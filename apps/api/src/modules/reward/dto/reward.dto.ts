import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRewardDto {
  @ApiProperty({ description: '打赏所属订单 ID' })
  @IsNumberString()
  orderId!: string;

  @ApiProperty({ description: '打赏金额（两位小数字符串），例 "9.90"' })
  @IsDecimal({ decimal_digits: '2' })
  amount!: string;

  @ApiPropertyOptional({ description: '留言（≤500 字）' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}

export class RewardListQueryDto {
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

  @ApiPropertyOptional({ description: '状态筛选（小写，逗号分隔）' })
  @IsOptional()
  @IsString()
  status?: string;
}
