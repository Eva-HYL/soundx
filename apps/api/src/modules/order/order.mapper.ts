import type { Order, Player, User } from '@prisma/client';
import { bigintToString, dateToIso, decimalToString, enumToLower } from '@/common/mappers';

type OrderWithRelations = Order & {
  user?: Pick<User, 'id' | 'nickname' | 'avatar'> | null;
  player?: Pick<Player, 'id' | 'nickname' | 'avatar'> | null;
};

export function toOrderDto(order: OrderWithRelations) {
  return {
    id: bigintToString(order.id),
    orderNo: order.orderNo,
    userId: bigintToString(order.userId),
    clubId: bigintToString(order.clubId),
    playerId: bigintToString(order.playerId),
    playerName: order.playerName,
    orderType: enumToLower(order.orderType),
    dispatchMode: enumToLower(order.dispatchMode),
    serviceType: order.serviceType,
    pricePerHour: decimalToString(order.pricePerHour),
    hours: decimalToString(order.hours),
    totalAmount: decimalToString(order.totalAmount),
    status: enumToLower(order.status),
    userRemark: order.userRemark,
    adminRemark: order.adminRemark,
    paymentConfirmedAt: dateToIso(order.paymentConfirmedAt),
    acceptedAt: dateToIso(order.acceptedAt),
    startedAt: dateToIso(order.startedAt),
    finishedAt: dateToIso(order.finishedAt),
    cancelledAt: dateToIso(order.cancelledAt),
    cancelReason: order.cancelReason,
    createdAt: dateToIso(order.createdAt),
    updatedAt: dateToIso(order.updatedAt),
    user: order.user
      ? {
          id: bigintToString(order.user.id),
          nickname: order.user.nickname,
          avatar: order.user.avatar,
        }
      : null,
    player: order.player
      ? {
          id: bigintToString(order.player.id),
          nickname: order.player.nickname,
          avatar: order.player.avatar,
        }
      : null,
  };
}

/**
 * 生成订单编号：SX + yyMMddHHmmss + 4 位随机。例：SX26042411130983
 * 非强幂等，仅用于用户可见编号。主键还是 autoincrement id。
 */
export function generateOrderNo(): string {
  const now = new Date();
  const pad = (n: number, len = 2) => String(n).padStart(len, '0');
  const ts =
    String(now.getFullYear()).slice(-2) +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds());
  const rand = pad(Math.floor(Math.random() * 10000), 4);
  return `SX${ts}${rand}`;
}
