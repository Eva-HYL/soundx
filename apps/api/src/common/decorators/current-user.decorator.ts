import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthContext } from '../types/auth-context';

/**
 * 从 req.user 取出 AuthContext。
 * 若路由未经过 JwtAuthGuard 会抛 401。
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthContext => {
    const req = ctx.switchToHttp().getRequest<Request & { user?: AuthContext }>();
    if (!req.user) throw new UnauthorizedException();
    return req.user;
  },
);
