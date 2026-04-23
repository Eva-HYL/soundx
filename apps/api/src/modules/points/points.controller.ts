import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { PageQueryDto } from '@/common/dto/page-query.dto';
import { PointsService } from './points.service';

@ApiTags('points')
@Controller()
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('player/me/points')
  @ApiOperation({ summary: '我的积分余额' })
  getMyBalance() {
    return { available_points: 0, frozen_points: 0, total_earned: 0 };
  }

  @Get('player/me/points/flows')
  @ApiOperation({ summary: '我的积分流水' })
  listMyFlows(@Query() _query: PageQueryDto) {
    return { list: [], pagination: { page: 1, page_size: 20, total: 0 } };
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/points/adjust')
  @ApiOperation({ summary: '管理员调整积分' })
  adminAdjust(@Body() _body: unknown) {
    return { ok: true };
  }
}
