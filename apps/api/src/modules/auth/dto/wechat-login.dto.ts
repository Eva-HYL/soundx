import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WechatLoginDto {
  @ApiProperty({ description: '微信 wx.login 返回的 code' })
  @IsString()
  @IsNotEmpty()
  code!: string;
}
