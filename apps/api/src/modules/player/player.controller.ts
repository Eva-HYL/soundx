import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';
import type { AuthContext } from '@/common/types/auth-context';
import { PlayerService, type MyOrderQuery } from './player.service';

@ApiTags('players')
@Controller()
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Public()
  @Get('players/:id')
  @ApiOperation({ summary: '获取陪玩详情' })
  getPlayer(@Param('id') id: string) {
    return this.playerService.getPlayer(id);
  }

  @Patch('player/me/profile')
  @ApiOperation({ summary: '更新陪玩资料（TODO）' })
  updateMyProfile(@Body() _body: unknown) {
    return { ok: true, todo: true };
  }

  @Patch('player/me/work-status')
  @ApiOperation({ summary: '更新接单状态（TODO）' })
  updateWorkStatus(@Body() _body: unknown) {
    return { ok: true, todo: true };
  }

  @Post('player/me/applications')
  @ApiOperation({ summary: '提交陪玩入驻申请（TODO）' })
  submitApplication(@Body() _body: unknown) {
    return { ok: true, todo: true };
  }

  @Get('player/me/orders')
  @ApiOperation({ summary: '我的接单列表（按状态过滤，小写逗号分隔）' })
  listMyOrders(
    @CurrentUser() user: AuthContext,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
  ) {
    const query: MyOrderQuery = {
      page: Math.max(1, parseInt(page ?? '1', 10) || 1),
      pageSize: Math.max(1, Math.min(100, parseInt(pageSize ?? '20', 10) || 20)),
      status,
    };
    return this.playerService.listMyOrders(user.userId, query);
  }
}
