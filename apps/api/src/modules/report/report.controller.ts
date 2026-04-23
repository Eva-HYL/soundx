import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { PageQueryDto } from '@/common/dto/page-query.dto';
import { ReportService } from './report.service';

@ApiTags('reports')
@Controller()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('player/orders/:id/start-service')
  @ApiOperation({ summary: '开始服务' })
  startService(@Param('id') _id: string) {
    return { ok: true };
  }

  @Post('player/orders/:id/finish-service')
  @ApiOperation({ summary: '结束服务' })
  finishService(@Param('id') _id: string) {
    return { ok: true };
  }

  @Post('orders/:id/reports')
  @ApiOperation({ summary: '提交报备' })
  submitReport(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }

  @Roles('club_admin', 'super_admin')
  @Get('admin/reports')
  @ApiOperation({ summary: '管理员报备列表' })
  adminList(@Query() _query: PageQueryDto) {
    return { list: [], pagination: { page: 1, page_size: 20, total: 0 } };
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/reports/:id/approve')
  @ApiOperation({ summary: '审核通过报备' })
  approve(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/reports/:id/reject')
  @ApiOperation({ summary: '驳回报备' })
  reject(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }
}
