import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { TU } from '../../constants/tokens';
import { useSafeArea } from '../../hooks/useSafeArea';
import { TabBar } from '../../components/ui/TabBar';
import { ListItem } from '../../components/ui/ListItem';

const QUICK_ACTIONS = [
  { icon: '❤️', label: '收藏' },
  { icon: '👣', label: '足迹' },
  { icon: '🎫', label: '优惠券' },
  { icon: '🎧', label: '客服' },
];

export default function ProfilePage() {
  const { statusBarHeight } = useSafeArea();
  const [palMode, setPalMode] = useState(false);

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: TU.bgPage }}
    >
      {/* Custom header — no NavBar */}
      <View
        style={{
          background: `linear-gradient(160deg, ${TU.brand} 0%, ${TU.brandDark} 100%)`,
          paddingTop: 0,
          paddingBottom: '60rpx',
          paddingLeft: '32rpx',
          paddingRight: '32rpx',
          flexShrink: 0,
        }}
      >
        {/* Status-bar spacer */}
        <View style={{ height: `${statusBarHeight}px` }} />
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24rpx' }}>
          {/* Avatar */}
          <View
            style={{
              width: '96rpx',
              height: '96rpx',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              border: '3rpx solid rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text style={{ fontSize: '40rpx', color: '#fff', fontWeight: 700 }}>我</Text>
          </View>
          {/* User info */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: '36rpx', color: '#fff', fontWeight: 700 }}>咕咕不鸽</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '12rpx',
                marginTop: '8rpx',
              }}
            >
              <View
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '999rpx',
                  padding: '4rpx 16rpx',
                }}
              >
                <Text style={{ fontSize: '22rpx', color: '#fff' }}>Lv.12 资深玩家</Text>
              </View>
            </View>
          </View>
          {/* Settings shortcut */}
          <View onClick={() => {}}>
            <Text style={{ fontSize: '48rpx', color: 'rgba(255,255,255,0.8)' }}>⚙</Text>
          </View>
        </View>

        {/* Stats row */}
        <View
          style={{
            marginTop: '32rpx',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: `${TU.radiusLg}rpx`,
            padding: '20rpx 0',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {[
            { value: '5', label: '收藏陪玩' },
            { value: '12', label: '历史订单' },
            { value: '¥0', label: '优惠券' },
          ].map((item, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4rpx',
              }}
            >
              <Text style={{ fontSize: '36rpx', color: '#fff', fontWeight: 700 }}>
                {item.value}
              </Text>
              <Text style={{ fontSize: '22rpx', color: 'rgba(255,255,255,0.7)' }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView scrollY style={{ flex: 1, height: 0, marginTop: '-20rpx' }}>
        {/* Quick actions card */}
        <View
          style={{
            margin: '0 24rpx',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            padding: '28rpx 0',
            display: 'flex',
            flexDirection: 'row',
            boxShadow: '0 4rpx 16rpx rgba(0,0,0,0.06)',
          }}
        >
          {QUICK_ACTIONS.map(a => (
            <View
              key={a.label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10rpx',
              }}
              onClick={() => {}}
            >
              <Text style={{ fontSize: '48rpx' }}>{a.icon}</Text>
              <Text style={{ fontSize: '24rpx', color: TU.text2 }}>{a.label}</Text>
            </View>
          ))}
        </View>

        {/* Group 1: Mode switch */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            overflow: 'hidden',
          }}
        >
          <ListItem
            title="切换为陪玩模式"
            note="开启后可接收订单"
            last
            isSwitch
            switchChecked={palMode}
            onSwitchChange={checked => {
              setPalMode(checked);
              Taro.showToast({
                title: checked ? '已切换陪玩模式' : '已切换用户模式',
                icon: 'none',
              });
            }}
          />
        </View>

        {/* Group 2: Finance & apply */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            overflow: 'hidden',
          }}
        >
          <ListItem
            title="成为陪玩"
            note="申请入驻，开始接单赚收入"
            onClick={() => Taro.navigateTo({ url: '/pages/player/apply/index' })}
          />
          <ListItem
            title="提现记录"
            onClick={() => Taro.navigateTo({ url: '/pages/finance/withdraw/index' })}
          />
          <ListItem
            title="消费记录"
            last
            onClick={() => Taro.navigateTo({ url: '/pages/order/list/index' })}
          />
        </View>

        {/* Group 3: Settings */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            overflow: 'hidden',
          }}
        >
          <ListItem title="设置" onClick={() => {}} />
          <ListItem
            title="联系客服"
            onClick={() => Taro.makePhoneCall({ phoneNumber: '400-000-0000' })}
          />
          <ListItem title="关于 SoundX" last onClick={() => {}} />
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      <TabBar role="user" active="me" />
    </View>
  );
}
