import { apiGet, apiPost } from '../api';
import type { OrderDto } from './order';

export interface ListOrderPoolQuery {
  page?: number;
  pageSize?: number;
}

export function listOrderPool(query: ListOrderPoolQuery = {}): Promise<{
  list: OrderDto[];
  pagination: { page: number; pageSize: number; total: number };
}> {
  return apiGet('/player/order-pool', {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
  });
}

export function grabOrder(orderId: string): Promise<OrderDto> {
  return apiPost(`/player/orders/${orderId}/grab`);
}
