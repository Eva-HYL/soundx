import { View, Text, ScrollView } from '@tarojs/components';
import { TU } from '../../../constants/tokens';
import { NavBar } from '../../../components/ui/NavBar';
import { TabBar } from '../../../components/ui/TabBar';

type TxKind = 'order' | 'tip' | 'withdraw';

interface TxItem {
  date: string;
  t: string;
  kind: TxKind;
  order?: string;
  wid?: string;
  user?: string;
  total?: number;
  rate?: number;
  amount: number;
  svc: string;
}

const items: TxItem[] = [
  {
    date: '今天',
    t: '14:44',
    kind: 'order',
    order: 'SX240422099',
    user: '奶茶要七*',
    total: 165,
    rate: 72,
    amount: 118.8,
    svc: '巅峰赛陪练 3h',
  },
  {
    date: '今天',
    t: '09:10',
    kind: 'tip',
    order: 'SX240421088',
    user: '咕咕不*',
    amount: 66,
    svc: '打赏',
  },
  {
    date: '昨天',
    t: '22:40',
    kind: 'order',
    order: 'SX240421088',
    user: '咕咕不*',
    total: 80,
    rate: 75,
    amount: 60.0,
    svc: '排位上分 2h',
  },
  {
    date: '昨天',
    t: '19:12',
    kind: 'order',
    order: 'SX240421085',
    user: '菜就多*',
    total: 100,
    rate: 75,
    amount: 75.0,
    svc: '教学陪练 2h',
  },
  {
    date: '昨天',
    t: '10:20',
    kind: 'withdraw',
    wid: 'W2404221',
    amount: -480,
    svc: '申请提现 · 微信到账',
  },
  {
    date: '04-20',
    t: '21:35',
    kind: 'order',
    order: 'SX240420077',
    user: '晚风不*',
    total: 60,
    rate: 75,
    amount: 45.0,
    svc: '娱乐开黑 2h',
  },
  {
    date: '04-20',
    t: '16:08',
    kind: 'tip',
    order: 'SX240420075',
    user: '摸鱼打*',
    amount: 20,
    svc: '打赏',
  },
];

const KIND_CFG: Record<TxKind, { label: string; color: string; bg: string }> = {
  order: { label: '订单', color: TU.brand, bg: TU.brandTint },
  tip: { label: '打赏', color: TU.success, bg: TU.successTint },
  withdraw: { label: '提现', color: TU.text2, bg: TU.bg },
};

export default function IncomePage() {
  // Group items by date, keeping order
  const groupOrder: string[] = [];
  const groups: Record<string, TxItem[]> = {};
  items.forEach(it => {
    if (!groups[it.date]) {
      groups[it.date] = [];
      groupOrder.push(it.date);
    }
    groups[it.date].push(it);
  });

  const dailySubtotal = (arr: TxItem[]) => arr.reduce((s, r) => s + r.amount, 0);

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: TU.bgPage }}
    >
      <NavBar
        title="我的收入"
        right={<Text style={{ fontSize: '28rpx', color: TU.brand }}>筛选</Text>}
      />

      <ScrollView scrollY style={{ flex: 1, height: 0 }}>
        {/* Month hero */}
        <View
          style={{
            position: 'relative',
            overflow: 'hidden',
            margin: '12rpx',
            borderRadius: `${TU.radiusLg * 2}rpx`,
            background: `linear-gradient(135deg, ${TU.brand} 0%, ${TU.brandDark} 100%)`,
            padding: '36rpx 40rpx 40rpx',
            color: '#fff',
          }}
        >
          {/* Decorative circle */}
          <View
            style={{
              position: 'absolute',
              top: '-80rpx',
              right: '-80rpx',
              width: '260rpx',
              height: '260rpx',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
            }}
          />
          <View
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8rpx' }}
          >
            <Text style={{ fontSize: '26rpx', color: 'rgba(255,255,255,0.85)' }}>
              本月到账收入 · 04 月
            </Text>
            <Text style={{ fontSize: '24rpx', color: 'rgba(255,255,255,0.85)' }}>▾</Text>
          </View>
          <Text
            style={{
              fontSize: '72rpx',
              color: '#fff',
              fontWeight: 700,
              marginTop: '12rpx',
              display: 'block',
            }}
          >
            ¥ 3,480.00
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: '40rpx', marginTop: '24rpx' }}>
            <View>
              <Text style={{ fontSize: '22rpx', color: 'rgba(255,255,255,0.7)' }}>订单</Text>
              <Text
                style={{
                  fontSize: '28rpx',
                  color: '#fff',
                  fontWeight: 500,
                  display: 'block',
                  marginTop: '4rpx',
                }}
              >
                52 单
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: '22rpx', color: 'rgba(255,255,255,0.7)' }}>打赏</Text>
              <Text
                style={{
                  fontSize: '28rpx',
                  color: '#fff',
                  fontWeight: 500,
                  display: 'block',
                  marginTop: '4rpx',
                }}
              >
                ¥240
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: '22rpx', color: 'rgba(255,255,255,0.7)' }}>已提现</Text>
              <Text
                style={{
                  fontSize: '28rpx',
                  color: '#fff',
                  fontWeight: 500,
                  display: 'block',
                  marginTop: '4rpx',
                }}
              >
                ¥2,800
              </Text>
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <View
          style={{
            margin: '0 12rpx',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            padding: '28rpx 0',
            display: 'flex',
            flexDirection: 'row',
            boxShadow: '0 2rpx 8rpx rgba(0,0,0,0.04)',
          }}
        >
          {/* Col 1 */}
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8rpx',
              borderRight: `1rpx solid ${TU.borderLight}`,
            }}
          >
            <Text style={{ fontSize: '22rpx', color: TU.text3 }}>可提现余额</Text>
            <Text style={{ fontSize: '36rpx', color: TU.error, fontWeight: 700 }}>¥ 680.00</Text>
            <View
              style={{
                marginTop: '4rpx',
                background: TU.brand,
                borderRadius: '999rpx',
                padding: '6rpx 20rpx',
              }}
            >
              <Text style={{ fontSize: '22rpx', color: '#fff' }}>提现</Text>
            </View>
          </View>
          {/* Col 2 */}
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8rpx',
              borderRight: `1rpx solid ${TU.borderLight}`,
            }}
          >
            <Text style={{ fontSize: '22rpx', color: TU.text3 }}>分成规则</Text>
            <Text style={{ fontSize: '36rpx', color: TU.text, fontWeight: 700 }}>75%</Text>
            <Text style={{ fontSize: '20rpx', color: TU.warning }}>★ 单独配置</Text>
          </View>
          {/* Col 3 */}
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8rpx',
            }}
          >
            <Text style={{ fontSize: '22rpx', color: TU.text3 }}>账单导出</Text>
            <Text style={{ fontSize: '36rpx', color: TU.text, fontWeight: 700 }}>.xlsx</Text>
            <Text style={{ fontSize: '20rpx', color: TU.text4 }}>&nbsp;</Text>
          </View>
        </View>

        {/* Transactions list */}
        <View
          style={{
            margin: '20rpx 12rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            overflow: 'hidden',
          }}
        >
          {groupOrder.map((date, gi) => {
            const arr = groups[date];
            const subtotal = dailySubtotal(arr);
            return (
              <View key={date}>
                {/* Date header */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20rpx 28rpx',
                    background: TU.bg,
                    borderTop: gi === 0 ? 'none' : `1rpx solid ${TU.borderLight}`,
                  }}
                >
                  <Text style={{ fontSize: '24rpx', color: TU.text2, fontWeight: 500 }}>
                    {date}
                  </Text>
                  <Text style={{ fontSize: '22rpx', color: TU.text3 }}>
                    {subtotal >= 0 ? `+ ¥${subtotal.toFixed(2)}` : `¥${subtotal.toFixed(2)}`}
                  </Text>
                </View>
                {/* Items */}
                {arr.map((it, i) => {
                  const cfg = KIND_CFG[it.kind];
                  const positive = it.amount >= 0;
                  return (
                    <View
                      key={`${date}-${i}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '24rpx 28rpx',
                        borderTop: i === 0 ? 'none' : `1rpx solid ${TU.borderLight}`,
                        alignItems: 'flex-start',
                      }}
                    >
                      {/* Left kind badge */}
                      <View
                        style={{
                          width: '72rpx',
                          height: '72rpx',
                          borderRadius: `${TU.radius * 2}rpx`,
                          background: cfg.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '20rpx',
                          flexShrink: 0,
                        }}
                      >
                        <Text style={{ fontSize: '24rpx', color: cfg.color, fontWeight: 500 }}>
                          {cfg.label}
                        </Text>
                      </View>

                      {/* Middle */}
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text style={{ fontSize: '28rpx', color: TU.text, fontWeight: 500 }}>
                            {it.user ?? '系统'}
                          </Text>
                          <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{it.t}</Text>
                        </View>
                        <Text
                          style={{
                            fontSize: '22rpx',
                            color: TU.text3,
                            marginTop: '4rpx',
                            display: 'block',
                          }}
                        >
                          {it.order ?? it.wid ?? ''} · {it.svc}
                        </Text>
                        {it.kind === 'order' && it.total !== undefined && it.rate !== undefined && (
                          <View
                            style={{
                              marginTop: '10rpx',
                              background: '#f7fbff',
                              borderRadius: '6rpx',
                              padding: '10rpx 16rpx',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: '22rpx',
                                color: TU.text2,
                                fontVariantNumeric: 'tabular-nums' as string,
                              }}
                            >
                              订单 ¥{it.total.toFixed(2)} ×{' '}
                              <Text style={{ color: TU.brand, fontWeight: 500 }}>{it.rate}%</Text> ={' '}
                              <Text style={{ color: TU.brand, fontWeight: 600 }}>
                                ¥{it.amount.toFixed(2)}
                              </Text>
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Right amount */}
                      <View
                        style={{
                          marginLeft: '16rpx',
                          textAlign: 'right',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          flexShrink: 0,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: '32rpx',
                            color: positive ? TU.error : TU.text2,
                            fontWeight: 700,
                            fontVariantNumeric: 'tabular-nums' as string,
                          }}
                        >
                          {positive ? '+' : ''}¥{Math.abs(it.amount).toFixed(2)}
                        </Text>
                        <Text style={{ fontSize: '20rpx', color: TU.text3, marginTop: '4rpx' }}>
                          {it.kind === 'withdraw'
                            ? '已到账'
                            : date === '今天'
                              ? '待到账'
                              : '已到账'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={{ padding: '36rpx 0', textAlign: 'center' }}>
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>— 加载更早账单 —</Text>
        </View>

        <View style={{ height: '40rpx' }} />
      </ScrollView>

      <TabBar role="pal" active="income" />
    </View>
  );
}
