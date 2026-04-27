import type { Club, Player, PlayerService, PlayerWorkStatus } from '@prisma/client';
import { bigintToString, dateToIso, decimalToString, enumToLower } from '@/common/mappers';

export function toClubDto(club: Club) {
  return {
    id: bigintToString(club.id),
    name: club.name,
    logo: club.logo,
    ownerId: bigintToString(club.ownerId),
    ownerName: club.ownerName,
    status: enumToLower(club.status),
    description: club.description,
    createdAt: dateToIso(club.createdAt),
    updatedAt: dateToIso(club.updatedAt),
  };
}

type PlayerListItem = Player & {
  workStatus?: Pick<PlayerWorkStatus, 'workStatus'> | null;
  services?: Pick<PlayerService, 'id' | 'serviceType' | 'price'>[];
};

export function toPlayerListItemDto(player: PlayerListItem) {
  const priceFrom = player.services?.length
    ? player.services.reduce<PlayerService | null>((min, s) => {
        if (!min) return s as PlayerService;
        return (s.price as unknown as { lessThan(other: unknown): boolean }).lessThan(min.price)
          ? (s as PlayerService)
          : min;
      }, null)
    : null;

  return {
    id: bigintToString(player.id),
    userId: bigintToString(player.userId),
    clubId: bigintToString(player.clubId),
    nickname: player.nickname,
    avatar: player.avatar,
    level: player.level,
    profileStatus: enumToLower(player.profileStatus),
    ability: player.ability,
    description: player.description,
    rating: decimalToString(player.rating),
    successRate: decimalToString(player.successRate),
    totalOrders: player.totalOrders,
    workStatus: player.workStatus ? enumToLower(player.workStatus.workStatus) : null,
    priceFrom: priceFrom ? decimalToString(priceFrom.price) : null,
    services: (player.services ?? []).map(s => ({
      id: bigintToString(s.id),
      serviceType: s.serviceType,
      price: decimalToString(s.price),
    })),
  };
}
