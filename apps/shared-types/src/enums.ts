/**
 * 所有业务枚举（字符串字面量联合类型）。
 *
 * 命名约定：字面量一律 snake_case；数据库层 Prisma 仍用 UPPER_SNAKE，
 * 在 Mapper 层做大小写转换。
 */

// ============ 3.1 用户与角色 ============

export type UserStatus = 'active' | 'disabled';

export type Gender = 0 | 1 | 2;

export type RoleType = 'user' | 'player' | 'club_admin' | 'platform_admin' | 'super_admin';

export type ClubStaffRole = 'owner' | 'admin' | 'finance' | 'service';

// ============ 3.2 俱乐部 ============

export type ClubStatus = 'trial' | 'active' | 'expired' | 'disabled';

export type PackageType = 'basic' | 'standard' | 'premium';

export type DispatchModeConfig = 'grab_only' | 'assign_only' | 'mixed';

// ============ 3.3 陪玩 ============

export type PlayerProfileStatus = 'pending' | 'active' | 'disabled' | 'rejected';

export type PlayerWorkStatusType = 'offline' | 'online' | 'busy' | 'resting';

export type PlayerApplyStatus = 'pending' | 'approved' | 'rejected';

// ============ 3.4 订单 / 派发 ============

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

export type DispatchStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled';

// ============ 3.5 报备 ============

export type ReportStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

// ============ 3.6 积分 ============

export type PointsFlowType =
  | 'order_income'
  | 'reward_income'
  | 'withdraw_freeze'
  | 'withdraw_deduct'
  | 'withdraw_unfreeze'
  | 'manual_adjust'
  | 'penalty';

export type BizType = 'order' | 'report' | 'reward' | 'withdraw' | 'subscription' | 'manual';

// ============ 3.7 提现 ============

export type WithdrawStatus =
  | 'pending_review'
  | 'approved_pending_transfer'
  | 'transferred_pending_confirm'
  | 'completed'
  | 'rejected'
  | 'cancelled';

// ============ 3.8 打赏 ============

export type RewardPaymentStatus =
  | 'pending_payment'
  | 'paid_pending_confirm'
  | 'confirmed'
  | 'rejected'
  | 'cancelled';

// ============ 3.9 人工确认与转账 ============

export type PaymentConfirmationStatus = 'confirmed' | 'rejected' | 'invalid';

export type TransferRecordStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export type TransferChannel = 'wechat' | 'alipay' | 'bank' | 'other';
