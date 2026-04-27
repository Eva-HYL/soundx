import { apiGet, apiPost } from '../api';
import type { Paginated } from './order';

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

export interface AdminReportQuery {
  page?: number;
  pageSize?: number;
  /** 小写状态，逗号分隔 */
  status?: string;
}

export function listAdminReports(query: AdminReportQuery = {}): Promise<Paginated<ReportDto>> {
  return apiGet('/admin/reports', {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
    status: query.status,
  });
}

export function approveReport(reportId: string): Promise<ReportDto> {
  return apiPost(`/admin/reports/${reportId}/approve`);
}

export function rejectReport(reportId: string, reason: string): Promise<ReportDto> {
  return apiPost(`/admin/reports/${reportId}/reject`, { reason });
}
