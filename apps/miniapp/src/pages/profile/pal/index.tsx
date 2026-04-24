import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { TU } from '../../../constants/tokens';
import { useSafeArea } from '../../../hooks/useSafeArea';
import { TabBar } from '../../../components/ui/TabBar';

type WorkStatus = '在线' | '忙碌' | '离线';

interface MenuRow {
  l: string;
  hint: string;
  hintColor?: string;
  icon: string;
}

const primaryMenu: MenuRow[] = [
  { l: '我的订单', hint: '进行中 1 单', icon: '▤' },
  { l: '收入账单', hint: '本月 ¥3,480', icon: '¥' },
  { l: '打赏记录', hint: '本月 +¥240', icon: '♥' },
  { l: '我的评价', hint: '★ 4.98 · 286 条', icon: '★' },
  { l: '分成规则', hint: '75% 到账 · 单独', hintColor: '#C48808', icon: '%' },
  { l: '切换俱乐部', hint: '星辰电竞', icon: '⇄' },
];

const secondaryMenu: MenuRow[] = [
  { l: '服务设置', hint: '2 款游戏 · 4 项服务', icon: '⚙' },
  { l: '资料修改', hint: '实名已认证', icon: '▦' },
  { l: '帮助与客服', hint: '', icon: '?' },
  { l: '设置', hint: '', icon: '☰' },
];

export default function PalProfilePage() {
  const { statusBarHeight } = useSafeArea();
  const [status, setStatus] = useState<WorkStatus>('在线');

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: TU.bgPage }}
    >
      <ScrollView scrollY style={{ flex: 1, height: 0 }}>
        {/* Hero */}
        <View
          style={{
            position: 'relative',
            height: '360rpx',
            background: `linear-gradient(135deg, ${TU.brand} 0%, ${TU.brandDark} 100%)`,
            paddingTop: `${statusBarHeight}px`,
            paddingLeft: '32rpx',
            paddingRight: '32rpx',
            paddingBottom: 0,
            color: '#fff',
          }}
        >
          {/* Settings icon */}
          <View
            style={{
              position: 'absolute',
              top: '104rpx',
              right: '32rpx',
              width: '64rpx',
              height: '64rpx',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: '36rpx', color: '#fff' }}>⚙</Text>
          </View>

          <View
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24rpx' }}
          >
            <View
              style={{
                width: '128rpx',
                height: '128rpx',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4rpx solid rgba(255,255,255,0.4)',
              }}
            >
              <Text style={{ fontSize: '48rpx', color: '#fff' }}>带</Text>
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
                <Text style={{ fontSize: '36rpx', color: '#fff', fontWeight: 600 }}>
                  带飞专业户
                </Text>
                <View
                  style={{
                    background: 'linear-gradient(135deg,#FFD56B,#F0A400)',
                    borderRadius: '6rpx',
                    padding: '2rpx 12rpx',
                  }}
                >
                  <Text style={{ fontSize: '20rpx', color: '#fff', fontWeight: 600 }}>金牌</Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: '24rpx',
                  color: 'rgba(255,255,255,0.85)',
                  marginTop: '10rpx',
                  display: 'block',
                }}
              >
                星辰电竞 · ID bf_zyh · 男陪
              </Text>
              <Text
                style={{
                  fontSize: '22rpx',
                  color: 'rgba(255,255,255,0.85)',
                  marginTop: '10rpx',
                  display: 'block',
                }}
              >
                ★ 4.98 · 接单 328 · 等级 Lv.5
              </Text>
            </View>
          </View>
        </View>

        {/* Work status switch card (overlapping) */}
        <View
          style={{
            margin: '-48rpx 12rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            padding: '24rpx 28rpx',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            boxShadow: '0 4rpx 16rpx rgba(0,0,0,0.08)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <View style={{ flex: 1, minWidth: 0 }}>
            <View
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12rpx' }}
            >
              <View
                style={{
                  width: '14rpx',
                  height: '14rpx',
                  borderRadius: '50%',
                  background: TU.success,
                }}
              />
              <Text style={{ fontSize: '28rpx', color: TU.text, fontWeight: 600 }}>
                在线 · 可接单
              </Text>
            </View>
            <Text
              style={{ fontSize: '22rpx', color: TU.text3, marginTop: '8rpx', display: 'block' }}
            >
              今日已接 3 单 · 进行中 1 单
            </Text>
          </View>

          {/* Segmented control */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              background: TU.bg,
              borderRadius: '999rpx',
              padding: '6rpx',
            }}
          >
            {(['在线', '忙碌', '离线'] as WorkStatus[]).map(s => {
              const active = status === s;
              return (
                <View
                  key={s}
                  onClick={() => setStatus(s)}
                  style={{
                    padding: '10rpx 20rpx',
                    borderRadius: '999rpx',
                    background: active ? TU.white : 'transparent',
                    boxShadow: active ? '0 2rpx 6rpx rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  <Text
                    style={{
                      fontSize: '22rpx',
                      color: active ? TU.brand : TU.text3,
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {s}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Body */}
        <View style={{ paddingTop: '24rpx' }}>
          {/* Money summary */}
          <View
            style={{
              margin: '0 12rpx',
              background: TU.white,
              borderRadius: `${TU.radiusLg * 2}rpx`,
              padding: '36rpx 0',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6rpx',
                borderRight: `1rpx solid ${TU.borderLight}`,
              }}
            >
              <Text style={{ fontSize: '22rpx', color: TU.text3 }}>可提现余额</Text>
              <Text style={{ fontSize: '32rpx', color: TU.error, fontWeight: 700 }}>680.00元</Text>
              <View
                style={{
                  marginTop: '6rpx',
                  background: TU.brand,
                  borderRadius: '999rpx',
                  padding: '4rpx 16rpx',
                }}
              >
                <Text style={{ fontSize: '20rpx', color: '#fff' }}>提现</Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6rpx',
                borderRight: `1rpx solid ${TU.borderLight}`,
              }}
            >
              <Text style={{ fontSize: '22rpx', color: TU.text3 }}>本月收入</Text>
              <Text style={{ fontSize: '32rpx', color: TU.text, fontWeight: 700 }}>3,480元</Text>
              <Text style={{ fontSize: '20rpx', color: TU.text4 }}>&nbsp;</Text>
            </View>
            <View
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6rpx',
              }}
            >
              <Text style={{ fontSize: '22rpx', color: TU.text3 }}>累计收入</Text>
              <Text style={{ fontSize: '32rpx', color: TU.text, fontWeight: 700 }}>12,480元</Text>
              <Text style={{ fontSize: '20rpx', color: TU.text4 }}>&nbsp;</Text>
            </View>
          </View>

          {/* Today stats */}
          <View
            style={{
              margin: '20rpx 12rpx 0',
              background: TU.white,
              borderRadius: `${TU.radiusLg * 2}rpx`,
              padding: '28rpx',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: '28rpx', color: TU.text, fontWeight: 500 }}>今日数据</Text>
              <Text style={{ fontSize: '22rpx', color: TU.text3 }}>04-23</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: '20rpx' }}>
              {[
                { l: '接单', v: '3' },
                { l: '收入', v: '¥224' },
                { l: '在线', v: '6.5h' },
                { l: '好评', v: '100%' },
              ].map(s => (
                <View
                  key={s.l}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6rpx',
                  }}
                >
                  <Text style={{ fontSize: '32rpx', color: TU.text, fontWeight: 700 }}>{s.v}</Text>
                  <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{s.l}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Primary menu */}
          <View
            style={{
              margin: '20rpx 12rpx 0',
              background: TU.white,
              borderRadius: `${TU.radiusLg * 2}rpx`,
              overflow: 'hidden',
            }}
          >
            {primaryMenu.map((row, i) => (
              <View
                key={row.l}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '22rpx 28rpx',
                  borderTop: i === 0 ? 'none' : `1rpx solid ${TU.borderLight}`,
                }}
              >
                <View
                  style={{
                    width: '56rpx',
                    height: '56rpx',
                    borderRadius: `${TU.radius * 2}rpx`,
                    background: TU.brandTint,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '20rpx',
                    flexShrink: 0,
                  }}
                >
                  <Text style={{ fontSize: '28rpx', color: TU.brand, fontWeight: 600 }}>
                    {row.icon}
                  </Text>
                </View>
                <Text style={{ flex: 1, fontSize: '28rpx', color: TU.text }}>{row.l}</Text>
                <Text
                  style={{
                    fontSize: '24rpx',
                    color: row.hintColor ?? TU.text3,
                    marginRight: '12rpx',
                  }}
                >
                  {row.hint}
                </Text>
                <Text style={{ fontSize: '28rpx', color: TU.text4 }}>›</Text>
              </View>
            ))}
          </View>

          {/* Secondary menu */}
          <View
            style={{
              margin: '20rpx 12rpx 0',
              background: TU.white,
              borderRadius: `${TU.radiusLg * 2}rpx`,
              overflow: 'hidden',
            }}
          >
            {secondaryMenu.map((row, i) => (
              <View
                key={row.l}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '22rpx 28rpx',
                  borderTop: i === 0 ? 'none' : `1rpx solid ${TU.borderLight}`,
                }}
              >
                <View
                  style={{
                    width: '56rpx',
                    height: '56rpx',
                    borderRadius: `${TU.radius * 2}rpx`,
                    background: TU.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '20rpx',
                    flexShrink: 0,
                  }}
                >
                  <Text style={{ fontSize: '28rpx', color: TU.text2, fontWeight: 500 }}>
                    {row.icon}
                  </Text>
                </View>
                <Text style={{ flex: 1, fontSize: '28rpx', color: TU.text }}>{row.l}</Text>
                {row.hint && (
                  <Text style={{ fontSize: '24rpx', color: TU.text3, marginRight: '12rpx' }}>
                    {row.hint}
                  </Text>
                )}
                <Text style={{ fontSize: '28rpx', color: TU.text4 }}>›</Text>
              </View>
            ))}
          </View>

          <View style={{ height: '40rpx' }} />
        </View>
      </ScrollView>

      <TabBar role="pal" active="me" />
    </View>
  );
}
