import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { PageQueryDto } from '@/common/dto/page-query.dto';
import { OperationLogService } from './operation-log.service';

@ApiTags('operation-logs')
@Controller()
export class OperationLogController {
  constructor(private readonly operationLogService: OperationLogService) {}

  @Roles('club_admin', 'platform_admin', 'super_admin')
  @Get('admin/operation-logs')
  @ApiOperation({ summary: '操作日志列表' })
  list(@Query() _query: PageQueryDto) {
    return { list: [], pagination: { page: 1, page_size: 20, total: 0 } };
  }
}
