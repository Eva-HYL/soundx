import type { Player, Reward } from '@prisma/client';
import { bigintToString, dateToIso, decimalToString, enumToLower } from '@/common/mappers';

type RewardWithRelations = Reward & {
  player?: Pick<Player, 'id' | 'nickname' | 'avatar'> | null;
};

export function toRewardDto(r: RewardWithRelations) {
  return {
    id: bigintToString(r.id),
    orderId: bigintToString(r.orderId),
    userId: bigintToString(r.userId),
    playerId: bigintToString(r.playerId),
    clubId: bigintToString(r.clubId),
    baseAmount: decimalToString(r.baseAmount),
    premiumAmount: decimalToString(r.premiumAmount),
    totalAmount: decimalToString(r.totalAmount),
    paymentStatus: enumToLower(r.paymentStatus),
    message: r.message,
    rejectReason: r.rejectReason,
    confirmedBy: bigintToString(r.confirmedBy),
    confirmedAt: dateToIso(r.confirmedAt),
    transferVoucherUrl: r.transferVoucherUrl,
    createdAt: dateToIso(r.createdAt),
    updatedAt: dateToIso(r.updatedAt),
    player: r.player
      ? {
          id: bigintToString(r.player.id),
          nickname: r.player.nickname,
          avatar: r.player.avatar,
        }
      : null,
  };
}
