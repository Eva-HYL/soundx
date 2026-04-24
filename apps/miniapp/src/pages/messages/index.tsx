import { View, Text, ScrollView } from '@tarojs/components';
import { TU } from '../../constants/tokens';
import { NavBar } from '../../components/ui/NavBar';
import { TabBar } from '../../components/ui/TabBar';

interface Category {
  l: string;
  icon: string;
  last: string;
  time: string;
  badge?: number;
  color: string;
}

const categories: Category[] = [
  {
    l: '订单通知',
    icon: '▤',
    last: '您的订单 SX240422099 已被老板确认付款',
    time: '10 分钟前',
    badge: 3,
    color: '#6190E8',
  },
  {
    l: '收入提醒',
    icon: '¥',
    last: '本次打赏 ¥66 已到账，查看详情',
    time: '1 小时前',
    badge: 1,
    color: '#13CE66',
  },
  {
    l: '审核结果',
    icon: '✓',
    last: '您的战绩报备已通过，积分已发放',
    time: '昨天',
    color: '#FFC82C',
  },
  {
    l: '官方公告',
    icon: '⚑',
    last: '五一期间客服响应时间调整通知',
    time: '2 天前',
    badge: 1,
    color: '#666666',
  },
  { l: '系统消息', icon: '◎', last: '您的账号从新设备登录', time: '04-20', color: '#666666' },
];

interface Recent {
  color: string;
  t: string;
  title: string;
  body: string;
  cta: string | null;
}

const recents: Recent[] = [
  {
    color: '#6190E8',
    t: '10 分钟前',
    title: '订单已付款',
    body: '订单 SX240422099 · ¥165 已到账，请准时开始服务',
    cta: '查看订单',
  },
  {
    color: '#13CE66',
    t: '1 小时前',
    title: '收到打赏 +¥66',
    body: '咕咕不鸽 打赏了你 ¥66，留言:"感谢带飞"',
    cta: '回复',
  },
  {
    color: '#FFC82C',
    t: '昨天 21:30',
    title: '报备已通过',
    body: 'RPT-20240422-097 · 结算 60 分',
    cta: null,
  },
  {
    color: '#FF4949',
    t: '2 天前',
    title: '有一条差评',
    body: '来自 摸鱼打工人 的 3 星评价，建议查看',
    cta: '查看',
  },
];

function alpha(hex: string, hexAlpha: string) {
  return `${hex}${hexAlpha}`;
}

export default function MessagesPage() {
  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: TU.bgPage }}
    >
      <NavBar
        title="消息"
        right={<Text style={{ fontSize: '26rpx', color: TU.text2 }}>全部已读</Text>}
      />

      <ScrollView scrollY style={{ flex: 1, height: 0 }}>
        {/* Fake push notification preview */}
        <View style={{ padding: '12rpx' }}>
          <View
            style={{
              background: 'rgba(180,180,180,0.35)',
              borderRadius: '28rpx',
              padding: '24rpx',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: '20rpx',
            }}
          >
            <View
              style={{
                width: '64rpx',
                height: '64rpx',
                borderRadius: '12rpx',
                background: TU.brand,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Text style={{ fontSize: '24rpx', color: '#fff', fontWeight: 700 }}>SX</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontSize: '26rpx', color: TU.text, fontWeight: 500 }}>
                  SoundX · 订单通知
                </Text>
                <Text style={{ fontSize: '22rpx', color: TU.text3 }}>刚刚</Text>
              </View>
              <Text
                style={{ fontSize: '24rpx', color: TU.text, marginTop: '8rpx', display: 'block' }}
              >
                🔥 奶茶要七分糖 向你发起了巅峰赛陪练订单, ¥165 · 3 小时
              </Text>
            </View>
          </View>
          <View style={{ textAlign: 'center', marginTop: '12rpx' }}>
            <Text style={{ fontSize: '22rpx', color: TU.text3 }}>
              ↑ 系统通知样式示例（锁屏/下拉横幅）
            </Text>
          </View>
        </View>

        {/* Category list */}
        <View
          style={{
            margin: '8rpx 12rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            overflow: 'hidden',
          }}
        >
          {categories.map((c, i) => (
            <View
              key={c.l}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '24rpx 28rpx',
                borderTop: i === 0 ? 'none' : `1rpx solid ${TU.borderLight}`,
              }}
            >
              {/* Icon square */}
              <View style={{ position: 'relative', marginRight: '20rpx' }}>
                <View
                  style={{
                    width: '84rpx',
                    height: '84rpx',
                    borderRadius: `${TU.radiusLg * 2}rpx`,
                    background: alpha(c.color, '22'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: '36rpx', color: c.color, fontWeight: 600 }}>
                    {c.icon}
                  </Text>
                </View>
                {c.badge && c.badge > 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: '-6rpx',
                      right: '-6rpx',
                      minWidth: '32rpx',
                      height: '32rpx',
                      padding: '0 8rpx',
                      background: TU.error,
                      borderRadius: '999rpx',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: '20rpx', color: '#fff', fontWeight: 500 }}>
                      {c.badge}
                    </Text>
                  </View>
                ) : null}
              </View>
              {/* Text */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: '30rpx', color: TU.text, fontWeight: 500 }}>{c.l}</Text>
                  <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{c.time}</Text>
                </View>
                <Text
                  style={{
                    fontSize: '24rpx',
                    color: TU.text3,
                    marginTop: '6rpx',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.last}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Section header */}
        <View style={{ padding: '28rpx 28rpx 12rpx' }}>
          <Text style={{ fontSize: '22rpx', color: TU.text3 }}>最近消息</Text>
        </View>

        {/* Recents */}
        <View style={{ margin: '0 12rpx' }}>
          {recents.map((r, i) => (
            <View
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'row',
                background: TU.white,
                borderRadius: `${TU.radiusLg * 2}rpx`,
                marginBottom: '16rpx',
                overflow: 'hidden',
              }}
            >
              <View style={{ width: '8rpx', background: r.color, flexShrink: 0 }} />
              <View style={{ flex: 1, padding: '24rpx 28rpx' }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: '28rpx', color: TU.text, fontWeight: 500 }}>
                    {r.title}
                  </Text>
                  <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{r.t}</Text>
                </View>
                <Text
                  style={{
                    fontSize: '24rpx',
                    color: TU.text2,
                    marginTop: '8rpx',
                    display: 'block',
                    lineHeight: 1.5,
                  }}
                >
                  {r.body}
                </Text>
                {r.cta && (
                  <Text
                    style={{
                      fontSize: '24rpx',
                      color: TU.brand,
                      marginTop: '12rpx',
                      display: 'block',
                    }}
                  >
                    {r.cta} →
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={{ padding: '24rpx 0 40rpx', textAlign: 'center' }}>
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>— 以上为 7 天内消息 —</Text>
        </View>
      </ScrollView>

      <TabBar role="user" active="msg" />
    </View>
  );
}
