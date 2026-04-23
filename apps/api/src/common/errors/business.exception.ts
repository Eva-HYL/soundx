import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessage } from '@soundx/shared-types';
import type { ErrorCodeValue } from '@soundx/shared-types';

/**
 * 业务异常。抛出时由全局过滤器捕获，转成统一 ApiError 响应。
 *
 * HTTP 状态码规则：
 *   - 1xxx → 400
 *   - 2xxx → 409（冲突 / 状态不允许）
 *   - 3001 → 401；其他 3xxx → 403
 *   - 4xxx → 500
 */
export class BusinessException extends HttpException {
  public readonly code: ErrorCodeValue;
  public readonly reason?: string;
  public readonly field?: string;

  constructor(
    code: ErrorCodeValue,
    options: { message?: string; reason?: string; field?: string } = {},
  ) {
    const message = options.message ?? ErrorMessage[code] ?? 'error';
    super({ code, message }, httpStatusFor(code));
    this.code = code;
    this.reason = options.reason;
    this.field = options.field;
  }
}

function httpStatusFor(code: ErrorCodeValue): number {
  if (code === ErrorCode.UNAUTHORIZED || code === ErrorCode.TOKEN_EXPIRED) {
    return HttpStatus.UNAUTHORIZED;
  }
  if (code >= 3000 && code < 4000) return HttpStatus.FORBIDDEN;
  if (code >= 2000 && code < 3000) return HttpStatus.CONFLICT;
  if (code >= 1000 && code < 2000) return HttpStatus.BAD_REQUEST;
  if (code === ErrorCode.SUCCESS) return HttpStatus.OK;
  return HttpStatus.INTERNAL_SERVER_ERROR;
}
