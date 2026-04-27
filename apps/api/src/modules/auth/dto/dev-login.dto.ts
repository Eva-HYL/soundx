import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
import type { RoleType } from '@soundx/shared-types';

const ROLE_VALUES: RoleType[] = [
  'user',
  'player',
  'club_admin',
  'platform_admin',
  'super_admin',
];

export class DevLoginDto {
  @ApiPropertyOptional({ description: '用户 ID（BigInt 字符串）' })
  @IsOptional()
  @IsNumberString()
  userId?: string;

  @ApiPropertyOptional({ description: '微信 openid' })
  @IsOptional()
  @IsString()
  openid?: string;

  @ApiPropertyOptional({ description: '角色覆盖（数组）', enum: ROLE_VALUES, isArray: true })
  @IsOptional()
  @IsArray()
  @IsIn(ROLE_VALUES, { each: true })
  rolesOverride?: RoleType[];

  @ApiPropertyOptional({ description: '俱乐部 ID 覆盖' })
  @IsOptional()
  @IsNumberString()
  clubIdOverride?: string;
}
