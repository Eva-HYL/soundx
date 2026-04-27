import { apiGet, apiPost } from '../api';
import type { Paginated } from './club';
import type { OrderDto } from './order';

export interface MyOrderQuery {
  page?: number;
  pageSize?: number;
  /** 小写状态，逗号分隔 */
  status?: string;
}

export function listMyPalOrders(query: MyOrderQuery = {}): Promise<Paginated<OrderDto>> {
  return apiGet('/player/me/orders', {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
    status: query.status,
  });
}

export function startService(orderId: string): Promise<OrderDto> {
  return apiPost(`/player/orders/${orderId}/start-service`);
}

export function finishService(orderId: string): Promise<OrderDto> {
  return apiPost(`/player/orders/${orderId}/finish-service`);
}

export interface SubmitReportPayload {
  content: string;
  attachments?: string[];
}

export interface ReportDto {
  id: string;
  orderId: string;
  clubId: string;
  playerId: string;
  status: string | null;
  startTime: string | null;
  endTime: string | null;
  durationMinutes: number;
  content: string;
  attachments: string[] | null;
  userConfirmed: boolean;
  reviewerId: string | null;
  reviewTime: string | null;
  rejectReason: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  player?: { id: string; nickname: string | null; avatar: string | null } | null;
}

export function submitReport(orderId: string, payload: SubmitReportPayload): Promise<ReportDto> {
  return apiPost(`/orders/${orderId}/reports`, payload);
}
