import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { amountToPoints, ErrorCode } from '@soundx/shared-types';
import { BusinessException } from '@/common/errors/business.exception';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { toOrderDto } from '@/modules/order/order.mapper';
import type { RejectReportDto, ReportListQueryDto, SubmitReportDto } from './dto/report.dto';
import { toReportDto } from './report.mapper';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 开始服务：ACCEPTED → IN_SERVICE，记录 startedAt。
   */
  async startService(userId: string, orderId: string) {
    const orderBig = BigInt(orderId);
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const player = await this.requirePlayer(tx, userId);
      const order = await tx.order.findUnique({ where: { id: orderBig } });
      if (!order) {
        throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'order not found' });
      }
      if (order.playerId !== player.id) {
        throw new BusinessException(ErrorCode.FORBIDDEN, { reason: 'not your accepted order' });
      }
      if (order.status !== 'ACCEPTED') {
        throw new BusinessException(ErrorCode.INVALID_STATE, {
          reason: `expected ACCEPTED, got ${order.status}`,
        });
      }
      const updated = await tx.order.update({
        where: { id: orderBig },
        data: { status: 'IN_SERVICE', startedAt: new Date() },
        include: {
          user: { select: { id: true, nickname: true, avatar: true } },
          player: { select: { id: true, nickname: true, avatar: true } },
        },
      });
      return toOrderDto(updated);
    });
  }

  /**
   * 结束服务：IN_SERVICE → PENDING_REPORT，记录 finishedAt。
   */
  async finishService(userId: string, orderId: string) {
    const orderBig = BigInt(orderId);
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const player = await this.requirePlayer(tx, userId);
      const order = await tx.order.findUnique({ where: { id: orderBig } });
      if (!order) {
        throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'order not found' });
      }
      if (order.playerId !== player.id) {
        throw new BusinessException(ErrorCode.FORBIDDEN, { reason: 'not your accepted order' });
      }
      if (order.status !== 'IN_SERVICE') {
        throw new BusinessException(ErrorCode.INVALID_STATE, {
          reason: `expected IN_SERVICE, got ${order.status}`,
        });
      }
      const updated = await tx.order.update({
        where: { id: orderBig },
        data: { status: 'PENDING_REPORT', finishedAt: new Date() },
        include: {
          user: { select: { id: true, nickname: true, avatar: true } },
          player: { select: { id: true, nickname: true, avatar: true } },
        },
      });
      return toOrderDto(updated);
    });
  }

  /**
   * 陪玩提交战绩。
   * PENDING_REPORT → PENDING_REPORT_AUDIT，创建 ServiceReport（status=SUBMITTED）。
   */
  async submit(userId: string, orderId: string, dto: SubmitReportDto) {
    const orderBig = BigInt(orderId);
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const player = await this.requirePlayer(tx, userId);
      const order = await tx.order.findUnique({
        where: { id: orderBig },
        include: { report: true },
      });
      if (!order) {
        throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'order not found' });
      }
      if (order.playerId !== player.id) {
        throw new BusinessException(ErrorCode.FORBIDDEN, { reason: 'not your accepted order' });
      }
      if (order.status !== 'PENDING_REPORT') {
        throw new BusinessException(ErrorCode.INVALID_STATE, {
          reason: `expected PENDING_REPORT, got ${order.status}`,
        });
      }
      if (order.report) {
        throw new BusinessException(ErrorCode.REPORT_ALREADY_SUBMITTED, {
          reason: 'report already submitted for this order',
        });
      }

      const start = order.startedAt ?? order.acceptedAt ?? order.createdAt;
      const end = order.finishedAt ?? new Date();
      const durationMinutes = Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));

      const report = await tx.serviceReport.create({
        data: {
          orderId: orderBig,
          clubId: order.clubId,
          playerId: player.id,
          status: 'SUBMITTED',
          startTime: start,
          endTime: end,
          durationMinutes,
          content: dto.content,
          attachments: dto.attachments ? (dto.attachments as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        },
        include: {
          player: { select: { id: true, nickname: true, avatar: true } },
        },
      });

      await tx.order.update({
        where: { id: orderBig },
        data: { status: 'PENDING_REPORT_AUDIT' },
      });

      return toReportDto(report);
    });
  }

  async adminList(clubId: string | null, query: ReportListQueryDto) {
    const where: Prisma.ServiceReportWhereInput = {};
    if (clubId) where.clubId = BigInt(clubId);
    if (query.status) {
      const statuses = query.status
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(Boolean);
      if (statuses.length) {
        where.status = { in: statuses as Prisma.EnumReportStatusFilter['in'] };
      }
    } else {
      // 默认只看待审核的
      where.status = 'SUBMITTED';
    }

    const [total, list] = await this.prisma.$transaction([
      this.prisma.serviceReport.count({ where }),
      this.prisma.serviceReport.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: {
          player: { select: { id: true, nickname: true, avatar: true } },
        },
      }),
    ]);

    return {
      list: list.map(toReportDto),
      pagination: { page: query.page, pageSize: query.pageSize, total },
    };
  }

  /**
   * 管理员审核通过。核心事务：
   *   1. Report.status = APPROVED
   *   2. Order.status = COMPLETED
   *   3. 按订单金额换算积分 → 写 PointsFlow + 更新/创建 PlayerPoints
   *   4. Player.totalOrders += 1
   */
  async approve(adminId: string, reportId: string) {
    const reportBig = BigInt(reportId);
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const report = await tx.serviceReport.findUnique({
        where: { id: reportBig },
        include: { order: true },
      });
      if (!report) {
        throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'report not found' });
      }
      if (report.status !== 'SUBMITTED') {
        throw new BusinessException(ErrorCode.REPORT_NOT_REVIEWABLE, {
          reason: `report status=${report.status}`,
        });
      }

      const order = report.order;
      if (order.status !== 'PENDING_REPORT_AUDIT') {
        throw new BusinessException(ErrorCode.INVALID_STATE, {
          reason: `order status=${order.status}, expected PENDING_REPORT_AUDIT`,
        });
      }

      const now = new Date();
      // 1) 标记 report APPROVED
      const updatedReport = await tx.serviceReport.update({
        where: { id: reportBig },
        data: {
          status: 'APPROVED',
          reviewerId: BigInt(adminId),
          reviewTime: now,
        },
        include: {
          player: { select: { id: true, nickname: true, avatar: true } },
        },
      });

      // 2) 订单 COMPLETED
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'COMPLETED' },
      });

      // 3) 积分结算
      const pointsDelta = amountToPoints(order.totalAmount.toString());

      // PlayerPoints 账户：upsert + 累加 —— 改用 update 然后捕获不存在来 create，避免并发 upsert 的死锁
      const existing = await tx.playerPoints.findUnique({
        where: { playerId_clubId: { playerId: report.playerId, clubId: report.clubId } },
      });
      let newAvailableBalance: number;
      if (existing) {
        const updatedAccount = await tx.playerPoints.update({
          where: { playerId_clubId: { playerId: report.playerId, clubId: report.clubId } },
          data: {
            totalPoints: { increment: pointsDelta },
            availablePoints: { increment: pointsDelta },
            withdrawablePoints: { increment: pointsDelta },
            version: { increment: 1 },
          },
        });
        newAvailableBalance = updatedAccount.availablePoints;
      } else {
        const createdAccount = await tx.playerPoints.create({
          data: {
            playerId: report.playerId,
            clubId: report.clubId,
            totalPoints: pointsDelta,
            availablePoints: pointsDelta,
            frozenPoints: 0,
            withdrawablePoints: pointsDelta,
            version: 1,
          },
        });
        newAvailableBalance = createdAccount.availablePoints;
      }

      // 4) PointsFlow 流水
      await tx.pointsFlow.create({
        data: {
          playerId: report.playerId,
          clubId: report.clubId,
          flowType: 'ORDER_INCOME',
          bizType: 'ORDER',
          bizId: order.id,
          points: pointsDelta,
          balance: newAvailableBalance,
          operatorId: BigInt(adminId),
          remark: `订单 ${order.orderNo} 结算`,
        },
      });

      // 5) Player.totalOrders 计数
      await tx.player.update({
        where: { id: report.playerId },
        data: { totalOrders: { increment: 1 } },
      });

      this.logger.log(
        `Report ${reportId} approved; order ${order.orderNo} COMPLETED; +${pointsDelta} points → player ${report.playerId}`,
      );
      return toReportDto(updatedReport);
    });
  }

  async reject(adminId: string, reportId: string, dto: RejectReportDto) {
    const reportBig = BigInt(reportId);
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const report = await tx.serviceReport.findUnique({
        where: { id: reportBig },
        include: { order: true },
      });
      if (!report) {
        throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'report not found' });
      }
      if (report.status !== 'SUBMITTED') {
        throw new BusinessException(ErrorCode.REPORT_NOT_REVIEWABLE, {
          reason: `report status=${report.status}`,
        });
      }
      const updated = await tx.serviceReport.update({
        where: { id: reportBig },
        data: {
          status: 'REJECTED',
          reviewerId: BigInt(adminId),
          reviewTime: new Date(),
          rejectReason: dto.reason,
        },
        include: {
          player: { select: { id: true, nickname: true, avatar: true } },
        },
      });
      // 订单回到 PENDING_REPORT，让陪玩重新提交
      await tx.order.update({
        where: { id: report.orderId },
        data: { status: 'PENDING_REPORT' },
      });
      return toReportDto(updated);
    });
  }

  private async requirePlayer(tx: Prisma.TransactionClient, userId: string) {
    const player = await tx.player.findUnique({
      where: { userId: BigInt(userId) },
      select: { id: true, clubId: true, profileStatus: true },
    });
    if (!player) {
      throw new BusinessException(ErrorCode.FORBIDDEN, { reason: 'not a player' });
    }
    return player;
  }
}
