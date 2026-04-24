import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Progress, Slider, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const { Title, Text } = Typography;

const NAV_ITEMS = [
  { key: 'basic', label: '基础信息' },
  { key: 'split', label: '分成规则', badge: '核心' },
  { key: 'price', label: '服务价格' },
  { key: 'hours', label: '工作时段' },
  { key: 'withdraw', label: '提现规则' },
  { key: 'notice', label: '公告' },
];

type Override = {
  id: string;
  pal: string;
  rate: number;
  reason: string;
  since: string;
  orders: number;
};

const OVERRIDES: Override[] = [
  {
    id: '1',
    pal: '带飞专业户',
    rate: 75,
    reason: '高单价头部陪玩, 谈妥 75%',
    since: '2024-01-15',
    orders: 328,
  },
  { id: '2', pal: 'AhriQueen', rate: 72, reason: '女陪流量激励', since: '2024-02-03', orders: 142 },
  { id: '3', pal: '打野在哪', rate: 68, reason: '新人试用期', since: '2024-02-18', orders: 86 },
];

const AVATAR_COLORS = ['#1677ff', '#d4a24a', '#52c41a', '#c23b3b', '#6b8fb5'];

function PalAvatar({ name, index }: { name: string; index: number }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <Flex align="center" gap={10}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          background: color,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        {name.slice(0, 1)}
      </div>
      <Text style={{ fontSize: 13 }}>{name}</Text>
    </Flex>
  );
}

export function ClubConfigPage() {
  const [defaultRatio, setDefaultRatio] = useState(70);
  const [activeNav, setActiveNav] = useState('split');

  const pal = defaultRatio;
  const club = 100 - defaultRatio;

  const example1Pal = ((80 * pal) / 100).toFixed(2);
  const example1Club = ((80 * club) / 100).toFixed(2);
  const example2Pal = ((165 * pal) / 100).toFixed(2);
  const example2Club = ((165 * club) / 100).toFixed(2);

  const overrideCols: ColumnsType<Override> = [
    {
      title: '陪玩',
      dataIndex: 'pal',
      width: 180,
      render: (v: string, _r, i) => <PalAvatar name={v} index={i} />,
    },
    {
      title: '到账比例',
      dataIndex: 'rate',
      width: 240,
      render: (v: number) => {
        const delta = v - defaultRatio;
        const deltaText = delta > 0 ? `+${delta}` : `${delta}`;
        const deltaColor = delta > 0 ? '#52c41a' : delta < 0 ? '#ff4d4f' : '#8c8c8c';
        return (
          <Flex align="center" gap={10}>
            <Progress
              percent={v}
              showInfo={false}
              size={{ width: 100, height: 8 }}
              strokeColor="#1677ff"
            />
            <Text strong style={{ fontSize: 13, minWidth: 32 }}>
              {v}%
            </Text>
            <Tag
              color={delta > 0 ? 'success' : delta < 0 ? 'error' : 'default'}
              style={{ margin: 0, fontSize: 11, color: deltaColor }}
            >
              {deltaText}
            </Tag>
          </Flex>
        );
      },
    },
    {
      title: '原因备注',
      dataIndex: 'reason',
      render: (v: string) => <Text style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: '已完成单数',
      dataIndex: 'orders',
      width: 110,
      align: 'right',
      render: (v: number) => <Text style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: '生效日期',
      dataIndex: 'since',
      width: 120,
      render: (v: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {v}
        </Text>
      ),
    },
    {
      title: '操作',
      width: 120,
      render: () => (
        <Space size={4}>
          <Button type="link" size="small" style={{ padding: 0 }}>
            编辑
          </Button>
          <Text type="secondary">|</Text>
          <Button type="link" size="small" danger style={{ padding: 0 }}>
            移除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            俱乐部配置
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            星辰电竞俱乐部 · 所有配置修改会记录到操作日志
          </Text>
        </div>
        <Space>
          <Button>取消</Button>
          <Button type="primary">保存修改</Button>
        </Space>
      </Flex>

      <Flex gap={16} align="flex-start">
        <Card style={{ width: 168, flexShrink: 0 }} styles={{ body: { padding: 8 } }}>
          {NAV_ITEMS.map(item => {
            const active = item.key === activeNav;
            return (
              <div
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  background: active ? '#e6f4ff' : 'transparent',
                  borderLeft: active ? '3px solid #1677ff' : '3px solid transparent',
                  color: active ? '#1677ff' : '#262626',
                  fontWeight: active ? 600 : 400,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 2,
                }}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <Tag
                    color="blue"
                    style={{ margin: 0, fontSize: 10, lineHeight: '16px', padding: '0 4px' }}
                  >
                    {item.badge}
                  </Tag>
                )}
              </div>
            );
          })}
        </Card>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0 }}>
                默认分成比例
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                适用于所有陪玩, 单独设置的陪玩会覆盖此默认值。订单结算时按实际到账金额计算。
              </Text>
            </div>

            <div
              style={{
                background: '#f5f7fa',
                borderRadius: 8,
                padding: 24,
                marginBottom: 20,
              }}
            >
              <Flex justify="space-between" align="flex-start" style={{ marginBottom: 20 }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    陪玩到账比例
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    <span
                      style={{ fontSize: 56, fontWeight: 700, color: '#1677ff', lineHeight: 1 }}
                    >
                      {pal}
                    </span>
                    <span style={{ fontSize: 24, color: '#1677ff', marginLeft: 4 }}>%</span>
                    <span style={{ fontSize: 14, color: '#8c8c8c', marginLeft: 12 }}>
                      = 俱乐部留存 {club}%
                    </span>
                  </div>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  生效日期 · 2024-01-15
                </Text>
              </Flex>

              <Slider
                min={50}
                max={95}
                step={5}
                value={defaultRatio}
                onChange={setDefaultRatio}
                marks={{ 50: '50', 60: '60', 70: '70', 80: '80', 90: '90' }}
              />
            </div>

            <Flex gap={12}>
              <Card
                size="small"
                style={{ flex: 1, background: '#fafafa', border: '1px solid #f0f0f0' }}
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ¥80 订单
                </Text>
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  陪玩{' '}
                  <Text strong style={{ color: '#1677ff' }}>
                    ¥{example1Pal}
                  </Text>
                  <Text type="secondary"> ({pal}%)</Text>
                </div>
                <div style={{ fontSize: 13 }}>
                  俱乐部 <Text strong>¥{example1Club}</Text>
                  <Text type="secondary"> ({club}%)</Text>
                </div>
              </Card>

              <Card
                size="small"
                style={{ flex: 1, background: '#fafafa', border: '1px solid #f0f0f0' }}
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ¥165 订单
                </Text>
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  陪玩{' '}
                  <Text strong style={{ color: '#1677ff' }}>
                    ¥{example2Pal}
                  </Text>
                  <Text type="secondary"> ({pal}%)</Text>
                </div>
                <div style={{ fontSize: 13 }}>
                  俱乐部 <Text strong>¥{example2Club}</Text>
                  <Text type="secondary"> ({club}%)</Text>
                </div>
              </Card>

              <Card
                size="small"
                style={{ flex: 1, background: '#fff7e6', border: '1px solid #ffd591' }}
              >
                <Text style={{ fontSize: 12, color: '#d46b08', fontWeight: 600 }}>⚠ 特殊情况</Text>
                <div style={{ marginTop: 6, fontSize: 12, color: '#873800', lineHeight: 1.55 }}>
                  若实际到账 ≠ 应付金额, 按实际到账算。打赏金额全额给陪玩, 不走分账。
                </div>
              </Card>
            </Flex>
          </Card>

          <Card styles={{ body: { padding: 0 } }}>
            <Flex
              justify="space-between"
              align="center"
              style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}
            >
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  单独陪玩覆盖
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  个别陪玩的分成优先级高于默认值
                </Text>
              </div>
              <Button type="primary" icon={<PlusOutlined />}>
                添加覆盖
              </Button>
            </Flex>

            <Table
              dataSource={OVERRIDES}
              columns={overrideCols}
              rowKey="id"
              size="middle"
              pagination={false}
            />

            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid #f0f0f0',
                fontSize: 12,
                color: '#8c8c8c',
              }}
            >
              共 {OVERRIDES.length} 位陪玩单独配置 · 其余 39 位按默认 {defaultRatio}%
            </div>
          </Card>
        </div>
      </Flex>
    </div>
  );
}
