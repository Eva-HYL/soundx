import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

type Admin = {
  id: string;
  name: string;
  wechat: string;
  role: 'super_admin' | 'club_admin' | 'ops' | 'finance';
  since: string;
  active: boolean;
};

const ADMINS: Admin[] = [
  { id: 'A001', name: '王超', wechat: 'wangchao_sx', role: 'super_admin', since: '2024-01-01', active: true },
  { id: 'A002', name: '李敏', wechat: 'li_ops',      role: 'ops',         since: '2024-01-15', active: true },
  { id: 'A003', name: '张涛', wechat: 'zt_finance',  role: 'finance',     since: '2024-02-01', active: true },
  { id: 'A004', name: '陈静', wechat: 'chen_jing',   role: 'club_admin',  since: '2024-03-01', active: false },
];

type Permission = {
  label: string;
  super_admin: boolean;
  club_admin: boolean;
  ops: boolean;
  finance: boolean;
};

const PERMISSIONS: Permission[] = [
  { label: '确认付款',   super_admin: true,  club_admin: true,  ops: true,  finance: false },
  { label: '审核报备',   super_admin: true,  club_admin: true,  ops: true,  finance: false },
  { label: '审核提现',   super_admin: true,  club_admin: true,  ops: false, finance: true  },
  { label: '确认转账',   super_admin: true,  club_admin: false, ops: false, finance: true  },
  { label: '陪玩管理',   super_admin: true,  club_admin: true,  ops: true,  finance: false },
  { label: '俱乐部配置', super_admin: true,  club_admin: true,  ops: false, finance: false },
  { label: '管理员管理', super_admin: true,  club_admin: false, ops: false, finance: false },
  { label: '数据看板',   super_admin: true,  club_admin: true,  ops: true,  finance: true  },
  { label: '操作日志',   super_admin: true,  club_admin: true,  ops: true,  finance: true  },
];

const ROLE_LABELS: Record<string, string> = {
  super_admin: '超级管理员',
  club_admin: '俱乐部管理员',
  ops: '运营',
  finance: '财务',
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'red',
  club_admin: 'blue',
  ops: 'cyan',
  finance: 'gold',
};

const adminCols: ColumnsType<Admin> = [
  { title: '姓名', dataIndex: 'name', width: 100 },
  { title: '微信号', dataIndex: 'wechat', width: 140 },
  {
    title: '角色',
    dataIndex: 'role',
    width: 120,
    render: (v) => <Tag color={ROLE_COLORS[v]}>{ROLE_LABELS[v]}</Tag>,
  },
  { title: '加入时间', dataIndex: 'since', width: 120 },
  {
    title: '状态',
    dataIndex: 'active',
    width: 80,
    render: (v) => <Tag color={v ? 'green' : 'default'}>{v ? '正常' : '已停用'}</Tag>,
  },
  {
    title: '操作',
    width: 100,
    render: (_, r) => (
      <Space size={4}>
        <Button size="small">编辑</Button>
        {r.role !== 'super_admin' && (
          <Button size="small" danger={r.active} type="text">
            {r.active ? '停用' : '启用'}
          </Button>
        )}
      </Space>
    ),
  },
];

const permCols: ColumnsType<Permission> = [
  { title: '功能', dataIndex: 'label', width: 120 },
  {
    title: '超级管理员',
    dataIndex: 'super_admin',
    width: 100,
    render: (v) => <Checkbox checked={v} disabled />,
  },
  {
    title: '俱乐部管理员',
    dataIndex: 'club_admin',
    width: 110,
    render: (v) => <Checkbox checked={v} disabled />,
  },
  {
    title: '运营',
    dataIndex: 'ops',
    width: 80,
    render: (v) => <Checkbox checked={v} disabled />,
  },
  {
    title: '财务',
    dataIndex: 'finance',
    width: 80,
    render: (v) => <Checkbox checked={v} disabled />,
  },
];

export function AdminManagePage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 20 }}>管理员管理</Title>

      <Card
        title="管理员列表"
        size="small"
        extra={<Button type="primary" size="small" icon={<PlusOutlined />}>添加管理员</Button>}
        style={{ marginBottom: 16 }}
      >
        <Table
          dataSource={ADMINS}
          columns={adminCols}
          rowKey="id"
          size="small"
          pagination={false}
        />
      </Card>

      <Card title="角色权限矩阵" size="small">
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
          权限配置由平台统一管理，不可在此修改。
        </Text>
        <Table
          dataSource={PERMISSIONS}
          columns={permCols}
          rowKey="label"
          size="small"
          pagination={false}
        />
      </Card>
    </div>
  );
}
