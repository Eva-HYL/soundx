import { View, Text } from '@tarojs/components';
import { TU } from '../../constants/tokens';

type TagType = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'tint' | 'fill';
type TagSize = 'small' | 'normal';

interface TagProps {
  type?: TagType;
  size?: TagSize;
  children: React.ReactNode;
  key?: string | number;
}

const TYPE_STYLES: Record<TagType, { bg: string; color: string; border: string }> = {
  default: { bg: TU.white, color: TU.text2, border: TU.border },
  primary: { bg: TU.white, color: TU.brand, border: TU.brand },
  success: { bg: TU.white, color: TU.success, border: TU.success },
  warning: { bg: TU.white, color: '#c48808', border: TU.warning },
  error: { bg: TU.white, color: TU.error, border: TU.error },
  tint: { bg: TU.brandTint, color: TU.brand, border: 'transparent' },
  fill: { bg: TU.brand, color: '#fff', border: 'transparent' },
};

export function Tag({ type = 'default', size = 'normal', children }: TagProps) {
  const t = TYPE_STYLES[type];
  const padding = size === 'small' ? '2rpx 16rpx' : '6rpx 20rpx';
  const fontSize = size === 'small' ? '22rpx' : '24rpx';

  return (
    <View
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        borderRadius: `${TU.radius * 2}rpx`,
        background: t.bg,
        border: `1rpx solid ${t.border}`,
      }}
    >
      <Text style={{ color: t.color, fontSize, lineHeight: 1.4 }}>{children}</Text>
    </View>
  );
}

export function StatusTag({ status }: { status: string }) {
  const map: Record<string, { label: string; type: TagType }> = {
    pending_payment: { label: '待付款', type: 'warning' },
    paid_pending_dispatch: { label: '待派发', type: 'primary' },
    pending_accept: { label: '待接单', type: 'warning' },
    accepted: { label: '已接单', type: 'primary' },
    in_service: { label: '服务中', type: 'primary' },
    pending_report: { label: '待报备', type: 'warning' },
    pending_report_audit: { label: '待审核', type: 'default' },
    completed: { label: '已完成', type: 'success' },
    cancelled: { label: '已取消', type: 'default' },
    closed: { label: '已关闭', type: 'default' },
  };
  const s = map[status] ?? { label: status, type: 'default' as TagType };
  return (
    <Tag type={s.type} size="small">
      {s.label}
    </Tag>
  );
}
