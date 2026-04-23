import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowRightOutlined } from '@ant-design/icons';
import { Badge, Card, Col, Progress, Row, Space, Statistic, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
const TODO_ITEMS = [
    { count: 15, title: '待确认付款', sub: '最早提交 10:02 · 已等 2 小时 41 分', urgent: true, link: '/orders/pending-payment' },
    { count: 8, title: '待审核报备', sub: '最早提交 13:24 · 已等 41 分', urgent: true, link: '/reports' },
    { count: 5, title: '待审核提现', sub: '最早提交 10:32 · 已等 4 小时 12 分', urgent: false, link: '/finance/withdrawals' },
    { count: 3, title: '待转账提现', sub: '已审核通过，待线下转账后确认', urgent: false, link: '/finance/withdrawals' },
    { count: 2, title: '陪玩入驻申请', sub: '待审核资料', urgent: false, link: '/players' },
];
const ORDER_DIST = [
    { status: '待付款', count: 15, pct: 17, color: '#faad14' },
    { status: '待派发', count: 4, pct: 5, color: '#1677ff' },
    { status: '服务中', count: 12, pct: 14, color: '#1677ff' },
    { status: '待审核', count: 8, pct: 9, color: '#fa8c16' },
    { status: '已完成', count: 44, pct: 50, color: '#52c41a' },
    { status: '已取消', count: 4, pct: 5, color: '#d9d9d9' },
];
const TOP_PALS = [
    { name: '带飞专业户', revenue: '¥2,180', orders: 28 },
    { name: 'AhriQueen', revenue: '¥1,840', orders: 22 },
    { name: '打野在哪', revenue: '¥1,560', orders: 31 },
];
export function DashboardPage() {
    const navigate = useNavigate();
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Title, { level: 4, style: { marginBottom: 24 }, children: "\u6B22\u8FCE\u56DE\u6765\uFF0C\u5468\u8001\u677F" }), _jsx(Row, { gutter: 16, style: { marginBottom: 24 }, children: [
                    { title: '今日订单', value: 87, suffix: '单', sub: '↑ 12% 较昨日' },
                    { title: '今日流水', value: '¥6,840', sub: '↑ 8.4% 较昨日' },
                    { title: '待确认付款', value: 15, sub: '最长等待 28 分钟', urgent: true },
                    { title: '待审核报备', value: 8, sub: '最长等待 41 分钟', urgent: true },
                    { title: '在线陪玩', value: 23, suffix: '人', sub: '/ 48 名在册' },
                ].map((s) => (_jsx(Col, { flex: 1, children: _jsxs(Card, { size: "small", children: [_jsx(Statistic, { title: s.title, value: s.value, suffix: s.suffix, valueStyle: { color: s.urgent ? '#faad14' : undefined, fontSize: 28 } }), _jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: s.sub })] }) }, s.title))) }), _jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 12, children: _jsx(Card, { title: _jsxs("span", { children: ["\u4ECA\u65E5\u5F85\u529E ", _jsx(Text, { type: "secondary", style: { fontSize: 12, fontWeight: 400 }, children: "\u5171 28 \u9879" })] }), size: "small", children: _jsx(Space, { direction: "vertical", style: { width: '100%' }, size: 8, children: TODO_ITEMS.map((item) => (_jsxs("div", { onClick: () => navigate(item.link), style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '10px 12px',
                                        borderRadius: 6,
                                        background: item.urgent ? '#fffbe6' : '#fafafa',
                                        border: `1px solid ${item.urgent ? '#ffe58f' : '#f0f0f0'}`,
                                        cursor: 'pointer',
                                    }, children: [_jsx(Badge, { count: item.count, style: { background: item.urgent ? '#faad14' : '#1677ff' } }), _jsxs("div", { style: { flex: 1, marginLeft: 12 }, children: [_jsx("div", { style: { fontSize: 14, fontWeight: 500 }, children: item.title }), _jsx("div", { style: { fontSize: 12, color: '#8c8c8c', marginTop: 2 }, children: item.sub })] }), _jsx(ArrowRightOutlined, { style: { color: '#1677ff', fontSize: 12 } })] }, item.title))) }) }) }), _jsxs(Col, { span: 12, children: [_jsx(Card, { title: "\u8BA2\u5355\u72B6\u6001\u5206\u5E03 \u00B7 \u672C\u65E5", size: "small", style: { marginBottom: 16 }, children: _jsx(Space, { direction: "vertical", style: { width: '100%' }, size: 8, children: ORDER_DIST.map((r) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }, children: [_jsx(Tag, { color: r.color, style: { minWidth: 60, textAlign: 'center', margin: 0 }, children: r.status }), _jsx(Progress, { percent: r.pct, showInfo: false, strokeColor: r.color, size: ['100%', 6], style: { flex: 1, marginBottom: 0 } }), _jsx(Text, { style: { width: 32, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }, children: r.count })] }, r.status))) }) }), _jsx(Card, { title: "\u672C\u5468 Top \u966A\u73A9", size: "small", children: TOP_PALS.map((p, i) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', padding: '6px 0', fontSize: 13 }, children: [_jsx(Text, { type: "secondary", style: { width: 20 }, children: i + 1 }), _jsx(Text, { style: { flex: 1 }, children: p.name }), _jsxs(Text, { type: "secondary", style: { width: 50, textAlign: 'right' }, children: [p.orders, " \u5355"] }), _jsx(Text, { strong: true, style: { width: 80, textAlign: 'right' }, children: p.revenue })] }, p.name))) })] })] })] }));
}
