import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { RoleType } from '@soundx/shared-types';
import { EnvService } from '@/config/env.service';
import { PrismaService } from '@/infra/prisma/prisma.service';

export interface LoginResult {
  token: string;
  expiresIn: number;
  userId: string;
  roles: RoleType[];
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly env: EnvService,
  ) {}

  /**
   * TODO: 微信小程序 code2Session + 用户 upsert。
   * 当前返回 stub，用于打通前端联调。
   */
  async wechatLogin(_code: string): Promise<LoginResult> {
    // 1. code2Session → openid/unionid
    // 2. upsert User
    // 3. 拉取 roles
    // 4. 签发 JWT
    const userId = 'stub-user-id';
    const roles: RoleType[] = ['user'];
    const token = await this.jwt.signAsync({
      sub: userId,
      roles,
    });
    return {
      token,
      expiresIn: this.parseExpiresInToSeconds(this.env.jwtExpiresIn),
      userId,
      roles,
    };
  }

  private parseExpiresInToSeconds(expr: string): number {
    const m = /^(\d+)([smhd])$/.exec(expr);
    if (!m) return 0;
    const n = Number(m[1]);
    const unit = m[2];
    switch (unit) {
      case 's':
        return n;
      case 'm':
        return n * 60;
      case 'h':
        return n * 3600;
      case 'd':
        return n * 86400;
      default:
        return 0;
    }
  }
}
