import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthContext } from '@/common/types/auth-context';
import { AuthService } from './auth.service';
import { DevLoginDto } from './dto/dev-login.dto';
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

  @Public()
  @Post('dev-login')
  @ApiOperation({
    summary: '【仅开发环境】临时登录后门，供 admin/调试使用。生产环境返回 401',
  })
  devLogin(@Body() dto: DevLoginDto) {
    return this.auth.devLogin({
      userId: dto.userId,
      openid: dto.openid,
      rolesOverride: dto.rolesOverride,
      clubIdOverride: dto.clubIdOverride,
    });
  }

  @Get('me')
  @ApiOperation({ summary: '获取当前登录上下文' })
  me(@CurrentUser() user: AuthContext): AuthContext {
    return user;
  }
}
