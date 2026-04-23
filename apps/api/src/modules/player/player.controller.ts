import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlayerService } from './player.service';

@ApiTags('players')
@Controller()
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('players/:id')
  @ApiOperation({ summary: '获取陪玩详情' })
  getPlayer(@Param('id') _id: string) {
    return {};
  }

  @Patch('player/me/profile')
  @ApiOperation({ summary: '更新陪玩资料' })
  updateMyProfile(@Body() _body: unknown) {
    return { ok: true };
  }

  @Patch('player/me/work-status')
  @ApiOperation({ summary: '更新接单状态' })
  updateWorkStatus(@Body() _body: unknown) {
    return { ok: true };
  }

  @Post('player/me/applications')
  @ApiOperation({ summary: '提交陪玩入驻申请' })
  submitApplication(@Body() _body: unknown) {
    return { ok: true };
  }

  @Get('player/me/orders')
  @ApiOperation({ summary: '我的接单列表' })
  listMyOrders() {
    return { list: [] };
  }
}
