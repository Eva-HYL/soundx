import { Card, Flex, Segmented, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

const REVENUE_DATA = [420, 380, 510, 680, 620, 890, 1020, 750, 820, 1180, 990, 1340, 1250, 1480];
const DAY_LABELS = [
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
];
const MAX_REV = Math.max(...REVENUE_DATA);

const STATS = [
  { title: '营业额', value: '¥ 13,240', change: '+18.2%', changeSub: '较上周期', up: true },
  { title: '成交订单', value: '142', change: '+12 单', changeSub: '较上周期', up: true },
  { title: '客单价', value: '¥ 93.2', change: '+5.3%', changeSub: '较上周期', up: true },
  { title: '平均服务时长', value: '2.3h', change: '-0.1h', changeSub: '较上周期', up: false },
  { title: '完单率', value: '94.3%', change: '+1.8%', changeSub: '较上周期', up: true },
];

const ORDER_STATUS = [
  { label: '已完成', value: 108, pct: 76, color: '#52c41a' },
  { label: '服务中', value: 12, pct: 8, color: '#1677ff' },
  { label: '待处理', value: 15, pct: 11, color: '#faad14' },
  { label: '取消/关闭', value: 7, pct: 5, color: '#bfbfbf' },
];

const GAME_DIST = [
  { label: '王者荣耀', value: 58, pct: 41, color: '#d4a24a' },
  { label: '英雄联盟', value: 42, pct: 30, color: '#1e6fba' },
  { label: '无畏契约', value: 18, pct: 13, color: '#c23b3b' },
  { label: 'Apex英雄', value: 14, pct: 10, color: '#c23b3b' },
  { label: '原神', value: 10, pct: 7, color: '#6b8fb5' },
];

type LeaderRow = { n: string; o: number; a: number; r: number };
const LEADER: LeaderRow[] = [
  { n: '带飞专业户', o: 48, a: 2880, r: 75 },
  { n: 'AhriQueen', o: 32, a: 2380, r: 72 },
  { n: '会玩辅助的刺客', o: 38, a: 1820, r: 70 },
  { n: '打野在哪', o: 22, a: 1260, r: 68 },
  { n: '小鸟游六花', o: 18, a: 980, r: 70 },
];

function StatCard({
  title,
  value,
  change,
  changeSub,
  up,
}: {
  title: string;
  value: string;
  change: string;
  changeSub: string;
  up: boolean;
}) {
  const color = up ? '#52c41a' : '#ff4d4f';
  const arrow = up ? '↑' : '↓';
  return (
    <Card size="small" style={{ flex: 1 }}>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {title}
      </Text>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6, color: '#262626' }}>{value}</div>
      <div style={{ marginTop: 4, fontSize: 12 }}>
        <span style={{ color, fontWeight: 600 }}>
          {arrow} {change}
        </span>
        <Text type="secondary" style={{ marginLeft: 6, fontSize: 12 }}>
          {changeSub}
        </Text>
      </div>
    </Card>
  );
}

function ProgressRow({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <Flex justify="space-between" style={{ marginBottom: 6 }}>
        <Text style={{ fontSize: 13 }}>{label}</Text>
        <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
          {value} · {pct}%
        </Text>
      </Flex>
      <div
        style={{
          height: 8,
          background: '#f0f0f0',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}

function RevenueChart() {
  const chartHeight = 220;
  const lastIdx = REVENUE_DATA.length - 1;
  return (
    <div style={{ position: 'relative', padding: '20px 0 30px', marginTop: 8 }}>
      {[0, 25, 50, 75, 100].map(p => (
        <div
          key={p}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 30 + (chartHeight * p) / 100,
            borderTop: '1px dashed #f0f0f0',
          }}
        />
      ))}

      <div
        style={{
          position: 'relative',
          height: chartHeight,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          padding: '0 8px',
        }}
      >
        {REVENUE_DATA.map((v, i) => {
          const h = (v / MAX_REV) * chartHeight;
          const isToday = i === lastIdx;
          const barColor = isToday ? '#1677ff' : '#bae0ff';
          const darkColor = isToday ? '#1560e8' : '#91caff';
          const darkH = h * 0.3;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              {isToday && (
                <div
                  style={{
                    position: 'absolute',
                    top: -24,
                    background: '#262626',
                    color: '#fff',
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ¥ 1480
                </div>
              )}
              <div
                style={{
                  width: '100%',
                  height: h,
                  background: barColor,
                  borderRadius: '3px 3px 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  transition: 'background 0.2s',
                }}
              >
                <div
                  style={{
                    height: darkH,
                    background: darkColor,
                    borderRadius: 0,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          padding: '10px 8px 0',
          borderTop: '1px solid #f0f0f0',
          marginTop: 4,
        }}
      >
        {DAY_LABELS.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 11,
              color: i === lastIdx ? '#1677ff' : '#8c8c8c',
              fontWeight: i === lastIdx ? 600 : 400,
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const colors = ['#d4a24a', '#a8a8a8', '#c47b3a'];
  if (rank <= 3) {
    return (
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          background: colors[rank - 1],
          color: '#fff',
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {rank}
      </div>
    );
  }
  return (
    <Text type="secondary" style={{ fontSize: 13, paddingLeft: 6 }}>
      {rank}
    </Text>
  );
}

const leaderCols: ColumnsType<LeaderRow> = [
  {
    title: '#',
    width: 44,
    render: (_, __, i) => <RankBadge rank={i + 1} />,
  },
  { title: '陪玩', dataIndex: 'n' },
  {
    title: '单数',
    dataIndex: 'o',
    width: 60,
    align: 'right',
    render: v => <Text style={{ fontSize: 13 }}>{v}</Text>,
  },
  {
    title: '到账',
    dataIndex: 'a',
    width: 80,
    align: 'right',
    render: v => (
      <Text strong style={{ color: '#1677ff', fontSize: 13 }}>
        ¥{v}
      </Text>
    ),
  },
  {
    title: '比例',
    dataIndex: 'r',
    width: 60,
    align: 'right',
    render: v => (
      <Text type="secondary" style={{ fontSize: 12 }}>
        {v}%
      </Text>
    ),
  },
];

export function AnalyticsPage() {
  return (
    <div style={{ padding: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            数据看板
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            最近 14 天 · 2024-04-10 至 04-23
          </Text>
        </div>
        <Segmented
          options={['今日', '本周', '本月', '最近 14 天', '自定义']}
          defaultValue="最近 14 天"
        />
      </Flex>

      <Flex gap={16} style={{ marginBottom: 16 }}>
        {STATS.map(s => (
          <StatCard key={s.title} {...s} />
        ))}
      </Flex>

      <Card style={{ marginBottom: 16 }}>
        <Flex justify="space-between" align="center">
          <Space size={16}>
            <Title level={5} style={{ margin: 0 }}>
              营业额趋势
            </Title>
            <Space size={12}>
              <Space size={4}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: '#1677ff',
                    display: 'inline-block',
                  }}
                />
                <Text style={{ fontSize: 12 }}>营业额</Text>
              </Space>
              <Space size={4}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: '#bae0ff',
                    display: 'inline-block',
                  }}
                />
                <Text style={{ fontSize: 12 }}>俱乐部留存</Text>
              </Space>
            </Space>
          </Space>
          <Text type="secondary" style={{ fontSize: 12 }}>
            单位 · 元
          </Text>
        </Flex>
        <RevenueChart />
      </Card>

      <Flex gap={16} align="stretch">
        <Card title="订单状态分布" style={{ flex: 1 }}>
          {ORDER_STATUS.map(s => (
            <ProgressRow key={s.label} {...s} />
          ))}
        </Card>

        <Card
          style={{ flex: 1 }}
          styles={{ body: { padding: 0 } }}
          title={
            <Flex justify="space-between" align="center">
              <span>陪玩收入榜 Top 5</span>
              <a style={{ fontSize: 12, fontWeight: 400 }}>查看全部 →</a>
            </Flex>
          }
        >
          <Table
            dataSource={LEADER}
            columns={leaderCols}
            rowKey="n"
            size="small"
            pagination={false}
          />
        </Card>

        <Card title="游戏分布" style={{ flex: 1 }}>
          {GAME_DIST.map(g => (
            <ProgressRow key={g.label} {...g} />
          ))}
        </Card>
      </Flex>
    </div>
  );
}
