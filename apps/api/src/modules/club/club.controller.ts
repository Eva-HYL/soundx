import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { ClubService, type ListPlayersQuery } from './club.service';

@ApiTags('clubs')
@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '获取俱乐部详情' })
  getClub(@Param('id') id: string) {
    return this.clubService.getClub(id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: '加入俱乐部（TODO）' })
  joinClub(@Param('id') _id: string) {
    return { ok: true, todo: true };
  }

  @Public()
  @Get(':id/players')
  @ApiOperation({ summary: '获取俱乐部陪玩列表' })
  listPlayers(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('serviceType') serviceType?: string,
    @Query('workStatus') workStatus?: string,
  ) {
    const query: ListPlayersQuery = {
      page: Math.max(1, parseInt(page ?? '1', 10) || 1),
      pageSize: Math.max(1, Math.min(100, parseInt(pageSize ?? '20', 10) || 20)),
      serviceType,
      workStatus,
    };
    return this.clubService.listPlayers(id, query);
  }

  @Get(':id/services')
  @ApiOperation({ summary: '获取俱乐部服务列表（TODO）' })
  listServices(@Param('id') _id: string) {
    return { list: [], todo: true };
  }
}
