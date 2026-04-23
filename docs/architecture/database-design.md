# 数据库设计修正版

## 1. 设计原则

- 保留现有核心表，避免无效推翻
- 补齐订单派发、报备、人工确认和审计能力
- 将积分流水作为结算追溯核心
- 面向 MVP 实际开发，不提前做过度设计

## 2. 推荐核心表

### 身份与组织
- `user`
- `user_role`
- `club`
- `club_staff`
- `user_club`
- `player`
- `player_club_apply`

### 俱乐部配置
- `club_config`
- `player_service`

### 交易链路
- `order`
- `order_dispatch`
- `service_report`
- `reward`

### 积分与提现
- `player_points`
- `points_flow`
- `withdraw`

### 审计与确认
- `payment_confirmation`
- `transfer_record`
- `operation_log`

## 3. 关键修正点

### 3.1 用户与角色分离
`user` 表只保存用户基础资料，角色关系通过 `user_role` 管理，以支持一个账号拥有多种身份。

### 3.2 俱乐部管理员独立建模
不应只依赖 `club.owner_id`。建议通过 `club_staff` 管理俱乐部内多种后台角色。

### 3.3 订单状态细化
订单建议使用以下状态：
- `pending_payment`
- `paid_pending_dispatch`
- `pending_accept`
- `accepted`
- `in_service`
- `pending_report`
- `pending_report_audit`
- `completed`
- `cancelled`
- `closed`

### 3.4 订单派发独立建模
`order_dispatch` 用于记录抢单、派单、指定单的流转历史，不应把所有派发信息都压在订单主表。

### 3.5 报备独立建模
`service_report` 独立承载服务报备内容、审核结果和驳回原因，不建议仅在订单表记录报备时间。

### 3.6 积分流水语义增强
`points_flow` 应支持：
- 流水类型
- 业务类型
- 业务 ID
- 操作人
- 余额快照

### 3.7 提现状态细化
提现建议使用：
- `pending_review`
- `approved_pending_transfer`
- `transferred_pending_confirm`
- `completed`
- `rejected`
- `cancelled`

### 3.8 人工确认与转账独立留痕
- `payment_confirmation`：记录订单、打赏、订阅等人工到账确认
- `transfer_record`：记录提现或其他场景的人工转账动作

### 3.9 审计日志独立表
`operation_log` 记录所有关键后台动作，至少覆盖付款确认、报备审核、提现处理、配置修改和积分调整。

## 4. MVP 最小表集

建议先落以下表即可支撑首期开发：
- `user`
- `user_role`
- `club`
- `club_staff`
- `user_club`
- `player`
- `player_service`
- `club_config`
- `order`
- `order_dispatch`
- `service_report`
- `player_points`
- `points_flow`
- `withdraw`
- `payment_confirmation`
- `operation_log`

## 5. 下一步建议

在此基础上继续输出：
- Prisma Schema 初稿
- API 设计文档
- 权限模型文档
