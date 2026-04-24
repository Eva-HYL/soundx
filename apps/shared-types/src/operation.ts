/**
 * 操作日志动作枚举。
 * 覆盖管理员 / 平台 / 陪玩 / 用户四方的写操作。
 */

export type OperationAction =
  // ---- 管理员 / 平台 ----
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

  // ---- 用户（下单方）----
  | 'user.order.create'
  | 'user.order.cancel'
  | 'user.reward.create'
  | 'user.reward.mark_paid'
  | 'user.reward.cancel'
  | 'user.club.join'
  | 'user.profile.update'

  // ---- 陪玩 ----
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

/** 是否为管理员侧动作（需同步写日志）。 */
export function isAdminAction(action: OperationAction): boolean {
  return action.startsWith('admin.');
}
