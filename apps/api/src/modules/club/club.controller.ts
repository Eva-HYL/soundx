import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClubService } from './club.service';

@ApiTags('clubs')
@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get(':id')
  @ApiOperation({ summary: '获取俱乐部详情' })
  getClub(@Param('id') _id: string) {
    return {};
  }

  @Post(':id/join')
  @ApiOperation({ summary: '加入俱乐部' })
  joinClub(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }

  @Get(':id/players')
  @ApiOperation({ summary: '获取俱乐部陪玩列表' })
  listPlayers(@Param('id') _id: string) {
    return { list: [] };
  }

  @Get(':id/services')
  @ApiOperation({ summary: '获取俱乐部服务列表' })
  listServices(@Param('id') _id: string) {
    return { list: [] };
  }
}
