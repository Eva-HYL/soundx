import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { PageQueryDto } from '@/common/dto/page-query.dto';
import { RewardService } from './reward.service';

@ApiTags('rewards')
@Controller()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post('rewards')
  @ApiOperation({ summary: '用户发起打赏' })
  create(@Body() _body: unknown) {
    return {};
  }

  @Get('rewards/me')
  @ApiOperation({ summary: '我的打赏记录' })
  listMine(@Query() _query: PageQueryDto) {
    return { list: [], pagination: { page: 1, page_size: 20, total: 0 } };
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/rewards/:id/confirm-payment')
  @ApiOperation({ summary: '管理员确认打赏到账' })
  confirmPayment(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }
}
