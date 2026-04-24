import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Input, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

type RoleKey = 'owner' | 'ops' | 'finance' | 'cs';

const ROLES: Record<RoleKey, { label: string; color: string; desc: string; count: number }> = {
  owner: {
    label: '超级管理员',
    color: '#ff4d4f',
    desc: '所有权限 + 管理员账号 + 分成配置',
    count: 1,
  },
  ops: {
    label: '运营',
    color: '#1677ff',
    desc: '订单 / 陪玩 / 报备 / 公告',
    count: 2,
  },
  finance: {
    label: '财务',
    color: '#52c41a',
    desc: '付款确认 / 提现 / 打赏 / 账单导出',
    count: 1,
  },
  cs: {
    label: '客服',
    color: '#d48806',
    desc: '订单查看 / 消息推送 / 投诉处理',
    count: 2,
  },
};

type Account = {
  name: string;
  u: string;
  role: RoleKey;
  phone: string;
  last: string;
  status: 'active' | 'disabled';
};

const ACCOUNTS: Account[] = [
  { name: '王超', u: 'admin', role: 'owner', phone: '138****1001', last: '刚刚', status: 'active' },
  {
    name: '李敏',
    u: 'li_min',
    role: 'ops',
    phone: '139****2045',
    last: '10 分钟前',
    status: 'active',
  },
  {
    name: '张涛',
    u: 'finance_zt',
    role: 'finance',
    phone: '150****8876',
    last: '昨 23:12',
    status: 'active',
  },
  {
    name: '陈婧',
    u: 'cs_chenj',
    role: 'cs',
    phone: '187****3320',
    last: '昨 18:42',
    status: 'active',
  },
  {
    name: '周小华',
    u: 'zhou_xh',
    role: 'ops',
    phone: '133****5520',
    last: '3 天前',
    status: 'active',
  },
  {
    name: '赵强(已离职)',
    u: 'zhao_q',
    role: 'cs',
    phone: '159****1178',
    last: '2024-04-02',
    status: 'disabled',
  },
];

type PermRow = [string, [number, number, number, number]];

const PERMS: PermRow[] = [
  ['订单查看', [1, 1, 1, 1]],
  ['确认付款', [1, 0, 1, 0]],
  ['审核报备', [1, 1, 0, 0]],
  ['审核提现', [1, 0, 1, 0]],
  ['陪玩管理', [1, 1, 0, 0]],
  ['分成配置', [1, 0, 0, 0]],
  ['管理员管理', [1, 0, 0, 0]],
  ['数据看板', [1, 1, 1, 0]],
  ['操作日志', [1, 0, 0, 0]],
  ['消息推送', [1, 1, 0, 1]],
];

function RoleCard({ role }: { role: RoleKey }) {
  const r = ROLES[role];
  return (
    <Card size="small" style={{ flex: 1 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
        <Tag color={r.color} style={{ margin: 0, fontSize: 12, padding: '2px 8px' }}>
          {r.label}
        </Tag>
        <Text style={{ fontSize: 13, fontWeight: 600 }}>{r.count}人</Text>
      </Flex>
      <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.55 }}>
        {r.desc}
      </Text>
    </Card>
  );
}

function Avatar({ name, color }: { name: string; color: string }) {
  return (
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
  );
}

function StatusDot({ status }: { status: 'active' | 'disabled' }) {
  const color = status === 'active' ? '#52c41a' : '#bfbfbf';
  const label = status === 'active' ? '正常' : '已禁用';
  return (
    <Flex align="center" gap={6}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: color,
          display: 'inline-block',
        }}
      />
      <Text style={{ fontSize: 13, color: status === 'active' ? '#262626' : '#8c8c8c' }}>
        {label}
      </Text>
    </Flex>
  );
}

export function AdminManagePage() {
  const accountCols: ColumnsType<Account> = [
    {
      title: '姓名/账号',
      width: 180,
      render: (_, r) => (
        <Flex align="center" gap={10}>
          <Avatar name={r.name} color={ROLES[r.role].color} />
          <div style={{ lineHeight: 1.4 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
            <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>
              {r.u}
            </Text>
          </div>
        </Flex>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 110,
      render: (v: RoleKey) => (
        <Tag color={ROLES[v].color} style={{ margin: 0 }}>
          {ROLES[v].label}
        </Tag>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
      render: (v: string) => <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{v}</Text>,
    },
    {
      title: '最近登录',
      dataIndex: 'last',
      width: 110,
      render: (v: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {v}
        </Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: 'active' | 'disabled') => <StatusDot status={v} />,
    },
    {
      title: '操作',
      width: 200,
      render: (_, r) => {
        if (r.role === 'owner') {
          return <Text type="secondary">—</Text>;
        }
        return (
          <Space size={4}>
            <Button type="link" size="small" style={{ padding: 0 }}>
              编辑
            </Button>
            <Text type="secondary">|</Text>
            <Button type="link" size="small" style={{ padding: 0 }}>
              重置密码
            </Button>
            <Text type="secondary">|</Text>
            <Button type="link" size="small" danger={r.status === 'active'} style={{ padding: 0 }}>
              {r.status === 'active' ? '禁用' : '启用'}
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            管理员管理
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            仅超级管理员可见 · 创建、修改、禁用后台账号
          </Text>
        </div>
        <Space>
          <Button>权限模板</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            新建账号
          </Button>
        </Space>
      </Flex>

      <Flex gap={16} style={{ marginBottom: 16 }}>
        <RoleCard role="owner" />
        <RoleCard role="ops" />
        <RoleCard role="finance" />
        <RoleCard role="cs" />
      </Flex>

      <Flex gap={16} align="flex-start">
        <Card style={{ flex: 1, minWidth: 0 }} styles={{ body: { padding: 0 } }}>
          <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
            <Space>
              <Input
                placeholder="姓名 / 账号 / 手机号"
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                style={{ width: 240 }}
              />
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: '全部角色' },
                  { value: 'owner', label: '超级管理员' },
                  { value: 'ops', label: '运营' },
                  { value: 'finance', label: '财务' },
                  { value: 'cs', label: '客服' },
                ]}
              />
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: '全部状态' },
                  { value: 'active', label: '正常' },
                  { value: 'disabled', label: '已禁用' },
                ]}
              />
              <Button type="primary">查询</Button>
            </Space>
          </div>
          <Table
            dataSource={ACCOUNTS}
            columns={accountCols}
            rowKey="u"
            size="middle"
            pagination={false}
            onRow={r => ({
              style: { opacity: r.status === 'disabled' ? 0.5 : 1 },
            })}
          />
        </Card>

        <Card style={{ width: 360, flexShrink: 0 }} styles={{ body: { padding: 0 } }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={5} style={{ margin: 0 }}>
              权限矩阵
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              角色可执行的关键操作
            </Text>
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 12,
            }}
          >
            <thead>
              <tr style={{ background: '#fafafa' }}>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    color: '#595959',
                    fontWeight: 500,
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  模块
                </th>
                {['超管', '运营', '财务', '客服'].map(h => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'center',
                      padding: '8px 6px',
                      color: '#595959',
                      fontWeight: 500,
                      borderBottom: '1px solid #f0f0f0',
                      width: 52,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMS.map(([label, flags]) => (
                <tr key={label} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '8px 12px', color: '#262626' }}>{label}</td>
                  {flags.map((f, i) => (
                    <td
                      key={i}
                      style={{
                        textAlign: 'center',
                        padding: '8px 6px',
                        color: f ? '#52c41a' : '#bfbfbf',
                        fontWeight: f ? 600 : 400,
                      }}
                    >
                      {f ? '✓' : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Flex>
    </div>
  );
}
