import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ErrorCode } from '@soundx/shared-types';
import type { ApiResponse } from '@soundx/shared-types';

/**
 * 成功响应统一包装为 ApiResponse<T>。
 * Controller 方法直接 return data，本拦截器负责包 code/message。
 *
 * 跳过包装的情况：
 *   - 返回值已是 ApiResponse 形态（带 code 字段）
 *   - 返回 null/undefined（也会被包一层 data: null）
 */
@Injectable()
export class ResponseEnvelopeInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | T>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T> | T> {
    return next.handle().pipe(
      map((data) => {
        if (isAlreadyEnvelope(data)) return data;
        return {
          code: ErrorCode.SUCCESS,
          message: 'success',
          data: (data ?? null) as T,
        };
      }),
    );
  }
}

function isAlreadyEnvelope(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    'data' in value
  );
}
