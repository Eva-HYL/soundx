import { CheckOutlined, CloseOutlined, EyeOutlined, PictureOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, Image, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import { GAMES, PENDING_PAYMENTS } from '../../mock/data';

const { Text, Title } = Typography;

type Order = (typeof PENDING_PAYMENTS)[number];

const GAME_MAP = Object.fromEntries(GAMES.map((g) => [g.id, g]));

const VOUCHER_PLACEHOLDER = 'https://placehold.co/480x320/f5f5f5/999?text=付款凭证';

function SplitPreview({ amount, ratio = 70 }: { amount: number; ratio?: number }) {
  const pal = ((amount * ratio) / 100).toFixed(2);
  const club = ((amount * (100 - ratio)) / 100).toFixed(2);
  return (
    <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 6, padding: '10px 14px' }}>
      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>结算预览（默认比例 {ratio}%）</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span>陪玩分成</span>
        <Text style={{ color: '#1677ff' }}>¥{pal}</Text>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4 }}>
        <span>俱乐部抽成</span>
        <Text type="secondary">¥{club}</Text>
      </div>
      <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span>订单金额</span>
        <Text strong>¥{amount.toFixed(2)}</Text>
      </div>
    </div>
  );
}

export function PendingPaymentPage() {
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [drawerOrder, setDrawerOrder] = useState<Order | null>(null);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());

  const data = PENDING_PAYMENTS.filter(
    (r) =>
      (gameFilter === 'all' || r.game === gameFilter) &&
      (typeFilter === 'all' || r.type === typeFilter),
  );

  const handleConfirm = useCallback(
    (orderNo: string) => {
      setConfirmed((p) => new Set(p).add(orderNo));
      if (drawerOrder?.orderNo === orderNo) setDrawerOrder(null);
    },
    [drawerOrder],
  );

  const handleReject = useCallback(
    (orderNo: string) => {
      setRejected((p) => new Set(p).add(orderNo));
      if (drawerOrder?.orderNo === orderNo) setDrawerOrder(null);
    },
    [drawerOrder],
  );

  useEffect(() => {
    if (!drawerOrder) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'y' || e.key === 'Y') handleConfirm(drawerOrder.orderNo);
      if (e.key === 'n' || e.key === 'N') handleReject(drawerOrder.orderNo);
      if (e.key === 'Escape') setDrawerOrder(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [drawerOrder, handleConfirm, handleReject]);

  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: 140,
      render: (v) => <Text copyable style={{ fontSize: 12, fontFamily: 'monospace' }}>{v}</Text>,
    },
    { title: '用户', dataIndex: 'user', width: 120 },
    {
      title: '陪玩',
      dataIndex: 'pal',
      width: 120,
      render: (v) => v ? <Text>{v}</Text> : <Tag color="gold">待派发</Tag>,
    },
    {
      title: '游戏 / 服务',
      width: 160,
      render: (_, r) => {
        const g = GAME_MAP[r.game];
        return (
          <Space size={4} direction="vertical" style={{ lineHeight: 1.4 }}>
            <Tag color={g?.color} style={{ margin: 0, fontSize: 11 }}>{g?.name}</Tag>
            <Text style={{ fontSize: 12 }}>{r.service} · {r.duration}h</Text>
          </Space>
        );
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 90,
      render: (v) => <Text strong style={{ color: '#52c41a' }}>¥{v}</Text>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (v) => <Tag color={v === 'assign' ? 'blue' : 'default'}>{v === 'assign' ? '指定' : '随机'}</Tag>,
    },
    {
      title: '凭证',
      width: 70,
      render: () => (
        <Tooltip title="查看凭证">
          <PictureOutlined style={{ fontSize: 18, color: '#1677ff', cursor: 'pointer' }} />
        </Tooltip>
      ),
    },
    {
      title: '等待',
      dataIndex: 'ago',
      width: 100,
      render: (v) => {
        const mins = parseInt(v);
        return <Text type={mins > 20 ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>{v}</Text>;
      },
    },
    {
      title: '操作',
      width: 150,
      render: (_, r) => {
        if (confirmed.has(r.orderNo)) return <Tag color="green">已确认</Tag>;
        if (rejected.has(r.orderNo)) return <Tag color="red">已拒绝</Tag>;
        return (
          <Space size={4}>
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleConfirm(r.orderNo)}
            >
              确认
            </Button>
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleReject(r.orderNo)}
            >
              拒绝
            </Button>
            <Button size="small" icon={<EyeOutlined />} onClick={() => setDrawerOrder(r)} />
          </Space>
        );
      },
    },
  ];

  const pending = data.filter((r) => !confirmed.has(r.orderNo) && !rejected.has(r.orderNo));

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>
          待确认付款
        </Title>
        <Badge count={pending.length} style={{ background: '#faad14' }} />
        <div style={{ flex: 1 }} />
        <Select
          value={gameFilter}
          onChange={setGameFilter}
          style={{ width: 120 }}
          options={[{ value: 'all', label: '全部游戏' }, ...GAMES.map((g) => ({ value: g.id, label: g.name }))]}
        />
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 100 }}
          options={[
            { value: 'all', label: '全部类型' },
            { value: 'assign', label: '指定陪玩' },
            { value: 'normal', label: '随机派单' },
          ]}
        />
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="orderNo"
        size="small"
        pagination={false}
        rowClassName={(r) =>
          confirmed.has(r.orderNo) || rejected.has(r.orderNo) ? 'ant-table-row-disabled' : ''
        }
        onRow={(r) => ({
          style: { opacity: confirmed.has(r.orderNo) || rejected.has(r.orderNo) ? 0.4 : 1 },
        })}
        scroll={{ x: 900 }}
      />

      <Drawer
        open={!!drawerOrder}
        onClose={() => setDrawerOrder(null)}
        width={720}
        title={
          <span>
            确认付款凭证
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 12 }}>
              按 Y 确认 · N 拒绝 · Esc 关闭
            </Text>
          </span>
        }
        footer={
          drawerOrder && !confirmed.has(drawerOrder.orderNo) && !rejected.has(drawerOrder.orderNo) ? (
            <Space>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleConfirm(drawerOrder.orderNo)}
              >
                确认到账 (Y)
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(drawerOrder.orderNo)}
              >
                凭证有误 (N)
              </Button>
            </Space>
          ) : null
        }
      >
        {drawerOrder && (
          <div style={{ display: 'flex', gap: 24, height: '100%' }}>
            <div style={{ flex: 1 }}>
              <Image
                src={VOUCHER_PLACEHOLDER}
                alt="付款凭证"
                style={{ width: '100%', borderRadius: 8 }}
                preview={{ mask: '点击预览' }}
              />
            </div>
            <div style={{ width: 240, flexShrink: 0 }}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>订单号</Text>
                <div style={{ fontFamily: 'monospace', fontSize: 13, marginTop: 2 }}>{drawerOrder.orderNo}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>用户 / 陪玩</Text>
                <div style={{ fontSize: 13, marginTop: 2 }}>{drawerOrder.user} → {drawerOrder.pal ?? '待派发'}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>服务</Text>
                <div style={{ fontSize: 13, marginTop: 2 }}>
                  {GAME_MAP[drawerOrder.game]?.name} · {drawerOrder.service} · {drawerOrder.duration}h
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>应付金额</Text>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#52c41a', marginTop: 2 }}>
                  ¥{drawerOrder.amount}
                </div>
              </div>
              <SplitPreview amount={drawerOrder.amount} />
              <div style={{ marginTop: 12, fontSize: 12, color: '#8c8c8c' }}>
                提交于 {drawerOrder.ago}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
