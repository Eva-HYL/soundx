# SoundX 文档索引

## 说明

`docs_backup/` 保留原始产品与设计输入，不作为开发阶段的唯一依据。

`docs/` 是正式文档区，用于沉淀已经收敛后的产品、业务规则和技术设计。后续开发默认以这里为准。

## 当前主文档

### 产品
- `product/product-overview.md`：项目定位、角色边界、MVP 范围、核心流程

### 业务规则
- `domain/order-rules.md`：下单、接单、派单、报备、取消等规则
- `domain/finance-rules.md`：人工支付确认、积分结算、提现处理规则

### 技术设计
- `architecture/system-architecture.md`：系统边界、模块划分、技术栈、部署思路
- `architecture/database-design.md`：数据库修正版设计，面向 MVP 开发
- `architecture/api-design.md`：面向 MVP 的接口设计与关键接口定义
- `architecture/auth-and-permission.md`：鉴权方式、角色模型、数据范围和权限校验流程

## 阅读顺序

1. `product/product-overview.md`
2. `domain/order-rules.md`
3. `domain/finance-rules.md`
4. `architecture/system-architecture.md`
5. `architecture/database-design.md`
6. `architecture/api-design.md`
7. `architecture/auth-and-permission.md`

## 后续扩展

后续可继续补充以下文档：
- `project/roadmap.md`
- `project/test-plan.md`
- `ui/miniprogram-pages.md`
- `ui/admin-console.md`
- `ui/platform-console.md`
