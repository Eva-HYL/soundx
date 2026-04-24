import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import { NavBar } from '../../../components/ui/NavBar';
import { Button } from '../../../components/ui/Button';
import { ListItem } from '../../../components/ui/ListItem';
import { TU } from '../../../constants/tokens';
import { GAME_MAP } from '../../../constants/tokens';
import { MOCK_USER_ORDERS } from '../../../mock/data';

type Stage = 'await_upload' | 'uploaded';

/** Simple QR code placeholder built from View grids */
function QRCode() {
  // 7-column finder pattern rows encoded as bit arrays (1=filled, 0=empty)
  const pattern: number[][] = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];
  const cellSize = '18rpx';
  return (
    <View
      style={{
        width: '160rpx',
        height: '160rpx',
        padding: '8rpx',
        border: `2rpx solid ${TU.border}`,
        borderRadius: `${TU.radiusLg}rpx`,
        background: TU.white,
      }}
    >
      {/* Top-left finder */}
      <View style={{ display: 'flex', flexDirection: 'column', gap: '2rpx' }}>
        {pattern.map((row, ri) => (
          <View key={ri} style={{ display: 'flex', flexDirection: 'row', gap: '2rpx' }}>
            {row.map((cell, ci) => (
              <View
                key={ci}
                style={{
                  width: cellSize,
                  height: cellSize,
                  background: cell ? TU.text : 'transparent',
                  borderRadius: '1rpx',
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export default function OrderDetailPage() {
  const params = Taro.getCurrentInstance().router?.params ?? {};
  const orderNo = params.orderNo ?? 'SX2404221222';

  const order = MOCK_USER_ORDERS.find(o => o.orderNo === orderNo) ?? MOCK_USER_ORDERS[0];

  const [stage, setStage] = useState<Stage>('await_upload');
  const [waitSecs, setWaitSecs] = useState(0);

  useEffect(() => {
    if (stage !== 'uploaded') return;
    const timer = setInterval(() => setWaitSecs((s: number) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [stage]);

  const shortNo = orderNo.slice(-4);

  function handleUpload() {
    Taro.chooseImage({
      count: 1,
      success: () => {
        setStage('uploaded');
        setWaitSecs(0);
        Taro.showToast({ title: '凭证已提交', icon: 'success' });
      },
    });
  }

  function handleCancel() {
    Taro.showToast({ title: '订单已取消', icon: 'none' });
    Taro.navigateBack();
  }

  return (
    <View
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: TU.bgPage }}
    >
      {/* Top status banner with gradient bg */}
      <View
        style={{
          background: `linear-gradient(135deg, ${TU.brand} 0%, ${TU.brandDark} 100%)`,
          paddingBottom: '36rpx',
        }}
      >
        <NavBar
          title="订单详情"
          right={<Text style={{ fontSize: '26rpx', color: TU.white }}>客服</Text>}
        />
        <View
          style={{
            padding: '24rpx 32rpx 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14rpx',
          }}
        >
          {/* Status icon */}
          <View
            style={{
              width: '80rpx',
              height: '80rpx',
              borderRadius: '40rpx',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: '40rpx' }}>{stage === 'uploaded' ? '✓' : '🕐'}</Text>
          </View>
          {/* Big title */}
          <Text
            style={{ fontSize: '34rpx', fontWeight: 600, color: TU.white, textAlign: 'center' }}
          >
            {stage === 'await_upload' ? '待上传付款凭证' : '凭证已提交，等待确认'}
          </Text>
          {/* Subtitle */}
          <Text style={{ fontSize: '24rpx', color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
            {stage === 'await_upload'
              ? '请转账至俱乐部收款码后上传凭证'
              : '管理员审核通过后将自动派单'}
          </Text>
          {/* Wait pill */}
          {stage === 'uploaded' && (
            <View
              style={{
                padding: '6rpx 24rpx',
                background: 'rgba(255,255,255,0.18)',
                borderRadius: '24rpx',
                marginTop: '4rpx',
              }}
            >
              <Text style={{ fontSize: '22rpx', color: TU.white }}>已等候 {waitSecs} 秒</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView scrollY style={{ flex: 1, height: 0 }}>
        {/* Receipt / ticket card */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            boxShadow: '0 4rpx 20rpx rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Top: amount + order number */}
          <View
            style={{
              padding: '32rpx 32rpx 24rpx',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12rpx',
            }}
          >
            <Text style={{ fontSize: '22rpx', color: TU.text3 }}>应转金额</Text>
            <Text
              style={{ fontSize: '64rpx', color: TU.error, fontWeight: 700, lineHeight: '1.1' }}
            >
              ¥{order.total}.00
            </Text>
            <View
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12rpx' }}
            >
              <Text style={{ fontSize: '22rpx', color: TU.text3 }}>订单号 {orderNo}</Text>
              <View
                style={{
                  padding: '2rpx 12rpx',
                  background: TU.brandTint,
                  borderRadius: `${TU.radius}rpx`,
                }}
              >
                <Text style={{ fontSize: '20rpx', color: TU.brand }}>复制</Text>
              </View>
            </View>
          </View>

          {/* Ticket tear divider */}
          <View style={{ position: 'relative', height: '32rpx', overflow: 'visible' }}>
            {/* Dashed line */}
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '32rpx',
                right: '32rpx',
                borderTop: `2rpx dashed ${TU.borderLight}`,
              }}
            />
            {/* Left cutout */}
            <View
              style={{
                position: 'absolute',
                left: '-16rpx',
                top: '50%',
                width: '32rpx',
                height: '32rpx',
                borderRadius: '16rpx',
                background: TU.bgPage,
                transform: 'translateY(-50%)',
              }}
            />
            {/* Right cutout */}
            <View
              style={{
                position: 'absolute',
                right: '-16rpx',
                top: '50%',
                width: '32rpx',
                height: '32rpx',
                borderRadius: '16rpx',
                background: TU.bgPage,
                transform: 'translateY(-50%)',
              }}
            />
          </View>

          {/* Bottom: QR + instructions */}
          <View
            style={{
              padding: '24rpx 32rpx 36rpx',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16rpx',
            }}
          >
            <QRCode />
            <Text style={{ fontSize: '26rpx', fontWeight: 600, color: TU.text }}>
              星辰电竞俱乐部
            </Text>
            <Text
              style={{ fontSize: '22rpx', color: TU.text3, textAlign: 'center', lineHeight: '1.6' }}
            >
              长按识别二维码转账{'\n'}备注：订单 {shortNo}
            </Text>
          </View>
        </View>

        {/* Order info */}
        <View
          style={{
            margin: '16rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            overflow: 'hidden',
            boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
          }}
        >
          <ListItem title="陪玩" extraText={order.pal} arrow="none" />
          <ListItem
            title="游戏 · 服务"
            extraText={`${GAME_MAP[order.game] ?? order.game} · ${order.svc}`}
            arrow="none"
          />
          <ListItem
            title="时长 / 单价"
            extraText={`${order.dur}h / ¥${order.total / order.dur}/h`}
            arrow="none"
          />
          <ListItem title="下单时间" extraText="2024-04-22 14:02" arrow="none" last />
        </View>

        {/* Upload voucher */}
        <View
          style={{
            margin: '16rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg * 2}rpx`,
            padding: '28rpx 28rpx',
            boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '6rpx',
              marginBottom: '20rpx',
            }}
          >
            <Text style={{ fontSize: '28rpx', fontWeight: 500, color: TU.text }}>上传付款凭证</Text>
            <Text style={{ fontSize: '24rpx', color: TU.error }}>*</Text>
          </View>

          {stage === 'uploaded' ? (
            /* Uploaded placeholder */
            <View
              style={{
                width: '160rpx',
                height: '160rpx',
                borderRadius: `${TU.radiusLg * 2}rpx`,
                background: TU.successTint,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8rpx',
              }}
            >
              <Text style={{ fontSize: '48rpx' }}>✓</Text>
              <Text style={{ fontSize: '20rpx', color: TU.success }}>已上传</Text>
            </View>
          ) : (
            /* Add box */
            <View
              onClick={handleUpload}
              style={{
                width: '160rpx',
                height: '160rpx',
                borderRadius: `${TU.radiusLg * 2}rpx`,
                border: `2rpx dashed ${TU.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8rpx',
              }}
            >
              <Text style={{ fontSize: '52rpx', color: TU.text4, lineHeight: '1' }}>+</Text>
              <Text style={{ fontSize: '22rpx', color: TU.text4 }}>添加图片</Text>
            </View>
          )}
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
          gap: '20rpx',
        }}
      >
        {stage === 'await_upload' ? (
          <>
            <View style={{ flex: 1 }}>
              <Button type="default" size="large" full onClick={handleCancel}>
                取消
              </Button>
            </View>
            <View style={{ flex: 2 }}>
              <Button type="primary" size="large" full onClick={handleUpload}>
                我已转账 · 上传凭证
              </Button>
            </View>
          </>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <Button type="default" size="large" full onClick={handleUpload}>
                重新上传
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                type="secondary"
                size="large"
                full
                onClick={() => Taro.showToast({ title: '正在接入客服…', icon: 'none' })}
              >
                联系客服
              </Button>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
