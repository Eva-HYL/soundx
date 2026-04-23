import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsMimeType, IsPositive, IsString, MaxLength } from 'class-validator';
import type { UploadBizType } from '@soundx/shared-types';

const UPLOAD_BIZ_TYPES: UploadBizType[] = [
  'payment_voucher',
  'reward_voucher',
  'transfer_voucher',
  'report_attachment',
  'player_voice',
  'player_avatar',
  'user_avatar',
  'club_logo',
];

export class SignUploadDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  filename!: string;

  @ApiProperty()
  @IsMimeType()
  mimeType!: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  sizeBytes!: number;

  @ApiProperty({ enum: UPLOAD_BIZ_TYPES })
  @IsEnum(UPLOAD_BIZ_TYPES)
  bizType!: UploadBizType;
}

export class ResolveFileDto {
  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  fileKeys!: string[];
}
