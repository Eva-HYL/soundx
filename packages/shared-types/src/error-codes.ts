/**
 * 错误码注册表。数值分区：
 *   1xxx 参数 / 2xxx 业务状态 / 3xxx 鉴权 / 4xxx 系统
 */

export const ErrorCode = {
  SUCCESS: 0,

  // ---- 1xxx 参数 ----
  PARAM_MISSING: 1001,
  PARAM_INVALID: 1002,
  PARAM_OUT_OF_RANGE: 1003,
  FILE_TOO_LARGE: 1101,
  FILE_TYPE_NOT_ALLOWED: 1102,
  FILE_KEY_INVALID: 1103,

  // ---- 2xxx 业务 ----
  RESOURCE_NOT_FOUND: 2001,
  INVALID_STATE: 2002,
  DUPLICATE_OPERATION: 2003,

  ORDER_ALREADY_GRABBED: 2101,
  ORDER_NOT_GRABBABLE: 2102,
  PLAYER_NOT_AVAILABLE: 2103,
  ORDER_AMOUNT_MISMATCH: 2104,
  DISPATCH_EXPIRED: 2105,

  INSUFFICIENT_POINTS: 2201,
  WITHDRAW_AMOUNT_BELOW_MIN: 2202,
  WITHDRAW_ALREADY_IN_FLIGHT: 2203,

  REPORT_ALREADY_SUBMITTED: 2301,
  REPORT_NOT_REVIEWABLE: 2302,

  REWARD_ALREADY_CONFIRMED: 2401,

  // ---- 3xxx 鉴权 ----
  UNAUTHORIZED: 3001,
  FORBIDDEN: 3002,
  CLUB_SCOPE_DENIED: 3003,
  ROLE_NOT_ALLOWED: 3004,
  TOKEN_EXPIRED: 3005,

  // ---- 4xxx 系统 ----
  DATABASE_ERROR: 4001,
  EXTERNAL_SERVICE_ERROR: 4002,
  UPLOAD_SERVICE_ERROR: 4003,
  INTERNAL_ERROR: 4999,
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * 错误码默认中文文案（后端异常过滤器 / 前端兜底用）。
 * 具体业务可覆盖。
 */
export const ErrorMessage: Record<ErrorCodeValue, string> = {
  [ErrorCode.SUCCESS]: '成功',

  [ErrorCode.PARAM_MISSING]: '参数缺失',
  [ErrorCode.PARAM_INVALID]: '参数非法',
  [ErrorCode.PARAM_OUT_OF_RANGE]: '参数超出范围',
  [ErrorCode.FILE_TOO_LARGE]: '文件过大',
  [ErrorCode.FILE_TYPE_NOT_ALLOWED]: '文件类型不允许',
  [ErrorCode.FILE_KEY_INVALID]: '文件引用无效',

  [ErrorCode.RESOURCE_NOT_FOUND]: '资源不存在',
  [ErrorCode.INVALID_STATE]: '当前状态不允许该操作',
  [ErrorCode.DUPLICATE_OPERATION]: '重复操作',

  [ErrorCode.ORDER_ALREADY_GRABBED]: '订单已被抢走',
  [ErrorCode.ORDER_NOT_GRABBABLE]: '订单不可抢',
  [ErrorCode.PLAYER_NOT_AVAILABLE]: '陪玩当前不可接单',
  [ErrorCode.ORDER_AMOUNT_MISMATCH]: '订单金额与确认金额不一致',
  [ErrorCode.DISPATCH_EXPIRED]: '派单已过期',

  [ErrorCode.INSUFFICIENT_POINTS]: '积分不足',
  [ErrorCode.WITHDRAW_AMOUNT_BELOW_MIN]: '低于最低提现金额',
  [ErrorCode.WITHDRAW_ALREADY_IN_FLIGHT]: '已有进行中的提现',

  [ErrorCode.REPORT_ALREADY_SUBMITTED]: '报备已提交',
  [ErrorCode.REPORT_NOT_REVIEWABLE]: '报备不在可审核状态',

  [ErrorCode.REWARD_ALREADY_CONFIRMED]: '打赏已确认',

  [ErrorCode.UNAUTHORIZED]: '未登录',
  [ErrorCode.FORBIDDEN]: '无权限',
  [ErrorCode.CLUB_SCOPE_DENIED]: '数据范围越权',
  [ErrorCode.ROLE_NOT_ALLOWED]: '角色不允许',
  [ErrorCode.TOKEN_EXPIRED]: '登录已过期',

  [ErrorCode.DATABASE_ERROR]: '数据库异常',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: '外部服务异常',
  [ErrorCode.UPLOAD_SERVICE_ERROR]: '上传服务异常',
  [ErrorCode.INTERNAL_ERROR]: '系统内部错误',
};
