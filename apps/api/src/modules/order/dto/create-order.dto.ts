import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// 保持与 shared-types 的小写枚举对齐；Service 层会做大写转换再写入 Prisma
export const ORDER_TYPES = ['designated', 'normal', 'urgent', 'newbie'] as const;
export type OrderTypeLower = (typeof ORDER_TYPES)[number];

export const DISPATCH_MODES = ['grab', 'assign', 'designated'] as const;
export type DispatchModeLower = (typeof DISPATCH_MODES)[number];

export class CreateOrderDto {
  @ApiProperty({ description: '俱乐部 ID（BigInt 以字符串传）' })
  @IsNumberString()
  clubId!: string;

  @ApiPropertyOptional({ description: '指定陪玩 ID（DESIGNATED 模式必填）' })
  @IsOptional()
  @IsNumberString()
  playerId?: string;

  @ApiProperty({ enum: ORDER_TYPES, default: 'normal' })
  @IsEnum(ORDER_TYPES)
  orderType: OrderTypeLower = 'normal';

  @ApiPropertyOptional({ enum: DISPATCH_MODES, description: '派单模式（默认 grab）' })
  @IsOptional()
  @IsEnum(DISPATCH_MODES)
  dispatchMode?: DispatchModeLower;

  @ApiProperty({ description: '服务类型关键字，如 rank_push / practice' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  serviceType!: string;

  @ApiProperty({ description: '每小时单价（两位小数字符串），例 "40.00"' })
  @IsDecimal({ decimal_digits: '2' })
  pricePerHour!: string;

  @ApiProperty({ description: '小时数，支持一位小数，例 1 / 2 / 1.5' })
  @Type(() => Number)
  @Min(0.5)
  hours!: number;

  @ApiPropertyOptional({ description: '老板备注' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  userRemark?: string;
}

export class CancelOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class OrderListQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 20;

  @ApiPropertyOptional({ description: '订单状态筛选（小写，以逗号分隔）' })
  @IsOptional()
  @IsString()
  status?: string;
}
