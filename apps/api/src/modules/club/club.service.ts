import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '@soundx/shared-types';
import { BusinessException } from '@/common/errors/business.exception';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { toClubDto, toPlayerListItemDto } from './club.mapper';

export interface ListPlayersQuery {
  page: number;
  pageSize: number;
  /** 按服务类型过滤（精确匹配 serviceType 字段） */
  serviceType?: string;
  /** 按工作状态过滤（小写，逗号分隔） */
  workStatus?: string;
}

@Injectable()
export class ClubService {
  constructor(private readonly prisma: PrismaService) {}

  async getClub(id: string) {
    const club = await this.prisma.club.findUnique({ where: { id: BigInt(id) } });
    if (!club) {
      throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, { reason: 'club not found' });
    }
    return toClubDto(club);
  }

  /**
   * 俱乐部下的陪玩列表。默认只返回 `profileStatus=ACTIVE` 的。
   * 携带 workStatus 和 services 用于首页展示。
   */
  async listPlayers(clubId: string, query: ListPlayersQuery) {
    const where: Prisma.PlayerWhereInput = {
      clubId: BigInt(clubId),
      profileStatus: 'ACTIVE',
    };

    if (query.serviceType) {
      where.services = { some: { serviceType: query.serviceType } };
    }

    const workFilter = query.workStatus
      ?.split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    const [total, list] = await this.prisma.$transaction([
      this.prisma.player.count({ where }),
      this.prisma.player.findMany({
        where,
        orderBy: [{ rating: 'desc' }, { totalOrders: 'desc' }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: {
          workStatus: { select: { workStatus: true } },
          services: { select: { id: true, serviceType: true, price: true } },
        },
      }),
    ]);

    // workStatus 是关联表，首页数据量不大，选在内存里过滤
    const filtered = workFilter?.length
      ? list.filter(p => p.workStatus && workFilter.includes(p.workStatus.workStatus))
      : list;

    return {
      list: filtered.map(toPlayerListItemDto),
      pagination: { page: query.page, pageSize: query.pageSize, total },
    };
  }
}
