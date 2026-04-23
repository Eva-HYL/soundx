import type { PresetColorType } from 'antd/es/_util/colors';

type StatusDef = { text: string; color: PresetColorType | 'default' };

export const ORDER_STATUS: Record<string, StatusDef> = {
  pending_payment:        { text: '待付款',     color: 'gold' },
  paid_pending_dispatch:  { text: '待派发',     color: 'gold' },
  pending_accept:         { text: '待接单',     color: 'gold' },
  accepted:               { text: '已接单',     color: 'blue' },
  in_service:             { text: '服务中',     color: 'blue' },
  pending_report:         { text: '待报备',     color: 'orange' },
  pending_report_audit:   { text: '待审核',     color: 'orange' },
  completed:              { text: '已完成',     color: 'green' },
  cancelled:              { text: '已取消',     color: 'default' },
  closed:                 { text: '已关闭',     color: 'default' },
};

export const WITHDRAW_STATUS: Record<string, StatusDef> = {
  pending_review:               { text: '待审核', color: 'gold' },
  approved_pending_transfer:    { text: '待转账', color: 'blue' },
  transferred_pending_confirm:  { text: '待确认', color: 'blue' },
  completed:                    { text: '已完成', color: 'green' },
  rejected:                     { text: '已驳回', color: 'red' },
};

export const TIP_STATUS: Record<string, StatusDef> = {
  received:        { text: '已到账', color: 'green' },
  pending_confirm: { text: '待确认', color: 'gold' },
  refunded:        { text: '已退款', color: 'default' },
};

export const PLAYER_WORK_STATUS: Record<string, { text: string; color: string }> = {
  online:     { text: '在线',   color: '#52c41a' },
  in_service: { text: '服务中', color: '#1677ff' },
  busy:       { text: '忙碌',   color: '#faad14' },
  resting:    { text: '休息',   color: '#8c8c8c' },
  offline:    { text: '离线',   color: '#d9d9d9' },
  pending:    { text: '待审核', color: '#faad14' },
};
