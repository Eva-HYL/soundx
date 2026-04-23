import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthContext } from '@/common/types/auth-context';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: '获取当前用户资料' })
  getMe(@CurrentUser() user: AuthContext) {
    return { userId: user.userId, roles: user.roles, currentClubId: user.currentClubId };
  }

  @Patch('me/profile')
  @ApiOperation({ summary: '更新个人资料' })
  updateProfile(@Body() _body: unknown, @CurrentUser() _user: AuthContext) {
    return { ok: true };
  }

  @Get('me/clubs')
  @ApiOperation({ summary: '获取我所在的俱乐部列表' })
  listMyClubs(@CurrentUser() _user: AuthContext) {
    return { list: [] };
  }

  @Post('me/clubs/switch')
  @ApiOperation({ summary: '切换当前俱乐部' })
  switchClub(@Body() _body: unknown, @CurrentUser() _user: AuthContext) {
    return { ok: true };
  }
}
