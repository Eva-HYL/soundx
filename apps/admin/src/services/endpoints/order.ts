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

export interface Paginated<T> {
  list: T[];
  pagination: { page: number; pageSize: number; total: number };
}

export interface AdminOrderQuery {
  page?: number;
  pageSize?: number;
  /** 小写状态，逗号分隔 */
  status?: string;
}

export function listAdminOrders(query: AdminOrderQuery = {}): Promise<Paginated<OrderDto>> {
  return apiGet('/admin/orders', {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
    status: query.status,
  });
}

export function adminConfirmPayment(orderId: string): Promise<OrderDto> {
  return apiPost(`/admin/orders/${orderId}/confirm-payment`);
}
