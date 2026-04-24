import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '@soundx/shared-types';
import { BusinessException } from '@/common/errors/business.exception';
import { PrismaService } from '@/infra/prisma/prisma.service';
import type { CancelOrderDto, CreateOrderDto, OrderListQueryDto } from './dto/create-order.dto';
import { generateOrderNo, toOrderDto } from './order.mapper';

const USER_CANCELLABLE: Prisma.OrderGetPayload<{}>['status'][] = [
  'PENDING_PAYMENT',
  'PAID_PENDING_DISPATCH',
];

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 老板下单。写入 PENDING_PAYMENT 初始状态。
   */
  async create(userId: string, dto: CreateOrderDto) {
    if (dto.orderType === 'designated' && !dto.playerId) {
      throw new BusinessException(ErrorCode.PARAM_MISSING, {
        reason: 'playerId is required for DESIGNATED order',
        field: 'playerId',
      });
    }

    const clubBigInt = BigInt(dto.clubId);
    const club = await this.prisma.club.findUnique({ where: { id: clubBigInt } });
    if (!club) {
      throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, {
        reason: `club ${dto.clubId} not found`,
        field: 'clubId',
      });
    }

    let playerBigInt: bigint | null = null;
    let playerName: string | null = null;
    if (dto.playerId) {
      playerBigInt = BigInt(dto.playerId);
      const player = await this.prisma.player.findUnique({
        where: { id: playerBigInt },
        select: { id: true, clubId: true, nickname: true },
      });
      if (!player) {
        throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, {
          reason: `player ${dto.playerId} not found`,
          field: 'playerId',
        });
      }
      if (player.clubId !== clubBigInt) {
        throw new BusinessException(ErrorCode.CLUB_SCOPE_DENIED, {
          reason: 'player does not belong to specified club',
        });
      }
      playerName = player.nickname;
    }

    const hours = new Prisma.Decimal(dto.hours);
    const pricePerHour = new Prisma.Decimal(dto.pricePerHour);
    const totalAmount = pricePerHour.mul(hours).toDecimalPlaces(2);

    const created = await this.prisma.order.create({
      data: {
        orderNo: generateOrderNo(),
        userId: BigInt(userId),
        clubId: clubBigInt,
        playerId: playerBigInt,
        playerName,
        orderType: dto.orderType.toUpperCase() as 'DESIGNATED' | 'NORMAL' | 'URGENT' | 'NEWBIE',
        dispatchMode: (dto.dispatchMode ?? 'grab').toUpperCase() as 'GRAB' | 'ASSIGN' | 'DESIGNATED',
        serviceType: dto.serviceType,
        pricePerHour,
        hours,
        totalAmount,
        status: 'PENDING_PAYMENT',
        userRemark: dto.userRemark ?? null,
      },
      include: {
        user: { select: { id: true, nickname: true, avatar: true } },
        player: { select: { id: true, nickname: true, avatar: true } },
      },
    });

    this.logger.log(
      `Order created: ${created.orderNo} (user=${userId}, total=${totalAmount.toString()})`,
    );
    return toOrderDto(created);
  }

  async list(userId: string, query: OrderListQueryDto) {
    const where: Prisma.OrderWhereInput = { userId: BigInt(userId) };
    if (query.status) {
      const statuses = query.status
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(Boolean);
      if (statuses.length) {
        where.status = { in: statuses as Prisma.EnumOrderStatusFilter['in'] };
      }
    }

    const [total, list] = await this.prisma.$transaction([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
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
      list: list.map(toOrderDto),
      pagination: { page: query.page, pageSize: query.pageSize, total },
    };
  }

  async detail(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: BigInt(orderId) },
      include: {
        user: { select: { id: true, nickname: true, avatar: true } },
        player: { select: { id: true, nickname: true, avatar: true } },
      },
    });
    if (!order) {
      throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'order not found' });
    }
    if (order.userId !== BigInt(userId)) {
      throw new BusinessException(ErrorCode.FORBIDDEN, { reason: 'not your order' });
    }
    return toOrderDto(order);
  }

  async cancel(userId: string, orderId: string, dto: CancelOrderDto) {
    const idBig = BigInt(orderId);
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const order = await tx.order.findUnique({ where: { id: idBig } });
      if (!order) {
        throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'order not found' });
      }
      if (order.userId !== BigInt(userId)) {
        throw new BusinessException(ErrorCode.FORBIDDEN, { reason: 'not your order' });
      }
      if (!USER_CANCELLABLE.includes(order.status)) {
        throw new BusinessException(ErrorCode.INVALID_STATE, {
          reason: `order status ${order.status} cannot be cancelled by user`,
        });
      }
      const updated = await tx.order.update({
        where: { id: idBig },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancelledBy: BigInt(userId),
          cancelReason: dto.reason ?? null,
        },
        include: {
          player: { select: { id: true, nickname: true, avatar: true } },
        },
      });
      return toOrderDto(updated);
    });
  }

  async adminList(clubId: string | null, query: OrderListQueryDto) {
    const where: Prisma.OrderWhereInput = {};
    if (clubId) where.clubId = BigInt(clubId);
    if (query.status) {
      const statuses = query.status
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(Boolean);
      if (statuses.length) {
        where.status = { in: statuses as Prisma.EnumOrderStatusFilter['in'] };
      }
    }
    const [total, list] = await this.prisma.$transaction([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: {
          user: { select: { id: true, nickname: true, avatar: true } },
          player: { select: { id: true, nickname: true, avatar: true } },
        },
      }),
    ]);
    return {
      list: list.map(toOrderDto),
      pagination: { page: query.page, pageSize: query.pageSize, total },
    };
  }

  /**
   * 管理员确认付款：PENDING_PAYMENT → PAID_PENDING_DISPATCH。
   * 事务内：状态校验 + 更新 Order + 写 PaymentConfirmation 流水。
   */
  async adminConfirmPayment(adminId: string, orderId: string) {
    const idBig = BigInt(orderId);
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const order = await tx.order.findUnique({ where: { id: idBig } });
      if (!order) {
        throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'order not found' });
      }
      if (order.status !== 'PENDING_PAYMENT') {
        throw new BusinessException(ErrorCode.INVALID_STATE, {
          reason: `expected PENDING_PAYMENT, got ${order.status}`,
        });
      }
      const now = new Date();
      const updated = await tx.order.update({
        where: { id: idBig },
        data: {
          status: 'PAID_PENDING_DISPATCH',
          paymentConfirmedAt: now,
          paymentConfirmedBy: BigInt(adminId),
        },
        include: {
          user: { select: { id: true, nickname: true, avatar: true } },
          player: { select: { id: true, nickname: true, avatar: true } },
        },
      });
      await tx.paymentConfirmation.create({
        data: {
          bizType: 'ORDER',
          bizId: idBig,
          clubId: order.clubId,
          payerUserId: order.userId,
          orderId: idBig,
          expectedAmount: order.totalAmount,
          confirmedAmount: order.totalAmount,
          status: 'CONFIRMED',
          confirmMethod: 'manual',
          confirmedBy: BigInt(adminId),
          confirmedAt: now,
        },
      });
      return toOrderDto(updated);
    });
  }
}
