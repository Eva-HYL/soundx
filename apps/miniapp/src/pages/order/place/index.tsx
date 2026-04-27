import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemo, useState } from 'react';
import { NavBar } from '../../../components/ui/NavBar';
import { Tag } from '../../../components/ui/Tag';
import { Button } from '../../../components/ui/Button';
import { TU } from '../../../constants/tokens';
import { MOCK_SERVICES, MOCK_PALS } from '../../../mock/data';
import { ApiError, createOrder } from '../../../services';

const DURATIONS = [0.5, 1, 2, 3, 4, 5];

export default function PlaceOrderPage() {
  const params = Taro.getCurrentInstance().router?.params ?? {};

  // URL 参数（由 home 页带来）。若没有（例如用户直接进入此页测试），fallback 到 mock
  const clubId = params.clubId;
  const palId = params.palId;
  const palName = params.palName;
  const serviceTypeParam = params.serviceType;
  const pricePerHourParam = params.pricePerHour;

  // 仅用于展示："如果有真实参数就用真实；否则用 mock 兜底避免崩页"
  const fallbackPal = MOCK_PALS.find(p => String(p.id) === palId) ?? MOCK_PALS[0];
  const fallbackService = MOCK_SERVICES[0];
  const display = useMemo(() => {
    return {
      palName: palName || fallbackPal.name,
      palTier: fallbackPal.tier,
      palOrders: fallbackPal.orders,
      serviceName: serviceTypeParam || fallbackService.name,
      pricePerHour: pricePerHourParam
        ? parseFloat(pricePerHourParam)
        : fallbackService.price,
    };
  }, [palName, serviceTypeParam, pricePerHourParam, fallbackPal, fallbackService]);

  const [duration, setDuration] = useState<number>(2);
  const [submitting, setSubmitting] = useState(false);

  const total = display.pricePerHour * duration;

  async function handleSubmit() {
    if (!clubId || !palId || !serviceTypeParam || !pricePerHourParam) {
      Taro.showToast({ title: '下单信息不完整', icon: 'none' });
      return;
    }
    setSubmitting(true);
    try {
      const created = await createOrder({
        clubId,
        playerId: palId,
        orderType: 'designated',
        dispatchMode: 'designated',
        serviceType: serviceTypeParam,
        pricePerHour: pricePerHourParam,
        hours: duration,
      });
      Taro.showToast({ title: '下单成功', icon: 'success', duration: 1000 });
      setTimeout(() => {
        Taro.redirectTo({ url: `/pages/order/detail/index?orderId=${created.id}` });
      }, 800);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : '下单失败';
      Taro.showToast({ title: msg, icon: 'none' });
    } finally {
      setSubmitting(false);
    }
  }

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
              {display.palName[0] ?? 'P'}
            </Text>
          </View>

          <View style={{ flex: 1, minWidth: 0 }}>
            <View
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12rpx' }}
            >
              <Text style={{ fontSize: '30rpx', fontWeight: 600, color: TU.text }}>
                {display.palName}
              </Text>
              <Tag type="tint" size="small">
                认证陪玩
              </Tag>
            </View>
            <Text
              style={{ fontSize: '22rpx', color: TU.text3, marginTop: '6rpx', display: 'block' }}
            >
              {display.palTier} · 接单 {display.palOrders} · 好评率 99%
            </Text>
          </View>

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
              {display.serviceName}
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
              ¥{display.pricePerHour.toFixed(2)}
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
            平台不代收款。下单后生成订单号，转账后上传凭证，管理员确认即自动派单。
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
            ¥{total.toFixed(2)}
          </Text>
        </View>
        <Button type="primary" size="large" onClick={handleSubmit} disabled={submitting}>
          {submitting ? '提交中…' : '确认下单'}
        </Button>
      </View>
    </View>
  );
}
