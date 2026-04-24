import type { Player, ServiceReport } from '@prisma/client';
import { bigintToString, dateToIso, enumToLower } from '@/common/mappers';

type ReportWithRelations = ServiceReport & {
  player?: Pick<Player, 'id' | 'nickname' | 'avatar'> | null;
};

export function toReportDto(report: ReportWithRelations) {
  return {
    id: bigintToString(report.id),
    orderId: bigintToString(report.orderId),
    clubId: bigintToString(report.clubId),
    playerId: bigintToString(report.playerId),
    status: enumToLower(report.status),
    startTime: dateToIso(report.startTime),
    endTime: dateToIso(report.endTime),
    durationMinutes: report.durationMinutes,
    content: report.content,
    attachments: report.attachments as string[] | null,
    userConfirmed: report.userConfirmed,
    reviewerId: bigintToString(report.reviewerId),
    reviewTime: dateToIso(report.reviewTime),
    rejectReason: report.rejectReason,
    createdAt: dateToIso(report.createdAt),
    updatedAt: dateToIso(report.updatedAt),
    player: report.player
      ? {
          id: bigintToString(report.player.id),
          nickname: report.player.nickname,
          avatar: report.player.avatar,
        }
      : null,
  };
}
