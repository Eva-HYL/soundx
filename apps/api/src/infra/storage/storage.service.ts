import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_CONSTRAINTS } from '@soundx/shared-types';
import type {
  FileRef,
  UploadBizType,
  UploadMethod,
} from '@soundx/shared-types';
import { EnvService } from '@/config/env.service';
import { BusinessException } from '@/common/errors/business.exception';
import { ErrorCode } from '@soundx/shared-types';

export interface SignUploadParams {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  bizType: UploadBizType;
  userId: string;
}

export interface SignedUpload {
  fileKey: string;
  uploadUrl: string;
  method: UploadMethod;
  headers: Record<string, string>;
  formFields?: Record<string, string>;
  expiresIn: number;
  publicUrl: string;
  maxSizeBytes: number;
}

/**
 * 对象存储适配层。提供预签名上传 URL 与 fileKey → FileRef 解析。
 *
 * 当前只有 local 实现（开发环境写本地目录）。
 * 生产：切到 OSS / S3，需根据 env.STORAGE_PROVIDER 分发。
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly env: EnvService) {}

  async signUpload(params: SignUploadParams): Promise<SignedUpload> {
    const constraint = UPLOAD_CONSTRAINTS[params.bizType];
    if (!constraint.allowedMimeTypes.includes(params.mimeType)) {
      throw new BusinessException(ErrorCode.FILE_TYPE_NOT_ALLOWED, {
        reason: `mime ${params.mimeType} not allowed for ${params.bizType}`,
      });
    }
    if (params.sizeBytes > constraint.maxSizeBytes) {
      throw new BusinessException(ErrorCode.FILE_TOO_LARGE, {
        reason: `limit ${constraint.maxSizeBytes}, got ${params.sizeBytes}`,
      });
    }

    const ext = this.extForMime(params.mimeType);
    const fileKey = `${params.bizType}/${params.userId}/${Date.now()}-${uuidv4()}${ext}`;
    const publicUrl = `${this.env.storage.publicUrl}/${fileKey}`;

    switch (this.env.storage.provider) {
      case 'local':
        return this.signLocal({ fileKey, publicUrl, constraint });
      case 'oss':
        throw new Error('OSS storage not implemented yet');
      case 's3':
        throw new Error('S3 storage not implemented yet');
    }
  }

  /**
   * fileKey → FileRef（读取时调用，返回签名 GET URL）。
   * local 实现直接返回 publicUrl。
   */
  async resolveFileRef(fileKey: string): Promise<FileRef> {
    const url = `${this.env.storage.publicUrl}/${fileKey}`;
    return { fileKey, url };
  }

  async resolveFileRefs(fileKeys: string[]): Promise<FileRef[]> {
    return Promise.all(fileKeys.map((k) => this.resolveFileRef(k)));
  }

  private signLocal(args: {
    fileKey: string;
    publicUrl: string;
    constraint: { maxSizeBytes: number };
  }): SignedUpload {
    return {
      fileKey: args.fileKey,
      uploadUrl: `${this.env.storage.publicUrl}/_upload/${args.fileKey}`,
      method: 'PUT',
      headers: {},
      expiresIn: 900,
      publicUrl: args.publicUrl,
      maxSizeBytes: args.constraint.maxSizeBytes,
    };
  }

  private extForMime(mime: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
      'audio/mpeg': '.mp3',
      'audio/aac': '.aac',
      'audio/mp4': '.m4a',
    };
    return map[mime] ?? '';
  }
}
