import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { PageQueryDto } from '@/common/dto/page-query.dto';
import { PlatformService } from './platform.service';

@ApiTags('platform')
@Controller()
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Roles('club_admin', 'super_admin')
  @Get('admin/dashboard')
  @ApiOperation({ summary: '俱乐部管理员工作台' })
  adminDashboard() {
    return {};
  }

  @Roles('platform_admin', 'super_admin')
  @Get('platform/dashboard')
  @ApiOperation({ summary: '平台工作台' })
  platformDashboard() {
    return {};
  }

  @Roles('platform_admin', 'super_admin')
  @Get('platform/clubs')
  @ApiOperation({ summary: '平台俱乐部列表' })
  listClubs(@Query() _query: PageQueryDto) {
    return { list: [], pagination: { page: 1, page_size: 20, total: 0 } };
  }

  @Roles('platform_admin', 'super_admin')
  @Post('platform/clubs/:id/approve')
  @ApiOperation({ summary: '审核通过俱乐部' })
  approveClub(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }

  @Roles('platform_admin', 'super_admin')
  @Patch('platform/clubs/:id/features')
  @ApiOperation({ summary: '修改俱乐部功能开关' })
  updateClubFeatures(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }
}
