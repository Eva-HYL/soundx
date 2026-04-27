import { apiGet } from '../api';

export interface PlayerServiceItem {
  id: string;
  serviceType: string;
  price: string | null;
}

export interface PlayerListItem {
  id: string;
  userId: string;
  clubId: string;
  nickname: string | null;
  avatar: string | null;
  level: number;
  profileStatus: string | null;
  ability: string | null;
  description: string | null;
  rating: string | null;
  successRate: string | null;
  totalOrders: number;
  workStatus: string | null;
  priceFrom: string | null;
  services: PlayerServiceItem[];
}

export interface Paginated<T> {
  list: T[];
  pagination: { page: number; pageSize: number; total: number };
}

export interface ListPlayersQuery {
  page?: number;
  pageSize?: number;
  serviceType?: string;
  workStatus?: string;
}

export function listClubPlayers(
  clubId: string,
  query: ListPlayersQuery = {},
): Promise<Paginated<PlayerListItem>> {
  return apiGet(`/clubs/${clubId}/players`, {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
    serviceType: query.serviceType ?? null,
    workStatus: query.workStatus ?? null,
  });
}
