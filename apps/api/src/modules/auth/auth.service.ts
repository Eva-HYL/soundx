import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Prisma } from '@prisma/client';
import { ErrorCode } from '@soundx/shared-types';
import type { RoleType } from '@soundx/shared-types';
import { BusinessException } from '@/common/errors/business.exception';
import { bigintToString } from '@/common/mappers';
import { EnvService } from '@/config/env.service';
import { PrismaService } from '@/infra/prisma/prisma.service';

export interface LoginResult {
  token: string;
  expiresIn: number;
  userId: string;
  roles: RoleType[];
  currentClubId: string | null;
}

interface Code2SessionResponse {
  openid?: string;
  unionid?: string;
  session_key?: string;
  errcode?: number;
  errmsg?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly env: EnvService,
  ) {}

  async wechatLogin(code: string): Promise<LoginResult> {
    const { appId, appSecret } = this.env.wechat;

    let openid: string;
    let unionid: string | null;

    if (!appId || !appSecret) {
      if (this.env.isProduction) {
        throw new BusinessException(ErrorCode.EXTERNAL_SERVICE_ERROR, {
          reason: 'WX_APP_ID / WX_APP_SECRET not configured',
        });
      }
      // 开发环境：用 code 作为伪 openid 方便本地联调
      this.logger.warn(
        `WX_APP_ID / WX_APP_SECRET not configured — falling back to dev stub (openid=dev_${code})`,
      );
      openid = `dev_${code}`;
      unionid = null;
    } else {
      const session = await this.code2Session(code, appId, appSecret);
      if (session.errcode || !session.openid) {
        this.logger.error(
          `code2Session failed: errcode=${session.errcode} errmsg=${session.errmsg}`,
        );
        throw new BusinessException(ErrorCode.EXTERNAL_SERVICE_ERROR, {
          reason: session.errmsg ?? 'code2session returned no openid',
        });
      }
      openid = session.openid;
      unionid = session.unionid ?? null;
    }

    // User upsert + 角色聚合放进事务，避免 upsert 成功但角色读失败导致不一致
    const { userId, roles, currentClubId } = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const user = await tx.user.upsert({
          where: { openid },
          update: {
            unionid: unionid ?? undefined,
            lastLoginAt: new Date(),
          },
          create: {
            openid,
            unionid,
            lastLoginAt: new Date(),
          },
        });

        const roleRecords = await tx.userRole.findMany({
          where: { userId: user.id, status: true },
        });

        const aggregatedRoles = roleRecords.map(
          (r: { role: string }) => r.role.toLowerCase() as RoleType,
        );
        // 新用户：默认赋予"老板（user）"角色（不落库，仅此次 JWT payload 使用）
        if (aggregatedRoles.length === 0) {
          aggregatedRoles.push('user');
        }

        // 取第一个带 clubId 的角色作为当前俱乐部上下文
        const firstClubRole = roleRecords.find((r: { clubId: bigint | null }) => r.clubId !== null);

        return {
          userId: user.id,
          roles: aggregatedRoles,
          currentClubId: firstClubRole?.clubId ?? null,
        };
      },
    );

    const userIdStr = userId.toString();
    const clubIdStr = bigintToString(currentClubId);

    const token = await this.jwt.signAsync({
      sub: userIdStr,
      roles,
      clubId: clubIdStr,
    });

    return {
      token,
      expiresIn: this.parseExpiresInToSeconds(this.env.jwtExpiresIn),
      userId: userIdStr,
      roles,
      currentClubId: clubIdStr,
    };
  }

  private async code2Session(
    code: string,
    appId: string,
    appSecret: string,
  ): Promise<Code2SessionResponse> {
    const url = new URL('https://api.weixin.qq.com/sns/jscode2session');
    url.searchParams.set('appid', appId);
    url.searchParams.set('secret', appSecret);
    url.searchParams.set('js_code', code);
    url.searchParams.set('grant_type', 'authorization_code');

    try {
      const res = await fetch(url.toString(), {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      return (await res.json()) as Code2SessionResponse;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new BusinessException(ErrorCode.EXTERNAL_SERVICE_ERROR, {
        reason: `code2session request failed: ${msg}`,
      });
    }
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
