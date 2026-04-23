import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AuditOutlined, BarChartOutlined, BellOutlined, ClockCircleOutlined, CrownOutlined, DollarOutlined, HomeOutlined, OrderedListOutlined, SettingOutlined, TeamOutlined, UserOutlined, } from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
const { Sider, Header, Content } = Layout;
const MENU_ITEMS = [
    { key: '/dashboard', icon: _jsx(HomeOutlined, {}), label: '仪表盘' },
    {
        key: 'orders',
        icon: _jsx(OrderedListOutlined, {}),
        label: '订单管理',
        children: [
            { key: '/orders/list', label: '订单列表' },
            {
                key: '/orders/pending-payment',
                label: (_jsxs("span", { children: ["\u5F85\u786E\u8BA4\u4ED8\u6B3E ", _jsx(Badge, { count: 15, size: "small", style: { marginLeft: 6 } })] })),
            },
        ],
    },
    {
        key: 'reports',
        icon: _jsx(AuditOutlined, {}),
        label: (_jsxs("span", { children: ["\u62A5\u5907\u5BA1\u6838 ", _jsx(Badge, { count: 8, size: "small", style: { marginLeft: 6 } })] })),
        children: [{ key: '/reports', label: '待审核报备' }],
    },
    { key: '/players', icon: _jsx(TeamOutlined, {}), label: '陪玩管理' },
    {
        key: 'finance',
        icon: _jsx(DollarOutlined, {}),
        label: '财务',
        children: [
            { key: '/finance/withdrawals', label: '提现列表' },
            { key: '/finance/tips', label: '打赏记录' },
        ],
    },
    { key: '/analytics', icon: _jsx(BarChartOutlined, {}), label: '数据看板' },
    { key: '/club/config', icon: _jsx(SettingOutlined, {}), label: '俱乐部配置' },
    { key: '/admins', icon: _jsx(CrownOutlined, {}), label: '管理员管理' },
    { key: '/logs', icon: _jsx(ClockCircleOutlined, {}), label: '操作日志' },
];
export function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { token } = theme.useToken();
    const selectedKey = location.pathname;
    const openKeys = (MENU_ITEMS ?? []).flatMap((item) => item?.children?.some((c) => c.key === selectedKey) ? [item.key] : []);
    return (_jsxs(Layout, { style: { minHeight: '100vh' }, children: [_jsxs(Sider, { collapsible: true, collapsed: collapsed, onCollapse: setCollapsed, style: { overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }, theme: "dark", width: 208, children: [_jsxs("div", { style: { height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10 }, children: [_jsx("div", { style: {
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
                                }, children: "SX" }), !collapsed && (_jsx("span", { style: { color: '#fff', fontSize: 16, fontWeight: 600, letterSpacing: 0.5 }, children: "SoundX" }))] }), _jsx(Menu, { theme: "dark", mode: "inline", selectedKeys: [selectedKey], defaultOpenKeys: openKeys, items: MENU_ITEMS, onClick: ({ key }) => navigate(key), style: { borderRight: 0 } })] }), _jsxs(Layout, { children: [_jsxs(Header, { style: {
                            background: '#fff',
                            padding: '0 24px',
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: '1px solid #f0f0f0',
                            position: 'sticky',
                            top: 0,
                            zIndex: 100,
                        }, children: [_jsxs(Button, { type: "text", style: { marginRight: 16, display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsx("span", { style: { width: 8, height: 8, borderRadius: 4, background: '#52c41a', display: 'inline-block' } }), "\u661F\u8FB0\u7535\u7ADE\u4FF1\u4E50\u90E8", _jsx("span", { style: { fontSize: 10, color: '#8c8c8c' }, children: "\u25BE" })] }), _jsx("div", { style: { flex: 1 } }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 20 }, children: [_jsx(Badge, { count: 3, children: _jsx(BellOutlined, { style: { fontSize: 16, color: '#595959', cursor: 'pointer' } }) }), _jsx(Dropdown, { menu: {
                                            items: [
                                                { key: 'profile', icon: _jsx(UserOutlined, {}), label: '个人资料' },
                                                { key: 'logout', label: '退出登录' },
                                            ],
                                        }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }, children: [_jsx(Avatar, { size: 28, style: { background: token.colorPrimary, fontSize: 12 }, children: "\u5468" }), _jsx("span", { style: { fontSize: 14 }, children: "\u5468\u8001\u677F" })] }) })] })] }), _jsx(Content, { style: { background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }, children: _jsx(Outlet, {}) })] })] }));
}
