import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { useSafeArea } from '../../hooks/useSafeArea';
import { TabBar } from '../../components/ui/TabBar';
import { Tabs } from '../../components/ui/Tabs';
import { Tag } from '../../components/ui/Tag';
import { TU, GAMES, WORK_STATUS_MAP } from '../../constants/tokens';
import { MOCK_PALS } from '../../mock/data';

const FILTER_TABS = ['推荐', '最近下单', '高分榜'];

interface Club {
  name: string;
  sub: string;
  active: boolean;
  pals: number;
  orders: string;
  joined: string;
}

const CLUBS: Club[] = [
  {
    name: '星辰电竞俱乐部',
    sub: '杭州 · 王者/LOL 主',
    active: true,
    pals: 48,
    orders: '日均 87',
    joined: '2024-01-15',
  },
  {
    name: '夜光电竞',
    sub: '上海 · FPS 专精',
    active: false,
    pals: 32,
    orders: '日均 54',
    joined: '2024-03-08',
  },
  {
    name: '铁三角俱乐部',
    sub: '成都 · 原神/二游',
    active: false,
    pals: 18,
    orders: '日均 22',
    joined: '2024-04-02',
  },
];

function ClubSwitcher({
  onClose,
  onSwitch,
}: {
  onClose: () => void;
  onSwitch: (name: string) => void;
}) {
  const { statusBarHeight } = useSafeArea();
  // Header = statusBarHeight (px) + 88rpx row; expressed as calc() for WXSS
  const headerBottom = `calc(${statusBarHeight}px + 88rpx)`;

  return (
    <View
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      {/* Scrim */}
      <View
        style={{
          position: 'absolute',
          top: headerBottom,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.35)',
        }}
        onClick={onClose}
      />

      {/* Dropdown sheet */}
      <View
        style={{
          position: 'absolute',
          top: headerBottom,
          left: 0,
          right: 0,
          background: TU.white,
          borderRadius: `0 0 ${TU.radiusLg * 2}rpx ${TU.radiusLg * 2}rpx`,
          paddingBottom: '24rpx',
          boxShadow: '0 12rpx 32rpx rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '28rpx 32rpx 20rpx',
            borderBottom: `1rpx solid ${TU.borderLight}`,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: '30rpx', color: TU.text, fontWeight: 500, display: 'block' }}>
              切换俱乐部
            </Text>
            <Text
              style={{ fontSize: '22rpx', color: TU.text3, marginTop: '4rpx', display: 'block' }}
            >
              陪玩身份 · 同时只属于一个俱乐部
            </Text>
          </View>
          <View
            style={{
              padding: '8rpx 20rpx',
              borderRadius: '24rpx',
              border: `1rpx solid ${TU.brand}`,
            }}
          >
            <Text style={{ fontSize: '22rpx', color: TU.brand }}>+ 加入新俱乐部</Text>
          </View>
        </View>

        {/* Club list */}
        {CLUBS.map((c, i) => (
          <View
            key={c.name}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '28rpx 32rpx',
              gap: '24rpx',
              background: c.active ? TU.brandTint : TU.white,
              borderBottom: i < CLUBS.length - 1 ? `1rpx solid ${TU.borderLight}` : 'none',
            }}
            onClick={() => onSwitch(c.name)}
          >
            <View
              style={{
                width: '88rpx',
                height: '88rpx',
                borderRadius: `${TU.radius * 2}rpx`,
                flexShrink: 0,
                background: c.active ? TU.brand : TU.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: c.active ? '#fff' : TU.text2, fontSize: '32rpx' }}>
                {c.name[0]}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '12rpx',
                }}
              >
                <Text style={{ fontSize: '28rpx', color: TU.text, fontWeight: 500 }}>{c.name}</Text>
                {c.active && (
                  <View
                    style={{ padding: '2rpx 12rpx', background: TU.brand, borderRadius: '4rpx' }}
                  >
                    <Text style={{ fontSize: '20rpx', color: '#fff' }}>当前</Text>
                  </View>
                )}
              </View>
              <Text
                style={{ fontSize: '22rpx', color: TU.text3, marginTop: '6rpx', display: 'block' }}
              >
                {c.sub}
              </Text>
              <View
                style={{ display: 'flex', flexDirection: 'row', gap: '16rpx', marginTop: '10rpx' }}
              >
                <Text style={{ fontSize: '20rpx', color: TU.text3 }}>{c.pals} 位陪玩</Text>
                <Text style={{ fontSize: '20rpx', color: TU.text3 }}>·</Text>
                <Text style={{ fontSize: '20rpx', color: TU.text3 }}>{c.orders}</Text>
                <Text style={{ fontSize: '20rpx', color: TU.text3 }}>·</Text>
                <Text style={{ fontSize: '20rpx', color: TU.text3 }}>入驻 {c.joined}</Text>
              </View>
            </View>
            {c.active ? (
              <Text style={{ color: TU.brand, fontSize: '32rpx' }}>✓</Text>
            ) : (
              <View
                style={{
                  padding: '8rpx 24rpx',
                  borderRadius: '24rpx',
                  border: `1rpx solid ${TU.border}`,
                }}
              >
                <Text style={{ fontSize: '24rpx', color: TU.text2 }}>切换</Text>
              </View>
            )}
          </View>
        ))}

        {/* Help */}
        <View
          style={{
            padding: '28rpx 32rpx 8rpx',
            display: 'flex',
            flexDirection: 'row',
            gap: '12rpx',
          }}
        >
          <Text style={{ fontSize: '22rpx', color: TU.text3, lineHeight: 1.6 }}>
            ⓘ 切换俱乐部不会影响历史订单。进行中订单需完成后才能切换活跃俱乐部。
          </Text>
        </View>
      </View>

      {/* Cancel pill bottom */}
      <View
        style={{
          position: 'absolute',
          left: '32rpx',
          right: '32rpx',
          bottom: '60rpx',
          padding: '24rpx 0',
          background: TU.white,
          borderRadius: `${TU.radiusLg * 2}rpx`,
          boxShadow: '0 4rpx 16rpx rgba(0,0,0,0.05)',
        }}
        onClick={onClose}
      >
        <Text style={{ fontSize: '30rpx', color: TU.text2, textAlign: 'center', display: 'block' }}>
          取消
        </Text>
      </View>
    </View>
  );
}

export default function HomePage() {
  const { statusBarHeight } = useSafeArea();
  const [activeTab, setActiveTab] = useState(0);
  const [clubName, setClubName] = useState('星辰电竞');
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const handleSwitch = (name: string) => {
    setClubName(name.replace('俱乐部', ''));
    setSwitcherOpen(false);
    Taro.showToast({ title: `已切换到 ${name}`, icon: 'none' });
  };

  return (
    <View
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: TU.bgPage }}
    >
      {/* 顶部搜索 + 俱乐部 */}
      <View
        style={{
          background: TU.white,
          borderBottom: `1rpx solid ${TU.borderLight}`,
          flexShrink: 0,
        }}
      >
        {/* Status-bar spacer */}
        <View style={{ height: `${statusBarHeight}px` }} />
        <View
          style={{
            padding: '12rpx 28rpx 20rpx',
            display: 'flex',
            flexDirection: 'row',
            gap: '20rpx',
            alignItems: 'center',
          }}
        >
        <View
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6rpx' }}
          onClick={() => setSwitcherOpen(true)}
        >
          <Text style={{ fontSize: '24rpx', color: TU.brand, fontWeight: 500 }}>{clubName}</Text>
          <Text style={{ fontSize: '20rpx', color: TU.brand }}>▾</Text>
        </View>
        <View
          style={{
            flex: 1,
            height: '64rpx',
            background: TU.bg,
            borderRadius: '32rpx',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0 24rpx',
            gap: '14rpx',
          }}
        >
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>🔍</Text>
          <Text style={{ fontSize: '26rpx', color: TU.text3 }}>搜索陪玩 · 游戏 · 服务</Text>
        </View>
        </View>
      </View>

      {/* Banner */}
      <View style={{ padding: '20rpx 24rpx 0' }}>
        <View
          style={{
            height: '176rpx',
            borderRadius: `${TU.radiusLg * 2}rpx`,
            background: TU.brand,
            padding: '28rpx 36rpx',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Text style={{ fontSize: '32rpx', fontWeight: 500, color: '#fff', display: 'block' }}>
            新用户首单立减
          </Text>
          <Text
            style={{
              fontSize: '44rpx',
              fontWeight: 600,
              color: '#fff',
              display: 'block',
              marginTop: '6rpx',
            }}
          >
            ¥ 20
          </Text>
          <Text
            style={{
              fontSize: '22rpx',
              color: 'rgba(255,255,255,0.85)',
              display: 'block',
              marginTop: '8rpx',
            }}
          >
            全平台陪玩通用 · 有效期 7 天
          </Text>
          <View
            style={{
              position: 'absolute',
              right: '32rpx',
              top: '32rpx',
              padding: '6rpx 20rpx',
              background: 'rgba(255,255,255,0.22)',
              borderRadius: '24rpx',
            }}
          >
            <Text style={{ color: '#fff', fontSize: '22rpx' }}>立即领取 ›</Text>
          </View>
        </View>
      </View>

      {/* 游戏分类 */}
      <View
        style={{
          margin: '24rpx 24rpx 0',
          background: TU.white,
          borderRadius: `${TU.radiusLg * 2}rpx`,
          padding: '28rpx 0',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {GAMES.slice(0, 6).map(g => (
          <View
            key={g.id}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12rpx',
            }}
          >
            <View
              style={{
                width: '76rpx',
                height: '76rpx',
                borderRadius: '20rpx',
                background: TU.brandTint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: TU.brand, fontSize: '26rpx', fontWeight: 500 }}>
                {g.name[0]}
              </Text>
            </View>
            <Text style={{ fontSize: '22rpx', color: TU.text2 }}>
              {g.name.length > 4 ? g.name.slice(0, 4) : g.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Tabs + 筛选 */}
      <View style={{ marginTop: '20rpx' }}>
        <Tabs tabs={FILTER_TABS} active={activeTab} onChange={setActiveTab} />
      </View>
      <View
        style={{
          padding: '20rpx 28rpx 12rpx',
          display: 'flex',
          flexDirection: 'row',
          gap: '14rpx',
          background: TU.white,
          borderBottom: `1rpx solid ${TU.borderLight}`,
        }}
      >
        <Tag type="tint" size="small">
          全部游戏 ▾
        </Tag>
        <Tag size="small">段位 ▾</Tag>
        <Tag size="small">价格 ▾</Tag>
        <Tag size="small">性别 ▾</Tag>
      </View>

      {/* 陪玩列表 */}
      <ScrollView scrollY style={{ flex: 1, height: 0, background: TU.white }}>
        {MOCK_PALS.map((p, i) => {
          const ws = WORK_STATUS_MAP[p.status as keyof typeof WORK_STATUS_MAP];
          return (
            <View
              key={p.id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '24rpx',
                padding: '28rpx 28rpx',
                borderBottom: i < MOCK_PALS.length - 1 ? `1rpx solid ${TU.borderLight}` : 'none',
              }}
              onClick={() => Taro.navigateTo({ url: `/pages/player/detail/index?id=${p.id}` })}
            >
              {/* 头像 */}
              <View style={{ position: 'relative', flexShrink: 0 }}>
                <View
                  style={{
                    width: '108rpx',
                    height: '108rpx',
                    borderRadius: `${TU.radiusLg * 2}rpx`,
                    background: TU.brand,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: '36rpx' }}>{p.name[0]}</Text>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: '-4rpx',
                    right: '-4rpx',
                    width: '28rpx',
                    height: '28rpx',
                    borderRadius: '14rpx',
                    background: ws.color,
                    border: '4rpx solid #fff',
                  }}
                />
              </View>

              {/* 内容 */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '12rpx',
                  }}
                >
                  <Text style={{ fontSize: '30rpx', color: TU.text, fontWeight: 500 }}>
                    {p.name}
                  </Text>
                  <Text style={{ fontSize: '20rpx', color: ws.color }}>{ws.label}</Text>
                </View>
                <Text
                  style={{
                    fontSize: '22rpx',
                    color: TU.text3,
                    marginTop: '4rpx',
                    display: 'block',
                  }}
                >
                  {p.tier}
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8rpx',
                    marginTop: '12rpx',
                    flexWrap: 'wrap',
                  }}
                >
                  {p.tags.slice(0, 3).map(t => (
                    <View
                      key={t}
                      style={{
                        padding: '2rpx 12rpx',
                        background: TU.brandTint,
                        borderRadius: '4rpx',
                      }}
                    >
                      <Text style={{ fontSize: '20rpx', color: TU.brand }}>{t}</Text>
                    </View>
                  ))}
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: '16rpx',
                    gap: '20rpx',
                  }}
                >
                  <Text style={{ fontSize: '22rpx', color: TU.text3 }}>
                    ★ {p.rating.toFixed(2)}
                  </Text>
                  <Text style={{ fontSize: '22rpx', color: TU.text3 }}>接单 {p.orders}</Text>
                </View>
              </View>

              {/* 价格 */}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontSize: '32rpx', color: TU.error, fontWeight: 500 }}>
                  ¥{p.price}
                  <Text style={{ fontSize: '22rpx', color: TU.text3 }}>/h</Text>
                </Text>
                <View
                  style={{
                    padding: '8rpx 24rpx',
                    border: `1rpx solid ${TU.brand}`,
                    borderRadius: '28rpx',
                  }}
                >
                  <Text style={{ fontSize: '24rpx', color: TU.brand }}>下单</Text>
                </View>
              </View>
            </View>
          );
        })}
        <View style={{ height: '40rpx' }} />
      </ScrollView>

      <TabBar role="user" active="home" />

      {switcherOpen && (
        <ClubSwitcher onClose={() => setSwitcherOpen(false)} onSwitch={handleSwitch} />
      )}
    </View>
  );
}
