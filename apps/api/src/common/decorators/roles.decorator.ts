import { SetMetadata } from '@nestjs/common';
import type { RoleType } from '@soundx/shared-types';

export const ROLES_KEY = 'roles';

/** 限定某路由允许的角色（OR 关系）。 */
export const Roles = (...roles: RoleType[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);
