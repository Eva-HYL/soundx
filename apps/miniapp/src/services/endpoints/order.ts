import { apiGet, apiPost } from '../api';

export interface OrderDto {
  id: string;
  orderNo: string;
  userId: string;
  clubId: string;
  playerId: string | null;
  playerName: string | null;
  orderType: string | null;
  dispatchMode: string | null;
  serviceType: string;
  pricePerHour: string | null;
  hours: string | null;
  totalAmount: string | null;
  status: string | null;
  userRemark: string | null;
  adminRemark: string | null;
  paymentConfirmedAt: string | null;
  acceptedAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  user?: { id: string; nickname: string | null; avatar: string | null } | null;
  player?: { id: string; nickname: string | null; avatar: string | null } | null;
}

export interface CreateOrderPayload {
  clubId: string;
  playerId?: string;
  orderType?: 'designated' | 'normal' | 'urgent' | 'newbie';
  dispatchMode?: 'grab' | 'assign' | 'designated';
  serviceType: string;
  pricePerHour: string;
  hours: number;
  userRemark?: string;
}

export function createOrder(payload: CreateOrderPayload): Promise<OrderDto> {
  return apiPost('/orders', payload);
}

export function getOrderDetail(orderId: string): Promise<OrderDto> {
  return apiGet(`/orders/${orderId}`);
}

export interface OrderListQuery {
  page?: number;
  pageSize?: number;
  /** 小写状态，逗号分隔 */
  status?: string;
}

export function listMyOrders(query: OrderListQuery = {}): Promise<{
  list: OrderDto[];
  pagination: { page: number; pageSize: number; total: number };
}> {
  return apiGet('/orders', {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
    status: query.status ?? null,
  });
}

export function cancelOrder(orderId: string, reason?: string): Promise<OrderDto> {
  return apiPost(`/orders/${orderId}/cancel`, { reason });
}
