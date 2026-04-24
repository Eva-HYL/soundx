import { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { TU } from '../../../constants/tokens';
import { NavBar } from '../../../components/ui/NavBar';

type Stage = 'start' | 'end';

export default function PalOrderDetailPage() {
  const [stage, setStage] = useState<Stage>('start');

  const heroBg =
    stage === 'start'
      ? `linear-gradient(135deg, ${TU.brand} 0%, ${TU.brandDark} 100%)`
      : `linear-gradient(135deg, ${TU.success} 0%, #0EA655 100%)`;

  const line1 = stage === 'start' ? '已接单 · 等待开始服务' : '服务中';
  const bigTitle = stage === 'start' ? '请按时开始，点击下方按钮记录' : '已开始 42 分钟';
  const subtitle =
    stage === 'start'
      ? '约定开始 · 今天 14:00 · 还剩 12 分钟'
      : '预计结束 16:00 · 还剩 1 小时 18 分';

  const startTime = stage === 'start' ? '--:--' : '14:02';
  const endTime = '--:--';

  const handlePrimary = () => {
    if (stage === 'start') {
      setStage('end');
      Taro.showToast({ title: '已记录开始时间', icon: 'success' });
    } else {
      Taro.navigateTo({ url: '/pages/report/submit/index' });
    }
  };

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: TU.bgPage }}
    >
      <NavBar
        title="订单详情"
        right={<Text style={{ fontSize: '36rpx', color: TU.text2 }}>⋯</Text>}
      />

      <ScrollView scrollY style={{ flex: 1, height: 0 }}>
        {/* Status hero */}
        <View
          style={{
            padding: '36rpx 40rpx',
            background: heroBg,
            color: '#fff',
          }}
        >
          <Text style={{ fontSize: '26rpx', color: 'rgba(255,255,255,0.9)' }}>{line1}</Text>
          <Text
            style={{
              fontSize: '40rpx',
              color: '#fff',
              fontWeight: 500,
              marginTop: '14rpx',
              display: 'block',
            }}
          >
            {bigTitle}
          </Text>
          <Text
            style={{
              fontSize: '24rpx',
              color: 'rgba(255,255,255,0.85)',
              marginTop: '14rpx',
              display: 'block',
            }}
          >
            {subtitle}
          </Text>
        </View>

        {/* User card */}
        <View
          style={{
            margin: '12rpx',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            padding: '28rpx',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '80rpx',
              height: '80rpx',
              borderRadius: `${TU.radius * 2}rpx`,
              background: TU.brandTint,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20rpx',
              flexShrink: 0,
            }}
          >
            <Text style={{ fontSize: '32rpx', color: TU.brand, fontWeight: 600 }}>咕</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontSize: '30rpx', color: TU.text, fontWeight: 500 }}>咕咕不鸽</Text>
            <Text
              style={{ fontSize: '22rpx', color: TU.text3, marginTop: '6rpx', display: 'block' }}
            >
              历史下单 8 次 · 好评率 100%
            </Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', gap: '16rpx' }}>
            <View
              style={{
                width: '64rpx',
                height: '64rpx',
                borderRadius: '50%',
                background: TU.brandTint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: '28rpx', color: TU.brand }}>☎</Text>
            </View>
            <View
              style={{
                width: '64rpx',
                height: '64rpx',
                borderRadius: '50%',
                background: TU.brandTint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: '28rpx', color: TU.brand }}>✉</Text>
            </View>
          </View>
        </View>

        {/* Order info card */}
        <View
          style={{
            margin: '0 12rpx',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            padding: '8rpx 28rpx',
          }}
        >
          {[
            { l: '订单号', v: 'SX2404221040', c: TU.text },
            { l: '游戏', v: '王者荣耀', c: TU.text },
            { l: '服务', v: '排位上分', c: TU.text },
            { l: '时长', v: '2 小时', c: TU.text },
            { l: '订单金额', v: '¥ 80.00', c: TU.text },
            { l: '到账给我', v: '¥ 60.00 (按 75%)', c: TU.brand },
            { l: '备注', v: '钻三带星四，我主玩打野', c: TU.text2 },
          ].map((row, i) => (
            <View
              key={row.l}
              style={{
                display: 'flex',
                flexDirection: 'row',
                padding: '22rpx 0',
                borderTop: i === 0 ? 'none' : `1rpx solid ${TU.borderLight}`,
                alignItems: 'flex-start',
              }}
            >
              <View style={{ width: '160rpx', flexShrink: 0 }}>
                <Text style={{ fontSize: '26rpx', color: TU.text3 }}>{row.l}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={{
                    fontSize: '28rpx',
                    color: row.c,
                    fontWeight: row.c === TU.brand ? 500 : 400,
                  }}
                >
                  {row.v}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Service time card */}
        <View
          style={{
            margin: '20rpx 12rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            padding: '32rpx',
          }}
        >
          <Text style={{ fontSize: '28rpx', color: TU.text, fontWeight: 500 }}>服务时间</Text>

          <View style={{ display: 'flex', flexDirection: 'row', gap: '16rpx', marginTop: '20rpx' }}>
            {/* Start time box */}
            <View
              style={{
                flex: 1,
                background: TU.bg,
                borderRadius: `${TU.radiusLg}rpx`,
                padding: '24rpx',
              }}
            >
              <View
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8rpx' }}
              >
                <View
                  style={{
                    width: '14rpx',
                    height: '14rpx',
                    borderRadius: '50%',
                    background: TU.success,
                  }}
                />
                <Text style={{ fontSize: '24rpx', color: TU.text2 }}>开始时间</Text>
              </View>
              <Text
                style={{
                  fontSize: '40rpx',
                  color: stage === 'start' ? TU.text4 : TU.text,
                  fontWeight: 600,
                  marginTop: '12rpx',
                  display: 'block',
                  fontVariantNumeric: 'tabular-nums' as string,
                }}
              >
                {startTime}
              </Text>
              {stage === 'end' && (
                <Text
                  style={{
                    fontSize: '20rpx',
                    color: TU.success,
                    marginTop: '6rpx',
                    display: 'block',
                  }}
                >
                  比约定早 2 分
                </Text>
              )}
            </View>
            {/* End time box */}
            <View
              style={{
                flex: 1,
                background: TU.bg,
                borderRadius: `${TU.radiusLg}rpx`,
                padding: '24rpx',
                opacity: stage === 'start' ? 0.5 : 1,
              }}
            >
              <View
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8rpx' }}
              >
                <View
                  style={{
                    width: '14rpx',
                    height: '14rpx',
                    borderRadius: '50%',
                    background: TU.text3,
                  }}
                />
                <Text style={{ fontSize: '24rpx', color: TU.text2 }}>结束时间</Text>
              </View>
              <Text
                style={{
                  fontSize: '40rpx',
                  color: TU.text4,
                  fontWeight: 600,
                  marginTop: '12rpx',
                  display: 'block',
                  fontVariantNumeric: 'tabular-nums' as string,
                }}
              >
                {endTime}
              </Text>
            </View>
          </View>

          {/* Warning box */}
          <View
            style={{
              marginTop: '20rpx',
              background: TU.warningTint,
              borderRadius: `${TU.radius * 2}rpx`,
              padding: '20rpx 24rpx',
            }}
          >
            <Text style={{ fontSize: '24rpx', color: '#B07A00', lineHeight: 1.5 }}>
              {stage === 'start'
                ? '请在开始陪玩时点击"开始服务"，用于精准计时和结算'
                : '服务结束后请及时点击"结束服务"，然后上传战绩给老板审核'}
            </Text>
          </View>
        </View>

        <View style={{ height: '40rpx' }} />
      </ScrollView>

      {/* Bottom CTA bar */}
      <View
        style={{
          background: TU.white,
          borderTop: `1rpx solid ${TU.borderLight}`,
          padding: '20rpx 28rpx 36rpx',
          flexShrink: 0,
        }}
      >
        <View
          onClick={handlePrimary}
          style={{
            height: '100rpx',
            borderRadius: '999rpx',
            background: stage === 'start' ? TU.brand : TU.error,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12rpx',
          }}
        >
          <Text style={{ fontSize: '28rpx', color: '#fff' }}>{stage === 'start' ? '▶' : '■'}</Text>
          <Text style={{ fontSize: '32rpx', color: '#fff', fontWeight: 600 }}>
            {stage === 'start' ? '开始服务' : '结束服务'}
          </Text>
        </View>
        <View style={{ textAlign: 'center', marginTop: '12rpx' }}>
          <Text style={{ fontSize: '22rpx', color: TU.text3 }}>
            {stage === 'start' ? '点击记录开始时间戳，不可撤销' : '已开始 14:02 · 当前 14:44'}
          </Text>
        </View>
      </View>
    </View>
  );
}
