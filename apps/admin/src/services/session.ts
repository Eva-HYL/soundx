/**
 * Admin 登录态持久化 —— localStorage 版本。
 *
 * admin 目前没有真实登录接口（微信登录给 miniapp 用，admin 用户名+密码登录需要后续加 User.password 字段）。
 * 这里先把 session 容器建好，等后端补上 admin 登录接口后把 loginWithPassword 接通即可。
 */
import type { RoleType } from '@soundx/shared-types';

const TOKEN_KEY = 'soundx:token';
const USER_ID_KEY = 'soundx:userId';
const ROLES_KEY = 'soundx:roles';
const CLUB_ID_KEY = 'soundx:clubId';
const EXPIRES_AT_KEY = 'soundx:expiresAt';

export interface Session {
  token: string;
  userId: string;
  roles: RoleType[];
  currentClubId: string | null;
  expiresAt: number;
}

export function saveSession(payload: {
  token: string;
  userId: string;
  roles: RoleType[];
  currentClubId: string | null;
  expiresIn: number;
}): void {
  const expiresAt = Date.now() + payload.expiresIn * 1000;
  localStorage.setItem(TOKEN_KEY, payload.token);
  localStorage.setItem(USER_ID_KEY, payload.userId);
  localStorage.setItem(ROLES_KEY, JSON.stringify(payload.roles));
  localStorage.setItem(CLUB_ID_KEY, payload.currentClubId ?? '');
  localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
}

export function getSession(): Session | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  const expiresAt = Number(localStorage.getItem(EXPIRES_AT_KEY) ?? 0);
  if (expiresAt && expiresAt <= Date.now()) {
    clearSession();
    return null;
  }
  let roles: RoleType[] = [];
  try {
    const raw = localStorage.getItem(ROLES_KEY);
    if (raw) roles = JSON.parse(raw) as RoleType[];
  } catch {
    roles = [];
  }
  return {
    token,
    userId: localStorage.getItem(USER_ID_KEY) ?? '',
    roles,
    currentClubId: localStorage.getItem(CLUB_ID_KEY) || null,
    expiresAt,
  };
}

export function getToken(): string | null {
  return getSession()?.token ?? null;
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(ROLES_KEY);
  localStorage.removeItem(CLUB_ID_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}
