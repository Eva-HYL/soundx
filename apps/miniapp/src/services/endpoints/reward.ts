import { apiGet, apiPost } from '../api';
import type { Paginated } from './club';

export interface RewardDto {
  id: string;
  orderId: string;
  userId: string;
  playerId: string;
  clubId: string;
  baseAmount: string | null;
  premiumAmount: string | null;
  totalAmount: string | null;
  paymentStatus: string | null;
  message: string | null;
  rejectReason: string | null;
  confirmedBy: string | null;
  confirmedAt: string | null;
  transferVoucherUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  player?: { id: string; nickname: string | null; avatar: string | null } | null;
}

export interface CreateRewardPayload {
  orderId: string;
  amount: string; // 两位小数字符串
  message?: string;
}

export function createReward(payload: CreateRewardPayload): Promise<RewardDto> {
  return apiPost('/rewards', payload);
}

export interface RewardListQuery {
  page?: number;
  pageSize?: number;
  /** 小写状态，逗号分隔 */
  status?: string;
}

export function listMyRewards(query: RewardListQuery = {}): Promise<Paginated<RewardDto>> {
  return apiGet('/rewards/me', {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
    status: query.status,
  });
}
