import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCallback, useEffect, useState } from 'react';
import { NavBar } from '../../../components/ui/NavBar';
import { TabBar } from '../../../components/ui/TabBar';
import { Tabs } from '../../../components/ui/Tabs';
import { StatusTag } from '../../../components/ui/Tag';
import { Button } from '../../../components/ui/Button';
import { TU } from '../../../constants/tokens';
import {
  ApiError,
  cancelOrder,
  listMyOrders,
  type OrderDto,
} from '../../../services';

interface OrderVM {
  id: string;
  orderNo: string;
  serviceType: string;
  palName: string;
  hours: number;
  total: number;
  status: string;
  detail: string;
  createdAt: string | null;
}

function vmDetail(o: OrderDto): string {
  switch (o.status) {
    case 'pending_payment':
      return '请尽快转账并上传凭证';
    case 'paid_pending_dispatch':
      return '已确认付款，等待派单';
    case 'pending_accept':
      return '已指派陪玩，等待接单';
    case 'accepted':
      return '陪玩已接单，待开始服务';
    case 'in_service':
      return o.startedAt
        ? `服务开始于 ${new Date(o.startedAt).toLocaleTimeString().slice(0, 5)}`
        : '服务进行中';
    case 'pending_report':
      return '服务已结束，陪玩正在填战绩';
    case 'pending_report_audit':
      return '战绩已提交，等待管理员审核';
    case 'completed':
      return o.finishedAt ? `完成于 ${new Date(o.finishedAt).toLocaleDateString()}` : '订单已完成';
    case 'cancelled':
      return o.cancelReason ? `已取消：${o.cancelReason}` : '订单已取消';
    case 'closed':
      return '订单已关闭';
    default:
      return '';
  }
}

function toVM(o: OrderDto): OrderVM {
  return {
    id: o.id,
    orderNo: o.orderNo,
    serviceType: o.serviceType,
    palName: o.playerName ?? o.player?.nickname ?? '待派发',
    hours: o.hours ? parseFloat(o.hours) : 0,
    total: o.totalAmount ? parseFloat(o.totalAmount) : 0,
    status: o.status ?? '',
    detail: vmDetail(o),
    createdAt: o.createdAt,
  };
}

// tab → 后端 status 过滤字符串
const TAB_STATUS: (string | null)[] = [
  null, // 全部
  'pending_payment', // 待付款
  'paid_pending_dispatch,pending_accept,accepted,in_service,pending_report,pending_report_audit', // 进行中
  'completed', // 已完成
];

const TAB_LABELS = ['全部', '待付款', '进行中', '已完成'];

interface OrderCardProps {
  order: OrderVM;
  onCancel: (id: string) => void;
  cancelling: boolean;
  key?: string | number;
}

function OrderCard({ order, onCancel, cancelling }: OrderCardProps) {
  function goDetail() {
    Taro.navigateTo({ url: `/pages/order/detail/index?orderId=${order.id}` });
  }

  function goTip() {
    Taro.navigateTo({ url: `/pages/order/tip/index?orderId=${order.id}` });
  }

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
          <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{order.serviceType}</Text>
          <Text style={{ fontSize: '20rpx', color: TU.text4 }}>#{order.orderNo.slice(-4)}</Text>
        </View>
        <StatusTag status={order.status} />
      </View>

      <View style={{ padding: '20rpx 24rpx 16rpx' }}>
        <Text style={{ fontSize: '30rpx', fontWeight: 600, color: TU.text, display: 'block' }}>
          {order.serviceType}
        </Text>
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
            <Text style={{ color: TU.white, fontSize: '18rpx' }}>{order.palName[0] ?? 'P'}</Text>
          </View>
          <Text style={{ fontSize: '24rpx', color: TU.text2 }}>{order.palName}</Text>
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>·</Text>
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>{order.hours}小时</Text>
        </View>
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
            ¥{order.total.toFixed(2)}
          </Text>
        </View>
      </View>

      {order.detail && (
        <View style={{ padding: '0 24rpx 16rpx' }}>
          <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{order.detail}</Text>
        </View>
      )}

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
              disabled={cancelling}
              onClick={() => onCancel(order.id)}
            >
              {cancelling ? '取消中…' : '取消订单'}
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

        {(order.status === 'accepted' || order.status === 'in_service') && (
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

        {(order.status === 'pending_report' || order.status === 'pending_report_audit') && (
          <Button type="default" size="small" onClick={goDetail}>
            查看详情
          </Button>
        )}

        {order.status === 'completed' && (
          <>
            <Button type="default" size="small" onClick={goTip}>
              打赏
            </Button>
            <Button type="primary" size="small" onClick={goDetail}>
              查看详情
            </Button>
          </>
        )}

        {(order.status === 'cancelled' || order.status === 'closed') && (
          <Button type="default" size="small" onClick={goDetail}>
            查看详情
          </Button>
        )}
      </View>
    </View>
  );
}

export default function OrderListPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState<OrderVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    listMyOrders({
      page: 1,
      pageSize: 50,
      status: TAB_STATUS[activeTab] ?? undefined,
    })
      .then(res => {
        if (cancelled) return;
        setOrders(res.list.map(toVM));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setLoadError(err.message);
        setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, tick]);

  async function handleCancel(orderId: string) {
    setCancellingId(orderId);
    try {
      await cancelOrder(orderId, '用户主动取消');
      Taro.showToast({ title: '订单已取消', icon: 'success' });
      reload();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : '取消失败';
      Taro.showToast({ title: msg, icon: 'none' });
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <View
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: TU.bgPage }}
    >
      <NavBar title="我的订单" right={<Text style={{ fontSize: '24rpx', color: TU.brand }} onClick={reload}>刷新</Text>} />

      <View style={{ background: TU.white, borderBottom: `1rpx solid ${TU.borderLight}` }}>
        <Tabs tabs={TAB_LABELS} active={activeTab} onChange={setActiveTab} />
      </View>

      <ScrollView scrollY style={{ flex: 1, height: 0, paddingTop: '20rpx' }}>
        <View style={{ height: '20rpx' }} />
        {loading && (
          <View style={{ padding: '40rpx 0', textAlign: 'center' }}>
            <Text style={{ fontSize: '24rpx', color: TU.text3 }}>加载中…</Text>
          </View>
        )}
        {!loading && orders.length === 0 ? (
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
            <Text style={{ fontSize: '28rpx', color: TU.text3 }}>
              {loadError ? '加载失败' : '暂无相关订单'}
            </Text>
            {loadError && (
              <Text style={{ fontSize: '22rpx', color: TU.text4 }}>{loadError}</Text>
            )}
          </View>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={handleCancel}
              cancelling={cancellingId === order.id}
            />
          ))
        )}
        <View style={{ height: '40rpx' }} />
      </ScrollView>

      <TabBar role="user" active="orders" />
    </View>
  );
}
