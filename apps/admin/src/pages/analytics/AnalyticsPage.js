import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Col, Row, Statistic, Table, Typography } from 'antd';
import { PLAYERS } from '../../mock/data';
const { Title, Text } = Typography;
const TREND_DATA = [
    { day: '04-10', orders: 52, revenue: 4200 },
    { day: '04-11', orders: 61, revenue: 5100 },
    { day: '04-12', orders: 48, revenue: 3900 },
    { day: '04-13', orders: 70, revenue: 6200 },
    { day: '04-14', orders: 83, revenue: 7400 },
    { day: '04-15', orders: 91, revenue: 8100 },
    { day: '04-16', orders: 76, revenue: 6800 },
    { day: '04-17', orders: 65, revenue: 5400 },
    { day: '04-18', orders: 72, revenue: 6000 },
    { day: '04-19', orders: 88, revenue: 7700 },
    { day: '04-20', orders: 94, revenue: 8400 },
    { day: '04-21', orders: 79, revenue: 7100 },
    { day: '04-22', orders: 87, revenue: 7600 },
    { day: '04-23', orders: 31, revenue: 2800 },
];
const MAX_REV = Math.max(...TREND_DATA.map((d) => d.revenue));
function MiniBar({ value, max, color }) {
    return (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx("div", { style: {
                    height: 16,
                    width: `${(value / max) * 180}px`,
                    background: color,
                    borderRadius: 2,
                    minWidth: 2,
                } }), _jsx(Text, { style: { fontSize: 12 }, children: value })] }));
}
const leaderboardCols = [
    {
        title: '#',
        width: 40,
        render: (_, __, i) => _jsx(Text, { type: "secondary", children: i + 1 }),
    },
    { title: '陪玩', dataIndex: 'name', width: 130 },
    {
        title: '订单数',
        dataIndex: 'orders',
        width: 80,
        sorter: (a, b) => a.orders - b.orders,
        defaultSortOrder: 'descend',
    },
    {
        title: '评分',
        dataIndex: 'rating',
        width: 80,
        render: (v) => (v > 0 ? _jsxs(Text, { style: { color: '#faad14' }, children: ["\u2605 ", v] }) : '—'),
    },
    {
        title: '累计流水',
        dataIndex: 'income',
        width: 110,
        render: (v) => _jsxs(Text, { strong: true, children: ["\u00A5", v.toLocaleString()] }),
    },
];
export function AnalyticsPage() {
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Title, { level: 4, style: { marginBottom: 20 }, children: "\u6570\u636E\u770B\u677F" }), _jsx(Row, { gutter: 16, style: { marginBottom: 20 }, children: [
                    { title: '本月订单', value: 1024, suffix: '单' },
                    { title: '本月流水', value: '¥84,320', color: '#52c41a' },
                    { title: '本月打赏', value: '¥6,480', color: '#1677ff' },
                    { title: '活跃陪玩', value: 18, suffix: '人' },
                ].map((s) => (_jsx(Col, { span: 6, children: _jsx(Card, { size: "small", children: _jsx(Statistic, { title: s.title, value: s.value, suffix: s.suffix, valueStyle: { color: s.color } }) }) }, s.title))) }), _jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 14, children: _jsx(Card, { title: "\u8FD1 14 \u65E5\u8BA2\u5355 & \u6D41\u6C34", size: "small", children: _jsx("div", { style: { overflowX: 'auto' }, children: _jsxs("table", { style: { width: '100%', fontSize: 12, borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { color: '#8c8c8c' }, children: [_jsx("td", { style: { padding: '4px 8px', width: 60 }, children: "\u65E5\u671F" }), _jsx("td", { style: { padding: '4px 8px', width: 200 }, children: "\u8BA2\u5355\u6570" }), _jsx("td", { style: { padding: '4px 8px', width: 200 }, children: "\u6D41\u6C34" }), _jsx("td", { style: { padding: '4px 8px' }, children: "\u91D1\u989D" })] }) }), _jsx("tbody", { children: TREND_DATA.map((d) => (_jsxs("tr", { style: { borderTop: '1px solid #f0f0f0' }, children: [_jsx("td", { style: { padding: '6px 8px', color: '#8c8c8c' }, children: d.day }), _jsx("td", { style: { padding: '6px 8px' }, children: _jsx(MiniBar, { value: d.orders, max: 100, color: "#1677ff" }) }), _jsx("td", { style: { padding: '6px 8px' }, children: _jsx(MiniBar, { value: d.revenue, max: MAX_REV, color: "#52c41a" }) }), _jsxs("td", { style: { padding: '6px 8px', color: '#52c41a' }, children: ["\u00A5", d.revenue.toLocaleString()] })] }, d.day))) })] }) }) }) }), _jsx(Col, { span: 10, children: _jsx(Card, { title: "\u966A\u73A9\u6392\u884C\u699C \u00B7 \u603B\u8BA1", size: "small", children: _jsx(Table, { dataSource: [...PLAYERS].sort((a, b) => b.income - a.income), columns: leaderboardCols, rowKey: "id", size: "small", pagination: false }) }) })] })] }));
}
