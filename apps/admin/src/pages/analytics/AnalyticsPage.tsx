import { Card, Col, Row, Statistic, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PLAYERS } from '../../mock/data';

const { Title, Text } = Typography;

const TREND_DATA = [
  { day: '04-10', orders: 52, revenue: 4200 },
  { day: '04-11', orders: 61, revenue: 5100 },
  { day: '04-12', orders: 48, revenue: 3900 },
  { day: '04-13', orders: 70, revenue: 6200 },
  { day: '04-14', orders: 83, revenue: 7400 },
  { day: '04-15', orders: 91, revenue: 8100 },
  { day: '04-16', orders: 76, revenue: 6800 },
  { day: '04-17', orders: 65, revenue: 5400 },
  { day: '04-18', orders: 72, revenue: 6000 },
  { day: '04-19', orders: 88, revenue: 7700 },
  { day: '04-20', orders: 94, revenue: 8400 },
  { day: '04-21', orders: 79, revenue: 7100 },
  { day: '04-22', orders: 87, revenue: 7600 },
  { day: '04-23', orders: 31, revenue: 2800 },
];

const MAX_REV = Math.max(...TREND_DATA.map((d) => d.revenue));

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          height: 16,
          width: `${(value / max) * 180}px`,
          background: color,
          borderRadius: 2,
          minWidth: 2,
        }}
      />
      <Text style={{ fontSize: 12 }}>{value}</Text>
    </div>
  );
}

const leaderboardCols: ColumnsType<(typeof PLAYERS)[number]> = [
  {
    title: '#',
    width: 40,
    render: (_, __, i) => <Text type="secondary">{i + 1}</Text>,
  },
  { title: '陪玩', dataIndex: 'name', width: 130 },
  {
    title: '订单数',
    dataIndex: 'orders',
    width: 80,
    sorter: (a, b) => a.orders - b.orders,
    defaultSortOrder: 'descend',
  },
  {
    title: '评分',
    dataIndex: 'rating',
    width: 80,
    render: (v) => (v > 0 ? <Text style={{ color: '#faad14' }}>★ {v}</Text> : '—'),
  },
  {
    title: '累计流水',
    dataIndex: 'income',
    width: 110,
    render: (v) => <Text strong>¥{v.toLocaleString()}</Text>,
  },
];

export function AnalyticsPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 20 }}>数据看板</Title>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        {[
          { title: '本月订单', value: 1024, suffix: '单' },
          { title: '本月流水', value: '¥84,320', color: '#52c41a' },
          { title: '本月打赏', value: '¥6,480', color: '#1677ff' },
          { title: '活跃陪玩', value: 18, suffix: '人' },
        ].map((s) => (
          <Col key={s.title} span={6}>
            <Card size="small">
              <Statistic
                title={s.title}
                value={s.value}
                suffix={s.suffix}
                valueStyle={{ color: s.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        <Col span={14}>
          <Card title="近 14 日订单 & 流水" size="small">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#8c8c8c' }}>
                    <td style={{ padding: '4px 8px', width: 60 }}>日期</td>
                    <td style={{ padding: '4px 8px', width: 200 }}>订单数</td>
                    <td style={{ padding: '4px 8px', width: 200 }}>流水</td>
                    <td style={{ padding: '4px 8px' }}>金额</td>
                  </tr>
                </thead>
                <tbody>
                  {TREND_DATA.map((d) => (
                    <tr key={d.day} style={{ borderTop: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '6px 8px', color: '#8c8c8c' }}>{d.day}</td>
                      <td style={{ padding: '6px 8px' }}>
                        <MiniBar value={d.orders} max={100} color="#1677ff" />
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <MiniBar value={d.revenue} max={MAX_REV} color="#52c41a" />
                      </td>
                      <td style={{ padding: '6px 8px', color: '#52c41a' }}>¥{d.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Col>

        <Col span={10}>
          <Card title="陪玩排行榜 · 总计" size="small">
            <Table
              dataSource={[...PLAYERS].sort((a, b) => b.income - a.income)}
              columns={leaderboardCols}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
