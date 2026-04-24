/**
 * miniapp API client —— 封装 Taro.request。
 *
 * 功能：
 *   - 自动拼 baseURL（由 config/index.ts 的 defineConstants 注入的 API_BASE）
 *   - 自动注入 Authorization: Bearer <token>
 *   - 自动解包 ApiResponse：成功返回 data，失败抛 ApiError
 *   - 401 → 清除登录态
 *
 * 用法：
 *   import { apiGet, apiPost } from '@/services/api';
 *   const me = await apiGet<AuthContext>('/auth/me');
 *   const r = await apiPost<LoginResult>('/auth/wechat/login', { code });
 */
import Taro from '@tarojs/taro';
import type { ApiResponse, ErrorCodeValue } from '@soundx/shared-types';
import { ErrorCode } from '@soundx/shared-types';
import { clearSession, getToken } from './session';

// 由 Taro defineConstants 编译时注入；这里给 TS 一个声明
declare const API_BASE: string;

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

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method: Method;
  path: string;
  data?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
  /** 是否跳过 token 注入（登录接口用） */
  skipAuth?: boolean;
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const base = typeof API_BASE !== 'undefined' ? API_BASE : 'http://localhost:3000/api/v1';
  const url = path.startsWith('http') ? path : `${base}${path}`;
  if (!params) return url;
  const qs = Object.entries(params)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return qs ? `${url}${url.includes('?') ? '&' : '?'}${qs}` : url;
}

async function request<T>(opts: RequestOptions): Promise<T> {
  const header: Record<string, string> = { 'Content-Type': 'application/json' };

  if (!opts.skipAuth) {
    const token = getToken();
    if (token) header.Authorization = `Bearer ${token}`;
  }

  let response: Taro.request.SuccessCallbackResult<ApiResponse<T>>;
  try {
    response = await Taro.request<ApiResponse<T>>({
      url: buildUrl(opts.path, opts.params),
      method: opts.method,
      data: opts.data,
      header,
      timeout: 15000,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new ApiError(ErrorCode.EXTERNAL_SERVICE_ERROR, `网络请求失败: ${msg}`);
  }

  const { statusCode, data: body } = response;

  // 401 → 清登录态
  if (statusCode === 401) {
    clearSession();
    throw new ApiError(ErrorCode.UNAUTHORIZED, '登录已失效，请重新登录', 401);
  }

  // 业务响应信封
  if (body && typeof body === 'object' && 'code' in body) {
    const envelope = body as ApiResponse<T>;
    if (envelope.code === ErrorCode.SUCCESS) {
      return envelope.data as T;
    }
    throw new ApiError(envelope.code as ErrorCodeValue, envelope.message || '请求失败', statusCode);
  }

  // 非预期响应
  if (statusCode >= 200 && statusCode < 300) {
    return body as unknown as T;
  }
  throw new ApiError(
    ErrorCode.EXTERNAL_SERVICE_ERROR,
    `HTTP ${statusCode} ${JSON.stringify(body).slice(0, 200)}`,
    statusCode,
  );
}

export function apiGet<T>(path: string, params?: RequestOptions['params']): Promise<T> {
  return request<T>({ method: 'GET', path, params });
}

export function apiPost<T>(path: string, data?: unknown, params?: RequestOptions['params']): Promise<T> {
  return request<T>({ method: 'POST', path, data, params });
}

export function apiPut<T>(path: string, data?: unknown): Promise<T> {
  return request<T>({ method: 'PUT', path, data });
}

export function apiPatch<T>(path: string, data?: unknown): Promise<T> {
  return request<T>({ method: 'PATCH', path, data });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>({ method: 'DELETE', path });
}

export function apiPostPublic<T>(path: string, data?: unknown): Promise<T> {
  return request<T>({ method: 'POST', path, data, skipAuth: true });
}
