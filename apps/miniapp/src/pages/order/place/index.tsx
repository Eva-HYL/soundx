import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { NavBar } from '../../../components/ui/NavBar';
import { Tag } from '../../../components/ui/Tag';
import { Button } from '../../../components/ui/Button';
import { TU } from '../../../constants/tokens';
import { MOCK_SERVICES, MOCK_PALS } from '../../../mock/data';

const DURATIONS = [0.5, 1, 2, 3, 4, 5];

export default function PlaceOrderPage() {
  const params = Taro.getCurrentInstance().router?.params ?? {};
  const palId = params.palId ?? 'P001';
  const serviceId = params.serviceId ?? 's1';

  const pal = MOCK_PALS.find(p => p.id === palId) ?? MOCK_PALS[0];
  const service = MOCK_SERVICES.find(s => s.id === serviceId) ?? MOCK_SERVICES[0];

  const [duration, setDuration] = useState<number>(2);

  const total = service.price * duration;

  return (
    <View
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: TU.bgPage }}
    >
      <NavBar title="确认下单" />

      <ScrollView scrollY style={{ flex: 1, height: 0 }}>
        {/* Pal Banner */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            padding: '28rpx 24rpx',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '20rpx',
            boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: '96rpx',
              height: '96rpx',
              borderRadius: `${TU.radiusLg * 2}rpx`,
              background: TU.brand,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text style={{ color: TU.white, fontSize: '36rpx', fontWeight: 600 }}>
              {pal.name[0]}
            </Text>
          </View>

          {/* Info */}
          <View style={{ flex: 1, minWidth: 0 }}>
            <View
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12rpx' }}
            >
              <Text style={{ fontSize: '30rpx', fontWeight: 600, color: TU.text }}>{pal.name}</Text>
              <Tag type="tint" size="small">
                认证陪玩
              </Tag>
            </View>
            <Text
              style={{ fontSize: '22rpx', color: TU.text3, marginTop: '6rpx', display: 'block' }}
            >
              {pal.tier} · 接单 {pal.orders} · 好评率 99%
            </Text>
          </View>

          {/* Chevron */}
          <Text style={{ fontSize: '28rpx', color: TU.text4 }}>›</Text>
        </View>

        {/* Service Info */}
        <View
          style={{
            margin: '16rpx 24rpx 0',
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
              padding: '24rpx 28rpx',
              borderBottom: `1rpx solid ${TU.borderLight}`,
            }}
          >
            <Text style={{ fontSize: '28rpx', color: TU.text2 }}>服务</Text>
            <Text style={{ fontSize: '28rpx', color: TU.text, fontWeight: 500 }}>
              {service.name}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24rpx 28rpx',
            }}
          >
            <Text style={{ fontSize: '28rpx', color: TU.text2 }}>单价</Text>
            <Text style={{ fontSize: '28rpx', color: TU.error, fontWeight: 500 }}>
              ¥{service.price}
              <Text style={{ fontSize: '22rpx', color: TU.text3, fontWeight: 400 }}>/h</Text>
            </Text>
          </View>
        </View>

        {/* Duration Selector */}
        <View
          style={{
            margin: '16rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            padding: '28rpx 24rpx',
            boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
          }}
        >
          <Text
            style={{
              fontSize: '28rpx',
              color: TU.text,
              fontWeight: 500,
              display: 'block',
              marginBottom: '20rpx',
            }}
          >
            时长
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16rpx' }}>
            {DURATIONS.map(d => {
              const selected = duration === d;
              return (
                <View
                  key={d}
                  onClick={() => setDuration(d)}
                  style={{
                    width: '148rpx',
                    height: '72rpx',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: `${TU.radiusLg}rpx`,
                    background: selected ? TU.brand : TU.white,
                    border: `2rpx solid ${selected ? TU.brand : TU.border}`,
                  }}
                >
                  <Text
                    style={{
                      fontSize: '28rpx',
                      color: selected ? TU.white : TU.text2,
                      fontWeight: selected ? 600 : 400,
                    }}
                  >
                    {d < 1 ? '30分钟' : `${d}小时`}
                  </Text>
                </View>
              );
            })}
            {/* Custom chip */}
            <View
              style={{
                width: '148rpx',
                height: '72rpx',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: `${TU.radiusLg}rpx`,
                border: `2rpx dashed ${TU.border}`,
                background: TU.white,
              }}
            >
              <Text style={{ fontSize: '26rpx', color: TU.text3 }}>自定义</Text>
            </View>
          </View>
        </View>

        {/* Remarks + Contact */}
        <View
          style={{
            margin: '16rpx 24rpx 0',
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
              padding: '24rpx 28rpx',
              borderBottom: `1rpx solid ${TU.borderLight}`,
            }}
          >
            <Text style={{ fontSize: '28rpx', color: TU.text2 }}>备注</Text>
            <View
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8rpx' }}
            >
              <Text style={{ fontSize: '26rpx', color: TU.text4 }}>请输入备注信息</Text>
              <Text style={{ fontSize: '28rpx', color: TU.text4 }}>›</Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24rpx 28rpx',
            }}
          >
            <Text style={{ fontSize: '28rpx', color: TU.text2 }}>联系方式</Text>
            <View
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8rpx' }}
            >
              <Text style={{ fontSize: '26rpx', color: TU.text4 }}>微信 / 手机号</Text>
              <Text style={{ fontSize: '28rpx', color: TU.text4 }}>›</Text>
            </View>
          </View>
        </View>

        {/* Notice */}
        <View
          style={{
            margin: '16rpx 24rpx 0',
            background: TU.brandTint,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            padding: '20rpx 24rpx',
            display: 'flex',
            flexDirection: 'row',
            gap: '12rpx',
            alignItems: 'flex-start',
          }}
        >
          <Text style={{ fontSize: '26rpx', color: TU.info, flexShrink: 0, marginTop: '2rpx' }}>
            ℹ
          </Text>
          <Text style={{ fontSize: '24rpx', color: TU.brand, lineHeight: '1.6' }}>
            平台不代收款。下单后会生成订单号和俱乐部收款码，转账后上传凭证，管理员确认即自动派单。
          </Text>
        </View>

        <View style={{ height: '140rpx' }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View
        style={{
          background: TU.white,
          borderTop: `1rpx solid ${TU.borderLight}`,
          padding: '16rpx 28rpx',
          paddingBottom: 'env(safe-area-inset-bottom)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>合计 </Text>
          <Text style={{ fontSize: '40rpx', color: TU.error, fontWeight: 600 }}>
            ¥{total % 1 === 0 ? `${total}.00` : total.toFixed(2)}
          </Text>
        </View>
        <Button
          type="primary"
          size="large"
          onClick={() => Taro.navigateTo({ url: '/pages/order/detail/index?orderNo=SX240423001' })}
        >
          确认下单
        </Button>
      </View>
    </View>
  );
}
