import { Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TIPS } from '../../mock/data';
import { TIP_STATUS } from '../../constants/status';

const { Text } = Typography;

type Tip = (typeof TIPS)[number];

const columns: ColumnsType<Tip> = [
  {
    title: '编号',
    dataIndex: 'id',
    width: 110,
    render: v => <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{v}</Text>,
  },
  { title: '用户', dataIndex: 'user', width: 120 },
  { title: '陪玩', dataIndex: 'pal', width: 120 },
  {
    title: '关联订单',
    dataIndex: 'order',
    width: 140,
    render: v => <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{v}</Text>,
  },
  {
    title: '金额',
    dataIndex: 'amount',
    width: 80,
    render: v => (
      <Text strong style={{ color: '#52c41a' }}>
        ¥{v}
      </Text>
    ),
  },
  {
    title: '留言',
    dataIndex: 'msg',
    render: v =>
      v ? (
        <Text
          style={{
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: 4,
            padding: '2px 8px',
            fontSize: 12,
          }}
        >
          「{v}」
        </Text>
      ) : (
        <Text type="secondary" style={{ fontSize: 12 }}>
          —
        </Text>
      ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 90,
    render: v => {
      const s = TIP_STATUS[v];
      return <Tag color={s?.color}>{s?.text}</Tag>;
    },
  },
  { title: '时间', dataIndex: 'time', width: 130 },
];

export function TipsPage() {
  const total = TIPS.reduce((s, r) => s + r.amount, 0);
  const received = TIPS.filter(r => r.status === 'received').reduce((s, r) => s + r.amount, 0);
  const withMsg = TIPS.filter(r => r.msg).length;

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="本日打赏总额" value={`¥${total}`} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="已到账" value={`¥${received}`} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="打赏笔数" value={TIPS.length} suffix="笔" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="含留言" value={withMsg} suffix="笔" />
          </Card>
        </Col>
      </Row>

      <Table dataSource={TIPS} columns={columns} rowKey="id" size="small" pagination={false} />
    </div>
  );
}
