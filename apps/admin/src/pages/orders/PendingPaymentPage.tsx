import { CheckOutlined, CloseOutlined, EyeOutlined, PictureOutlined } from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Drawer,
  Image,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GAMES } from '../../mock/data';
import { ApiError, adminConfirmPayment, listAdminOrders, type OrderDto } from '../../services';

const { Text, Title } = Typography;

const GAME_MAP = Object.fromEntries(GAMES.map(g => [g.id, g]));

const VOUCHER_PLACEHOLDER = 'https://placehold.co/480x320/f5f5f5/999?text=付款凭证';

const DEFAULT_RATE = 70;
const PAL_OVERRIDES: Record<string, number> = {
  AhriQueen: 72,
  带飞专业户: 75,
  打野在哪: 68,
};

function getRate(pal: string | null): number {
  if (!pal) return DEFAULT_RATE;
  return PAL_OVERRIDES[pal] ?? DEFAULT_RATE;
}

/** 后端 OrderDto 归一化为页面需要的形态 */
interface Order {
  id: string;
  orderNo: string;
  user: string;
  pal: string | null;
  game: string;
  service: string;
  duration: number;
  amount: number;
  type: 'assign' | 'normal';
  ago: string;
  rate: number;
}

function timeAgo(iso: string | null): string {
  if (!iso) return '刚刚';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return '刚刚';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}分钟`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}小时`;
  return `${Math.floor(diff / 86_400_000)}天`;
}

function toOrderVM(o: OrderDto): Order {
  const pal = o.playerName ?? o.player?.nickname ?? null;
  return {
    id: o.id,
    orderNo: o.orderNo,
    user: o.user?.nickname ?? '老板',
    pal,
    game: o.serviceType, // schema 未独立存 game，暂用 serviceType
    service: o.serviceType,
    duration: o.hours ? parseFloat(o.hours) : 0,
    amount: o.totalAmount ? parseFloat(o.totalAmount) : 0,
    type: o.dispatchMode === 'designated' || o.dispatchMode === 'assign' ? 'assign' : 'normal',
    ago: timeAgo(o.createdAt),
    rate: getRate(pal),
  };
}

function SplitPreview({
  amount,
  rate,
  palName,
  isOverride,
}: {
  amount: number;
  rate: number;
  palName: string;
  isOverride: boolean;
}) {
  const palAmount = ((amount * rate) / 100).toFixed(2);
  const clubAmount = ((amount * (100 - rate)) / 100).toFixed(2);
  const clubRate = 100 - rate;

  return (
    <div
      style={{
        background: '#f7fbff',
        border: '1px solid #e6f4ff',
        borderRadius: 8,
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 12 }}>
        分账预览
      </Text>

      <div
        style={{
          display: 'flex',
          height: 40,
          borderRadius: 6,
          overflow: 'hidden',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: `${rate}%`,
            background: '#1677ff',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          陪玩 {rate}%
        </div>
        <div
          style={{
            width: `${clubRate}%`,
            background: '#bae0ff',
            color: '#1677ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          俱乐部 {clubRate}%
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div
          style={{
            flex: 1,
            background: '#fff',
            border: '1px solid #e6f4ff',
            borderRadius: 6,
            padding: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: '#1677ff',
                display: 'inline-block',
              }}
            />
            <Text style={{ fontSize: 12, color: '#595959' }}>陪玩 · {palName}</Text>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1677ff' }}>¥ {palAmount}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
            {amount.toFixed(2)} × {rate}% = {palAmount}
            {isOverride && <span style={{ color: '#d4a24a', marginLeft: 6 }}>· 单独覆盖</span>}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: '#fff',
            border: '1px solid #e6f4ff',
            borderRadius: 6,
            padding: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: '#bae0ff',
                display: 'inline-block',
              }}
            />
            <Text style={{ fontSize: 12, color: '#595959' }}>俱乐部留存</Text>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#262626' }}>¥ {clubAmount}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>
            {amount.toFixed(2)} × {clubRate}% = {clubAmount}
          </div>
        </div>
      </div>

      {isOverride && (
        <div style={{ marginTop: 10, fontSize: 12, color: '#1677ff' }}>
          ⓘ {palName} 单独配置 {rate}%, {rate > DEFAULT_RATE ? '高于' : '低于'} 默认 {DEFAULT_RATE}
          %。确认后陪玩侧账单同步按 {rate}% 入账。
        </div>
      )}
    </div>
  );
}

export function PendingPaymentPage() {
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [drawerOrder, setDrawerOrder] = useState<Order | null>(null);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const [amount, setAmount] = useState<number>(0);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  const reload = useCallback(() => setReloadTick(t => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    listAdminOrders({ page: 1, pageSize: 50, status: 'pending_payment' })
      .then(res => {
        if (cancelled) return;
        setOrders(res.list.map(toOrderVM));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setLoadError(err.message);
        setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadTick]);

  const data = useMemo(
    () =>
      orders.filter(
        r =>
          (gameFilter === 'all' || r.game === gameFilter) &&
          (typeFilter === 'all' || r.type === typeFilter),
      ),
    [orders, gameFilter, typeFilter],
  );

  const openDrawer = (order: Order) => {
    setAmount(order.amount);
    setDrawerOrder(order);
  };

  const handleConfirm = useCallback(
    async (order: Order) => {
      setSubmittingId(order.id);
      try {
        await adminConfirmPayment(order.id);
        setConfirmed(p => new Set(p).add(order.orderNo));
        message.success(`订单 ${order.orderNo} 已确认付款`);
        if (drawerOrder?.id === order.id) setDrawerOrder(null);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : '确认付款失败';
        message.error(msg);
      } finally {
        setSubmittingId(null);
      }
    },
    [drawerOrder],
  );

  const handleReject = useCallback(
    (order: Order) => {
      // 后端暂无"驳回付款"接口；本地标记，后续接通 P1
      setRejected(p => new Set(p).add(order.orderNo));
      if (drawerOrder?.id === order.id) setDrawerOrder(null);
      message.info('已本地驳回（后端驳回接口待接入）');
    },
    [drawerOrder],
  );

  useEffect(() => {
    if (!drawerOrder) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'y' || e.key === 'Y') handleConfirm(drawerOrder);
      if (e.key === 'n' || e.key === 'N') handleReject(drawerOrder);
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
      render: v => (
        <Text copyable style={{ fontSize: 12, fontFamily: 'monospace' }}>
          {v}
        </Text>
      ),
    },
    { title: '用户', dataIndex: 'user', width: 120 },
    {
      title: '陪玩',
      dataIndex: 'pal',
      width: 120,
      render: v => (v ? <Text>{v}</Text> : <Tag color="gold">待派发</Tag>),
    },
    {
      title: '游戏 / 服务',
      width: 160,
      render: (_, r) => {
        const g = GAME_MAP[r.game];
        return (
          <Space size={4} direction="vertical" style={{ lineHeight: 1.4 }}>
            <Tag color={g?.color} style={{ margin: 0, fontSize: 11 }}>
              {g?.name}
            </Tag>
            <Text style={{ fontSize: 12 }}>
              {r.service} · {r.duration}h
            </Text>
          </Space>
        );
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 90,
      render: v => (
        <Text strong style={{ color: '#52c41a' }}>
          ¥{v}
        </Text>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: v => (
        <Tag color={v === 'assign' ? 'blue' : 'default'}>{v === 'assign' ? '指定' : '随机'}</Tag>
      ),
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
      render: v => {
        const mins = parseInt(v);
        return (
          <Text type={mins > 20 ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>
            {v}
          </Text>
        );
      },
    },
    {
      title: '操作',
      width: 170,
      render: (_, r) => {
        if (confirmed.has(r.orderNo)) return <Tag color="green">已确认</Tag>;
        if (rejected.has(r.orderNo)) return <Tag color="red">已拒绝</Tag>;
        return (
          <Space size={4}>
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              loading={submittingId === r.id}
              onClick={() => handleConfirm(r)}
            >
              确认
            </Button>
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleReject(r)}
            >
              拒绝
            </Button>
            <Button size="small" icon={<EyeOutlined />} onClick={() => openDrawer(r)} />
          </Space>
        );
      },
    },
  ];

  const pending = data.filter(r => !confirmed.has(r.orderNo) && !rejected.has(r.orderNo));

  const palName = drawerOrder?.pal ?? '待派发';
  const isOverride = !!drawerOrder?.pal && drawerOrder.pal in PAL_OVERRIDES;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>
          待确认付款
        </Title>
        <Badge count={pending.length} style={{ background: '#faad14' }} />
        <div style={{ flex: 1 }} />
        <Button size="small" onClick={reload} loading={loading}>
          刷新
        </Button>
        <Select
          value={gameFilter}
          onChange={setGameFilter}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: '全部游戏' },
            ...GAMES.map(g => ({ value: g.id, label: g.name })),
          ]}
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

      {loadError && (
        <Alert
          type="error"
          showIcon
          message={`加载失败：${loadError}`}
          closable
          style={{ marginBottom: 12 }}
        />
      )}

      <Spin spinning={loading}>
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
          rowClassName={r =>
            confirmed.has(r.orderNo) || rejected.has(r.orderNo) ? 'ant-table-row-disabled' : ''
          }
          onRow={r => ({
            style: { opacity: confirmed.has(r.orderNo) || rejected.has(r.orderNo) ? 0.4 : 1 },
          })}
          scroll={{ x: 900 }}
        />
      </Spin>

      <Drawer
        open={!!drawerOrder}
        onClose={() => setDrawerOrder(null)}
        width={780}
        title={
          <span>
            确认付款凭证
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 12 }}>
              按 Y 确认 · N 拒绝 · Esc 关闭
            </Text>
          </span>
        }
        footer={
          drawerOrder &&
          !confirmed.has(drawerOrder.orderNo) &&
          !rejected.has(drawerOrder.orderNo) ? (
            <Space>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                loading={submittingId === drawerOrder.id}
                onClick={() => handleConfirm(drawerOrder)}
              >
                确认付款 · 自动派发给 {palName}
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(drawerOrder)}
              >
                凭证有误 (N)
              </Button>
            </Space>
          ) : null
        }
      >
        {drawerOrder && (
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Image
                src={VOUCHER_PLACEHOLDER}
                alt="付款凭证"
                style={{ width: '100%', borderRadius: 8 }}
                preview={{ mask: '点击预览' }}
              />
            </div>
            <div style={{ width: 340, flexShrink: 0 }}>
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  订单号
                </Text>
                <div style={{ fontFamily: 'monospace', fontSize: 13, marginTop: 2 }}>
                  {drawerOrder.orderNo}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  用户 / 陪玩
                </Text>
                <div style={{ fontSize: 13, marginTop: 2 }}>
                  {drawerOrder.user} → {drawerOrder.pal ?? '待派发'}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  服务
                </Text>
                <div style={{ fontSize: 13, marginTop: 2 }}>
                  {GAME_MAP[drawerOrder.game]?.name} · {drawerOrder.service} ·{' '}
                  {drawerOrder.duration}h
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  应付金额
                </Text>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#52c41a', marginTop: 2 }}>
                  ¥{drawerOrder.amount}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  实际到账金额
                </Text>
                <Input
                  prefix="¥"
                  value={amount}
                  onChange={e => {
                    const v = Number(e.target.value);
                    if (!Number.isNaN(v)) setAmount(v);
                  }}
                  style={{ marginTop: 4 }}
                />
                <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
                  如凭证金额与应付金额不一致, 请按凭证填入, 分账自动按实际到账重算
                </Text>
              </div>

              <SplitPreview
                amount={amount}
                rate={drawerOrder.rate}
                palName={palName}
                isOverride={isOverride}
              />

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
