import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { PageQueryDto } from '@/common/dto/page-query.dto';
import type { AuthContext } from '@/common/types/auth-context';
import { DispatchService } from './dispatch.service';

@ApiTags('dispatch')
@Controller()
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get('player/order-pool')
  @ApiOperation({ summary: '陪玩可抢订单池' })
  orderPool(@CurrentUser() user: AuthContext, @Query() query: PageQueryDto) {
    return this.dispatchService.orderPool(user.userId, {
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Post('player/orders/:id/grab')
  @ApiOperation({ summary: '抢单' })
  grab(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.dispatchService.grab(user.userId, id);
  }

  @Post('player/orders/:id/accept')
  @ApiOperation({ summary: '接受指派单（TODO）' })
  accept(@Param('id') _id: string) {
    return { ok: true, todo: true };
  }

  @Post('player/orders/:id/reject')
  @ApiOperation({ summary: '拒绝指派单（TODO）' })
  reject(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true, todo: true };
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/orders/:id/dispatch')
  @ApiOperation({ summary: '管理员指派陪玩（TODO）' })
  adminDispatch(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true, todo: true };
  }
}
