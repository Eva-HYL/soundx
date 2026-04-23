# 数据结构规范（前后端共享契约）

本文件是前后端在 API 边界交换数据的**事实标准**。所有 DTO、实体、枚举、错误码以本文档为准；Prisma 模型是数据库层落地，可能与此存在字段差异，通过 Mapper 转换。

---

## 1. 基础约定

### 1.1 命名

- **API 边界统一使用 camelCase**（例如 `orderNo`、`createdAt`）
- 数据库使用 snake_case（Prisma `@map` 自动转换）
- 枚举值：常量名 UPPER_SNAKE，字符串字面量 `snake_case`（序列化/存储用）

### 1.2 类型约定

| 领域类型 | TypeScript 表示 | 序列化格式 | 说明 |
|---------|----------------|------------|------|
| ID | `string` | `"12345"` | Prisma BigInt 序列化字符串，避免 JS Number 精度丢失 |
| 金额 | `string` | `"80.00"` | 单位：元，**严格 2 位小数**。后端 Decimal(10,2)，API 默认以字符串形式返回，避免 JS float 精度与 `80` vs `80.00` 的歧义 |
| 时长（小时） | `string` | `"2.00"` | Decimal(5,2) |
| 评分 / 百分比 | `string` | `"4.50"` / `"85.00"` | Decimal；前端按需 `parseFloat` |
| 费率 | `string` | `"0.02"` | Decimal(5,2)，0-1 之间的小数 |
| 积分 | `number` | `80` | 整数 |
| 时间 | `string` | ISO 8601 | 例 `2026-04-22T14:30:00+08:00` |
| 文件（写入） | `string`（`fileKey`） | — | 由 Upload 服务返回的对象存储 key |
| 文件（读取） | `FileRef` | — | 服务端签发访问 URL 的对象 |
| 性别 | `Gender` (`0 \| 1 \| 2`) | 整数 | 0 未知 / 1 男 / 2 女 |
| 布尔 | `boolean` | `true/false` | 不用 `0/1` |
| 非结构化扩展 | 优先具体 interface，次选 `Record<string, unknown>` | — | 避免 `any` |

**规则：凡 Prisma 为 `Decimal` 的字段，API 边界一律 `string` 类型，保留列定义的小数位数。** 这样前后端都不会因 float 产生 `80.0000000001` 之类的问题，也不会出现 `80` 和 `80.00` 的展示差异。

辅助类型（放 `shared-types`）：

```ts
export type DecimalString = string;   // 语义占位，统一金额/时长/费率
```

### 1.3 金额与积分换算

**强制约定：1 元 = 1 积分。**

- 订单结算时，陪玩应得积分 = `parseFloat(order.totalAmount)`（管理员可在审核时微调）
- 提现时 `amount(元) === points(积分)`，因此 `CreateWithdrawReq` 只传 `amount`，`points` 由后端推导
- 打赏结算同理
- 业务常量：`POINTS_PER_YUAN = 1`

### 1.4 列表接口统一结构

```ts
export interface PageQuery {
  page?: number;            // 默认 1，最小 1
  pageSize?: number;        // 默认 20，最大 100
  sortBy?: string;          // 字段名，由各接口声明支持列表
  sortOrder?: 'asc' | 'desc';
}

export interface Paginated<T> {
  list: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}
```

### 1.5 统一响应

```ts
export interface ApiResponse<T> {
  code: number;             // 0 表示成功
  message: string;
  data: T;
}

export interface ApiError {
  code: number;             // 非 0
  message: string;
  error?: {
    reason?: string;
    field?: string;
    [key: string]: unknown;
  };
}
```

### 1.6 幂等

- 对写操作，请求头可携带 `X-Idempotency-Key`（UUID）
- 后端对同 key 在 24h 内返回同一结果
- 必须幂等的接口：登录、确认付款、抢单、审核报备、发起提现、确认转账、确认打赏

### 1.7 文件上传约束

每个 `UploadBizType` 有独立的大小 / MIME 白名单（后端配置，前端通过 `UploadSignResp.maxSizeBytes` 获取）：

| bizType | 最大大小 | 允许 MIME |
|--------|---------|----------|
| `payment_voucher` | 5 MB | `image/jpeg`, `image/png`, `application/pdf` |
| `reward_voucher` | 5 MB | `image/jpeg`, `image/png`, `application/pdf` |
| `transfer_voucher` | 5 MB | `image/jpeg`, `image/png`, `application/pdf` |
| `report_attachment` | 5 MB | `image/jpeg`, `image/png` |
| `player_voice` | 10 MB | `audio/mpeg`, `audio/aac`, `audio/mp4` |
| `player_avatar` | 2 MB | `image/jpeg`, `image/png`, `image/webp` |
| `user_avatar` | 2 MB | `image/jpeg`, `image/png`, `image/webp` |
| `club_logo` | 2 MB | `image/jpeg`, `image/png`, `image/webp` |

后端以此表为源，前端勿写死。签名阶段校验 MIME，上传完成后异步二次校验（内容探测 + 大小）。

---

## 2. 错误码

```ts
export const ErrorCode = {
  SUCCESS: 0,

  // 1xxx 参数错误
  PARAM_MISSING: 1001,
  PARAM_INVALID: 1002,
  PARAM_OUT_OF_RANGE: 1003,
  FILE_TOO_LARGE: 1101,
  FILE_TYPE_NOT_ALLOWED: 1102,
  FILE_KEY_INVALID: 1103,

  // 2xxx 业务状态错误
  RESOURCE_NOT_FOUND: 2001,
  INVALID_STATE: 2002,
  DUPLICATE_OPERATION: 2003,

  // 2100 订单
  ORDER_ALREADY_GRABBED: 2101,
  ORDER_NOT_GRABBABLE: 2102,
  PLAYER_NOT_AVAILABLE: 2103,
  ORDER_AMOUNT_MISMATCH: 2104,
  DISPATCH_EXPIRED: 2105,

  // 2200 积分/提现
  INSUFFICIENT_POINTS: 2201,
  WITHDRAW_AMOUNT_BELOW_MIN: 2202,
  WITHDRAW_ALREADY_IN_FLIGHT: 2203,

  // 2300 报备
  REPORT_ALREADY_SUBMITTED: 2301,
  REPORT_NOT_REVIEWABLE: 2302,

  // 2400 打赏
  REWARD_ALREADY_CONFIRMED: 2401,

  // 3xxx 鉴权与权限
  UNAUTHORIZED: 3001,
  FORBIDDEN: 3002,
  CLUB_SCOPE_DENIED: 3003,
  ROLE_NOT_ALLOWED: 3004,
  TOKEN_EXPIRED: 3005,

  // 4xxx 系统错误
  DATABASE_ERROR: 4001,
  EXTERNAL_SERVICE_ERROR: 4002,
  UPLOAD_SERVICE_ERROR: 4003,
  INTERNAL_ERROR: 4999,
} as const;

export type ErrorCodeValue = typeof ErrorCode[keyof typeof ErrorCode];
```

---

## 3. 枚举

### 3.1 用户与角色

```ts
export type UserStatus = 'active' | 'disabled';

export type Gender = 0 | 1 | 2;

export type RoleType =
  | 'user'
  | 'player'
  | 'club_admin'
  | 'platform_admin'
  | 'super_admin';

export type ClubStaffRole = 'owner' | 'admin' | 'finance' | 'service';
```

### 3.2 俱乐部

```ts
export type ClubStatus = 'trial' | 'active' | 'expired' | 'disabled';

export type PackageType = 'basic' | 'standard' | 'premium';

export type DispatchModeConfig = 'grab_only' | 'assign_only' | 'mixed';
```

### 3.3 陪玩

```ts
export type PlayerProfileStatus = 'pending' | 'active' | 'disabled' | 'rejected';

export type PlayerWorkStatusType = 'offline' | 'online' | 'busy' | 'resting';

export type PlayerApplyStatus = 'pending' | 'approved' | 'rejected';
```

### 3.4 订单 / 派发

```ts
export type OrderType = 'designated' | 'normal' | 'urgent' | 'newbie';

export type DispatchMode = 'grab' | 'assign' | 'designated';

export type OrderStatus =
  | 'pending_payment'
  | 'paid_pending_dispatch'
  | 'pending_accept'
  | 'accepted'
  | 'in_service'
  | 'pending_report'
  | 'pending_report_audit'
  | 'completed'
  | 'cancelled'
  | 'closed';

export type DispatchStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled';
```

### 3.5 报备

```ts
export type ReportStatus = 'draft' | 'submitted' | 'approved' | 'rejected';
```

### 3.6 积分

```ts
export type PointsFlowType =
  | 'order_income'
  | 'reward_income'
  | 'withdraw_freeze'
  | 'withdraw_deduct'
  | 'withdraw_unfreeze'
  | 'manual_adjust'
  | 'penalty';

export type BizType =
  | 'order'
  | 'report'
  | 'reward'
  | 'withdraw'
  | 'subscription'
  | 'manual';
```

### 3.7 提现

```ts
export type WithdrawStatus =
  | 'pending_review'
  | 'approved_pending_transfer'
  | 'transferred_pending_confirm'
  | 'completed'
  | 'rejected'
  | 'cancelled';
```

### 3.8 打赏

```ts
export type RewardPaymentStatus =
  | 'pending_payment'
  | 'paid_pending_confirm'
  | 'confirmed'
  | 'rejected'
  | 'cancelled';
```

### 3.9 人工确认与转账

```ts
export type PaymentConfirmationStatus = 'confirmed' | 'rejected' | 'invalid';

export type TransferRecordStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export type TransferChannel = 'wechat' | 'alipay' | 'bank' | 'other';
```

### 3.10 文件上传

```ts
export type UploadBizType =
  | 'payment_voucher'
  | 'reward_voucher'
  | 'transfer_voucher'
  | 'report_attachment'
  | 'player_voice'
  | 'player_avatar'
  | 'user_avatar'
  | 'club_logo';

export type UploadMethod = 'PUT' | 'POST';
```

### 3.11 操作日志动作

覆盖管理员 / 平台 / 陪玩 / 用户四方的写操作。所有需要留痕的业务动作必须落 `operation_log`。

```ts
export type OperationAction =
  // --- 管理员 / 平台 ---
  | 'admin.order.confirm_payment'
  | 'admin.order.dispatch'
  | 'admin.order.cancel'
  | 'admin.order.close'
  | 'admin.report.approve'
  | 'admin.report.reject'
  | 'admin.withdraw.approve'
  | 'admin.withdraw.reject'
  | 'admin.withdraw.confirm_transfer'
  | 'admin.points.adjust'
  | 'admin.reward.confirm_payment'
  | 'admin.reward.reject'
  | 'admin.club.approve'
  | 'admin.club.update_features'
  | 'admin.club.update_config'
  | 'admin.player.approve_apply'
  | 'admin.player.reject_apply'
  | 'admin.player.disable'
  | 'admin.user.assign_role'
  | 'admin.user.revoke_role'

  // --- 用户（下单方）---
  | 'user.order.create'
  | 'user.order.cancel'
  | 'user.reward.create'
  | 'user.reward.mark_paid'
  | 'user.reward.cancel'
  | 'user.club.join'
  | 'user.profile.update'

  // --- 陪玩 ---
  | 'player.apply.submit'
  | 'player.order.grab'
  | 'player.order.accept'
  | 'player.order.reject'
  | 'player.service.start'
  | 'player.service.finish'
  | 'player.report.submit'
  | 'player.report.resubmit'
  | 'player.withdraw.create'
  | 'player.withdraw.cancel'
  | 'player.work_status.update'
  | 'player.profile.update'
  | 'player.service.update';
```

**写入策略**：
- 管理员动作（`admin.*`）：强制写日志，主线业务事务内同写
- 用户 / 陪玩动作：写异步日志（事务外），避免影响关键路径延迟
- 敏感动作（撤单、退款相关）即使是 C 端也同步写

---

## 4. 领域实体（API 返回形态）

### 4.1 FileRef

```ts
export interface FileRef {
  fileKey: string;          // 对象存储 key（稳定）
  url: string;              // 服务端签发访问 URL（可能带过期）
  filename?: string;
  mimeType?: string;
  sizeBytes?: number;
}
```

请求体传 `fileKey`，响应体返回完整 `FileRef`。前端展示用 `url`。

### 4.2 User

```ts
export interface User {
  id: string;
  nickname: string | null;
  avatar: string | null;          // URL
  phone: string | null;
  gender: Gender;
  status: UserStatus;
  roles: RoleType[];
  createdAt: string;
  lastLoginAt: string | null;
}
```

### 4.3 Club

```ts
export interface Club {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
  ownerId: string;
  ownerName: string;
  status: ClubStatus;
  createdAt: string;
}

export interface ClubFeatures {
  voice: boolean;
  task: boolean;
  welfare: boolean;
}

export interface ClubConfig {
  clubId: string;
  packageType: PackageType;
  playerLimit: number;
  features: ClubFeatures;
  minWithdrawAmount: DecimalString;    // 元，2 位小数
  withdrawFeeRate: DecimalString;      // 0-1 小数，例 "0.02"
  dispatchMode: DispatchModeConfig;
  serviceNotice: string | null;
  paymentNotice: string | null;
  expiredAt: string | null;
}

export interface ClubStaff {
  id: string;
  clubId: string;
  userId: string;
  staffRole: ClubStaffRole;
  status: boolean;
  createdAt: string;
}

export interface UserClub {
  clubId: string;
  clubName: string;
  isCurrent: boolean;
  joinedAt: string;
}
```

### 4.4 Player

```ts
export interface Player {
  id: string;
  userId: string;
  clubId: string;
  nickname: string | null;
  avatar: string | null;
  level: number;
  profileStatus: PlayerProfileStatus;
  ability: string | null;
  description: string | null;
  voice: {
    url: string | null;
    durationSeconds: number;
  };
  successRate: DecimalString;          // "85.00"
  rating: DecimalString;               // "4.50"
  totalOrders: number;
  workStatus: PlayerWorkStatusType;
  createdAt: string;
}

export interface PlayerService {
  id: string;
  playerId: string;
  clubId: string;
  serviceType: string;
  price: DecimalString;                // 元/小时
  createdAt: string;
}

export interface PlayerClubApply {
  id: string;
  playerId: string;
  clubId: string;
  applyReason: string | null;
  status: PlayerApplyStatus;
  reviewerId: string | null;
  reviewTime: string | null;
  reviewNote: string | null;
  createdAt: string;
}
```

### 4.5 Order

```ts
export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  clubId: string;
  playerId: string | null;
  playerName: string | null;
  orderType: OrderType;
  dispatchMode: DispatchMode | null;
  serviceType: string;
  pricePerHour: DecimalString;
  hours: DecimalString;
  totalAmount: DecimalString;
  status: OrderStatus;
  userRemark: string | null;
  adminRemark: string | null;
  paymentConfirmedAt: string | null;
  acceptedAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDispatch {
  id: string;
  orderId: string;
  clubId: string;
  dispatchMode: DispatchMode;
  status: DispatchStatus;
  targetPlayerId: string | null;
  acceptedPlayerId: string | null;
  dispatchTime: string;
  expireTime: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  createdAt: string;
}
```

### 4.6 ServiceReport

```ts
export interface ServiceReport {
  id: string;
  orderId: string;
  clubId: string;
  playerId: string;
  status: ReportStatus;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  content: string;
  attachments: FileRef[];
  userConfirmed: boolean;
  reviewerId: string | null;
  reviewTime: string | null;
  rejectReason: string | null;
  createdAt: string;
}
```

### 4.7 积分

```ts
export interface PlayerPoints {
  playerId: string;
  clubId: string;
  totalPoints: number;
  availablePoints: number;
  frozenPoints: number;
  withdrawablePoints: number;
  updatedAt: string;
}

export interface PointsFlow {
  id: string;
  playerId: string;
  clubId: string;
  flowType: PointsFlowType;
  bizType: BizType | null;
  bizId: string | null;
  points: number;              // 正负数
  balance: number;             // 变动后可用积分快照
  operatorId: string | null;
  remark: string | null;
  createdAt: string;
}
```

### 4.8 Withdraw

```ts
export interface Withdraw {
  id: string;
  playerId: string;
  clubId: string;
  amount: DecimalString;       // "80.00"
  points: number;              // 因 1元=1积分，等于 parseFloat(amount)
  wechatId: string;
  wechatName: string;
  status: WithdrawStatus;
  reviewerId: string | null;
  reviewTime: string | null;
  reviewNote: string | null;
  transferOperatorId: string | null;
  transferAt: string | null;
  transferChannel: TransferChannel | null;
  transferVoucher: FileRef | null;
  completedAt: string | null;
  createdAt: string;
}
```

### 4.9 Reward

```ts
export interface PremiumServiceItem {
  name: string;
  price: DecimalString;
}

export interface Reward {
  id: string;
  orderId: string;
  userId: string;
  playerId: string;
  clubId: string;
  baseAmount: DecimalString;
  premiumServices: PremiumServiceItem[];
  premiumAmount: DecimalString;
  totalAmount: DecimalString;
  paymentStatus: RewardPaymentStatus;
  message: string | null;
  confirmedBy: string | null;
  confirmedAt: string | null;
  rejectReason: string | null;
  transferVoucher: FileRef | null;
  createdAt: string;
}
```

### 4.10 人工确认与转账

```ts
export interface PaymentConfirmation {
  id: string;
  bizType: BizType;
  bizId: string;
  clubId: string | null;
  payerUserId: string | null;
  orderId: string | null;
  expectedAmount: DecimalString;
  confirmedAmount: DecimalString;
  status: PaymentConfirmationStatus;
  confirmMethod: string;
  confirmNote: string | null;
  voucher: FileRef | null;
  confirmedBy: string;
  confirmedAt: string;
  createdAt: string;
}

export interface TransferRecord {
  id: string;
  bizType: BizType;
  bizId: string;
  clubId: string | null;
  withdrawId: string | null;
  payeeUserId: string | null;
  amount: DecimalString;
  channel: TransferChannel;
  accountName: string | null;
  accountNo: string | null;
  voucher: FileRef | null;
  status: TransferRecordStatus;
  operatorId: string;
  transferTime: string;
  remark: string | null;
  createdAt: string;
}
```

### 4.11 操作日志

```ts
export interface OperationLog {
  id: string;
  operatorId: string;
  operatorRole: RoleType;
  clubId: string | null;
  bizType: BizType;
  bizId: string;
  action: OperationAction;
  beforeData: Record<string, unknown> | null;
  afterData: Record<string, unknown> | null;
  requestId: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}
```

---

## 5. 请求 DTO

### 5.1 Auth

```ts
export interface WechatLoginReq {
  code: string;
}

export interface WechatLoginResp {
  token: string;
  expiresIn: number;
  user: User;
  roles: RoleType[];
}
```

### 5.2 User

```ts
export interface UpdateProfileReq {
  nickname?: string;
  avatarFileKey?: string;
  phone?: string;
  gender?: Gender;
}

export interface SwitchClubReq {
  clubId: string;
}
```

### 5.3 Club

```ts
export interface JoinClubReq {
  clubId: string;
  applyReason?: string;
}

export interface ListClubPlayersQuery extends PageQuery {
  profileStatus?: PlayerProfileStatus;
  workStatus?: PlayerWorkStatusType;
  keyword?: string;
}
```

### 5.4 Order

```ts
export interface CreateOrderReq {
  clubId: string;
  orderType: Extract<OrderType, 'designated' | 'normal'>;
  playerId?: string;
  serviceType: string;
  pricePerHour: DecimalString;       // "40.00"
  hours: DecimalString;              // "2.00"
  userRemark?: string;
}

export interface CancelOrderReq {
  reason: string;
}

export interface ConfirmPaymentReq {
  confirmedAmount: DecimalString;
  confirmNote?: string;
  voucherFileKey?: string;
}

export interface ListOrdersQuery extends PageQuery {
  status?: OrderStatus;
  orderType?: OrderType;
  clubId?: string;
  playerId?: string;
  keyword?: string;
  startTime?: string;
  endTime?: string;
}
```

### 5.5 Dispatch

```ts
export interface AdminDispatchReq {
  playerId: string;
  expireMinutes?: number;
  remark?: string;
}

export interface PlayerRejectOrderReq {
  reason?: string;
}

export interface ListOrderPoolQuery extends PageQuery {
  serviceType?: string;
}
```

### 5.6 Service / Report

```ts
export interface SubmitReportReq {
  startTime: string;
  endTime: string;
  durationMinutes: number;
  content: string;
  attachmentFileKeys?: string[];
}

export interface ApproveReportReq {
  points?: number;             // 默认取 Math.round(parseFloat(order.totalAmount))
  remark?: string;
}

export interface RejectReportReq {
  rejectReason: string;
}

export interface ListReportsQuery extends PageQuery {
  status?: ReportStatus;
  clubId?: string;
  playerId?: string;
  startTime?: string;
  endTime?: string;
}
```

### 5.7 Points

```ts
export interface AdjustPointsReq {
  playerId: string;
  clubId: string;
  points: number;              // 可正可负整数
  remark: string;
}

export interface ListPointsFlowsQuery extends PageQuery {
  flowType?: PointsFlowType;
  bizType?: BizType;
  startTime?: string;
  endTime?: string;
}
```

### 5.8 Withdraw

```ts
export interface CreateWithdrawReq {
  amount: DecimalString;       // points 由后端按 1:1 推导
  wechatId: string;
  wechatName: string;
}

export interface ApproveWithdrawReq {
  reviewNote?: string;
}

export interface RejectWithdrawReq {
  rejectReason: string;
}

export interface ConfirmTransferReq {
  transferChannel: TransferChannel;
  transferNote?: string;
  voucherFileKey?: string;
}

export interface ListWithdrawsQuery extends PageQuery {
  status?: WithdrawStatus;
  clubId?: string;
  playerId?: string;
  startTime?: string;
  endTime?: string;
}
```

### 5.9 Reward

```ts
export interface CreateRewardReq {
  orderId: string;
  baseAmount: DecimalString;
  premiumServices?: PremiumServiceItem[];
  message?: string;
}

export interface ConfirmRewardPaymentReq {
  confirmNote?: string;
  voucherFileKey?: string;
}

export interface RejectRewardReq {
  rejectReason: string;
}
```

### 5.10 Platform

```ts
export interface ApproveClubReq {
  packageType: PackageType;
  expiredAt?: string;
  remark?: string;
}

export interface UpdateClubFeaturesReq {
  packageType?: PackageType;
  playerLimit?: number;
  features?: Partial<ClubFeatures>;
  expiredAt?: string;
}

export interface UpdateClubConfigReq {
  minWithdrawAmount?: DecimalString;
  withdrawFeeRate?: DecimalString;
  dispatchMode?: DispatchModeConfig;
  serviceNotice?: string;
  paymentNotice?: string;
}
```

### 5.11 Upload

```ts
export interface UploadSignReq {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  bizType: UploadBizType;
}

export interface UploadSignResp {
  fileKey: string;
  uploadUrl: string;
  method: UploadMethod;
  headers: Record<string, string>;
  formFields?: Record<string, string>;   // 仅 POST policy 需要
  expiresIn: number;                     // 秒
  publicUrl: string;
  maxSizeBytes: number;                  // 该 bizType 的上限（见 §1.7）
}

export interface ResolveFileReq {
  fileKeys: string[];
}

export interface ResolveFileResp {
  files: FileRef[];
}
```

**上传流程**：
1. 前端 `POST /uploads/sign` → `UploadSignResp`
2. 前端直传到 `uploadUrl`（PUT 或 POST）
3. 业务接口提交 `fileKey`（不传 URL）
4. 读取时，后端将 `fileKey` 膨胀为 `FileRef`

---

## 6. 状态机

### 6.1 Order

```
pending_payment
  └─(admin confirm_payment)→ paid_pending_dispatch
        ├─(designated dispatch)→ pending_accept
        │     ├─(player accept)→ accepted → in_service → pending_report
        │     └─(reject / timeout)→ paid_pending_dispatch
        ├─(player grab)→ accepted → ...
        └─(admin assign)→ pending_accept → ...
  pending_report ─(submit report)→ pending_report_audit
        ├─(admin approve)→ completed          // 同事务：加积分 + 写 points_flow(order_income)
        └─(admin reject)→ pending_report      // 陪玩重提
  任意活跃状态 → cancelled
  异常 → closed
```

### 6.2 Withdraw

```
pending_review
  ├─(approve)→ approved_pending_transfer
  │     └─(confirm_transfer)→ transferred_pending_confirm → completed    // 扣冻结
  ├─(reject)→ rejected                                                    // 解冻
  └─(user cancel)→ cancelled                                              // 解冻
```

### 6.3 ServiceReport

```
submitted
  ├─(approve)→ approved       // 订单 → completed，加积分，写 points_flow
  └─(reject)→ rejected        // 可重提 → submitted
```

### 6.4 Reward

```
pending_payment
  ├─(user mark_paid)→ paid_pending_confirm
  │     ├─(admin confirm_payment)→ confirmed    // 同事务：加陪玩积分 + 写 points_flow(reward_income)
  │     └─(admin reject)→ rejected
  └─(user cancel)→ cancelled
```

### 6.5 积分发放时机（重要）

**订单积分（`order_income`）发放时机**：在 **`admin.report.approve`** 同一事务内：
- 订单 `pending_report_audit` → `completed`
- 报备 `submitted` → `approved`
- `PlayerPoints.availablePoints += points`
- `PlayerPoints.totalPoints += points`
- 新增 `PointsFlow` 记录（`flowType='order_income'`, `bizType='order'`, `bizId=orderId`, `balance=变动后可用积分`）
- 写 `OperationLog`（`admin.report.approve`）

**打赏积分（`reward_income`）发放时机**：在 **`admin.reward.confirm_payment`** 同一事务内，规则同上。

原因：订单"完成"本身就是报备审核通过的结果，两者在同一事务发生；单独在 order 完成后再发积分会增加一次冗余写。

---

## 7. 与 Prisma 模型的差异

| 差异点 | Prisma | API 约定 | 备注 |
|-------|--------|----------|-----|
| 命名 | camelCase | camelCase | 一致 |
| ID | BigInt | string | JS 大整数精度 |
| Decimal 字段 | Decimal(x,y) | `DecimalString` | 金额 / 时长 / 费率 / 评分统一字符串，保留小数位 |
| 枚举 | UPPER_SNAKE | lower_snake | 字符串字面量 |
| 时间 | DateTime | ISO8601 string | — |
| 文件 | `voucherUrl: VARCHAR` | `voucher: FileRef` | 写入传 `fileKey`，读取返回含 URL 对象 |
| `ClubConfig.dispatchMode` | `VARCHAR(32)` | `DispatchModeConfig` enum | **需要更新 Prisma**：加枚举 |
| `Reward.paymentStatus` | `VARCHAR(32)` | `RewardPaymentStatus` enum | **需要更新 Prisma**：加枚举 |
| `Reward.rejectReason` | 暂无 | 新增 `String? @db.VarChar(500)` | **需要更新 Prisma**：加字段 |
| `premiumServices` | `Json?` | `PremiumServiceItem[]`（空数组） | 显式结构 |
| `OperationLog.action` | `VARCHAR(64)` | `OperationAction` | 应用层枚举约束，DB 仍为字符串以便扩展 |
| `OperationLog.operatorRole` | `VARCHAR(32)` | `RoleType` | 同上 |

Mapper 层职责（`apps/api/src/common/mapper/`）：
- BigInt → string
- Decimal → `DecimalString`（通过 `.toFixed(columnScale)`）
- 枚举大小写转换
- `fileKey` ↔ `FileRef`（调用对象存储签发 URL）
- 过滤内部字段（`version` 等）

---

## 8. 落地建议

1. monorepo 中的类型分发：
   - `packages/shared-types`：**手写**枚举、错误码、`ApiResponse<T>`、`Paginated<T>`、`PageQuery`、`FileRef`、`DecimalString`、状态机类型、业务常量（如 `POINTS_PER_YUAN`）、`UploadBizType` 白名单表
   - `packages/api-client`：**自动生成**自 NestJS Swagger 的请求/响应 DTO 与实体
2. NestJS 侧用 `class-validator` + `@nestjs/swagger` 装饰 DTO；对 `DecimalString` 字段用 `@Matches(/^\d+\.\d{2}$/)` 校验
3. 金额比对统一在后端进行（前端不做金额加减，只显示；需要计算就 `parseFloat`）

---

## 9. 变更影响与下一步

本轮定稿后，下列动作需要同步：
1. **更新 Prisma schema**（本次 PR 一并改）：
   - 新增 `RewardPaymentStatus` / `DispatchModeConfig` enum
   - `Reward.paymentStatus` 字段换枚举类型
   - `Reward.rejectReason` 新增
   - `ClubConfig.dispatchMode` 换枚举类型
2. Monorepo 初始化后，首先落 `packages/shared-types` 的枚举 / 常量 / 响应类型
3. api-design.md 的 JSON 样例里金额统一改成 `"80.00"` 字符串（随 NestJS DTO 改造一次性调整）
