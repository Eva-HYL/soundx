import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ErrorCode, ErrorMessage } from '@soundx/shared-types';
import type { ApiError, ErrorCodeValue } from '@soundx/shared-types';
import { BusinessException } from '../errors/business.exception';

/**
 * 全局异常过滤器：把所有异常统一转成 ApiError 形态（保留 HTTP 状态码）。
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, body } = this.normalize(exception);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status} ${body.code}: ${body.message}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(body);
  }

  private normalize(exception: unknown): {
    status: number;
    body: ApiError;
  } {
    if (exception instanceof BusinessException) {
      const payload = exception.getResponse() as { code: number; message: string };
      return {
        status: exception.getStatus(),
        body: {
          code: payload.code,
          message: payload.message,
          ...(exception.reason || exception.field
            ? { error: { reason: exception.reason, field: exception.field } }
            : {}),
        },
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resp = exception.getResponse();
      const { code, message, field } = mapHttpToApiError(status, resp);
      return {
        status,
        body: { code, message, ...(field ? { error: { field } } : {}) },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        code: ErrorCode.INTERNAL_ERROR,
        message: ErrorMessage[ErrorCode.INTERNAL_ERROR],
      },
    };
  }
}

function mapHttpToApiError(
  status: number,
  resp: string | object,
): { code: ErrorCodeValue; message: string; field?: string } {
  const defaultMessage =
    typeof resp === 'string'
      ? resp
      : ((resp as { message?: string | string[] })?.message ?? 'error');
  const message = Array.isArray(defaultMessage)
    ? defaultMessage[0] ?? 'error'
    : defaultMessage;

  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return { code: ErrorCode.PARAM_INVALID, message };
    case HttpStatus.UNAUTHORIZED:
      return {
        code: ErrorCode.UNAUTHORIZED,
        message: ErrorMessage[ErrorCode.UNAUTHORIZED],
      };
    case HttpStatus.FORBIDDEN:
      return {
        code: ErrorCode.FORBIDDEN,
        message: ErrorMessage[ErrorCode.FORBIDDEN],
      };
    case HttpStatus.NOT_FOUND:
      return {
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: ErrorMessage[ErrorCode.RESOURCE_NOT_FOUND],
      };
    case HttpStatus.CONFLICT:
      return { code: ErrorCode.INVALID_STATE, message };
    default:
      return {
        code: ErrorCode.INTERNAL_ERROR,
        message: ErrorMessage[ErrorCode.INTERNAL_ERROR],
      };
  }
}
