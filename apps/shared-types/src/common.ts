/**
 * 通用类型：响应封装、分页、金额字符串。
 */

/**
 * 保留 2 位小数的金额字符串（元），例 "80.00"。
 * 前端需要算术时用 parseFloat；后端用 Decimal 库。
 */
export type DecimalString = string;

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ApiError {
  code: number;
  message: string;
  error?: {
    reason?: string;
    field?: string;
    [key: string]: unknown;
  };
}

export interface PageQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface Paginated<T> {
  list: T[];
  pagination: Pagination;
}
