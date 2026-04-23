import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppEnv } from './env.schema';

@Injectable()
export class EnvService {
  constructor(private readonly config: ConfigService<AppEnv, true>) {}

  get nodeEnv(): AppEnv['NODE_ENV'] {
    return this.config.get('NODE_ENV', { infer: true });
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get port(): number {
    return this.config.get('PORT', { infer: true });
  }

  get databaseUrl(): string {
    return this.config.get('DATABASE_URL', { infer: true });
  }

  get redisUrl(): string {
    return this.config.get('REDIS_URL', { infer: true });
  }

  get jwtSecret(): string {
    return this.config.get('JWT_SECRET', { infer: true });
  }

  get jwtExpiresIn(): string {
    return this.config.get('JWT_EXPIRES_IN', { infer: true });
  }

  get wechat(): { appId: string; appSecret: string } {
    return {
      appId: this.config.get('WX_APP_ID', { infer: true }),
      appSecret: this.config.get('WX_APP_SECRET', { infer: true }),
    };
  }

  get storage(): {
    provider: AppEnv['STORAGE_PROVIDER'];
    endpoint: string;
    region: string;
    bucket: string;
    accessKey: string;
    secretKey: string;
    publicUrl: string;
  } {
    return {
      provider: this.config.get('STORAGE_PROVIDER', { infer: true }),
      endpoint: this.config.get('STORAGE_ENDPOINT', { infer: true }),
      region: this.config.get('STORAGE_REGION', { infer: true }),
      bucket: this.config.get('STORAGE_BUCKET', { infer: true }),
      accessKey: this.config.get('STORAGE_ACCESS_KEY', { infer: true }),
      secretKey: this.config.get('STORAGE_SECRET_KEY', { infer: true }),
      publicUrl: this.config.get('STORAGE_PUBLIC_URL', { infer: true }),
    };
  }

  get corsOrigins(): string[] {
    return this.config
      .get('CORS_ORIGINS', { infer: true })
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
}
