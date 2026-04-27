import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import type { AuthContext } from '@/common/types/auth-context';
import { CreateRewardDto, RewardListQueryDto } from './dto/reward.dto';
import { RewardService } from './reward.service';

@ApiTags('rewards')
@Controller()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post('rewards')
  @ApiOperation({ summary: '用户发起打赏（订单必须已完成）' })
  create(@CurrentUser() user: AuthContext, @Body() body: CreateRewardDto) {
    return this.rewardService.create(user.userId, body);
  }

  @Get('rewards/me')
  @ApiOperation({ summary: '我的打赏记录' })
  listMine(@CurrentUser() user: AuthContext, @Query() query: RewardListQueryDto) {
    return this.rewardService.listMine(user.userId, query);
  }

  @Roles('club_admin', 'super_admin')
  @Get('admin/rewards')
  @ApiOperation({ summary: '管理员打赏列表（默认只看待确认）' })
  adminList(@CurrentUser() user: AuthContext, @Query() query: RewardListQueryDto) {
    return this.rewardService.adminList(user.currentClubId, query);
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/rewards/:id/confirm-payment')
  @ApiOperation({ summary: '管理员确认打赏到账（结算积分）' })
  confirmPayment(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.rewardService.adminConfirmPayment(user.userId, id);
  }
}
