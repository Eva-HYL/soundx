/**
 * 登录态持久化：token、userId、roles、currentClubId。
 *
 * 使用 Taro.setStorageSync 持久化到小程序本地存储。
 * 所有字段在登录成功时由 services/auth.ts 写入。
 */
import Taro from '@tarojs/taro';
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
  Taro.setStorageSync(TOKEN_KEY, payload.token);
  Taro.setStorageSync(USER_ID_KEY, payload.userId);
  Taro.setStorageSync(ROLES_KEY, payload.roles);
  Taro.setStorageSync(CLUB_ID_KEY, payload.currentClubId ?? '');
  Taro.setStorageSync(EXPIRES_AT_KEY, expiresAt);
}

export function getSession(): Session | null {
  const token = Taro.getStorageSync(TOKEN_KEY);
  if (!token) return null;
  const expiresAt = Number(Taro.getStorageSync(EXPIRES_AT_KEY) ?? 0);
  if (expiresAt && expiresAt <= Date.now()) {
    clearSession();
    return null;
  }
  return {
    token,
    userId: Taro.getStorageSync(USER_ID_KEY) ?? '',
    roles: (Taro.getStorageSync(ROLES_KEY) as RoleType[]) ?? [],
    currentClubId: (Taro.getStorageSync(CLUB_ID_KEY) as string) || null,
    expiresAt,
  };
}

export function getToken(): string | null {
  const s = getSession();
  return s?.token ?? null;
}

export function clearSession(): void {
  Taro.removeStorageSync(TOKEN_KEY);
  Taro.removeStorageSync(USER_ID_KEY);
  Taro.removeStorageSync(ROLES_KEY);
  Taro.removeStorageSync(CLUB_ID_KEY);
  Taro.removeStorageSync(EXPIRES_AT_KEY);
}
