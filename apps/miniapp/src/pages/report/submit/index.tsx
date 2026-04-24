import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useState } from 'react';
import { NavBar } from '../../../components/ui/NavBar';
import { Button } from '../../../components/ui/Button';
import { Tag } from '../../../components/ui/Tag';
import { TU } from '../../../constants/tokens';

// Route params: orderNo
// The order referenced by MOCK_PAL_ORDERS pending_report entry
const MOCK_ORDER = {
  orderNo: 'SX2404221185',
  user: '奶茶要七分糖',
  game: 'lol',
  gameName: '英雄联盟',
  svc: '巅峰赛陪练',
  dur: 3,
  total: 165,
  startTime: '20:15',
  actualDur: '02:18:42',
  durNote: '20:15 开始 · 订单 3 小时，实际提前 42 分钟',
};

const MAX_CONTENT = 500;

const PLACEHOLDER_CONTENT = `请描述服务内容，例如：\n- 完成了 3 局排位，胜 2 负 1\n- 帮助老板从铂金 IV 晋级至铂金 III\n- 重点针对打野 Gank 节奏进行了讲解\n- 老板操作积极，执行力强`;

export default function SubmitReportPage() {
  const router = useRouter();
  const orderNo = router.params?.orderNo ?? MOCK_ORDER.orderNo;

  const [content, _setContent] = useState('');
  const [duration, _setDuration] = useState(MOCK_ORDER.actualDur);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // Fake screenshot placeholders
  const fakeScreenshots = ['#4A4A6A', '#3D5A80'];

  function handleSaveDraft() {
    setSavingDraft(true);
    setTimeout(() => {
      setSavingDraft(false);
      Taro.showToast({ title: '草稿已保存', icon: 'success' });
    }, 800);
  }

  function handleSubmit() {
    if (!content.trim()) {
      Taro.showToast({ title: '请填写服务内容', icon: 'none' });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Taro.showToast({ title: '提交成功，等待审核', icon: 'success' });
      setTimeout(() => Taro.navigateBack(), 1500);
    }, 1000);
  }

  function handleAddScreenshot() {
    Taro.showToast({ title: '选择截图功能开发中', icon: 'none' });
  }

  function handleModifyDuration() {
    Taro.showToast({ title: '手动修改时长功能开发中', icon: 'none' });
  }

  return (
    <View
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: TU.bgPage }}
    >
      <NavBar title="提交战绩" />

      <ScrollView scrollY style={{ flex: 1, height: 0 }}>
        <View
          style={{
            padding: '20rpx 24rpx 140rpx',
            display: 'flex',
            flexDirection: 'column',
            gap: '16rpx',
          }}
        >
          {/* 1. 订单概览卡片 */}
          <View
            style={{
              background: TU.white,
              borderRadius: `${TU.radiusLg * 2}rpx`,
              overflow: 'hidden',
              boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
            }}
          >
            {/* 卡头 */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20rpx 24rpx 16rpx',
                borderBottom: `1rpx solid ${TU.borderLight}`,
              }}
            >
              <Text style={{ fontSize: '26rpx', fontWeight: 500, color: TU.text2 }}>
                {MOCK_ORDER.gameName}
              </Text>
              <Text style={{ fontSize: '22rpx', color: TU.text3 }}>{orderNo.slice(-6)}</Text>
            </View>
            {/* 卡体 */}
            <View style={{ padding: '20rpx 24rpx' }}>
              <Text
                style={{ fontSize: '30rpx', fontWeight: 600, color: TU.text, display: 'block' }}
              >
                {MOCK_ORDER.svc}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '10rpx',
                }}
              >
                <Text style={{ fontSize: '22rpx', color: TU.text3 }}>
                  老板 {MOCK_ORDER.user} · {MOCK_ORDER.dur} 小时
                </Text>
                <Text style={{ fontSize: '32rpx', fontWeight: 600, color: TU.error }}>
                  ¥{MOCK_ORDER.total}
                </Text>
              </View>
            </View>
          </View>

          {/* 2. 服务时长卡片 */}
          <View
            style={{
              background: TU.white,
              borderRadius: `${TU.radiusLg * 2}rpx`,
              padding: '24rpx',
              boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
            }}
          >
            {/* 标题行 */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '12rpx',
                marginBottom: '20rpx',
              }}
            >
              <Text style={{ fontSize: '28rpx', fontWeight: 600, color: TU.text }}>服务时长</Text>
              <Tag type="tint" size="small">
                自动计时
              </Tag>
            </View>

            {/* 大计时器 */}
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12rpx 0',
              }}
            >
              <Text
                style={{
                  fontSize: '80rpx',
                  fontWeight: 300,
                  color: TU.text,
                  letterSpacing: '4rpx',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {duration}
              </Text>
            </View>

            {/* 副文本 */}
            <Text
              style={{
                fontSize: '22rpx',
                color: TU.text3,
                display: 'block',
                textAlign: 'center',
                marginBottom: '24rpx',
              }}
            >
              {MOCK_ORDER.durNote}
            </Text>

            {/* 操作按钮 */}
            <View style={{ display: 'flex', flexDirection: 'row', gap: '16rpx' }}>
              <Button full onClick={handleModifyDuration}>
                手动修改
              </Button>
              <Button
                type="default"
                full
                onClick={() => Taro.showToast({ title: '已使用此时长', icon: 'success' })}
              >
                使用此时长
              </Button>
            </View>
          </View>

          {/* 3. 服务内容卡片 */}
          <View
            style={{
              background: TU.white,
              borderRadius: `${TU.radiusLg * 2}rpx`,
              padding: '24rpx',
              boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16rpx',
              }}
            >
              <Text style={{ fontSize: '28rpx', fontWeight: 600, color: TU.text }}>
                服务内容
                <Text style={{ color: TU.error }}>*</Text>
              </Text>
              <Text
                style={{
                  fontSize: '22rpx',
                  color: content.length > MAX_CONTENT * 0.8 ? TU.warning : TU.text3,
                }}
              >
                {content.length}/{MAX_CONTENT}
              </Text>
            </View>
            {/* 用 View 模拟 textarea，因为真实项目会接 Taro.Textarea */}
            <View
              style={{
                minHeight: '240rpx',
                background: TU.bgPage,
                borderRadius: `${TU.radius}rpx`,
                padding: '20rpx',
                position: 'relative',
              }}
              onClick={() => Taro.showToast({ title: '请输入服务内容', icon: 'none' })}
            >
              {content ? (
                <Text style={{ fontSize: '26rpx', color: TU.text, lineHeight: '1.7' }}>
                  {content}
                </Text>
              ) : (
                <Text style={{ fontSize: '26rpx', color: TU.text3, lineHeight: '1.7' }}>
                  {PLACEHOLDER_CONTENT}
                </Text>
              )}
            </View>
          </View>

          {/* 4. 战绩截图卡片 */}
          <View
            style={{
              background: TU.white,
              borderRadius: `${TU.radiusLg * 2}rpx`,
              padding: '24rpx',
              boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '10rpx',
                marginBottom: '20rpx',
              }}
            >
              <Text style={{ fontSize: '28rpx', fontWeight: 600, color: TU.text }}>战绩截图</Text>
              <Text style={{ fontSize: '22rpx', color: TU.text3 }}>
                （{fakeScreenshots.length}/9）
              </Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16rpx' }}>
              {/* 已上传截图 */}
              {fakeScreenshots.map((bgColor, i) => (
                <View
                  key={i}
                  style={{
                    width: '196rpx',
                    height: '196rpx',
                    borderRadius: `${TU.radiusLg}rpx`,
                    background: bgColor,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* 删除按钮 */}
                  <View
                    style={{
                      position: 'absolute',
                      top: '8rpx',
                      right: '8rpx',
                      width: '40rpx',
                      height: '40rpx',
                      borderRadius: '20rpx',
                      background: 'rgba(0,0,0,0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: TU.white, fontSize: '22rpx', lineHeight: '1' }}>×</Text>
                  </View>
                  {/* 游戏截图占位图案 */}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: '16rpx',
                      left: '16rpx',
                    }}
                  >
                    <Text style={{ fontSize: '18rpx', color: 'rgba(255,255,255,0.5)' }}>
                      截图 {i + 1}
                    </Text>
                  </View>
                </View>
              ))}

              {/* 添加按钮 */}
              <View
                style={{
                  width: '196rpx',
                  height: '196rpx',
                  borderRadius: `${TU.radiusLg}rpx`,
                  border: `2rpx dashed ${TU.border}`,
                  background: TU.bgPage,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10rpx',
                }}
                onClick={handleAddScreenshot}
              >
                <Text style={{ fontSize: '52rpx', color: TU.text4, lineHeight: '1' }}>+</Text>
                <Text style={{ fontSize: '22rpx', color: TU.text3 }}>添加截图</Text>
              </View>
            </View>
          </View>

          {/* 5. 结算预览卡片 */}
          <View
            style={{
              background: TU.white,
              borderRadius: `${TU.radiusLg * 2}rpx`,
              padding: '24rpx',
              boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: '22rpx',
                  color: TU.text3,
                  display: 'block',
                  marginBottom: '8rpx',
                }}
              >
                预计结算
              </Text>
              <Text style={{ fontSize: '40rpx', fontWeight: 600, color: TU.error }}>
                ¥{MOCK_ORDER.total}
                <Text style={{ fontSize: '22rpx', color: TU.text3, fontWeight: 400 }}> 元</Text>
              </Text>
            </View>
            <View style={{ maxWidth: '240rpx' }}>
              <Text
                style={{
                  fontSize: '20rpx',
                  color: TU.text3,
                  lineHeight: '1.6',
                  textAlign: 'right',
                  display: 'block',
                }}
              >
                默认 = 订单金额
              </Text>
              <Text
                style={{
                  fontSize: '20rpx',
                  color: TU.text3,
                  lineHeight: '1.6',
                  textAlign: 'right',
                  display: 'block',
                }}
              >
                老板审核时可能调整
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          background: TU.white,
          borderTop: `1rpx solid ${TU.borderLight}`,
          padding: '16rpx 28rpx',
          display: 'flex',
          flexDirection: 'row',
          gap: '16rpx',
          paddingBottom: 'calc(16rpx + env(safe-area-inset-bottom))',
        }}
      >
        <Button full onClick={handleSaveDraft} type={savingDraft ? 'default' : undefined}>
          {savingDraft ? '保存中…' : '存草稿'}
        </Button>
        <Button type="primary" full onClick={handleSubmit}>
          {submitting ? '提交中…' : '提交审核'}
        </Button>
      </View>
    </View>
  );
}
