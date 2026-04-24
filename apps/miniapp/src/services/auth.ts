/**
 * 登录 / 登出 / 获取当前用户上下文。
 */
import Taro from '@tarojs/taro';
import type { RoleType } from '@soundx/shared-types';
import { apiGet, apiPostPublic } from './api';
import { clearSession, getSession, saveSession } from './session';

interface LoginResponse {
  token: string;
  expiresIn: number;
  userId: string;
  roles: RoleType[];
  currentClubId: string | null;
}

interface AuthMe {
  userId: string;
  roles: RoleType[];
  currentClubId: string | null;
}

/**
 * 调 wx.login 拿 code，再调后端 /auth/wechat/login 换 token。
 * 成功后登录态已持久化。
 */
export async function loginWithWechat(): Promise<LoginResponse> {
  const { code } = await Taro.login();
  if (!code) throw new Error('wx.login 未返回 code');
  const result = await apiPostPublic<LoginResponse>('/auth/wechat/login', { code });
  saveSession({
    token: result.token,
    userId: result.userId,
    roles: result.roles,
    currentClubId: result.currentClubId,
    expiresIn: result.expiresIn,
  });
  return result;
}

/** 已登录则直接返回 session；未登录则自动走微信登录。 */
export async function ensureLogin(): Promise<LoginResponse> {
  const existing = getSession();
  if (existing) {
    return {
      token: existing.token,
      userId: existing.userId,
      roles: existing.roles,
      currentClubId: existing.currentClubId,
      expiresIn: Math.max(0, Math.floor((existing.expiresAt - Date.now()) / 1000)),
    };
  }
  return loginWithWechat();
}

export async function fetchMe(): Promise<AuthMe> {
  return apiGet<AuthMe>('/auth/me');
}

export function logout(): void {
  clearSession();
}
