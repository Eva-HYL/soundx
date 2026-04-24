import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.string().url(),

  REDIS_URL: z.string().url(),

  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('7d'),

  WX_APP_ID: z.string().default(''),
  WX_APP_SECRET: z.string().default(''),

  STORAGE_PROVIDER: z.enum(['oss', 's3', 'local']).default('local'),
  STORAGE_ENDPOINT: z.string().default(''),
  STORAGE_REGION: z.string().default(''),
  STORAGE_BUCKET: z.string().default('soundx-dev'),
  STORAGE_ACCESS_KEY: z.string().default(''),
  STORAGE_SECRET_KEY: z.string().default(''),
  STORAGE_PUBLIC_URL: z.string().default('http://localhost:3000/static'),

  CORS_ORIGINS: z.string().default('http://localhost:5173'),
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): AppEnv {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const errors = result.error.errors.map(e => `  - ${e.path.join('.')}: ${e.message}`).join('\n');
    throw new Error(`Invalid environment variables:\n${errors}`);
  }
  return result.data;
}
