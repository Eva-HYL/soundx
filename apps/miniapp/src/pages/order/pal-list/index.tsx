import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCallback, useEffect, useState } from 'react';
import { useSafeArea } from '../../../hooks/useSafeArea';
import { TabBar } from '../../../components/ui/TabBar';
import { Tabs } from '../../../components/ui/Tabs';
import { StatusTag } from '../../../components/ui/Tag';
import { Button } from '../../../components/ui/Button';
import { TU } from '../../../constants/tokens';
import {
  ApiError,
  finishService,
  listMyPalOrders,
  startService,
  type OrderDto,
} from '../../../services';

interface PalOrderVM {
  id: string;
  orderNo: string;
  user: string;
  game: string;
  svc: string;
  dur: number;
  total: number;
  status: string;
  detail: string;
}

function vmDetail(o: OrderDto): string {
  switch (o.status) {
    case 'accepted':
      return '已接单，等待开始服务';
    case 'in_service': {
      const start = o.startedAt ? new Date(o.startedAt).getTime() : 0;
      if (!start) return '服务中';
      const elapsed = Math.max(0, Date.now() - start);
      const mins = Math.floor(elapsed / 60_000);
      return `开始于 ${new Date(start).toLocaleTimeString().slice(0, 5)} · 已进行 ${mins} 分钟`;
    }
    case 'pending_report':
      return '服务已结束，请填写战绩报告';
    case 'pending_report_audit':
      return '战绩已提交，等待管理员审核';
    case 'completed':
      return o.finishedAt ? `完成于 ${new Date(o.finishedAt).toLocaleString()}` : '订单已完成';
    case 'cancelled':
      return o.cancelReason ?? '订单已取消';
    default:
      return '';
  }
}

function toVM(o: OrderDto): PalOrderVM {
  return {
    id: o.id,
    orderNo: o.orderNo,
    user: o.user?.nickname ?? '老板',
    game: o.serviceType, // 暂用 serviceType 当游戏标签
    svc: o.serviceType,
    dur: o.hours ? parseFloat(o.hours) : 0,
    total: o.totalAmount ? parseFloat(o.totalAmount) : 0,
    status: o.status ?? '',
    detail: vmDetail(o),
  };
}

// Tab index → status filter mapping（小写，逗号分隔后端）
const TAB_STATUS: (string | null)[] = [
  'accepted,in_service', // 进行中
  'pending_report,pending_report_audit', // 待审核
  'completed', // 已完成
  null, // 全部
];

const LIST_TABS = ['进行中', '待审核', '已完成', '全部'];

const GAME_MAP: Record<string, string> = {
  hok: '王者荣耀',
  lol: '英雄联盟',
  ys: '原神',
  apex: 'Apex英雄',
  pg: '和平精英',
  val: '无畏契约',
};

export default function PalOrderListPage() {
  const { statusBarHeight } = useSafeArea();
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState<PalOrderVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    listMyPalOrders({
      page: 1,
      pageSize: 30,
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

  function handleContactUser(_orderId: string) {
    Taro.showToast({ title: '即将打开聊天', icon: 'none' });
  }

  async function handleStartService(orderId: string) {
    setSubmittingId(orderId);
    try {
      await startService(orderId);
      Taro.showToast({ title: '已开始服务', icon: 'success' });
      reload();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : '操作失败';
      Taro.showToast({ title: msg, icon: 'none' });
    } finally {
      setSubmittingId(null);
    }
  }

  async function handleEndService(orderId: string) {
    setSubmittingId(orderId);
    try {
      await finishService(orderId);
      Taro.showToast({ title: '服务已结束', icon: 'success' });
      reload();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : '操作失败';
      Taro.showToast({ title: msg, icon: 'none' });
    } finally {
      setSubmittingId(null);
    }
  }

  function handleGoReport(orderId: string) {
    Taro.navigateTo({ url: `/pages/report/submit/index?orderId=${orderId}` });
  }

  function handleViewDetail(orderId: string) {
    Taro.navigateTo({ url: `/pages/order/detail/index?orderId=${orderId}` });
  }

  return (
    <View
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: TU.bgPage }}
    >
      {/* 自定义头部 */}
      <View
        style={{
          background: TU.white,
          padding: '0 28rpx 0',
          borderBottom: `1rpx solid ${TU.borderLight}`,
          flexShrink: 0,
        }}
      >
        <View style={{ height: `${statusBarHeight}px` }} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20rpx',
          }}
        >
          <Text style={{ fontSize: '36rpx', fontWeight: 600, color: TU.text }}>我的订单</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '6rpx',
              padding: '8rpx 20rpx',
              border: `1rpx solid ${TU.border}`,
              borderRadius: '28rpx',
            }}
            onClick={reload}
          >
            <Text style={{ fontSize: '24rpx', color: TU.text2 }}>↻</Text>
            <Text style={{ fontSize: '24rpx', color: TU.text2 }}>刷新</Text>
          </View>
        </View>
        <Tabs tabs={LIST_TABS} active={activeTab} onChange={setActiveTab} />
      </View>

      {/* 订单列表 */}
      <ScrollView scrollY style={{ flex: 1, height: 0 }}>
        <View
          style={{
            padding: '16rpx 24rpx 40rpx',
            display: 'flex',
            flexDirection: 'column',
            gap: '16rpx',
          }}
        >
          {loading && (
            <View style={{ padding: '40rpx 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '24rpx', color: TU.text3 }}>加载中…</Text>
            </View>
          )}
          {!loading && orders.length === 0 && (
            <View style={{ padding: '80rpx 0', textAlign: 'center' }}>
              <Text style={{ fontSize: '28rpx', color: TU.text3, display: 'block' }}>
                {loadError ? '加载失败' : '暂无订单'}
              </Text>
              {loadError && (
                <Text
                  style={{
                    fontSize: '22rpx',
                    color: TU.text4,
                    display: 'block',
                    marginTop: '12rpx',
                  }}
                >
                  {loadError}
                </Text>
              )}
            </View>
          )}
          {orders.map(order => {
            const busy = submittingId === order.id;
            return (
              <View
                key={order.id}
                style={{
                  background: TU.white,
                  borderRadius: `${TU.radiusLg * 2}rpx`,
                  overflow: 'hidden',
                  boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
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
                  <Text style={{ fontSize: '26rpx', fontWeight: 500, color: TU.text2 }}>
                    {GAME_MAP[order.game] ?? order.game}
                  </Text>
                  <StatusTag status={order.status} />
                </View>

                <View style={{ padding: '20rpx 24rpx 0' }}>
                  <Text
                    style={{ fontSize: '30rpx', fontWeight: 600, color: TU.text, display: 'block' }}
                  >
                    {order.svc}
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '10rpx',
                    }}
                  >
                    <Text style={{ fontSize: '22rpx', color: TU.text3 }}>
                      老板 {order.user} · {order.dur} 小时
                    </Text>
                    <Text style={{ fontSize: '32rpx', fontWeight: 600, color: TU.error }}>
                      ¥{order.total.toFixed(0)}
                    </Text>
                  </View>

                  {order.status === 'in_service' && order.detail && (
                    <View
                      style={{
                        background: TU.brandTint,
                        borderRadius: `${TU.radius}rpx`,
                        padding: '14rpx 20rpx',
                        marginTop: '16rpx',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '10rpx',
                      }}
                    >
                      <Text style={{ fontSize: '22rpx', color: TU.brand }}>⏱</Text>
                      <Text style={{ fontSize: '24rpx', color: TU.brand }}>{order.detail}</Text>
                    </View>
                  )}
                  {order.status === 'pending_report' && (
                    <View
                      style={{
                        background: TU.warningTint,
                        borderRadius: `${TU.radius}rpx`,
                        padding: '14rpx 20rpx',
                        marginTop: '16rpx',
                      }}
                    >
                      <Text style={{ fontSize: '24rpx', color: TU.warning }}>{order.detail}</Text>
                    </View>
                  )}
                  {(order.status === 'pending_report_audit' ||
                    order.status === 'completed' ||
                    order.status === 'accepted') && (
                    <View style={{ marginTop: '16rpx' }}>
                      <Text style={{ fontSize: '24rpx', color: TU.text3 }}>{order.detail}</Text>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '16rpx',
                    padding: '16rpx 24rpx 20rpx',
                    marginTop: '12rpx',
                  }}
                >
                  {order.status === 'accepted' && (
                    <>
                      <Button size="small" onClick={() => handleContactUser(order.id)}>
                        联系老板
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        disabled={busy}
                        onClick={() => handleStartService(order.id)}
                      >
                        {busy ? '处理中…' : '开始服务'}
                      </Button>
                    </>
                  )}
                  {order.status === 'in_service' && (
                    <>
                      <Button size="small" onClick={() => handleContactUser(order.id)}>
                        联系老板
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        disabled={busy}
                        onClick={() => handleEndService(order.id)}
                      >
                        {busy ? '处理中…' : '结束服务'}
                      </Button>
                    </>
                  )}
                  {order.status === 'pending_report' && (
                    <Button type="primary" size="small" onClick={() => handleGoReport(order.id)}>
                      去填战绩
                    </Button>
                  )}
                  {(order.status === 'pending_report_audit' ||
                    order.status === 'completed') && (
                    <Button size="small" onClick={() => handleViewDetail(order.id)}>
                      查看详情
                    </Button>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TabBar role="pal" active="orders" />
    </View>
  );
}
