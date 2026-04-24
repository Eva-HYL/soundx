import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import type { AuthContext } from '@/common/types/auth-context';
import { RejectReportDto, ReportListQueryDto, SubmitReportDto } from './dto/report.dto';
import { ReportService } from './report.service';

@ApiTags('reports')
@Controller()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('player/orders/:id/start-service')
  @ApiOperation({ summary: '开始服务' })
  startService(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.reportService.startService(user.userId, id);
  }

  @Post('player/orders/:id/finish-service')
  @ApiOperation({ summary: '结束服务' })
  finishService(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.reportService.finishService(user.userId, id);
  }

  @Post('orders/:id/reports')
  @ApiOperation({ summary: '陪玩提交战绩报备' })
  submitReport(
    @CurrentUser() user: AuthContext,
    @Param('id') id: string,
    @Body() body: SubmitReportDto,
  ) {
    return this.reportService.submit(user.userId, id, body);
  }

  @Roles('club_admin', 'super_admin')
  @Get('admin/reports')
  @ApiOperation({ summary: '管理员报备列表（默认 status=submitted）' })
  adminList(@CurrentUser() user: AuthContext, @Query() query: ReportListQueryDto) {
    return this.reportService.adminList(user.currentClubId, query);
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/reports/:id/approve')
  @ApiOperation({ summary: '审核通过报备（订单完成并结算积分）' })
  approve(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.reportService.approve(user.userId, id);
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/reports/:id/reject')
  @ApiOperation({ summary: '驳回报备（订单回退到 PENDING_REPORT）' })
  reject(
    @CurrentUser() user: AuthContext,
    @Param('id') id: string,
    @Body() body: RejectReportDto,
  ) {
    return this.reportService.reject(user.userId, id, body);
  }
}
