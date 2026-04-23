import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { PageQueryDto } from '@/common/dto/page-query.dto';
import { WithdrawService } from './withdraw.service';

@ApiTags('withdrawals')
@Controller()
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post('withdrawals')
  @ApiOperation({ summary: '发起提现' })
  create(@Body() _body: unknown) {
    return {};
  }

  @Get('withdrawals/me')
  @ApiOperation({ summary: '我的提现列表' })
  listMine(@Query() _query: PageQueryDto) {
    return { list: [], pagination: { page: 1, page_size: 20, total: 0 } };
  }

  @Roles('club_admin', 'super_admin')
  @Get('admin/withdrawals')
  @ApiOperation({ summary: '管理员提现列表' })
  adminList(@Query() _query: PageQueryDto) {
    return { list: [], pagination: { page: 1, page_size: 20, total: 0 } };
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/withdrawals/:id/approve')
  @ApiOperation({ summary: '审核通过提现' })
  approve(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/withdrawals/:id/reject')
  @ApiOperation({ summary: '驳回提现' })
  reject(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/withdrawals/:id/confirm-transfer')
  @ApiOperation({ summary: '确认转账完成' })
  confirmTransfer(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }
}
