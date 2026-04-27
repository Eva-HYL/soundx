import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '@soundx/shared-types';
import { BusinessException } from '@/common/errors/business.exception';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { toPlayerListItemDto } from '@/modules/club/club.mapper';
import { toOrderDto } from '@/modules/order/order.mapper';

export interface MyOrderQuery {
  page: number;
  pageSize: number;
  /** 小写状态，逗号分隔 */
  status?: string;
}

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlayer(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id: BigInt(id) },
      include: {
        workStatus: { select: { workStatus: true } },
        services: { select: { id: true, serviceType: true, price: true } },
      },
    });
    if (!player) {
      throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'player not found' });
    }
    return toPlayerListItemDto(player);
  }

  /**
   * 陪玩（当前登录用户）接过的订单列表。默认按 createdAt desc。
   */
  async listMyOrders(userId: string, query: MyOrderQuery) {
    const player = await this.prisma.player.findUnique({
      where: { userId: BigInt(userId) },
      select: { id: true },
    });
    if (!player) {
      throw new BusinessException(ErrorCode.FORBIDDEN, { reason: 'not a player' });
    }

    const where: Prisma.OrderWhereInput = { playerId: player.id };
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
}
