/**
 * 业务常量与正则。
 */

/**
 * 元与积分的兑换比例。**强制 1:1。**
 * 改动此常量将影响订单结算、打赏、提现等核心链路，需全局评估。
 */
export const POINTS_PER_YUAN = 1;

/** 两位小数金额字符串的校验正则，例："80.00"。 */
export const DECIMAL_2_PATTERN = /^\d+\.\d{2}$/;

/** 分页默认值与上限。 */
export const PAGE_DEFAULT = 1;
export const PAGE_SIZE_DEFAULT = 20;
export const PAGE_SIZE_MAX = 100;

/** 幂等键请求头名。 */
export const IDEMPOTENCY_KEY_HEADER = 'X-Idempotency-Key';

/** 认证请求头。 */
export const AUTH_HEADER = 'Authorization';
export const AUTH_SCHEME = 'Bearer';

/**
 * 将 DecimalString 金额换算为积分。
 * 注意：Math.round 只用于兜底极少数脏数据，正常金额始终两位小数。
 */
export function amountToPoints(amount: string): number {
  const n = parseFloat(amount);
  if (Number.isNaN(n)) throw new Error(`Invalid decimal amount: ${amount}`);
  return Math.round(n * POINTS_PER_YUAN);
}

/** 将积分换算为 DecimalString 金额（保留 2 位小数）。 */
export function pointsToAmount(points: number): string {
  return (points / POINTS_PER_YUAN).toFixed(2);
}
