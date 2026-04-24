import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import type { AuthContext } from '@/common/types/auth-context';
import { CancelOrderDto, CreateOrderDto, OrderListQueryDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('orders')
  @ApiOperation({ summary: '创建订单（老板下单）' })
  create(@CurrentUser() user: AuthContext, @Body() body: CreateOrderDto) {
    return this.orderService.create(user.userId, body);
  }

  @Get('orders')
  @ApiOperation({ summary: '我的订单列表' })
  list(@CurrentUser() user: AuthContext, @Query() query: OrderListQueryDto) {
    return this.orderService.list(user.userId, query);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: '订单详情' })
  detail(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.orderService.detail(user.userId, id);
  }

  @Post('orders/:id/cancel')
  @ApiOperation({ summary: '老板取消订单' })
  cancel(
    @CurrentUser() user: AuthContext,
    @Param('id') id: string,
    @Body() body: CancelOrderDto,
  ) {
    return this.orderService.cancel(user.userId, id, body);
  }

  @Roles('club_admin', 'super_admin')
  @Get('admin/orders')
  @ApiOperation({ summary: '管理员订单列表' })
  adminList(@CurrentUser() user: AuthContext, @Query() query: OrderListQueryDto) {
    return this.orderService.adminList(user.currentClubId, query);
  }

  @Roles('club_admin', 'super_admin')
  @Post('admin/orders/:id/confirm-payment')
  @ApiOperation({ summary: '管理员确认订单付款' })
  confirmPayment(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.orderService.adminConfirmPayment(user.userId, id);
  }
}
