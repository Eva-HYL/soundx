import { Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';
import { EnvService } from '@/config/env.service';

@Module({
  imports: [
    PinoModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        pinoHttp: {
          level: env.isProduction ? 'info' : 'debug',
          transport: env.isProduction
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  translateTime: 'HH:MM:ss',
                  ignore: 'pid,hostname,req.headers,res.headers',
                },
              },
          customProps: (req) => ({
            requestId: (req as { requestId?: string }).requestId,
          }),
          redact: {
            paths: [
              'req.headers.authorization',
              'req.headers.cookie',
              'res.headers["set-cookie"]',
            ],
            remove: true,
          },
        },
      }),
    }),
  ],
})
export class LoggerModule {}
