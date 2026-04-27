import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCallback, useEffect, useState } from 'react';
import { useSafeArea } from '../../../hooks/useSafeArea';
import { TabBar } from '../../../components/ui/TabBar';
import { Tabs } from '../../../components/ui/Tabs';
import { Tag } from '../../../components/ui/Tag';
import { Button } from '../../../components/ui/Button';
import { TU } from '../../../constants/tokens';
import { ApiError, grabOrder, listOrderPool, type OrderDto } from '../../../services';

const GAME_MAP: Record<string, string> = {
  hok: '王者荣耀',
  lol: '英雄联盟',
  ys: '原神',
  apex: 'Apex英雄',
  pg: '和平精英',
  val: '无畏契约',
};

interface PoolItemVM {
  id: string; // order id（调 grab 用）
  orderNo: string;
  user: string;
  game: string;
  svc: string;
  dur: number;
  price: number;
  total: number;
  note: string;
  ago: string;
}

function timeAgo(iso: string | null): string {
  if (!iso) return '刚刚';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return '刚刚';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时`;
  return `${Math.floor(diff / 86_400_000)} 天`;
}

function toPoolVM(o: OrderDto): PoolItemVM {
  const hours = o.hours ? parseFloat(o.hours) : 0;
  const price = o.pricePerHour ? parseFloat(o.pricePerHour) : 0;
  const total = o.totalAmount ? parseFloat(o.totalAmount) : 0;
  return {
    id: o.id,
    orderNo: o.orderNo,
    user: o.user?.nickname ?? '老板',
    game: o.serviceType, // schema 未独立存游戏；暂用 serviceType 当游戏 tag
    svc: o.serviceType,
    dur: hours,
    price,
    total,
    note: o.userRemark ?? '—',
    ago: timeAgo(o.createdAt),
  };
}

const POOL_TABS = ['全部', '王者', '英雄联盟', '原神', 'Apex'];

type WorkStatus = 'online' | 'busy' | 'resting' | 'offline';

const WORK_STATUS_OPTIONS: { value: WorkStatus; label: string; color: string }[] = [
  { value: 'online', label: '在线中', color: TU.success },
  { value: 'busy', label: '忙碌中', color: TU.warning },
  { value: 'resting', label: '休息中', color: TU.text3 },
  { value: 'offline', label: '已下线', color: TU.text4 },
];

export default function OrderPoolPage() {
  const { statusBarHeight } = useSafeArea();
  const [activeTab, setActiveTab] = useState(0);
  const [grabbingId, setGrabbingId] = useState<string | null>(null);
  const [workStatus, setWorkStatus] = useState<WorkStatus>('online');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const [orders, setOrders] = useState<PoolItemVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const currentStatus = WORK_STATUS_OPTIONS.find(o => o.value === workStatus)!;

  const reload = useCallback(() => setRefreshTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    listOrderPool({ page: 1, pageSize: 20 })
      .then(res => {
        if (cancelled) return;
        setOrders(res.list.map(toPoolVM));
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
  }, [refreshTick]);

  async function handleGrab(orderId: string) {
    setGrabbingId(orderId);
    try {
      await grabOrder(orderId);
      Taro.showToast({ title: '抢单成功！', icon: 'success' });
      // 从列表移除被抢走的这单
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : '抢单失败';
      Taro.showToast({ title: msg, icon: 'none' });
      // 失败时拉一次列表确保数据新鲜
      reload();
    } finally {
      setGrabbingId(null);
    }
  }

  function handleStatusSelect(val: WorkStatus) {
    setWorkStatus(val);
    setShowStatusMenu(false);
  }

  return (
    <View
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: TU.bgPage }}
    >
      {/* 顶部渐变 Banner */}
      <View
        style={{
          background: 'linear-gradient(180deg, #6190E8 0%, #346FC2 100%)',
          padding: '0 28rpx 0',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {/* Status-bar spacer */}
        <View style={{ height: `${statusBarHeight}px` }} />
        {/* 状态菜单浮层 */}
        {showStatusMenu && (
          <View
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99,
            }}
            onClick={() => setShowStatusMenu(false)}
          />
        )}

        {/* 标题行 */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24rpx',
          }}
        >
          <Text style={{ fontSize: '40rpx', fontWeight: 600, color: TU.white }}>订单池</Text>
          <View style={{ position: 'relative' }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8rpx',
                background: 'rgba(255,255,255,0.18)',
                borderRadius: '28rpx',
                padding: '8rpx 20rpx',
              }}
              onClick={() => setShowStatusMenu((v: boolean) => !v)}
            >
              <View
                style={{
                  width: '16rpx',
                  height: '16rpx',
                  borderRadius: '8rpx',
                  background: currentStatus.color,
                }}
              />
              <Text style={{ fontSize: '24rpx', color: TU.white }}>{currentStatus.label}</Text>
              <Text style={{ fontSize: '20rpx', color: 'rgba(255,255,255,0.8)' }}>▾</Text>
            </View>
            {/* 下拉菜单 */}
            {showStatusMenu && (
              <View
                style={{
                  position: 'absolute',
                  top: '60rpx',
                  right: 0,
                  zIndex: 100,
                  background: TU.white,
                  borderRadius: `${TU.radiusLg}rpx`,
                  boxShadow: '0 4rpx 24rpx rgba(0,0,0,0.12)',
                  minWidth: '180rpx',
                  overflow: 'hidden',
                }}
              >
                {WORK_STATUS_OPTIONS.map((opt, i) => (
                  <View
                    key={opt.value}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '12rpx',
                      padding: '24rpx 28rpx',
                      borderBottom:
                        i < WORK_STATUS_OPTIONS.length - 1
                          ? `1rpx solid ${TU.borderLight}`
                          : 'none',
                      background: workStatus === opt.value ? TU.brandTint : TU.white,
                    }}
                    onClick={(e: { stopPropagation: () => void }) => {
                      e.stopPropagation();
                      handleStatusSelect(opt.value);
                    }}
                  >
                    <View
                      style={{
                        width: '16rpx',
                        height: '16rpx',
                        borderRadius: '8rpx',
                        background: opt.color,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: '26rpx',
                        color: workStatus === opt.value ? TU.brand : TU.text,
                      }}
                    >
                      {opt.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* 统计行 */}
        <View
          style={{
            background: 'rgba(255,255,255,0.14)',
            borderRadius: `${TU.radiusLg}rpx`,
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '0',
            overflow: 'hidden',
          }}
        >
          {[
            { label: '今日接单', value: '6', unit: '单' },
            { label: '今日收入', value: '420', unit: '元' },
            { label: '可提现', value: '1,240', unit: '元' },
          ].map((item, i) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20rpx 0',
                borderLeft: i > 0 ? '1rpx solid rgba(255,255,255,0.22)' : 'none',
              }}
            >
              <Text style={{ fontSize: '36rpx', fontWeight: 600, color: TU.white }}>
                {item.value}
              </Text>
              <Text
                style={{ fontSize: '20rpx', color: 'rgba(255,255,255,0.75)', marginTop: '4rpx' }}
              >
                {item.label}（{item.unit}）
              </Text>
            </View>
          ))}
        </View>

        {/* Tabs 紧贴 banner 底部 */}
        <View style={{ marginTop: '20rpx' }}>
          <Tabs tabs={POOL_TABS} active={activeTab} onChange={setActiveTab} />
        </View>
      </View>

      {/* 工具栏 */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: TU.white,
          padding: '14rpx 28rpx',
          borderBottom: `1rpx solid ${TU.borderLight}`,
        }}
      >
        <Text style={{ fontSize: '22rpx', color: TU.text3 }}>最近刷新 · 刚刚</Text>
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
          onClick={() => {
            reload();
            Taro.showToast({ title: '已刷新', icon: 'success', duration: 800 });
          }}
        >
          <Text style={{ fontSize: '22rpx', color: TU.text2 }}>↻</Text>
          <Text style={{ fontSize: '22rpx', color: TU.text2 }}>刷新</Text>
        </View>
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
            <View style={{ padding: '80rpx 40rpx', textAlign: 'center' }}>
              <Text style={{ fontSize: '28rpx', color: TU.text3, display: 'block' }}>
                {loadError ? '加载失败' : '暂无可抢订单'}
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
          {orders.map((order, i) => {
            const isGrabbing = grabbingId === order.id;
            const isFirst = i === 0;
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
                {/* 卡片头 */}
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
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '12rpx',
                    }}
                  >
                    <Text style={{ fontSize: '26rpx', fontWeight: 500, color: TU.text2 }}>
                      {GAME_MAP[order.game] ?? order.game}
                    </Text>
                    {isFirst && (
                      <Tag type="error" size="small">
                        新单
                      </Tag>
                    )}
                  </View>
                  <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{order.ago}前</Text>
                </View>

                {/* 卡片主体 */}
                <View style={{ padding: '20rpx 24rpx 0' }}>
                  <Text
                    style={{ fontSize: '30rpx', fontWeight: 600, color: TU.text, display: 'block' }}
                  >
                    {order.svc}
                  </Text>
                  <Text
                    style={{
                      fontSize: '22rpx',
                      color: TU.text3,
                      marginTop: '8rpx',
                      display: 'block',
                    }}
                  >
                    {order.dur} 小时 · ¥{order.price}/小时
                  </Text>

                  {/* 备注框 */}
                  <View
                    style={{
                      background: TU.bgPage,
                      borderRadius: `${TU.radius}rpx`,
                      padding: '14rpx 20rpx',
                      marginTop: '16rpx',
                    }}
                  >
                    <Text style={{ fontSize: '24rpx', color: TU.text2 }}>备注：{order.note}</Text>
                  </View>
                </View>

                {/* 卡片底部 */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16rpx 24rpx 20rpx',
                    marginTop: '12rpx',
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'column', gap: '4rpx' }}>
                    <Text style={{ fontSize: '22rpx', color: TU.text3 }}>老板 {order.user}</Text>
                    <Text style={{ fontSize: '32rpx', fontWeight: 600, color: TU.error }}>
                      ¥{order.total}
                      <Text style={{ fontSize: '20rpx', color: TU.text3, fontWeight: 400 }}>
                        {' '}
                        总计
                      </Text>
                    </Text>
                  </View>
                  <Button
                    type={isGrabbing ? 'default' : 'primary'}
                    circle
                    onClick={() => !isGrabbing && handleGrab(order.id)}
                  >
                    {isGrabbing ? '抢单中…' : '抢单'}
                  </Button>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <TabBar role="pal" active="pool" />
    </View>
  );
}
