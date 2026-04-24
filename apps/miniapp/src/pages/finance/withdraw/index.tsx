import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { TU } from '../../../constants/tokens';
import { NavBar } from '../../../components/ui/NavBar';
import { Button } from '../../../components/ui/Button';

const PRESETS = [
  { label: '¥100', value: '100' },
  { label: '¥200', value: '200' },
  { label: '¥500', value: '500' },
  { label: '¥1000', value: '1000' },
  { label: '¥1500', value: '1500' },
  { label: '全部提', value: '1240' },
];

const TOTAL_BALANCE = 1240;
const TOTAL_EARNED = 12480;
const TOTAL_WITHDRAWN = 11240;

export default function WithdrawPage() {
  const [amount, setAmount] = useState('500');
  const [selectedPreset, setSelectedPreset] = useState(2);

  const handlePreset = (value: string, index: number) => {
    setAmount(value);
    setSelectedPreset(index);
  };

  const handleInput = (val: string) => {
    setAmount(val);
    setSelectedPreset(-1);
  };

  const displayAmount = parseFloat(amount) || 0;

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: TU.bgPage }}
    >
      <NavBar
        title="申请提现"
        right={
          <Text
            style={{ fontSize: '28rpx', color: TU.brand }}
            onClick={() => Taro.navigateTo({ url: '/pages/finance/income/index' })}
          >
            记录
          </Text>
        }
      />

      <ScrollView scrollY style={{ flex: 1, height: 0 }}>
        {/* Balance hero card */}
        <View style={{ margin: '20rpx 24rpx 0', position: 'relative', overflow: 'hidden' }}>
          <View
            style={{
              background: `linear-gradient(135deg, ${TU.brand} 0%, ${TU.brandDark} 100%)`,
              borderRadius: `${TU.radiusLg}rpx`,
              padding: '40rpx 36rpx',
            }}
          >
            {/* Decorative circle */}
            <View
              style={{
                position: 'absolute',
                top: '-60rpx',
                right: '-60rpx',
                width: '240rpx',
                height: '240rpx',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: '-80rpx',
                right: '40rpx',
                width: '180rpx',
                height: '180rpx',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
              }}
            />
            <Text style={{ fontSize: '26rpx', color: 'rgba(255,255,255,0.8)' }}>
              当前可提现余额
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline',
                gap: '8rpx',
                marginTop: '12rpx',
              }}
            >
              <Text style={{ fontSize: '24rpx', color: '#fff', fontWeight: 500 }}>¥</Text>
              <Text style={{ fontSize: '72rpx', color: '#fff', fontWeight: 700, lineHeight: '1' }}>
                {TOTAL_BALANCE.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <Text style={{ fontSize: '24rpx', color: 'rgba(255,255,255,0.7)', marginTop: '16rpx' }}>
              累计收入 ¥{TOTAL_EARNED.toLocaleString()} · 已提现 ¥{TOTAL_WITHDRAWN.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Withdraw amount card */}
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
              marginBottom: '24rpx',
            }}
          >
            <Text style={{ flex: 1, fontSize: '30rpx', color: TU.text, fontWeight: 600 }}>
              提现金额
            </Text>
            <Text style={{ fontSize: '24rpx', color: TU.text3 }}>单笔 ≥ ¥10</Text>
          </View>

          {/* Large amount input */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              borderBottom: `2rpx solid ${TU.brand}`,
              paddingBottom: '16rpx',
              marginBottom: '24rpx',
            }}
          >
            <Text
              style={{ fontSize: '48rpx', color: TU.text2, marginRight: '8rpx', fontWeight: 300 }}
            >
              ¥
            </Text>
            <Input
              type="digit"
              value={amount}
              placeholder="0.00"
              placeholderStyle={`color: ${TU.text4}; font-size: 56rpx;`}
              style={{ flex: 1, fontSize: '56rpx', color: TU.text, fontWeight: 700 }}
              onInput={(e: { detail: { value: string } }) => handleInput(e.detail.value)}
            />
            <Text
              style={{ fontSize: '26rpx', color: TU.brand, marginLeft: '16rpx' }}
              onClick={() => handleInput(String(TOTAL_BALANCE))}
            >
              全部提现
            </Text>
          </View>

          {/* Preset grid */}
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16rpx' }}>
            {PRESETS.map((p, i) => {
              const isSelected = selectedPreset === i;
              return (
                <View
                  key={p.value}
                  style={{
                    width: 'calc(33.33% - 12rpx)',
                    border: `2rpx solid ${isSelected ? TU.brand : TU.border}`,
                    borderRadius: `${TU.radius * 2}rpx`,
                    background: isSelected ? TU.brandTint : TU.white,
                    padding: '18rpx 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => handlePreset(p.value, i)}
                >
                  <Text
                    style={{
                      fontSize: '28rpx',
                      color: isSelected ? TU.brand : TU.text,
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {p.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 到账方式 card */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            overflow: 'hidden',
          }}
        >
          <View style={{ padding: '24rpx 28rpx', borderBottom: `1rpx solid ${TU.borderLight}` }}>
            <Text style={{ fontSize: '30rpx', color: TU.text, fontWeight: 600 }}>到账方式</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '24rpx 28rpx',
            }}
          >
            <View
              style={{
                width: '72rpx',
                height: '72rpx',
                borderRadius: '50%',
                background: '#07C160',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20rpx',
                flexShrink: 0,
              }}
            >
              <Text style={{ fontSize: '32rpx', color: '#fff', fontWeight: 700 }}>微</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '30rpx', color: TU.text, fontWeight: 500 }}>
                微信 · bf_zyh2024
              </Text>
              <Text style={{ fontSize: '24rpx', color: TU.text3, marginTop: '4rpx' }}>
                实名：张伟 · 默认
              </Text>
            </View>
            <View
              style={{
                background: TU.successTint,
                borderRadius: '4rpx',
                padding: '4rpx 16rpx',
                marginRight: '12rpx',
              }}
            >
              <Text style={{ fontSize: '22rpx', color: TU.success }}>已认证</Text>
            </View>
            <Text style={{ color: TU.text4, fontSize: '28rpx' }}>›</Text>
          </View>
        </View>

        {/* Tips */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            padding: '24rpx 28rpx',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
          }}
        >
          <Text
            style={{ fontSize: '26rpx', color: TU.text3, fontWeight: 600, marginBottom: '12rpx' }}
          >
            温馨提示
          </Text>
          {[
            '提现金额将在 1-3 个工作日内到账',
            '单笔提现金额不低于 ¥10',
            '每日最多可申请 3 次提现',
            '如有问题请联系在线客服',
          ].map((tip, i) => (
            <Text
              key={i}
              style={{ fontSize: '24rpx', color: TU.text3, lineHeight: '1.8', display: 'block' }}
            >
              · {tip}
            </Text>
          ))}
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
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>本次到账</Text>
          <Text style={{ fontSize: '36rpx', color: TU.text, fontWeight: 700 }}>
            ¥{displayAmount.toFixed(2)}
          </Text>
        </View>
        <Button
          type="primary"
          size="large"
          circle
          disabled={displayAmount < 10 || displayAmount > TOTAL_BALANCE}
          onClick={() => Taro.showToast({ title: '申请已提交', icon: 'success' })}
        >
          提交申请
        </Button>
      </View>
    </View>
  );
}
