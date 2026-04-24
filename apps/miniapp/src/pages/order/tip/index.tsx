import { View, Text, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useState } from 'react';
import { TU } from '../../../constants/tokens';
import { NavBar } from '../../../components/ui/NavBar';
import { Button } from '../../../components/ui/Button';

const PRESET_AMOUNTS = [
  { label: '¥6.6', sub: '鼓励', value: 6.6, hot: false },
  { label: '¥9.9', sub: '支持🔥', value: 9.9, hot: true },
  { label: '¥20', sub: '打赏', value: 20, hot: false },
  { label: '¥50', sub: '感谢🔥', value: 50, hot: true },
  { label: '¥99', sub: '厉害了', value: 99, hot: false },
  { label: '¥200', sub: '大佬', value: 200, hot: false },
];

const QUICK_PHRASES = ['声音好听！', '很耐心', '技术牛', '下次还来', '带飞感谢'];

const MAX_MSG = 100;

export default function TipPage() {
  const router = useRouter();
  const orderNo = router.params.orderNo ?? 'SX2404221185';

  const [selectedPreset, setSelectedPreset] = useState<number | null>(1);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');

  const displayAmount = customAmount
    ? parseFloat(customAmount) || 0
    : selectedPreset !== null
      ? PRESET_AMOUNTS[selectedPreset].value
      : 0;

  const handlePhrase = (phrase: string) => {
    const next = message ? `${message} ${phrase}` : phrase;
    if (next.length <= MAX_MSG) setMessage(next);
  };

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: TU.bgPage }}
    >
      <NavBar title="打赏陪玩" />

      <ScrollView scrollY style={{ flex: 1, height: 0 }}>
        {/* Pal info card */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            padding: '28rpx',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '20rpx',
          }}
        >
          <View
            style={{
              width: '96rpx',
              height: '96rpx',
              borderRadius: `${TU.radiusLg}rpx`,
              background: TU.brandTint,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text style={{ fontSize: '40rpx', color: TU.brand, fontWeight: 700 }}>带</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: '32rpx', color: TU.text, fontWeight: 600 }}>带飞专业户</Text>
            <Text style={{ fontSize: '24rpx', color: TU.text3, marginTop: '6rpx' }}>
              {orderNo} · 巅峰赛陪练
            </Text>
            <View
              style={{
                marginTop: '10rpx',
                display: 'inline-flex',
                background: TU.successTint,
                borderRadius: '4rpx',
                padding: '4rpx 16rpx',
              }}
            >
              <Text style={{ fontSize: '22rpx', color: TU.success }}>服务已完成</Text>
            </View>
          </View>
        </View>

        {/* Amount selector card */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            padding: '28rpx',
          }}
        >
          <Text
            style={{ fontSize: '30rpx', color: TU.text, fontWeight: 600, marginBottom: '24rpx' }}
          >
            选择打赏金额
          </Text>
          {/* 3×2 grid */}
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16rpx' }}>
            {PRESET_AMOUNTS.map((item, i) => {
              const isSelected = selectedPreset === i && !customAmount;
              return (
                <View
                  key={i}
                  style={{
                    width: 'calc(33.33% - 12rpx)',
                    position: 'relative',
                    border: `2rpx solid ${isSelected ? TU.brand : TU.border}`,
                    borderRadius: `${TU.radius * 2}rpx`,
                    background: isSelected ? TU.brandTint : TU.white,
                    padding: '20rpx 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4rpx',
                  }}
                  onClick={() => {
                    setSelectedPreset(i);
                    setCustomAmount('');
                  }}
                >
                  {item.hot && (
                    <View
                      style={{
                        position: 'absolute',
                        top: '-14rpx',
                        right: '-10rpx',
                        background: TU.error,
                        borderRadius: '999rpx',
                        padding: '2rpx 10rpx',
                      }}
                    >
                      <Text style={{ fontSize: '18rpx', color: '#fff' }}>热门</Text>
                    </View>
                  )}
                  <Text
                    style={{
                      fontSize: '32rpx',
                      color: isSelected ? TU.brand : TU.text,
                      fontWeight: 700,
                    }}
                  >
                    {item.label}
                  </Text>
                  <Text style={{ fontSize: '22rpx', color: isSelected ? TU.brand : TU.text3 }}>
                    {item.sub}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Custom input */}
          <View
            style={{
              marginTop: '20rpx',
              border: `2rpx solid ${customAmount ? TU.brand : TU.border}`,
              borderRadius: `${TU.radius * 2}rpx`,
              padding: '18rpx 24rpx',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8rpx',
              background: customAmount ? TU.brandTint : TU.white,
            }}
          >
            <Text style={{ fontSize: '28rpx', color: TU.text2 }}>自定义 ¥</Text>
            <Input
              type="digit"
              value={customAmount}
              placeholder="输入金额"
              placeholderStyle={`color: ${TU.text4};`}
              style={{ flex: 1, fontSize: '28rpx', color: TU.text }}
              onInput={(e: { detail: { value: string } }) => {
                setCustomAmount(e.detail.value);
                setSelectedPreset(null);
              }}
            />
          </View>
        </View>

        {/* 留言 card */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            padding: '28rpx',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: '16rpx',
            }}
          >
            <Text style={{ flex: 1, fontSize: '30rpx', color: TU.text, fontWeight: 600 }}>
              留言
            </Text>
            <Text style={{ fontSize: '24rpx', color: TU.text3 }}>选填 · 陪玩可见</Text>
            <Text style={{ fontSize: '24rpx', color: TU.text3, marginLeft: '12rpx' }}>
              {message.length}/{MAX_MSG}
            </Text>
          </View>
          <Textarea
            value={message}
            placeholder="说点什么吧…"
            placeholderStyle={`color: ${TU.text4};`}
            maxlength={MAX_MSG}
            style={{
              width: '100%',
              minHeight: '140rpx',
              fontSize: '28rpx',
              color: TU.text,
              background: TU.bgPage,
              borderRadius: `${TU.radius}rpx`,
              padding: '16rpx',
              boxSizing: 'border-box',
            }}
            onInput={(e: { detail: { value: string } }) => setMessage(e.detail.value)}
          />
          {/* Quick phrase chips */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '12rpx',
              marginTop: '16rpx',
            }}
          >
            {QUICK_PHRASES.map(p => (
              <View
                key={p}
                style={{
                  border: `1rpx solid ${TU.border}`,
                  borderRadius: '999rpx',
                  padding: '8rpx 24rpx',
                  background: TU.white,
                }}
                onClick={() => handlePhrase(p)}
              >
                <Text style={{ fontSize: '24rpx', color: TU.text2 }}>{p}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Note */}
        <View style={{ margin: '20rpx 24rpx', padding: '0 4rpx' }}>
          <Text style={{ fontSize: '24rpx', color: TU.text3, lineHeight: '1.8' }}>
            · 打赏金额全额给陪玩，平台不抽成{'\n'}· 确认付款后陪玩会收到通知
          </Text>
        </View>

        <View style={{ height: '160rpx' }} />
      </ScrollView>

      {/* Bottom bar */}
      <View
        style={{
          flexShrink: 0,
          background: TU.white,
          borderTop: `1rpx solid ${TU.borderLight}`,
          padding: '16rpx 24rpx 48rpx',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>打赏金额</Text>
          <Text style={{ fontSize: '36rpx', color: TU.error, fontWeight: 700 }}>
            ¥{displayAmount.toFixed(2)}
          </Text>
        </View>
        <Button
          type="primary"
          size="large"
          circle
          onClick={() => Taro.showToast({ title: '打赏成功！', icon: 'success' })}
        >
          确认打赏
        </Button>
      </View>
    </View>
  );
}
