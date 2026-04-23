import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthContext } from '@/common/types/auth-context';
import { AuthService } from './auth.service';
import { WechatLoginDto } from './dto/wechat-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('wechat/login')
  @ApiOperation({ summary: '微信小程序登录（code2Session）' })
  wechatLogin(@Body() dto: WechatLoginDto) {
    return this.auth.wechatLogin(dto.code);
  }

  @Get('me')
  @ApiOperation({ summary: '获取当前登录上下文' })
  me(@CurrentUser() user: AuthContext): AuthContext {
    return user;
  }
}
