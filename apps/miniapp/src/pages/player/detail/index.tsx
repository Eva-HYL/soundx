import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useState } from 'react';
import { TU } from '../../../constants/tokens';
import { NavBar } from '../../../components/ui/NavBar';
import { Button } from '../../../components/ui/Button';
import { Tag } from '../../../components/ui/Tag';

const MOCK_PAL = {
  id: 'P001',
  name: '带飞专业户',
  gender: '男',
  city: '杭州',
  tier: '最强王者 · 王者 98 星',
  rating: 4.98,
  orders: 328,
  approvalRate: 99,
  price: 40,
  status: 'online',
  tags: ['可教学', '声音甜', '带飞'],
  certified: true,
};

const MOCK_GAMES = [
  { id: 'hok', name: '王者荣耀', tier: '最强王者', icon: '👑', years: 4 },
  { id: 'lol', name: '英雄联盟', tier: '钻石 I', icon: '⚔️', years: 3 },
];

const MOCK_SERVICES = [
  { id: 's1', name: '排位上分', price: 40, hot: true },
  { id: 's2', name: '巅峰赛陪练', price: 55, hot: false },
  { id: 's3', name: '娱乐开黑', price: 30, hot: false },
  { id: 's4', name: '教学指导', price: 60, hot: false },
];

const REVIEWS = [
  {
    user: '咕咕不鸽',
    rate: 5,
    text: '带得好！声音也好听，教了很多打野节奏，下次还来。',
    time: '2 天前',
    svc: '排位上分 · 2h',
  },
  {
    user: '奶茶要七分糖',
    rate: 5,
    text: '上单位带得稳，逆风局翻盘，已回购三次啦。',
    time: '3 天前',
    svc: '巅峰赛 · 3h',
  },
  {
    user: '摸鱼打工人',
    rate: 4,
    text: '整体不错，就是中间掉过一次线。',
    time: '1 周前',
    svc: '排位上分 · 2h',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', gap: '4rpx' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={{ fontSize: '24rpx', color: i <= count ? TU.warning : TU.border }}>
          ★
        </Text>
      ))}
    </View>
  );
}

export default function PalDetailPage() {
  const router = useRouter();
  const id = router.params.id ?? 'P001';
  const pal = MOCK_PAL;
  const [followed, setFollowed] = useState(false);

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: TU.bgPage }}
    >
      {/* Hero gradient header */}
      <View
        style={{
          background: `linear-gradient(160deg, ${TU.brand} 0%, ${TU.brandDark} 100%)`,
          paddingBottom: '60rpx',
          flexShrink: 0,
        }}
      >
        <NavBar title="" dark />
        {/* Hero content */}
        <View
          style={{ padding: '0 32rpx 0', display: 'flex', flexDirection: 'column', gap: '20rpx' }}
        >
          {/* Avatar row */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: '24rpx',
            }}
          >
            {/* Avatar */}
            <View
              style={{
                width: '144rpx',
                height: '144rpx',
                borderRadius: `${TU.radiusLg * 2}rpx`,
                background: 'rgba(255,255,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Text style={{ fontSize: '56rpx', color: '#fff', fontWeight: 700 }}>
                {pal.name.charAt(0)}
              </Text>
            </View>
            {/* Name / info */}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '12rpx',
                  flexWrap: 'wrap',
                }}
              >
                <Text style={{ fontSize: '36rpx', color: '#fff', fontWeight: 700 }}>
                  {pal.name}
                </Text>
                {pal.certified && (
                  <View
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      borderRadius: '6rpx',
                      padding: '2rpx 12rpx',
                    }}
                  >
                    <Text style={{ fontSize: '22rpx', color: '#fff', fontWeight: 600 }}>认证</Text>
                  </View>
                )}
              </View>
              <Text
                style={{ fontSize: '24rpx', color: 'rgba(255,255,255,0.75)', marginTop: '8rpx' }}
              >
                ID: {id} · {pal.gender} · {pal.city}
              </Text>
              <Text
                style={{ fontSize: '24rpx', color: 'rgba(255,255,255,0.75)', marginTop: '4rpx' }}
              >
                {pal.tier}
              </Text>
            </View>
          </View>
          {/* Stats row */}
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <Text style={{ fontSize: '36rpx', color: '#fff', fontWeight: 700 }}>
                {pal.rating}
              </Text>
              <Text style={{ fontSize: '22rpx', color: 'rgba(255,255,255,0.7)' }}>评分</Text>
            </View>
            <View
              style={{ width: '1rpx', height: '48rpx', background: 'rgba(255,255,255,0.25)' }}
            />
            <View
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <Text style={{ fontSize: '36rpx', color: '#fff', fontWeight: 700 }}>
                {pal.orders}
              </Text>
              <Text style={{ fontSize: '22rpx', color: 'rgba(255,255,255,0.7)' }}>接单数</Text>
            </View>
            <View
              style={{ width: '1rpx', height: '48rpx', background: 'rgba(255,255,255,0.25)' }}
            />
            <View
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <Text style={{ fontSize: '36rpx', color: '#fff', fontWeight: 700 }}>
                {pal.approvalRate}%
              </Text>
              <Text style={{ fontSize: '22rpx', color: 'rgba(255,255,255,0.7)' }}>好评率</Text>
            </View>
            <View style={{ marginLeft: '24rpx' }}>
              <View
                style={{
                  border: '1rpx solid rgba(255,255,255,0.7)',
                  borderRadius: '999rpx',
                  padding: '10rpx 28rpx',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => setFollowed((f: boolean) => !f)}
              >
                <Text style={{ fontSize: '26rpx', color: '#fff' }}>
                  {followed ? '已关注' : '+ 关注'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable body — overlaps hero with negative margin */}
      <ScrollView scrollY style={{ flex: 1, height: 0, marginTop: '-40rpx' }}>
        {/* Status strip */}
        <View
          style={{
            margin: '0 24rpx',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            boxShadow: '0 4rpx 20rpx rgba(0,0,0,0.08)',
            padding: '20rpx 28rpx',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '16rpx',
              height: '16rpx',
              borderRadius: '50%',
              background: TU.success,
              marginRight: '12rpx',
              flexShrink: 0,
            }}
          />
          <Text style={{ fontSize: '28rpx', color: TU.text, flex: 1 }}>在线 · 可立即接单</Text>
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>平均响应 3 分钟</Text>
        </View>

        {/* Tags */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '12rpx',
            flexWrap: 'wrap',
            padding: '20rpx 24rpx 0',
          }}
        >
          {pal.tags.map(tag => (
            <Tag key={tag} type="tint">
              {tag}
            </Tag>
          ))}
        </View>

        {/* 主玩游戏 card */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '24rpx 28rpx',
              borderBottom: `1rpx solid ${TU.borderLight}`,
            }}
          >
            <Text style={{ flex: 1, fontSize: '30rpx', color: TU.text, fontWeight: 600 }}>
              主玩游戏
            </Text>
            <Text style={{ fontSize: '24rpx', color: TU.text3 }}>{MOCK_GAMES.length} 个游戏</Text>
          </View>
          {MOCK_GAMES.map((g, i) => (
            <View
              key={g.id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '20rpx 28rpx',
                borderBottom: i < MOCK_GAMES.length - 1 ? `1rpx solid ${TU.borderLight}` : 'none',
              }}
            >
              <View
                style={{
                  width: '72rpx',
                  height: '72rpx',
                  borderRadius: `${TU.radius * 2}rpx`,
                  background: TU.brandTint,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20rpx',
                  flexShrink: 0,
                }}
              >
                <Text style={{ fontSize: '36rpx' }}>{g.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: '30rpx', color: TU.text, fontWeight: 500 }}>{g.name}</Text>
                <Text style={{ fontSize: '24rpx', color: TU.text3, marginTop: '4rpx' }}>
                  {g.tier} · {g.years} 年经验
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* 可下单服务 card */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              padding: '24rpx 28rpx',
              borderBottom: `1rpx solid ${TU.borderLight}`,
            }}
          >
            <Text style={{ fontSize: '30rpx', color: TU.text, fontWeight: 600 }}>可下单服务</Text>
          </View>
          {MOCK_SERVICES.map((svc, i) => (
            <View
              key={svc.id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '22rpx 28rpx',
                borderBottom:
                  i < MOCK_SERVICES.length - 1 ? `1rpx solid ${TU.borderLight}` : 'none',
              }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '12rpx',
                  }}
                >
                  <Text style={{ fontSize: '30rpx', color: TU.text, fontWeight: 500 }}>
                    {svc.name}
                  </Text>
                  {svc.hot && (
                    <View
                      style={{
                        background: TU.errorTint,
                        borderRadius: '4rpx',
                        padding: '2rpx 12rpx',
                      }}
                    >
                      <Text style={{ fontSize: '20rpx', color: TU.error }}>最热</Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: '24rpx', color: TU.text3, marginTop: '4rpx' }}>
                  ¥{svc.price} / 小时
                </Text>
              </View>
              <Button
                type="primary"
                size="small"
                onClick={() =>
                  Taro.navigateTo({ url: `/pages/order/place/index?palId=${id}&svcId=${svc.id}` })
                }
              >
                下单
              </Button>
            </View>
          ))}
        </View>

        {/* 用户评价 card */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '24rpx 28rpx',
              borderBottom: `1rpx solid ${TU.borderLight}`,
            }}
          >
            <Text style={{ flex: 1, fontSize: '30rpx', color: TU.text, fontWeight: 600 }}>
              用户评价
            </Text>
            <View
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12rpx' }}
            >
              <Text style={{ fontSize: '28rpx', color: TU.warning, fontWeight: 700 }}>
                {pal.rating}
              </Text>
              <Text style={{ fontSize: '24rpx', color: TU.text3 }}>共 {pal.orders} 条</Text>
              <Text style={{ fontSize: '24rpx', color: TU.brand }}>查看全部 ›</Text>
            </View>
          </View>
          {REVIEWS.map((r, i) => (
            <View
              key={i}
              style={{
                padding: '24rpx 28rpx',
                borderBottom: i < REVIEWS.length - 1 ? `1rpx solid ${TU.borderLight}` : 'none',
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '16rpx',
                  marginBottom: '14rpx',
                }}
              >
                <View
                  style={{
                    width: '60rpx',
                    height: '60rpx',
                    borderRadius: '50%',
                    background: TU.brand,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Text style={{ fontSize: '26rpx', color: '#fff' }}>{r.user.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: '28rpx', color: TU.text, fontWeight: 500 }}>
                    {r.user}
                  </Text>
                  <View style={{ marginTop: '4rpx' }}>
                    <Stars count={r.rate} />
                  </View>
                </View>
                <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{r.time}</Text>
              </View>
              <Text style={{ fontSize: '28rpx', color: TU.text2, lineHeight: '1.6' }}>
                {r.text}
              </Text>
              <Text style={{ fontSize: '22rpx', color: TU.text3, marginTop: '10rpx' }}>
                {r.svc}
              </Text>
            </View>
          ))}
        </View>

        {/* Bottom spacer for action bar */}
        <View style={{ height: '180rpx' }} />
      </ScrollView>

      {/* Bottom action bar */}
      <View
        style={{
          flexShrink: 0,
          background: TU.white,
          borderTop: `1rpx solid ${TU.borderLight}`,
          padding: '16rpx 24rpx 48rpx',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '24rpx',
        }}
      >
        {[
          { icon: '📞', label: '客服' },
          { icon: '💬', label: '私信' },
          { icon: '♡', label: '收藏' },
        ].map(a => (
          <View
            key={a.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4rpx',
              width: '96rpx',
              flexShrink: 0,
            }}
          >
            <Text style={{ fontSize: '40rpx' }}>{a.icon}</Text>
            <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{a.label}</Text>
          </View>
        ))}
        <View style={{ flex: 1 }}>
          <Button
            type="primary"
            size="large"
            full
            circle
            onClick={() => Taro.navigateTo({ url: `/pages/order/place/index?palId=${id}` })}
          >
            立即下单
          </Button>
        </View>
      </View>
    </View>
  );
}
