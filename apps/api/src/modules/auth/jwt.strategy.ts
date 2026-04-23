import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { RoleType } from '@soundx/shared-types';
import { EnvService } from '@/config/env.service';
import type { AuthContext } from '@/common/types/auth-context';

interface JwtPayload {
  sub: string;
  roles: RoleType[];
  clubId?: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.jwtSecret,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload): AuthContext {
    return {
      userId: payload.sub,
      roles: payload.roles,
      currentClubId: payload.clubId ?? null,
    };
  }
}
