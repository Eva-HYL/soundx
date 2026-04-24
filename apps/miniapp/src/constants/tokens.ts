/** Taro UI / SoundX design tokens */
export const TU = {
  brand: '#6190E8',
  brandLight: '#78A4F4',
  brandDark: '#346FC2',
  brandTint: '#EEF3FD',

  success: '#13CE66',
  successTint: '#E7FAF0',
  warning: '#FFC82C',
  warningTint: '#FFF8E1',
  error: '#FF4949',
  errorTint: '#FFECEC',
  info: '#78A4FA',

  text: '#333333',
  text2: '#666666',
  text3: '#999999',
  text4: '#CCCCCC',

  border: '#E5E5E5',
  borderLight: '#F0F0F0',
  bg: '#F7F7F7',
  bgPage: '#F5F5F5',
  white: '#FFFFFF',

  radius: 4,
  radiusLg: 8,

  font: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif",
} as const;

export const GAMES = [
  { id: 'hok', name: '王者荣耀' },
  { id: 'lol', name: '英雄联盟' },
  { id: 'ys', name: '原神' },
  { id: 'apex', name: 'Apex英雄' },
  { id: 'pg', name: '和平精英' },
  { id: 'val', name: '无畏契约' },
] as const;

export const GAME_MAP: Record<string, string> = Object.fromEntries(GAMES.map(g => [g.id, g.name]));

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending_payment: { label: '待付款', color: '#FFC82C' },
  paid_pending_dispatch: { label: '待派发', color: '#6190E8' },
  pending_accept: { label: '待接单', color: '#FFC82C' },
  accepted: { label: '已接单', color: '#6190E8' },
  in_service: { label: '服务中', color: '#6190E8' },
  pending_report: { label: '待报备', color: '#FFC82C' },
  pending_report_audit: { label: '待审核', color: '#999999' },
  completed: { label: '已完成', color: '#13CE66' },
  cancelled: { label: '已取消', color: '#999999' },
  closed: { label: '已关闭', color: '#999999' },
};

export type WorkStatus = 'online' | 'in_service' | 'busy' | 'resting' | 'offline';
export const WORK_STATUS_MAP: Record<WorkStatus, { label: string; color: string }> = {
  online: { label: '在线', color: '#13CE66' },
  in_service: { label: '服务中', color: '#6190E8' },
  busy: { label: '忙碌', color: '#FFC82C' },
  resting: { label: '休息', color: '#999999' },
  offline: { label: '离线', color: '#CCCCCC' },
};
