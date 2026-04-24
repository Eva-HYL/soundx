import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { NavBar } from '../../../components/ui/NavBar';
import { TabBar } from '../../../components/ui/TabBar';
import { Tabs } from '../../../components/ui/Tabs';
import { StatusTag } from '../../../components/ui/Tag';
import { Button } from '../../../components/ui/Button';
import { TU, GAME_MAP, ORDER_STATUS_MAP } from '../../../constants/tokens';
import { MOCK_USER_ORDERS } from '../../../mock/data';

type OrderStatus = keyof typeof ORDER_STATUS_MAP;

const TAB_KEYS: (OrderStatus | 'all')[] = ['all', 'pending_payment', 'in_service', 'completed'];
const TAB_LABELS = ['全部', '待付款', '进行中', '已完成'];

function getTabBadge(key: OrderStatus | 'all'): number {
  if (key === 'all') return MOCK_USER_ORDERS.length;
  return MOCK_USER_ORDERS.filter(o => o.status === key).length;
}

interface OrderCardProps {
  order: (typeof MOCK_USER_ORDERS)[number];
  key?: string | number;
}

function OrderCard({ order }: OrderCardProps) {
  function goDetail() {
    Taro.navigateTo({ url: `/pages/order/detail/index?orderNo=${order.orderNo}` });
  }

  function goTip() {
    Taro.navigateTo({ url: `/pages/finance/tip/index?orderNo=${order.orderNo}` });
  }

  const gameName = GAME_MAP[order.game] ?? order.game;

  return (
    <View
      style={{
        margin: '0 24rpx 20rpx',
        background: TU.white,
        borderRadius: `${TU.radiusLg * 2}rpx`,
        boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Card header */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20rpx 24rpx 16rpx',
          borderBottom: `1rpx solid ${TU.borderLight}`,
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12rpx' }}>
          <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{gameName}</Text>
          <Text style={{ fontSize: '20rpx', color: TU.text4 }}>#{order.orderNo.slice(-4)}</Text>
        </View>
        <StatusTag status={order.status} />
      </View>

      {/* Card body */}
      <View style={{ padding: '20rpx 24rpx 16rpx' }}>
        {/* Service name */}
        <Text style={{ fontSize: '30rpx', fontWeight: 600, color: TU.text, display: 'block' }}>
          {order.svc}
        </Text>
        {/* Pal + duration */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16rpx',
            marginTop: '10rpx',
          }}
        >
          <View
            style={{
              width: '40rpx',
              height: '40rpx',
              borderRadius: '20rpx',
              background: TU.brand,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text style={{ color: TU.white, fontSize: '18rpx' }}>{order.pal[0]}</Text>
          </View>
          <Text style={{ fontSize: '24rpx', color: TU.text2 }}>{order.pal}</Text>
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>·</Text>
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>{order.dur}小时</Text>
        </View>
        {/* Amount */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: '4rpx',
            marginTop: '12rpx',
          }}
        >
          <Text style={{ fontSize: '22rpx', color: TU.text3 }}>实付</Text>
          <Text style={{ fontSize: '36rpx', fontWeight: 600, color: TU.error }}>
            ¥{order.total}
          </Text>
        </View>
      </View>

      {/* Card detail */}
      <View style={{ padding: '0 24rpx 16rpx' }}>
        <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{order.detail}</Text>
      </View>

      {/* Card footer — action buttons */}
      <View
        style={{
          borderTop: `1rpx solid ${TU.borderLight}`,
          padding: '16rpx 24rpx',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: '16rpx',
        }}
      >
        {order.status === 'pending_payment' && (
          <>
            <Button
              type="default"
              size="small"
              onClick={() => Taro.showToast({ title: '订单已取消', icon: 'none' })}
            >
              取消订单
            </Button>
            <Button type="primary" size="small" onClick={goDetail}>
              去上传凭证
            </Button>
          </>
        )}

        {order.status === 'paid_pending_dispatch' && (
          <Button type="default" size="small" onClick={goDetail}>
            查看详情
          </Button>
        )}

        {order.status === 'in_service' && (
          <>
            <Button
              type="default"
              size="small"
              onClick={() => Taro.showToast({ title: '正在连接陪玩…', icon: 'none' })}
            >
              联系陪玩
            </Button>
            <Button type="secondary" size="small" onClick={goDetail}>
              查看详情
            </Button>
          </>
        )}

        {order.status === 'completed' && (
          <>
            <Button type="default" size="small" onClick={goTip}>
              打赏
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => Taro.navigateTo({ url: `/pages/player/detail/index?id=P001` })}
            >
              再来一单
            </Button>
          </>
        )}
      </View>
    </View>
  );
}

export default function OrderListPage() {
  const [activeTab, setActiveTab] = useState(0);

  const activeKey = TAB_KEYS[activeTab];

  const filtered =
    activeKey === 'all' ? MOCK_USER_ORDERS : MOCK_USER_ORDERS.filter(o => o.status === activeKey);

  const tabLabels = TAB_LABELS.map((label, i) => {
    const count = getTabBadge(TAB_KEYS[i]);
    return count > 0 ? `${label} ${count}` : label;
  });

  return (
    <View
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: TU.bgPage }}
    >
      <NavBar title="我的订单" />

      {/* Tabs */}
      <View style={{ background: TU.white, borderBottom: `1rpx solid ${TU.borderLight}` }}>
        <Tabs tabs={tabLabels} active={activeTab} onChange={setActiveTab} />
      </View>

      {/* Order list */}
      <ScrollView scrollY style={{ flex: 1, height: 0, paddingTop: '20rpx' }}>
        <View style={{ height: '20rpx' }} />
        {filtered.length === 0 ? (
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '120rpx',
              gap: '20rpx',
            }}
          >
            <Text style={{ fontSize: '80rpx' }}>📋</Text>
            <Text style={{ fontSize: '28rpx', color: TU.text3 }}>暂无相关订单</Text>
          </View>
        ) : (
          filtered.map(order => <OrderCard key={order.orderNo} order={order} />)
        )}
        <View style={{ height: '40rpx' }} />
      </ScrollView>

      <TabBar role="user" active="orders" />
    </View>
  );
}
