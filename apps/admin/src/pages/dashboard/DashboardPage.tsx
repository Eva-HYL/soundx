import { ArrowRightOutlined } from '@ant-design/icons';
import { Badge, Card, Col, Progress, Row, Space, Statistic, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const TODO_ITEMS = [
  {
    count: 15,
    title: '待确认付款',
    sub: '最早提交 10:02 · 已等 2 小时 41 分',
    urgent: true,
    link: '/orders/pending-payment',
  },
  {
    count: 8,
    title: '待审核报备',
    sub: '最早提交 13:24 · 已等 41 分',
    urgent: true,
    link: '/reports',
  },
  {
    count: 5,
    title: '待审核提现',
    sub: '最早提交 10:32 · 已等 4 小时 12 分',
    urgent: false,
    link: '/finance/withdrawals',
  },
  {
    count: 3,
    title: '待转账提现',
    sub: '已审核通过，待线下转账后确认',
    urgent: false,
    link: '/finance/withdrawals',
  },
  { count: 2, title: '陪玩入驻申请', sub: '待审核资料', urgent: false, link: '/players' },
];

const ORDER_DIST = [
  { status: '待付款', count: 15, pct: 17, color: '#faad14' },
  { status: '待派发', count: 4, pct: 5, color: '#1677ff' },
  { status: '服务中', count: 12, pct: 14, color: '#1677ff' },
  { status: '待审核', count: 8, pct: 9, color: '#fa8c16' },
  { status: '已完成', count: 44, pct: 50, color: '#52c41a' },
  { status: '已取消', count: 4, pct: 5, color: '#d9d9d9' },
];

const TOP_PALS = [
  { name: '带飞专业户', revenue: '¥2,180', orders: 28 },
  { name: 'AhriQueen', revenue: '¥1,840', orders: 22 },
  { name: '打野在哪', revenue: '¥1,560', orders: 31 },
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        欢迎回来，周老板
      </Title>

      {/* Stats row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {[
          { title: '今日订单', value: 87, suffix: '单', sub: '↑ 12% 较昨日' },
          { title: '今日流水', value: '¥6,840', sub: '↑ 8.4% 较昨日' },
          { title: '待确认付款', value: 15, sub: '最长等待 28 分钟', urgent: true },
          { title: '待审核报备', value: 8, sub: '最长等待 41 分钟', urgent: true },
          { title: '在线陪玩', value: 23, suffix: '人', sub: '/ 48 名在册' },
        ].map(s => (
          <Col key={s.title} flex={1}>
            <Card size="small">
              <Statistic
                title={s.title}
                value={s.value}
                suffix={s.suffix}
                valueStyle={{ color: s.urgent ? '#faad14' : undefined, fontSize: 28 }}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {s.sub}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        {/* 今日待办 */}
        <Col span={12}>
          <Card
            title={
              <span>
                今日待办{' '}
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
                  共 28 项
                </Text>
              </span>
            }
            size="small"
          >
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              {TODO_ITEMS.map(item => (
                <div
                  key={item.title}
                  onClick={() => navigate(item.link)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: item.urgent ? '#fffbe6' : '#fafafa',
                    border: `1px solid ${item.urgent ? '#ffe58f' : '#f0f0f0'}`,
                    cursor: 'pointer',
                  }}
                >
                  <Badge
                    count={item.count}
                    style={{ background: item.urgent ? '#faad14' : '#1677ff' }}
                  />
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <ArrowRightOutlined style={{ color: '#1677ff', fontSize: 12 }} />
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* 订单分布 + 排行 */}
        <Col span={12}>
          <Card title="订单状态分布 · 本日" size="small" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              {ORDER_DIST.map(r => (
                <div
                  key={r.status}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}
                >
                  <Tag color={r.color} style={{ minWidth: 60, textAlign: 'center', margin: 0 }}>
                    {r.status}
                  </Tag>
                  <Progress
                    percent={r.pct}
                    showInfo={false}
                    strokeColor={r.color}
                    size={['100%' as unknown as number, 6]}
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <Text
                    style={{ width: 32, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {r.count}
                  </Text>
                </div>
              ))}
            </Space>
          </Card>

          <Card title="本周 Top 陪玩" size="small">
            {TOP_PALS.map((p, i) => (
              <div
                key={p.name}
                style={{ display: 'flex', alignItems: 'center', padding: '6px 0', fontSize: 13 }}
              >
                <Text type="secondary" style={{ width: 20 }}>
                  {i + 1}
                </Text>
                <Text style={{ flex: 1 }}>{p.name}</Text>
                <Text type="secondary" style={{ width: 50, textAlign: 'right' }}>
                  {p.orders} 单
                </Text>
                <Text strong style={{ width: 80, textAlign: 'right' }}>
                  {p.revenue}
                </Text>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
