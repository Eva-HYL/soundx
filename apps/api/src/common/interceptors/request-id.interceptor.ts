import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';

/**
 * 为每个请求附加 requestId（来自 X-Request-Id 或生成新的），
 * 落到 req.requestId 与响应头，便于日志与问题排查。
 */
@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { requestId?: string }>();
    const res = http.getResponse<Response>();

    const requestId = (req.header('x-request-id') ?? uuidv4()).toString();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    return next.handle();
  }
}
