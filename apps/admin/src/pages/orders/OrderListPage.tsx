import { SearchOutlined } from '@ant-design/icons';
import { Input, Select, Space, Table, Tabs, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { GAMES, ORDER_LIST } from '../../mock/data';
import { ORDER_STATUS } from '../../constants/status';

const { Text } = Typography;
const GAME_MAP = Object.fromEntries(GAMES.map(g => [g.id, g]));

const STATUS_TABS = [
  { key: 'all', label: '全部' },
  { key: 'pending_payment', label: '待付款' },
  { key: 'paid_pending_dispatch', label: '待派发' },
  { key: 'in_service', label: '服务中' },
  { key: 'pending_report_audit', label: '待审核' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

type Order = (typeof ORDER_LIST)[number];

const columns: ColumnsType<Order> = [
  {
    title: '订单号',
    dataIndex: 'no',
    width: 140,
    render: v => (
      <Text copyable style={{ fontSize: 12, fontFamily: 'monospace' }}>
        {v}
      </Text>
    ),
  },
  { title: '用户', dataIndex: 'user', width: 120 },
  { title: '陪玩', dataIndex: 'pal', width: 120 },
  {
    title: '游戏',
    dataIndex: 'game',
    width: 100,
    render: v => {
      const g = GAME_MAP[v];
      return (
        <Tag color={g?.color} style={{ margin: 0 }}>
          {g?.name}
        </Tag>
      );
    },
  },
  { title: '服务', dataIndex: 'svc', width: 120 },
  {
    title: '时长',
    dataIndex: 'dur',
    width: 70,
    render: v => `${v}h`,
  },
  {
    title: '金额',
    dataIndex: 'total',
    width: 80,
    render: v => <Text strong>¥{v}</Text>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 90,
    render: v => {
      const s = ORDER_STATUS[v];
      return <Tag color={s?.color}>{s?.text}</Tag>;
    },
  },
  { title: '时间', dataIndex: 'time', width: 100 },
];

export function OrderListPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [gameFilter, setGameFilter] = useState('all');

  const filtered = ORDER_LIST.filter(
    r =>
      (activeTab === 'all' || r.status === activeTab) &&
      (gameFilter === 'all' || r.game === gameFilter) &&
      (!keyword || r.no.includes(keyword) || r.user.includes(keyword) || r.pal.includes(keyword)),
  );

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索订单号 / 用户 / 陪玩"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ width: 240 }}
          allowClear
        />
        <Select
          value={gameFilter}
          onChange={setGameFilter}
          style={{ width: 130 }}
          options={[
            { value: 'all', label: '全部游戏' },
            ...GAMES.map(g => ({ value: g.id, label: g.name })),
          ]}
        />
      </Space>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={STATUS_TABS.map(t => ({
          key: t.key,
          label: t.label,
        }))}
      />

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="no"
        size="small"
        pagination={{ pageSize: 20, showSizeChanger: false }}
        scroll={{ x: 900 }}
      />
    </div>
  );
}
