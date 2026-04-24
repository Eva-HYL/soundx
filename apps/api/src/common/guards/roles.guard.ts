import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { RoleType } from '@soundx/shared-types';
import { ErrorCode } from '@soundx/shared-types';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthContext } from '../types/auth-context';
import { BusinessException } from '../errors/business.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<RoleType[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest<Request & { user?: AuthContext }>();
    const user = req.user;
    if (!user) throw new BusinessException(ErrorCode.UNAUTHORIZED);

    const hit = user.roles.some(r => required.includes(r));
    if (!hit) throw new BusinessException(ErrorCode.ROLE_NOT_ALLOWED);
    return true;
  }
}
