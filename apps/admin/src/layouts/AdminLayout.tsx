import {
  AuditOutlined,
  BarChartOutlined,
  BellOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  DollarOutlined,
  HomeOutlined,
  OrderedListOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Sider, Header, Content } = Layout;

const MENU_ITEMS: MenuProps['items'] = [
  { key: '/dashboard', icon: <HomeOutlined />, label: '仪表盘' },
  {
    key: 'orders',
    icon: <OrderedListOutlined />,
    label: '订单管理',
    children: [
      { key: '/orders/list', label: '订单列表' },
      {
        key: '/orders/pending-payment',
        label: (
          <span>
            待确认付款 <Badge count={15} size="small" style={{ marginLeft: 6 }} />
          </span>
        ),
      },
    ],
  },
  {
    key: 'reports',
    icon: <AuditOutlined />,
    label: (
      <span>
        报备审核 <Badge count={8} size="small" style={{ marginLeft: 6 }} />
      </span>
    ),
    children: [{ key: '/reports', label: '待审核报备' }],
  },
  { key: '/players', icon: <TeamOutlined />, label: '陪玩管理' },
  {
    key: 'finance',
    icon: <DollarOutlined />,
    label: '财务',
    children: [
      { key: '/finance/withdrawals', label: '提现列表' },
      { key: '/finance/tips', label: '打赏记录' },
    ],
  },
  { key: '/analytics', icon: <BarChartOutlined />, label: '数据看板' },
  { key: '/club/config', icon: <SettingOutlined />, label: '俱乐部配置' },
  { key: '/admins', icon: <CrownOutlined />, label: '管理员管理' },
  { key: '/logs', icon: <ClockCircleOutlined />, label: '操作日志' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  const selectedKey = location.pathname;
  const openKeys = (MENU_ITEMS ?? []).flatMap((item: any) =>
    item?.children?.some((c: any) => c.key === selectedKey) ? [item.key as string] : [],
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }}
        theme="dark"
        width={208}
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: token.colorPrimary,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            SX
          </div>
          {!collapsed && (
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 600, letterSpacing: 0.5 }}>
              SoundX
            </span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={MENU_ITEMS}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Button
            type="text"
            style={{ marginRight: 16, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 4, background: '#52c41a', display: 'inline-block' }} />
            星辰电竞俱乐部
            <span style={{ fontSize: 10, color: '#8c8c8c' }}>▾</span>
          </Button>

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Badge count={3}>
              <BellOutlined style={{ fontSize: 16, color: '#595959', cursor: 'pointer' }} />
            </Badge>
            <Dropdown
              menu={{
                items: [
                  { key: 'profile', icon: <UserOutlined />, label: '个人资料' },
                  { key: 'logout', label: '退出登录' },
                ],
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar size={28} style={{ background: token.colorPrimary, fontSize: 12 }}>
                  周
                </Avatar>
                <span style={{ fontSize: 14 }}>周老板</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
