import type { RoleType } from '@soundx/shared-types';

/**
 * JWT 解码后放到 req.user 上的上下文。
 * Guards / 控制器通过 @CurrentUser() 拿到。
 */
export interface AuthContext {
  userId: string;
  roles: RoleType[];
  currentClubId: string | null;
}
