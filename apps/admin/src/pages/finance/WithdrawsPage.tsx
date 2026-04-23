import { CheckOutlined, CloseOutlined, DollarOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Statistic, Table, Tabs, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { WITHDRAWALS } from '../../mock/data';
import { WITHDRAW_STATUS } from '../../constants/status';

const { Text } = Typography;

type PendingRow = (typeof WITHDRAWALS.pending_review)[number];
type ApprovedRow = (typeof WITHDRAWALS.approved_pending_transfer)[number];
type AllRow = (typeof WITHDRAWALS.all)[number];

const pendingCols: ColumnsType<PendingRow> = [
  { title: '编号', dataIndex: 'id', width: 100, render: (v) => <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</Text> },
  { title: '陪玩', dataIndex: 'pal', width: 120 },
  { title: '姓名', dataIndex: 'name', width: 80 },
  { title: '微信号', dataIndex: 'wechat', width: 130, render: (v) => <Text copyable style={{ fontSize: 12 }}>{v}</Text> },
  { title: '申请金额', dataIndex: 'amount', width: 100, render: (v) => <Text strong style={{ color: '#1677ff' }}>¥{v}</Text> },
  { title: '账户余额', dataIndex: 'balance', width: 100, render: (v) => <Text type="secondary">¥{v}</Text> },
  { title: '申请时间', dataIndex: 'submitted', width: 100 },
  {
    title: '操作',
    width: 160,
    render: () => (
      <Space size={4}>
        <Button size="small" type="primary" icon={<CheckOutlined />}>审核通过</Button>
        <Button size="small" danger icon={<CloseOutlined />}>驳回</Button>
      </Space>
    ),
  },
];

const approvedCols: ColumnsType<ApprovedRow> = [
  { title: '编号', dataIndex: 'id', width: 100, render: (v) => <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</Text> },
  { title: '陪玩', dataIndex: 'pal', width: 120 },
  { title: '姓名', dataIndex: 'name', width: 80 },
  { title: '微信号', dataIndex: 'wechat', width: 130, render: (v) => <Text copyable style={{ fontSize: 12 }}>{v}</Text> },
  { title: '转账金额', dataIndex: 'amount', width: 100, render: (v) => <Text strong style={{ color: '#52c41a' }}>¥{v}</Text> },
  { title: '申请时间', dataIndex: 'submitted', width: 120 },
  {
    title: '操作',
    width: 140,
    render: () => (
      <Button size="small" type="primary" icon={<DollarOutlined />}>确认已转账</Button>
    ),
  },
];

const allCols: ColumnsType<AllRow> = [
  { title: '编号', dataIndex: 'id', width: 100, render: (v) => <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</Text> },
  { title: '陪玩', dataIndex: 'pal', width: 120 },
  { title: '姓名', dataIndex: 'name', width: 80 },
  { title: '微信号', dataIndex: 'wechat', width: 130 },
  { title: '金额', dataIndex: 'amount', width: 90, render: (v) => `¥${v}` },
  { title: '申请时间', dataIndex: 'submitted', width: 100 },
  {
    title: '状态',
    dataIndex: 'status',
    width: 90,
    render: (v) => {
      const s = WITHDRAW_STATUS[v];
      return <Tag color={s?.color}>{s?.text}</Tag>;
    },
  },
];

export function WithdrawsPage() {
  const totalPending = WITHDRAWALS.pending_review.reduce((s, r) => s + r.amount, 0);
  const totalApproved = WITHDRAWALS.approved_pending_transfer.reduce((s, r) => s + r.amount, 0);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="待审核提现"
              value={WITHDRAWALS.pending_review.length}
              suffix="笔"
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>合计 ¥{totalPending}</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic
              title="待转账"
              value={WITHDRAWALS.approved_pending_transfer.length}
              suffix="笔"
              valueStyle={{ color: '#1677ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>合计 ¥{totalApproved}</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="本月已完成" value={28} suffix="笔" />
            <Text type="secondary" style={{ fontSize: 12 }}>合计 ¥12,480</Text>
          </Card>
        </Col>
      </Row>

      <Tabs
        items={[
          {
            key: 'pending',
            label: (
              <span>
                待审核{' '}
                <Tag color="gold" style={{ marginLeft: 4 }}>
                  {WITHDRAWALS.pending_review.length}
                </Tag>
              </span>
            ),
            children: (
              <Table
                dataSource={WITHDRAWALS.pending_review}
                columns={pendingCols}
                rowKey="id"
                size="small"
                pagination={false}
              />
            ),
          },
          {
            key: 'approved',
            label: (
              <span>
                待转账{' '}
                <Tag color="blue" style={{ marginLeft: 4 }}>
                  {WITHDRAWALS.approved_pending_transfer.length}
                </Tag>
              </span>
            ),
            children: (
              <Table
                dataSource={WITHDRAWALS.approved_pending_transfer}
                columns={approvedCols}
                rowKey="id"
                size="small"
                pagination={false}
              />
            ),
          },
          {
            key: 'all',
            label: '历史记录',
            children: (
              <Table
                dataSource={WITHDRAWALS.all}
                columns={allCols}
                rowKey="id"
                size="small"
                pagination={false}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
