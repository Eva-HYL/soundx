import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '@soundx/shared-types';
import { BusinessException } from '@/common/errors/business.exception';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { RedisService } from '@/infra/redis/redis.service';
import { toOrderDto } from '@/modules/order/order.mapper';

@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * 订单池：陪玩所在俱乐部下，status = PAID_PENDING_DISPATCH 且 dispatchMode = GRAB 的订单。
   */
  async orderPool(userId: string, query: { page: number; pageSize: number }) {
    const player = await this.prisma.player.findUnique({
      where: { userId: BigInt(userId) },
      select: { id: true, clubId: true, profileStatus: true },
    });
    if (!player) {
      throw new BusinessException(ErrorCode.FORBIDDEN, {
        reason: 'current user is not a player',
      });
    }
    if (player.profileStatus !== 'ACTIVE') {
      throw new BusinessException(ErrorCode.PLAYER_NOT_AVAILABLE, {
        reason: `player profile is ${player.profileStatus}`,
      });
    }

    const where: Prisma.OrderWhereInput = {
      clubId: player.clubId,
      status: 'PAID_PENDING_DISPATCH',
      dispatchMode: 'GRAB',
      playerId: null,
    };

    const [total, list] = await this.prisma.$transaction([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: {
          user: { select: { id: true, nickname: true, avatar: true } },
        },
      }),
    ]);

    return {
      list: list.map(toOrderDto),
      pagination: { page: query.page, pageSize: query.pageSize, total },
    };
  }

  /**
   * 陪玩抢单。并发控制策略：
   *   1. Redis 分布式锁防抖（同一订单瞬时多人点击，只有一把锁拿到）
   *   2. DB 层 updateMany 带 where 条件（乐观锁，只有 status=PAID_PENDING_DISPATCH 且 playerId=null 才更新成功）
   *
   * 成功后：Order.status=ACCEPTED，写入一条 OrderDispatch 记录（GRAB/ACCEPTED）。
   */
  async grab(userId: string, orderId: string) {
    const player = await this.prisma.player.findUnique({
      where: { userId: BigInt(userId) },
      select: { id: true, clubId: true, profileStatus: true },
    });
    if (!player) {
      throw new BusinessException(ErrorCode.FORBIDDEN, { reason: 'not a player' });
    }
    if (player.profileStatus !== 'ACTIVE') {
      throw new BusinessException(ErrorCode.PLAYER_NOT_AVAILABLE, {
        reason: `player profile is ${player.profileStatus}`,
      });
    }

    const orderBig = BigInt(orderId);
    const lockKey = `order:grab:${orderId}`;
    const lockToken = await this.redis.acquireLock(lockKey, 5000);
    if (!lockToken) {
      throw new BusinessException(ErrorCode.ORDER_ALREADY_GRABBED, {
        reason: 'another player is grabbing this order',
      });
    }

    try {
      const updated = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const order = await tx.order.findUnique({ where: { id: orderBig } });
        if (!order) {
          throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'order not found' });
        }
        if (order.clubId !== player.clubId) {
          throw new BusinessException(ErrorCode.CLUB_SCOPE_DENIED, {
            reason: 'order is not in your club',
          });
        }
        if (order.dispatchMode !== 'GRAB') {
          throw new BusinessException(ErrorCode.ORDER_NOT_GRABBABLE, {
            reason: `dispatchMode=${order.dispatchMode}`,
          });
        }

        // 乐观锁：条件更新，只有状态 + playerId 同时满足时更新
        const result = await tx.order.updateMany({
          where: {
            id: orderBig,
            status: 'PAID_PENDING_DISPATCH',
            playerId: null,
          },
          data: {
            status: 'ACCEPTED',
            playerId: player.id,
            playerName: undefined, // 后面再读 Player.nickname 赋值
            acceptedAt: new Date(),
          },
        });
        if (result.count === 0) {
          throw new BusinessException(ErrorCode.ORDER_ALREADY_GRABBED, {
            reason: 'order status changed or already grabbed',
          });
        }

        // 补上 playerName（分两步；若要强一致可合并到 update）
        const playerFull = await tx.player.findUnique({
          where: { id: player.id },
          select: { nickname: true },
        });
        if (playerFull?.nickname) {
          await tx.order.update({
            where: { id: orderBig },
            data: { playerName: playerFull.nickname },
          });
        }

        await tx.orderDispatch.create({
          data: {
            orderId: orderBig,
            clubId: order.clubId,
            dispatchMode: 'GRAB',
            status: 'ACCEPTED',
            acceptedPlayerId: player.id,
            dispatchTime: new Date(),
            acceptedAt: new Date(),
          },
        });

        const finalOrder = await tx.order.findUnique({
          where: { id: orderBig },
          include: {
            user: { select: { id: true, nickname: true, avatar: true } },
            player: { select: { id: true, nickname: true, avatar: true } },
          },
        });
        return finalOrder!;
      });

      this.logger.log(`Order ${updated.orderNo} grabbed by player=${player.id}`);
      return toOrderDto(updated);
    } finally {
      await this.redis.releaseLock(lockKey, lockToken);
    }
  }
}
