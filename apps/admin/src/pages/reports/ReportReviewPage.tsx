import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Descriptions, Image, Row, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { GAMES, PENDING_REPORTS } from '../../mock/data';

const { Text, Title, Paragraph } = Typography;

type Report = (typeof PENDING_REPORTS)[number];
const GAME_MAP = Object.fromEntries(GAMES.map((g) => [g.id, g]));

function QueueCard({
  r,
  active,
  onClick,
}: {
  r: Report;
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
        <Tag color={GAME_MAP[r.game]?.color} style={{ margin: 0, fontSize: 11 }}>
          {GAME_MAP[r.game]?.name}
        </Tag>
        <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{r.orderNo}</Text>
        <Text type="secondary" style={{ fontSize: 11, marginLeft: 'auto' }}>
          {r.ago}
        </Text>
      </div>
      <div style={{ display: 'flex', marginTop: 6, fontSize: 13 }}>
        <Text style={{ flex: 1 }}>{r.pal}</Text>
        <Text strong style={{ color: '#52c41a' }}>
          ¥{r.amount}
        </Text>
      </div>
      <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>
        {r.svc} · {r.start}–{r.end} ({r.dur}h)
      </div>
    </div>
  );
}

const PLACEHOLDER = (n: number) =>
  `https://placehold.co/200x150/f5f5f5/999?text=截图${n}`;

export function ReportReviewPage() {
  const [queue, setQueue] = useState(PENDING_REPORTS);
  const [selected, setSelected] = useState<Report | null>(queue[0] ?? null);
  const handle = (r: Report) => {
    const remaining = queue.filter((x) => x.orderNo !== r.orderNo);
    setQueue(remaining);
    setSelected(remaining[0] ?? null);
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>
          报备审核
        </Title>
        <Badge count={queue.length} style={{ background: '#fa8c16' }} />
      </div>

      <Row gutter={16}>
        {/* Queue */}
        <Col span={8}>
          <Card size="small" title="待审核队列" bodyStyle={{ padding: '8px 12px' }}>
            {queue.length === 0 ? (
              <Text type="secondary" style={{ fontSize: 13 }}>
                暂无待审核报备 🎉
              </Text>
            ) : (
              queue.map((r) => (
                <QueueCard
                  key={r.orderNo}
                  r={r}
                  active={selected?.orderNo === r.orderNo}
                  onClick={() => setSelected(r)}
                />
              ))
            )}
          </Card>
        </Col>

        {/* Detail */}
        <Col span={16}>
          {selected ? (
            <Card
              size="small"
              title={
                <span>
                  <Text style={{ fontFamily: 'monospace', fontSize: 13 }}>{selected.orderNo}</Text>
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
                    onClick={() => handle(selected)}
                  >
                    通过
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => handle(selected)}
                  >
                    驳回
                  </Button>
                </Space>
              }
            >
              <Descriptions size="small" column={2} style={{ marginBottom: 16 }}>
                <Descriptions.Item label="用户">{selected.user}</Descriptions.Item>
                <Descriptions.Item label="陪玩">{selected.pal}</Descriptions.Item>
                <Descriptions.Item label="游戏 / 服务">
                  <Tag color={GAME_MAP[selected.game]?.color} style={{ margin: 0 }}>
                    {GAME_MAP[selected.game]?.name}
                  </Tag>{' '}
                  {selected.svc}
                </Descriptions.Item>
                <Descriptions.Item label="服务时长">
                  {selected.start} – {selected.end}（{selected.dur}h）
                </Descriptions.Item>
                <Descriptions.Item label="结算金额">
                  <Text strong style={{ color: '#52c41a' }}>
                    ¥{selected.amount}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="附件数量">{selected.attachments} 张</Descriptions.Item>
              </Descriptions>

              <div style={{ marginBottom: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  服务备注
                </Text>
                <Paragraph
                  style={{
                    marginTop: 4,
                    background: '#fafafa',
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: 13,
                    lineHeight: 1.7,
                  }}
                >
                  {selected.note}
                </Paragraph>
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  服务截图
                </Text>
                <Image.PreviewGroup>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {Array.from({ length: selected.attachments }).map((_, i) => (
                      <Image
                        key={i}
                        width={120}
                        height={80}
                        src={PLACEHOLDER(i + 1)}
                        style={{ borderRadius: 4, objectFit: 'cover' }}
                      />
                    ))}
                  </div>
                </Image.PreviewGroup>
              </div>
            </Card>
          ) : (
            <Card size="small">
              <div style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}>
                全部审核完毕 ✅
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
