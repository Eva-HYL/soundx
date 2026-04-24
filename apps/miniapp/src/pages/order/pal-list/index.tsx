import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { useSafeArea } from '../../../hooks/useSafeArea';
import { TabBar } from '../../../components/ui/TabBar';
import { Tabs } from '../../../components/ui/Tabs';
import { StatusTag } from '../../../components/ui/Tag';
import { Button } from '../../../components/ui/Button';
import { TU } from '../../../constants/tokens';

const GAME_MAP: Record<string, string> = {
  hok: '王者荣耀',
  lol: '英雄联盟',
  ys: '原神',
  apex: 'Apex英雄',
  pg: '和平精英',
  val: '无畏契约',
};

const MOCK_PAL_ORDERS = [
  {
    orderNo: 'SX2404221222',
    user: '咕咕不鸽',
    game: 'hok',
    svc: '排位上分',
    dur: 2,
    total: 80,
    status: 'in_service',
    detail: '开始 14:10 · 剩余约 1h30m',
  },
  {
    orderNo: 'SX2404221185',
    user: '奶茶要七分糖',
    game: 'lol',
    svc: '巅峰赛陪练',
    dur: 3,
    total: 165,
    status: 'pending_report',
    detail: '服务已结束，请填写战绩报告',
  },
  {
    orderNo: 'SX2404221074',
    user: '摸鱼打工人',
    game: 'hok',
    svc: '教学指导',
    dur: 2,
    total: 80,
    status: 'pending_report_audit',
    detail: '战绩已提交，等待管理员审核',
  },
  {
    orderNo: 'SX2404221037',
    user: '晚风不识路',
    game: 'val',
    svc: '排位上分',
    dur: 2,
    total: 100,
    status: 'completed',
    detail: '结算 72 分 · 04-21 21:00',
  },
];

// Tab index → status filter mapping
const TAB_STATUS_FILTER: (string[] | null)[] = [
  ['in_service'], // 进行中 3
  ['pending_report_audit'], // 待审核 1
  ['completed'], // 已完成 42
  null, // 全部 48
];

const LIST_TABS = ['进行中 3', '待审核 1', '已完成 42', '全部 48'];

export default function PalOrderListPage() {
  const { statusBarHeight } = useSafeArea();
  const [activeTab, setActiveTab] = useState(0);

  const filter = TAB_STATUS_FILTER[activeTab];
  const visibleOrders = filter
    ? MOCK_PAL_ORDERS.filter(o => filter.includes(o.status))
    : MOCK_PAL_ORDERS;

  function handleContactUser(_orderNo: string) {
    Taro.showToast({ title: '即将打开聊天', icon: 'none' });
  }

  function handleEndService(_orderNo: string) {
    Taro.showToast({ title: '服务已结束', icon: 'success' });
  }

  function handleGoReport(orderNo: string) {
    Taro.navigateTo({ url: `/pages/report/submit/index?orderNo=${orderNo}` });
  }

  function handleViewReport(_orderNo: string) {
    Taro.showToast({ title: '查看战绩', icon: 'none' });
  }

  function handleViewDetail(orderNo: string) {
    Taro.navigateTo({ url: `/pages/order/detail/index?orderNo=${orderNo}` });
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
        {/* Status-bar spacer */}
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
            onClick={() => Taro.showToast({ title: '筛选功能开发中', icon: 'none' })}
          >
            <Text style={{ fontSize: '24rpx', color: TU.text2 }}>⊟</Text>
            <Text style={{ fontSize: '24rpx', color: TU.text2 }}>筛选</Text>
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
          {visibleOrders.length === 0 && (
            <View
              style={{
                padding: '80rpx 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: '28rpx', color: TU.text3 }}>暂无订单</Text>
            </View>
          )}
          {visibleOrders.map(order => {
            return (
              <View
                key={order.orderNo}
                style={{
                  background: TU.white,
                  borderRadius: `${TU.radiusLg * 2}rpx`,
                  overflow: 'hidden',
                  boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
                }}
              >
                {/* 卡片头：游戏名 + 状态标签 */}
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

                {/* 卡片主体 */}
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
                      ¥{order.total}
                    </Text>
                  </View>

                  {/* 状态详情框 */}
                  {order.status === 'in_service' && (
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
                  {(order.status === 'pending_report_audit' || order.status === 'completed') && (
                    <View style={{ marginTop: '16rpx' }}>
                      <Text style={{ fontSize: '24rpx', color: TU.text3 }}>{order.detail}</Text>
                    </View>
                  )}
                </View>

                {/* 卡片底部按钮 */}
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
                  {order.status === 'in_service' && (
                    <>
                      <Button size="small" onClick={() => handleContactUser(order.orderNo)}>
                        联系老板
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleEndService(order.orderNo)}
                      >
                        结束服务
                      </Button>
                    </>
                  )}
                  {order.status === 'pending_report' && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleGoReport(order.orderNo)}
                    >
                      去填战绩
                    </Button>
                  )}
                  {order.status === 'pending_report_audit' && (
                    <Button size="small" onClick={() => handleViewReport(order.orderNo)}>
                      查看战绩
                    </Button>
                  )}
                  {order.status === 'completed' && (
                    <Button size="small" onClick={() => handleViewDetail(order.orderNo)}>
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
