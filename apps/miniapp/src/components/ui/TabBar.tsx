import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { TU } from '../../constants/tokens';
import { useSafeArea } from '../../hooks/useSafeArea';

type UserTab = 'home' | 'orders' | 'msg' | 'me';
type PalTab = 'pool' | 'orders' | 'income' | 'me';

interface TabBarProps {
  role?: 'user' | 'pal';
  active: string;
}

const USER_TABS: { key: UserTab; label: string; badge?: number; path: string }[] = [
  { key: 'home', label: '首页', path: '/pages/home/index' },
  { key: 'orders', label: '我的订单', badge: 2, path: '/pages/order/list/index' },
  { key: 'msg', label: '消息', path: '/pages/messages/index' },
  { key: 'me', label: '我的', path: '/pages/profile/index' },
];

const PAL_TABS: { key: PalTab; label: string; badge?: number; path: string }[] = [
  { key: 'pool', label: '订单池', badge: 8, path: '/pages/order/pool/index' },
  { key: 'orders', label: '我的订单', path: '/pages/order/pal-list/index' },
  { key: 'income', label: '收入', path: '/pages/finance/income/index' },
  { key: 'me', label: '我的', path: '/pages/profile/index' },
];

export function TabBar({ role = 'user', active }: TabBarProps) {
  const { safeAreaBottom } = useSafeArea();
  const tabs = role === 'pal' ? PAL_TABS : USER_TABS;

  const iconPath = (key: string, _c: string) => {
    const icons: Record<string, string> = {
      home: `M 12 3 L 2 10 L 2 20 L 8 20 L 8 14 L 16 14 L 16 20 L 22 20 L 22 10 Z`,
      orders: `M 5 3 Q 5 2 6 2 L 18 2 Q 19 2 19 3 L 19 21 Q 19 22 18 22 L 6 22 Q 5 22 5 21 Z M 8 8 L 16 8 M 8 12 L 16 12 M 8 16 L 13 16`,
      msg: `M 4 5 Q 4 3 6 3 L 18 3 Q 20 3 20 5 L 20 15 Q 20 17 18 17 L 10 17 L 6 20 L 6 17 L 6 17 Q 4 17 4 15 Z`,
      me: `M 12 4 A 4 4 0 1 1 12 12 A 4 4 0 1 1 12 4 M 4 21 C 4 17 8 14 12 14 C 16 14 20 17 20 21`,
      pool: `M 13 2 L 4 13 L 10 13 L 9 22 L 18 11 L 12 11 Z`,
      income: `M 4 19 L 4 10 M 9 19 L 9 5 M 14 19 L 14 13 M 19 19 L 19 8`,
    };
    return icons[key] || '';
  };

  return (
    <View
      style={{
        background: TU.white,
        borderTop: `1rpx solid ${TU.borderLight}`,
        flexShrink: 0,
      }}
    >
      {/* Tab row — fixed height so icons always stay vertically centred */}
      <View style={{ height: '98rpx', display: 'flex', flexDirection: 'row' }}>
      {tabs.map(t => {
        const isActive = t.key === active;
        const col = isActive ? TU.brand : TU.text3;
        return (
          <View
            key={t.key}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6rpx',
            }}
            onClick={() => Taro.switchTab({ url: t.path })}
          >
            <View style={{ position: 'relative' }}>
              <svg width="48rpx" height="48rpx" viewBox="0 0 24 24" fill="none">
                <path
                  d={iconPath(t.key, col)}
                  stroke={col}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t.badge && (
                <View
                  style={{
                    position: 'absolute',
                    top: '-6rpx',
                    right: '-16rpx',
                    minWidth: '30rpx',
                    height: '30rpx',
                    padding: '0 8rpx',
                    background: TU.error,
                    borderRadius: '999rpx',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: '18rpx', fontWeight: 500 }}>
                    {t.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: '20rpx', color: col }}>{t.label}</Text>
          </View>
        );
      })}
      </View>
      {/* Safe-area bottom spacer — pushes content above the home indicator */}
      {safeAreaBottom > 0 && <View style={{ height: `${safeAreaBottom}px` }} />}
    </View>
  );
}
