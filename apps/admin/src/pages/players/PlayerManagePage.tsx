import { SearchOutlined } from '@ant-design/icons';
import {
  Avatar,
  Card,
  Col,
  Input,
  Row,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { GAMES, PLAYERS } from '../../mock/data';
import { PLAYER_WORK_STATUS } from '../../constants/status';

const { Text } = Typography;
const GAME_MAP = Object.fromEntries(GAMES.map(g => [g.id, g]));

type Player = (typeof PLAYERS)[number];

export function PlayerManagePage() {
  const [keyword, setKeyword] = useState('');

  const filtered = PLAYERS.filter(
    p => !keyword || p.name.includes(keyword) || p.wechat.includes(keyword),
  );

  const online = PLAYERS.filter(p => ['online', 'in_service'].includes(p.status)).length;
  const pending = PLAYERS.filter(p => p.status === 'pending').length;

  const columns: ColumnsType<Player> = [
    {
      title: '陪玩',
      width: 160,
      render: (_, r) => (
        <Space>
          <Avatar size={28} style={{ background: '#1677ff', fontSize: 12 }}>
            {r.name[0]}
          </Avatar>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
            <div style={{ fontSize: 11, color: '#8c8c8c' }}>{r.wechat}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '游戏',
      dataIndex: 'games',
      width: 160,
      render: (v: string[]) => (
        <Space size={4} wrap>
          {v.map(g => (
            <Tag key={g} color={GAME_MAP[g]?.color} style={{ margin: 0, fontSize: 11 }}>
              {GAME_MAP[g]?.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    { title: '段位', dataIndex: 'tier', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: v => {
        const s = PLAYER_WORK_STATUS[v];
        return (
          <Space size={4}>
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: 3,
                background: s?.color,
              }}
            />
            <Text style={{ fontSize: 12 }}>{s?.text}</Text>
          </Space>
        );
      },
    },
    {
      title: '订单数',
      dataIndex: 'orders',
      width: 80,
      sorter: (a, b) => a.orders - b.orders,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      width: 70,
      render: v => (v > 0 ? <Text style={{ color: '#faad14' }}>★ {v}</Text> : '—'),
    },
    {
      title: '累计流水',
      dataIndex: 'income',
      width: 100,
      sorter: (a, b) => a.income - b.income,
      render: v => `¥${v.toLocaleString()}`,
    },
    {
      title: '当前余额',
      dataIndex: 'balance',
      width: 90,
      render: v => <Text style={{ color: '#1677ff' }}>¥{v}</Text>,
    },
    {
      title: '入驻日期',
      dataIndex: 'join',
      width: 110,
    },
    {
      title: '启用',
      width: 70,
      render: (_, r) => (
        <Switch
          size="small"
          defaultChecked={r.status !== 'pending'}
          disabled={r.status === 'pending'}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        {[
          { title: '在册陪玩', value: PLAYERS.length, suffix: '人', color: undefined },
          { title: '在线 / 服务中', value: online, suffix: '人', color: '#52c41a' },
          { title: '待审核入驻', value: pending, suffix: '人', color: '#faad14' },
          { title: '本月新增', value: 2, suffix: '人', color: undefined },
        ].map(s => (
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

      <div style={{ marginBottom: 12 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索昵称 / 微信号"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={false}
        scroll={{ x: 1000 }}
      />
    </div>
  );
}
