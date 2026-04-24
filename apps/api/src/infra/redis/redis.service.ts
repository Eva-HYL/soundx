import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { EnvService } from '@/config/env.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;

  constructor(private readonly env: EnvService) {}

  async onModuleInit(): Promise<void> {
    this.client = new Redis(this.env.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });
    await this.client.connect();
    this.logger.log('Redis connected');
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.quit();
  }

  get raw(): Redis {
    return this.client;
  }

  /**
   * Redis 分布式锁（简化版，够用于抢单场景）。
   * 成功返回 token，失败返回 null。释放时比对 token 避免误释放。
   */
  async acquireLock(key: string, ttlMs: number): Promise<string | null> {
    const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const ok = await this.client.set(`lock:${key}`, token, 'PX', ttlMs, 'NX');
    return ok === 'OK' ? token : null;
  }

  async releaseLock(key: string, token: string): Promise<void> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await this.client.eval(script, 1, `lock:${key}`, token);
  }
}
