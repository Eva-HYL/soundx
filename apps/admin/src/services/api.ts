/**
 * Admin API client —— axios 封装。
 *
 * 功能：
 *   - baseURL 由 vite.config.ts 的 __API_BASE__ 定义（开发模式 vite proxy 会拦截 /api/v1）
 *   - 自动注入 Authorization
 *   - 统一解包 ApiResponse：成功返 data，失败抛 ApiError
 *   - 401 → 清登录态并触发跳转（由 onUnauthorized 回调决定）
 */
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, ErrorCodeValue } from '@soundx/shared-types';
import { ErrorCode } from '@soundx/shared-types';
import { clearSession, getToken } from './session';

declare const __API_BASE__: string;

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCodeValue,
    message: string,
    public readonly httpStatus?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(cb: () => void): void {
  onUnauthorized = cb;
}

const baseURL = typeof __API_BASE__ !== 'undefined' ? __API_BASE__ : '/api/v1';

const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  response => {
    const body = response.data as ApiResponse<unknown>;
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === ErrorCode.SUCCESS) {
        // 把 envelope 替换为真实 data，业务层直接拿 response.data
        response.data = body.data;
        return response;
      }
      throw new ApiError(
        body.code as ErrorCodeValue,
        body.message || '请求失败',
        response.status,
      );
    }
    return response;
  },
  (err: AxiosError<ApiResponse<unknown>>) => {
    if (err.response?.status === 401) {
      clearSession();
      onUnauthorized?.();
      return Promise.reject(
        new ApiError(ErrorCode.UNAUTHORIZED, '登录已失效，请重新登录', 401),
      );
    }
    const body = err.response?.data;
    if (body && typeof body === 'object' && 'code' in body) {
      return Promise.reject(
        new ApiError(
          body.code as ErrorCodeValue,
          body.message || err.message,
          err.response?.status,
        ),
      );
    }
    return Promise.reject(
      new ApiError(
        ErrorCode.EXTERNAL_SERVICE_ERROR,
        err.message || '网络请求失败',
        err.response?.status,
      ),
    );
  },
);

export async function apiGet<T>(
  path: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const res = await http.get<T>(path, { params });
  return res.data;
}

export async function apiPost<T>(path: string, data?: unknown): Promise<T> {
  const res = await http.post<T>(path, data);
  return res.data;
}

export async function apiPut<T>(path: string, data?: unknown): Promise<T> {
  const res = await http.put<T>(path, data);
  return res.data;
}

export async function apiPatch<T>(path: string, data?: unknown): Promise<T> {
  const res = await http.patch<T>(path, data);
  return res.data;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const res = await http.delete<T>(path);
  return res.data;
}
