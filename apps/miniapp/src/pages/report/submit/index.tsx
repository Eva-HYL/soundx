import { View, Text, ScrollView, Textarea } from '@tarojs/components';
import type { BaseEventOrig, TextareaProps } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useState } from 'react';
import { NavBar } from '../../../components/ui/NavBar';
import { Button } from '../../../components/ui/Button';
import { Tag } from '../../../components/ui/Tag';
import { TU } from '../../../constants/tokens';
import { ApiError, submitReport } from '../../../services';

const MAX_CONTENT = 500;

const PLACEHOLDER_CONTENT = `请描述服务内容，例如：
- 完成了 3 局排位，胜 2 负 1
- 帮助老板从铂金 IV 晋级至铂金 III
- 重点针对打野 Gank 节奏进行了讲解
- 老板操作积极，执行力强`;

export default function SubmitReportPage() {
  const router = useRouter();
  // 新流程下传的是 orderId（BigInt 字符串）。兼容旧 orderNo（但后端只接 id）
  const orderId = router.params?.orderId;

  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const fakeScreenshots = ['#4A4A6A', '#3D5A80'];

  function handleSaveDraft() {
    setSavingDraft(true);
    setTimeout(() => {
      setSavingDraft(false);
      Taro.showToast({ title: '草稿已保存（本地）', icon: 'success' });
    }, 400);
  }

  async function handleSubmit() {
    if (!orderId) {
      Taro.showToast({ title: '缺少订单 ID', icon: 'none' });
      return;
    }
    if (!content.trim()) {
      Taro.showToast({ title: '请填写服务内容', icon: 'none' });
      return;
    }
    setSubmitting(true);
    try {
      await submitReport(orderId, {
        content: content.trim(),
        // 截图上传未接入，暂不传 attachments
      });
      Taro.showToast({ title: '提交成功，等待审核', icon: 'success' });
      setTimeout(() => Taro.navigateBack(), 1200);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : '提交失败';
      Taro.showToast({ title: msg, icon: 'none' });
    } finally {
      setSubmitting(false);
    }
  }

  function handleAddScreenshot() {
    Taro.showToast({ title: '截图上传尚未接入', icon: 'none' });
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
          {/* 订单概览 */}
          <View
            style={{
              background: TU.white,
              borderRadius: `${TU.radiusLg * 2}rpx`,
              padding: '20rpx 24rpx',
              boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.04)',
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
              <Text style={{ fontSize: '26rpx', fontWeight: 500, color: TU.text2 }}>
                订单 {orderId ? `#${orderId.slice(-6)}` : '(未知)'}
              </Text>
              <Tag type="tint" size="small">
                待提交战绩
              </Tag>
            </View>
            <Text
              style={{
                fontSize: '22rpx',
                color: TU.text3,
                marginTop: '10rpx',
                display: 'block',
              }}
            >
              提交后将进入"等待管理员审核"状态，审核通过自动结算到你的积分账户。
            </Text>
          </View>

          {/* 服务时长占位（后端尚未提供"用时"独立字段给陪玩） */}
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
                gap: '12rpx',
                marginBottom: '16rpx',
              }}
            >
              <Text style={{ fontSize: '28rpx', fontWeight: 600, color: TU.text }}>服务时长</Text>
              <Tag type="tint" size="small">
                自动计时
              </Tag>
            </View>
            <Text
              style={{
                fontSize: '22rpx',
                color: TU.text3,
                display: 'block',
                marginBottom: '16rpx',
              }}
            >
              由订单 `startedAt` / `finishedAt` 推导，提交时由后端自动计算。
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', gap: '16rpx' }}>
              <Button full onClick={handleModifyDuration}>
                手动修改
              </Button>
            </View>
          </View>

          {/* 服务内容（真 Textarea） */}
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
                服务内容 <Text style={{ color: TU.error }}>*</Text>
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
            <Textarea
              value={content}
              maxlength={MAX_CONTENT}
              placeholder={PLACEHOLDER_CONTENT}
              onInput={(e: BaseEventOrig<TextareaProps.onInputEventDetail>) =>
                setContent(e.detail.value)
              }
              style={{
                width: '100%',
                minHeight: '240rpx',
                background: TU.bgPage,
                borderRadius: `${TU.radius}rpx`,
                padding: '20rpx',
                fontSize: '26rpx',
                color: TU.text,
                lineHeight: 1.7,
              }}
            />
          </View>

          {/* 战绩截图（未接入上传） */}
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
                ({fakeScreenshots.length}/9，尚未接入上传)
              </Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16rpx' }}>
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
                  <View
                    style={{
                      position: 'absolute',
                      bottom: '16rpx',
                      left: '16rpx',
                    }}
                  >
                    <Text style={{ fontSize: '18rpx', color: 'rgba(255,255,255,0.5)' }}>
                      占位 {i + 1}
                    </Text>
                  </View>
                </View>
              ))}
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
        <Button full onClick={handleSaveDraft} disabled={savingDraft}>
          {savingDraft ? '保存中…' : '存草稿'}
        </Button>
        <Button type="primary" full onClick={handleSubmit} disabled={submitting}>
          {submitting ? '提交中…' : '提交审核'}
        </Button>
      </View>
    </View>
  );
}
