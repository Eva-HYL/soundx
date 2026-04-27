import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { amountToPoints, ErrorCode } from '@soundx/shared-types';
import { BusinessException } from '@/common/errors/business.exception';
import { PrismaService } from '@/infra/prisma/prisma.service';
import type { CreateRewardDto, RewardListQueryDto } from './dto/reward.dto';
import { toRewardDto } from './reward.mapper';

@Injectable()
export class RewardService {
  private readonly logger = new Logger(RewardService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 老板下打赏单。要求订单已完成且归属当前用户，防止为他人的订单建打赏。
   */
  async create(userId: string, dto: CreateRewardDto) {
    const orderIdBig = BigInt(dto.orderId);
    const order = await this.prisma.order.findUnique({ where: { id: orderIdBig } });
    if (!order) {
      throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'order not found' });
    }
    if (order.userId !== BigInt(userId)) {
      throw new BusinessException(ErrorCode.FORBIDDEN, { reason: 'not your order' });
    }
    if (order.status !== 'COMPLETED') {
      throw new BusinessException(ErrorCode.INVALID_STATE, {
        reason: `order status=${order.status}, only COMPLETED order can be rewarded`,
      });
    }
    if (!order.playerId) {
      throw new BusinessException(ErrorCode.INVALID_STATE, { reason: 'order has no player' });
    }

    const total = new Prisma.Decimal(dto.amount).toDecimalPlaces(2);
    if (total.lte(0)) {
      throw new BusinessException(ErrorCode.PARAM_OUT_OF_RANGE, {
        reason: 'amount must be > 0',
        field: 'amount',
      });
    }

    const reward = await this.prisma.reward.create({
      data: {
        orderId: orderIdBig,
        userId: BigInt(userId),
        playerId: order.playerId,
        clubId: order.clubId,
        baseAmount: total,
        premiumAmount: new Prisma.Decimal('0.00'),
        totalAmount: total,
        paymentStatus: 'PENDING_PAYMENT',
        message: dto.message ?? null,
      },
      include: {
        player: { select: { id: true, nickname: true, avatar: true } },
      },
    });

    this.logger.log(
      `Reward created: reward=${reward.id} order=${order.orderNo} amount=${total.toString()}`,
    );
    return toRewardDto(reward);
  }

  /** 老板视角：我发起的打赏记录。 */
  async listMine(userId: string, query: RewardListQueryDto) {
    const where: Prisma.RewardWhereInput = { userId: BigInt(userId) };
    if (query.status) {
      const statuses = query.status
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(Boolean);
      if (statuses.length) {
        where.paymentStatus = { in: statuses as Prisma.EnumRewardPaymentStatusFilter['in'] };
      }
    }
    const [total, list] = await this.prisma.$transaction([
      this.prisma.reward.count({ where }),
      this.prisma.reward.findMany({
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
      list: list.map(toRewardDto),
      pagination: { page: query.page, pageSize: query.pageSize, total },
    };
  }

  /** 管理员视角：俱乐部的打赏列表（默认只看待确认的）。 */
  async adminList(clubId: string | null, query: RewardListQueryDto) {
    const where: Prisma.RewardWhereInput = {};
    if (clubId) where.clubId = BigInt(clubId);
    if (query.status) {
      const statuses = query.status
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(Boolean);
      if (statuses.length) {
        where.paymentStatus = { in: statuses as Prisma.EnumRewardPaymentStatusFilter['in'] };
      }
    } else {
      where.paymentStatus = { in: ['PENDING_PAYMENT', 'PAID_PENDING_CONFIRM'] };
    }
    const [total, list] = await this.prisma.$transaction([
      this.prisma.reward.count({ where }),
      this.prisma.reward.findMany({
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
      list: list.map(toRewardDto),
      pagination: { page: query.page, pageSize: query.pageSize, total },
    };
  }

  /**
   * 管理员确认打赏到账。事务：
   *   1. Reward.paymentStatus = CONFIRMED + confirmedBy + confirmedAt
   *   2. PlayerPoints upsert 累加
   *   3. PointsFlow 流水（REWARD_INCOME）
   */
  async adminConfirmPayment(adminId: string, rewardId: string) {
    const rewardIdBig = BigInt(rewardId);
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const reward = await tx.reward.findUnique({ where: { id: rewardIdBig } });
      if (!reward) {
        throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'reward not found' });
      }
      if (reward.paymentStatus === 'CONFIRMED') {
        throw new BusinessException(ErrorCode.REWARD_ALREADY_CONFIRMED, {
          reason: `reward ${rewardId} already confirmed`,
        });
      }
      if (reward.paymentStatus === 'REJECTED' || reward.paymentStatus === 'CANCELLED') {
        throw new BusinessException(ErrorCode.INVALID_STATE, {
          reason: `reward status=${reward.paymentStatus}, cannot confirm`,
        });
      }

      const now = new Date();
      const updated = await tx.reward.update({
        where: { id: rewardIdBig },
        data: {
          paymentStatus: 'CONFIRMED',
          confirmedBy: BigInt(adminId),
          confirmedAt: now,
        },
        include: {
          player: { select: { id: true, nickname: true, avatar: true } },
        },
      });

      const pointsDelta = amountToPoints(reward.totalAmount.toString());
      const existing = await tx.playerPoints.findUnique({
        where: { playerId_clubId: { playerId: reward.playerId, clubId: reward.clubId } },
      });
      let newAvailable: number;
      if (existing) {
        const acc = await tx.playerPoints.update({
          where: { playerId_clubId: { playerId: reward.playerId, clubId: reward.clubId } },
          data: {
            totalPoints: { increment: pointsDelta },
            availablePoints: { increment: pointsDelta },
            withdrawablePoints: { increment: pointsDelta },
            version: { increment: 1 },
          },
        });
        newAvailable = acc.availablePoints;
      } else {
        const acc = await tx.playerPoints.create({
          data: {
            playerId: reward.playerId,
            clubId: reward.clubId,
            totalPoints: pointsDelta,
            availablePoints: pointsDelta,
            frozenPoints: 0,
            withdrawablePoints: pointsDelta,
            version: 1,
          },
        });
        newAvailable = acc.availablePoints;
      }

      await tx.pointsFlow.create({
        data: {
          playerId: reward.playerId,
          clubId: reward.clubId,
          flowType: 'REWARD_INCOME',
          bizType: 'REWARD',
          bizId: reward.id,
          points: pointsDelta,
          balance: newAvailable,
          operatorId: BigInt(adminId),
          remark: `打赏到账 +${pointsDelta}`,
        },
      });

      this.logger.log(
        `Reward ${reward.id} confirmed; +${pointsDelta} points → player ${reward.playerId}`,
      );
      return toRewardDto(updated);
    });
  }
}
