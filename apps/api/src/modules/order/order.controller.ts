import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { PageQueryDto } from '@/common/dto/page-query.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  @ApiOperation({ summary: '创建订单' })
  create(@Body() _body: unknown) {
    return {};
  }

  @Get('orders')
  @ApiOperation({ summary: '我的订单列表' })
  list(@Query() _query: PageQueryDto) {
    return { list: [], pagination: { page: 1, page_size: 20, total: 0 } };
  }

  @Get('orders/:id')
  @ApiOperation({ summary: '订单详情' })
  detail(@Param('id') _id: string) {
    return {};
  }

  @Post('orders/:id/cancel')
  @ApiOperation({ summary: '取消订单' })
  cancel(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }

  @Roles('club_admin', 'super_admin')
  @Get('admin/orders')
  @ApiOperation({ summary: '管理员订单列表' })
  adminList(@Query() _query: PageQueryDto) {
    return { list: [], pagination: { page: 1, page_size: 20, total: 0 } };
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/orders/:id/confirm-payment')
  @ApiOperation({ summary: '管理员确认订单付款' })
  confirmPayment(@Param('id') _id: string, @Body() _body: unknown) {
    return { ok: true };
  }
}
