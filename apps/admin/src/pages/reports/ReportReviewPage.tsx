import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import {
  ApiError,
  approveReport,
  listAdminReports,
  rejectReport,
  type ReportDto,
} from '../../services';

const { Text, Title, Paragraph } = Typography;

interface ReportVM {
  id: string;
  orderId: string;
  playerName: string;
  serviceNote: string;
  status: string;
  startTime: string | null;
  endTime: string | null;
  durationMinutes: number;
  attachments: string[];
  reviewerId: string | null;
  reviewTime: string | null;
  rejectReason: string | null;
  createdAt: string | null;
  ago: string;
}

function timeAgo(iso: string | null): string {
  if (!iso) return '刚刚';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return '刚刚';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`;
  return `${Math.floor(diff / 86_400_000)} 天前`;
}

function toVM(r: ReportDto): ReportVM {
  return {
    id: r.id,
    orderId: r.orderId,
    playerName: r.player?.nickname ?? '未知陪玩',
    serviceNote: r.content,
    status: r.status ?? '',
    startTime: r.startTime,
    endTime: r.endTime,
    durationMinutes: r.durationMinutes,
    attachments: r.attachments ?? [],
    reviewerId: r.reviewerId,
    reviewTime: r.reviewTime,
    rejectReason: r.rejectReason,
    createdAt: r.createdAt,
    ago: timeAgo(r.createdAt),
  };
}

function formatTimeRange(start: string | null, end: string | null): string {
  if (!start || !end) return '—';
  const s = new Date(start);
  const e = new Date(end);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(s.getHours())}:${p(s.getMinutes())} – ${p(e.getHours())}:${p(e.getMinutes())}`;
}

function QueueCard({
  r,
  active,
  onClick,
}: {
  r: ReportVM;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 14px',
        borderRadius: 6,
        border: `1px solid ${active ? '#1677ff' : '#f0f0f0'}`,
        background: active ? '#e6f4ff' : '#fff',
        cursor: 'pointer',
        marginBottom: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>#{r.orderId.slice(-6)}</Text>
        <Text type="secondary" style={{ fontSize: 11, marginLeft: 'auto' }}>
          {r.ago}
        </Text>
      </div>
      <div style={{ display: 'flex', marginTop: 6, fontSize: 13 }}>
        <Text style={{ flex: 1 }}>{r.playerName}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {r.durationMinutes} 分钟
        </Text>
      </div>
      <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>
        {r.serviceNote.slice(0, 40)}
        {r.serviceNote.length > 40 ? '…' : ''}
      </div>
    </div>
  );
}

export function ReportReviewPage() {
  const [queue, setQueue] = useState<ReportVM[]>([]);
  const [selected, setSelected] = useState<ReportVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    listAdminReports({ page: 1, pageSize: 50, status: 'submitted' })
      .then(res => {
        if (cancelled) return;
        const vms = res.list.map(toVM);
        setQueue(vms);
        setSelected(prev => {
          if (prev && vms.find(v => v.id === prev.id)) return prev;
          return vms[0] ?? null;
        });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setLoadError(err.message);
        setQueue([]);
        setSelected(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  async function handleApprove(r: ReportVM) {
    setSubmittingId(r.id);
    try {
      await approveReport(r.id);
      message.success(`报备 #${r.orderId.slice(-6)} 审核通过，已结算积分`);
      // 从队列移除
      const next = queue.filter(x => x.id !== r.id);
      setQueue(next);
      setSelected(next[0] ?? null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : '审核失败';
      message.error(msg);
    } finally {
      setSubmittingId(null);
    }
  }

  function openReject() {
    if (!selected) return;
    setRejectReason('');
    setRejectModalOpen(true);
  }

  async function handleRejectSubmit() {
    if (!selected) return;
    if (!rejectReason.trim()) {
      message.warning('请填写驳回原因');
      return;
    }
    setSubmittingId(selected.id);
    try {
      await rejectReport(selected.id, rejectReason.trim());
      message.success(`报备 #${selected.orderId.slice(-6)} 已驳回`);
      setRejectModalOpen(false);
      const next = queue.filter(x => x.id !== selected.id);
      setQueue(next);
      setSelected(next[0] ?? null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : '驳回失败';
      message.error(msg);
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>
          报备审核
        </Title>
        <Badge count={queue.length} style={{ background: '#fa8c16' }} />
        <div style={{ flex: 1 }} />
        <Button size="small" onClick={reload} loading={loading}>
          刷新
        </Button>
      </div>

      {loadError && (
        <Alert
          type="error"
          showIcon
          message={`加载失败：${loadError}`}
          closable
          style={{ marginBottom: 12 }}
        />
      )}

      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small" title="待审核队列" bodyStyle={{ padding: '8px 12px' }}>
              {queue.length === 0 ? (
                <Text type="secondary" style={{ fontSize: 13 }}>
                  暂无待审核报备 🎉
                </Text>
              ) : (
                queue.map(r => (
                  <QueueCard
                    key={r.id}
                    r={r}
                    active={selected?.id === r.id}
                    onClick={() => setSelected(r)}
                  />
                ))
              )}
            </Card>
          </Col>

          <Col span={16}>
            {selected ? (
              <Card
                size="small"
                title={
                  <span>
                    <Text style={{ fontFamily: 'monospace', fontSize: 13 }}>
                      #{selected.orderId.slice(-6)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 12 }}>
                      提交于 {selected.ago}
                    </Text>
                  </span>
                }
                extra={
                  <Space>
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      loading={submittingId === selected.id && !rejectModalOpen}
                      onClick={() => handleApprove(selected)}
                    >
                      通过（结算积分）
                    </Button>
                    <Button danger icon={<CloseOutlined />} onClick={openReject}>
                      驳回
                    </Button>
                  </Space>
                }
              >
                <Descriptions size="small" column={2} style={{ marginBottom: 16 }}>
                  <Descriptions.Item label="订单 ID">
                    <Text copyable style={{ fontSize: 12, fontFamily: 'monospace' }}>
                      {selected.orderId}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="陪玩">{selected.playerName}</Descriptions.Item>
                  <Descriptions.Item label="服务时段">
                    {formatTimeRange(selected.startTime, selected.endTime)}
                  </Descriptions.Item>
                  <Descriptions.Item label="时长">
                    <Text strong>{selected.durationMinutes} 分钟</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="附件数量">
                    {selected.attachments.length} 张
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color="orange">{selected.status}</Tag>
                  </Descriptions.Item>
                </Descriptions>

                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    服务内容
                  </Text>
                  <Paragraph
                    style={{
                      marginTop: 4,
                      background: '#fafafa',
                      borderRadius: 6,
                      padding: '8px 12px',
                      fontSize: 13,
                      lineHeight: 1.7,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {selected.serviceNote}
                  </Paragraph>
                </div>

                {selected.attachments.length > 0 && (
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      服务截图
                    </Text>
                    <Image.PreviewGroup>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        {selected.attachments.map((url, i) => (
                          <Image
                            key={i}
                            width={120}
                            height={80}
                            src={url}
                            style={{ borderRadius: 4, objectFit: 'cover' }}
                          />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  </div>
                )}
              </Card>
            ) : (
              <Card size="small">
                <div style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}>
                  {loading ? '加载中…' : '全部审核完毕 ✅'}
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </Spin>

      <Modal
        title="驳回报备"
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onOk={handleRejectSubmit}
        confirmLoading={!!submittingId}
        okText="确认驳回"
        cancelText="取消"
      >
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
          驳回后订单会回退到 <Tag color="orange">PENDING_REPORT</Tag>，陪玩需重新提交。
        </Text>
        <Input.TextArea
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          placeholder="请填写驳回原因（给陪玩看）"
          rows={4}
          maxLength={255}
          showCount
        />
      </Modal>
    </div>
  );
}
