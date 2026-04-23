# API 设计

## 1. 设计目标

本项目 API 以业务动作驱动为主，优先支撑 MVP 的订单闭环、人工确认、报备审核、积分结算和提现处理，而不是追求形式上的完整 REST 风格。

设计原则：
- 路径按业务资源分组
- 关键动作使用明确的 action 接口
- 所有关键写操作必须幂等
- 所有管理员操作必须带操作日志
- 所有接口默认受角色权限和数据范围双重控制

## 2. 基础规范

- 协议：`HTTPS`
- 前缀：`/api/v1`
- 数据格式：`application/json`
- 鉴权方式：`Authorization: Bearer <token>`
- 时间格式：ISO8601

统一响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

统一错误结构：

```json
{
  "code": 3002,
  "message": "forbidden",
  "error": {
    "reason": "club scope denied"
  }
}
```

## 3. 错误码建议

- `1000-1999`：参数错误
- `2000-2999`：业务状态错误
- `3000-3999`：鉴权与权限错误
- `4000-4999`：系统错误

常用错误：
- `1001`：参数缺失
- `1002`：参数非法
- `2001`：资源不存在
- `2002`：状态不允许当前操作
- `2003`：重复操作
- `3001`：未登录
- `3002`：无权限
- `3003`：数据范围越权
- `4001`：数据库异常

## 4. 接口分组

### 4.1 Auth
- `POST /auth/wechat/login`
- `POST /auth/logout`
- `GET /auth/me`

### 4.2 User
- `GET /users/me`
- `PATCH /users/me/profile`
- `GET /users/me/clubs`
- `POST /users/me/clubs/switch`

### 4.3 Club
- `GET /clubs/{id}`
- `POST /clubs/{id}/join`
- `GET /clubs/{id}/players`
- `GET /clubs/{id}/services`

### 4.4 Player
- `GET /players/{id}`
- `PATCH /player/me/profile`
- `PATCH /player/me/work-status`
- `POST /player/me/applications`
- `GET /player/me/orders`

### 4.5 Order
- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `POST /orders/{id}/cancel`

### 4.6 Dispatch
- `GET /player/order-pool`
- `POST /player/orders/{id}/grab`
- `POST /player/orders/{id}/accept`
- `POST /player/orders/{id}/reject`
- `POST /admin/orders/{id}/dispatch`

### 4.7 Service / Report
- `POST /player/orders/{id}/start-service`
- `POST /player/orders/{id}/finish-service`
- `POST /orders/{id}/reports`
- `GET /admin/reports`
- `POST /admin/reports/{id}/approve`
- `POST /admin/reports/{id}/reject`

### 4.8 Points
- `GET /player/me/points`
- `GET /player/me/points/flows`
- `POST /admin/points/adjust`

### 4.9 Withdraw
- `POST /withdrawals`
- `GET /withdrawals/me`
- `GET /admin/withdrawals`
- `POST /admin/withdrawals/{id}/approve`
- `POST /admin/withdrawals/{id}/reject`
- `POST /admin/withdrawals/{id}/confirm-transfer`

### 4.10 Reward
- `POST /rewards`
- `GET /rewards/me`
- `POST /admin/rewards/{id}/confirm-payment`

### 4.11 Admin / Platform
- `GET /admin/dashboard`
- `GET /admin/orders`
- `POST /admin/orders/{id}/confirm-payment`
- `GET /platform/dashboard`
- `GET /platform/clubs`
- `POST /platform/clubs/{id}/approve`
- `PATCH /platform/clubs/{id}/features`

## 5. 核心接口定义

### 5.1 微信登录

`POST /api/v1/auth/wechat/login`

请求：

```json
{
  "code": "wx-login-code"
}
```

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "jwt-token",
    "expires_in": 86400,
    "user": {
      "id": 1,
      "nickname": "张三",
      "avatar": "https://example.com/avatar.png"
    },
    "roles": ["user", "player"]
  }
}
```

### 5.2 创建订单

`POST /api/v1/orders`

请求：

```json
{
  "club_id": 1,
  "order_type": "designated",
  "player_id": 101,
  "service_type": "王者荣耀-钻石局",
  "price_per_hour": 40,
  "hours": 2,
  "user_remark": "希望开麦教学"
}
```

规则：
- 普通单可不传 `player_id`
- 创建后订单状态为 `pending_payment`
- 金额由后端二次计算，不完全信任前端

### 5.3 管理员确认订单付款

`POST /api/v1/admin/orders/{id}/confirm-payment`

请求：

```json
{
  "confirmed_amount": 80,
  "confirm_note": "微信转账已到账",
  "voucher_url": "https://example.com/voucher.png"
}
```

结果：
- 写入 `payment_confirmation`
- 更新订单状态为 `paid_pending_dispatch`
- 写入操作日志

### 5.4 抢单

`POST /api/v1/player/orders/{id}/grab`

规则：
- 仅普通单可抢
- 仅同俱乐部陪玩可抢
- 陪玩必须处于可接单状态
- 需要并发控制，避免多人抢中同一订单

成功结果：
- 订单状态变为 `accepted`
- 写入 `order_dispatch.accepted_player_id`
- 记录接单时间

### 5.5 提交报备

`POST /api/v1/orders/{id}/reports`

请求：

```json
{
  "start_time": "2026-04-21T20:00:00+08:00",
  "end_time": "2026-04-21T22:00:00+08:00",
  "duration_minutes": 120,
  "content": "完成双排上分和教学",
  "attachments": []
}
```

结果：
- 创建 `service_report`
- 更新订单状态为 `pending_report_audit`

### 5.6 审核报备通过

`POST /api/v1/admin/reports/{id}/approve`

请求：

```json
{
  "points": 800,
  "remark": "按订单结算发放积分"
}
```

结果：
- 报备状态改为 `approved`
- 订单状态改为 `completed`
- 增加 `player_points`
- 新增 `points_flow`
- 写入操作日志

### 5.7 发起提现

`POST /api/v1/withdrawals`

请求：

```json
{
  "amount": 80,
  "points": 800,
  "wechat_id": "player_wx_01",
  "wechat_name": "小王"
}
```

结果：
- 创建提现单
- 冻结相应积分
- 写入 `points_flow: withdraw_freeze`

### 5.8 确认提现转账

`POST /api/v1/admin/withdrawals/{id}/confirm-transfer`

请求：

```json
{
  "transfer_channel": "wechat",
  "transfer_note": "已完成微信转账",
  "voucher_url": "https://example.com/transfer.png"
}
```

结果：
- 更新提现状态为 `completed`
- 扣减冻结积分
- 写入 `transfer_record`
- 写入 `points_flow: withdraw_deduct`
- 写入操作日志

## 6. 幂等与并发要求

以下接口必须支持幂等控制：
- 登录
- 确认付款
- 抢单
- 审核报备
- 发起提现
- 确认提现转账

建议：
- 请求头支持 `X-Idempotency-Key`
- 抢单使用 Redis 锁或数据库乐观锁
- 审核类动作在事务中校验当前状态

## 7. 列表接口通用规范

列表接口统一支持：
- `page`
- `page_size`
- `status`
- `club_id`（仅管理员/平台侧可用）
- `keyword`
- `start_time`
- `end_time`

统一分页结构：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "page_size": 20,
      "total": 100
    }
  }
}
```
