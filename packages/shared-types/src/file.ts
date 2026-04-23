/**
 * 文件上传相关类型与约束表。
 * 约束表（UPLOAD_CONSTRAINTS）是前后端的事实标准。
 */

export interface FileRef {
  fileKey: string;
  url: string;
  filename?: string;
  mimeType?: string;
  sizeBytes?: number;
}

export type UploadBizType =
  | 'payment_voucher'
  | 'reward_voucher'
  | 'transfer_voucher'
  | 'report_attachment'
  | 'player_voice'
  | 'player_avatar'
  | 'user_avatar'
  | 'club_logo';

export type UploadMethod = 'PUT' | 'POST';

export interface UploadConstraint {
  maxSizeBytes: number;
  allowedMimeTypes: readonly string[];
}

const MB = 1024 * 1024;

export const UPLOAD_CONSTRAINTS: Record<UploadBizType, UploadConstraint> = {
  payment_voucher: {
    maxSizeBytes: 5 * MB,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  reward_voucher: {
    maxSizeBytes: 5 * MB,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  transfer_voucher: {
    maxSizeBytes: 5 * MB,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  report_attachment: {
    maxSizeBytes: 5 * MB,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
  },
  player_voice: {
    maxSizeBytes: 10 * MB,
    allowedMimeTypes: ['audio/mpeg', 'audio/aac', 'audio/mp4'],
  },
  player_avatar: {
    maxSizeBytes: 2 * MB,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  user_avatar: {
    maxSizeBytes: 2 * MB,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  club_logo: {
    maxSizeBytes: 2 * MB,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};
