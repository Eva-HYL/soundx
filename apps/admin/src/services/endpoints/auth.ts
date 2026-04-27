import type { RoleType } from '@soundx/shared-types';
import { apiPost } from '../api';
import { saveSession } from '../session';

interface LoginResponse {
  token: string;
  expiresIn: number;
  userId: string;
  roles: RoleType[];
  currentClubId: string | null;
}

export interface DevLoginInput {
  userId?: string;
  openid?: string;
  rolesOverride?: RoleType[];
  clubIdOverride?: string;
}

/**
 * 开发后门登录。当前生产 admin 登录体系待建，本地联调用这个拿 token。
 * 服务端对生产环境已禁用。
 */
export async function devLogin(input: DevLoginInput): Promise<LoginResponse> {
  const res = await apiPost<LoginResponse>('/auth/dev-login', input);
  saveSession({
    token: res.token,
    userId: res.userId,
    roles: res.roles,
    currentClubId: res.currentClubId,
    expiresIn: res.expiresIn,
  });
  return res;
}
