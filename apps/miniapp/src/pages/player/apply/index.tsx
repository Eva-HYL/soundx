import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import { TU } from '../../../constants/tokens';
import { NavBar } from '../../../components/ui/NavBar';
import { Button } from '../../../components/ui/Button';
import { Tag } from '../../../components/ui/Tag';

type StepStatus = 'done' | 'current' | 'future';

const STEPS: { label: string; status: StepStatus }[] = [
  { label: '基本信息', status: 'done' },
  { label: '游戏资料', status: 'done' },
  { label: '实名认证', status: 'current' },
  { label: '审核结果', status: 'future' },
];

function StepIndicator() {
  return (
    <View
      style={{
        background: TU.white,
        padding: '28rpx 24rpx',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {STEPS.map((step, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Connector line */}
          {i < STEPS.length - 1 && (
            <View
              style={{
                position: 'absolute',
                top: '22rpx',
                left: '50%',
                width: '100%',
                height: '2rpx',
                background: step.status === 'future' ? TU.border : TU.brand,
                zIndex: 0,
              }}
            />
          )}
          {/* Step circle */}
          <View
            style={{
              width: '44rpx',
              height: '44rpx',
              borderRadius: '50%',
              border: `2rpx solid ${step.status === 'future' ? TU.border : TU.brand}`,
              background: step.status === 'done' ? TU.brand : TU.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              position: 'relative',
            }}
          >
            {step.status === 'done' && (
              <Text style={{ fontSize: '24rpx', color: '#fff', fontWeight: 700 }}>✓</Text>
            )}
            {step.status === 'current' && (
              <View
                style={{
                  width: '20rpx',
                  height: '20rpx',
                  borderRadius: '50%',
                  background: TU.brand,
                }}
              />
            )}
            {step.status === 'future' && (
              <Text style={{ fontSize: '22rpx', color: TU.text4 }}>{i + 1}</Text>
            )}
          </View>
          <Text
            style={{
              fontSize: '22rpx',
              color: step.status === 'future' ? TU.text3 : TU.brand,
              marginTop: '8rpx',
              fontWeight: step.status === 'current' ? 600 : 400,
            }}
          >
            {step.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function SectionCard({
  step,
  title,
  onEdit,
  children,
}: {
  step: number;
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        margin: '20rpx 24rpx 0',
        background: TU.white,
        borderRadius: `${TU.radiusLg}rpx`,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '24rpx 28rpx',
          borderBottom: `1rpx solid ${TU.borderLight}`,
        }}
      >
        <View
          style={{
            width: '40rpx',
            height: '40rpx',
            borderRadius: '50%',
            background: TU.brand,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16rpx',
            flexShrink: 0,
          }}
        >
          <Text style={{ fontSize: '22rpx', color: '#fff', fontWeight: 700 }}>
            {step === 3 ? '③' : step === 2 ? '②' : '①'}
          </Text>
        </View>
        <Text style={{ flex: 1, fontSize: '30rpx', color: TU.text, fontWeight: 600 }}>{title}</Text>
        {onEdit && (
          <Text style={{ fontSize: '26rpx', color: TU.brand }} onClick={onEdit}>
            修改
          </Text>
        )}
      </View>
      <View style={{ padding: '24rpx 28rpx' }}>{children}</View>
    </View>
  );
}

function FormRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: '16rpx',
        paddingBottom: '16rpx',
        borderBottom: `1rpx solid ${TU.borderLight}`,
      }}
    >
      <Text style={{ width: '160rpx', fontSize: '28rpx', color: TU.text3, flexShrink: 0 }}>
        {label}
      </Text>
      <Text style={{ flex: 1, fontSize: '28rpx', color: TU.text }}>{value}</Text>
      {badge && (
        <View style={{ background: TU.successTint, borderRadius: '4rpx', padding: '2rpx 12rpx' }}>
          <Text style={{ fontSize: '22rpx', color: TU.success }}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

function IdPhotoBox({ label }: { label: string }) {
  return (
    <View
      style={{
        flex: 1,
        border: `2rpx dashed ${TU.border}`,
        borderRadius: `${TU.radiusLg}rpx`,
        aspectRatio: '1.6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12rpx',
        background: TU.bgPage,
      }}
    >
      <Text style={{ fontSize: '48rpx', color: TU.text4 }}>+</Text>
      <Text style={{ fontSize: '24rpx', color: TU.text3, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}

export default function ApplyPage() {
  const [agreed, setAgreed] = useState(false);

  return (
    <View
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: TU.bgPage }}
    >
      <NavBar title="成为陪玩" />

      <ScrollView scrollY style={{ flex: 1, height: 0 }}>
        <StepIndicator />

        {/* Step 1 summary */}
        <SectionCard step={1} title="基本信息" onEdit={() => {}}>
          <Text style={{ fontSize: '28rpx', color: TU.text2, lineHeight: '1.8' }}>
            昵称：阿杰 · 男 · 22 岁
          </Text>
          <Text
            style={{ fontSize: '28rpx', color: TU.text2, lineHeight: '1.8', marginTop: '6rpx' }}
          >
            城市：杭州 · 在校学生 / 晚间可接单
          </Text>
        </SectionCard>

        {/* Step 2 summary */}
        <SectionCard step={2} title="游戏资料" onEdit={() => {}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '12rpx',
              marginBottom: '16rpx',
            }}
          >
            <Tag type="tint">王者荣耀 · 王者</Tag>
            <Tag type="tint">英雄联盟 · 大师</Tag>
          </View>
          <Text style={{ fontSize: '24rpx', color: TU.text3 }}>已上传段位截图 2 张</Text>
        </SectionCard>

        {/* Step 3 current — real name auth form */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            background: TU.white,
            borderRadius: `${TU.radiusLg}rpx`,
            overflow: 'hidden',
            border: `2rpx solid ${TU.brand}`,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '24rpx 28rpx',
              background: TU.brandTint,
              borderBottom: `1rpx solid ${TU.border}`,
            }}
          >
            <View
              style={{
                width: '40rpx',
                height: '40rpx',
                borderRadius: '50%',
                background: TU.brand,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16rpx',
                flexShrink: 0,
              }}
            >
              <Text style={{ fontSize: '22rpx', color: '#fff', fontWeight: 700 }}>③</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '30rpx', color: TU.text, fontWeight: 600 }}>实名认证</Text>
              <Text style={{ fontSize: '24rpx', color: TU.text3, marginTop: '4rpx' }}>
                信息仅用于身份核验，安全加密存储
              </Text>
            </View>
          </View>
          <View style={{ padding: '24rpx 28rpx' }}>
            <FormRow label="真实姓名" value="请输入" />
            <FormRow label="身份证号" value="请输入" />
            <FormRow label="手机号" value="138****8888" badge="已认证" />

            {/* ID photo upload */}
            <View style={{ marginTop: '24rpx' }}>
              <Text style={{ fontSize: '28rpx', color: TU.text2, marginBottom: '16rpx' }}>
                上传身份证照片
              </Text>
              <View style={{ display: 'flex', flexDirection: 'row', gap: '20rpx' }}>
                <IdPhotoBox label={'人像面'} />
                <IdPhotoBox label={'国徽面'} />
              </View>
              <Text
                style={{
                  fontSize: '22rpx',
                  color: TU.text3,
                  marginTop: '12rpx',
                  textAlign: 'center',
                }}
              >
                请确保照片清晰、信息完整
              </Text>
            </View>
          </View>
        </View>

        {/* Agreement */}
        <View
          style={{
            margin: '20rpx 24rpx 0',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16rpx',
          }}
        >
          <View
            style={{
              width: '40rpx',
              height: '40rpx',
              borderRadius: '6rpx',
              border: `2rpx solid ${agreed ? TU.brand : TU.border}`,
              background: agreed ? TU.brand : TU.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            onClick={() => setAgreed((a: boolean) => !a)}
          >
            {agreed && <Text style={{ fontSize: '24rpx', color: '#fff' }}>✓</Text>}
          </View>
          <Text style={{ fontSize: '26rpx', color: TU.text2, flex: 1, lineHeight: '1.6' }}>
            我已阅读并同意
            <Text style={{ color: TU.brand }}>《陪玩入驻协议》</Text>
            <Text style={{ color: TU.brand }}>《隐私政策》</Text>
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
          gap: '20rpx',
        }}
      >
        <Button type="secondary" size="large" onClick={() => Taro.navigateBack()}>
          上一步
        </Button>
        <View style={{ flex: 1 }}>
          <Button
            type="primary"
            size="large"
            full
            circle
            disabled={!agreed}
            onClick={() => Taro.showToast({ title: '提交成功，等待审核', icon: 'success' })}
          >
            提交审核
          </Button>
        </View>
      </View>
    </View>
  );
}
