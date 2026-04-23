import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { PageQueryDto } from '@/common/dto/page-query.dto';
import { DispatchService } from './dispatch.service';

@ApiTags('dispatch')
@Controller()
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Get('player/order-pool')
  @ApiOperation({ summary: '陪玩可抢订单池' })
  orderPool(@Query() _query: PageQueryDto) {
    return { list: [] };
  }

  @Post('player/orders/:id/grab')
  @ApiOperation({ summary: '抢单' })
  grab(@Param('id') _id: string) {
    return { ok: true };
  }

  @Post('player/orders/:id/accept')
  @ApiOperation({ summary: '接受指派单' })
  accept(@Param('id') _id: string) {
    return { ok: true };
  }

  @Post('player/orders/:id/reject')
  @ApiOperation({ summary: '拒绝指派单' })
  reject(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/orders/:id/dispatch')
  @ApiOperation({ summary: '管理员指派陪玩' })
  adminDispatch(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }
}
