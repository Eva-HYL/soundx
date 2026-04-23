import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import { TIPS } from '../../mock/data';
import { TIP_STATUS } from '../../constants/status';
const { Text } = Typography;
const columns = [
    {
        title: '编号',
        dataIndex: 'id',
        width: 110,
        render: (v) => _jsx(Text, { style: { fontSize: 12, fontFamily: 'monospace' }, children: v }),
    },
    { title: '用户', dataIndex: 'user', width: 120 },
    { title: '陪玩', dataIndex: 'pal', width: 120 },
    {
        title: '关联订单',
        dataIndex: 'order',
        width: 140,
        render: (v) => _jsx(Text, { style: { fontSize: 12, fontFamily: 'monospace' }, children: v }),
    },
    {
        title: '金额',
        dataIndex: 'amount',
        width: 80,
        render: (v) => _jsxs(Text, { strong: true, style: { color: '#52c41a' }, children: ["\u00A5", v] }),
    },
    {
        title: '留言',
        dataIndex: 'msg',
        render: (v) => v ? (_jsxs(Text, { style: {
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: 4,
                padding: '2px 8px',
                fontSize: 12,
            }, children: ["\u300C", v, "\u300D"] })) : (_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u2014" })),
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: 90,
        render: (v) => {
            const s = TIP_STATUS[v];
            return _jsx(Tag, { color: s?.color, children: s?.text });
        },
    },
    { title: '时间', dataIndex: 'time', width: 130 },
];
export function TipsPage() {
    const total = TIPS.reduce((s, r) => s + r.amount, 0);
    const received = TIPS.filter((r) => r.status === 'received').reduce((s, r) => s + r.amount, 0);
    const withMsg = TIPS.filter((r) => r.msg).length;
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsxs(Row, { gutter: 16, style: { marginBottom: 20 }, children: [_jsx(Col, { span: 6, children: _jsx(Card, { size: "small", children: _jsx(Statistic, { title: "\u672C\u65E5\u6253\u8D4F\u603B\u989D", value: `¥${total}`, valueStyle: { color: '#52c41a' } }) }) }), _jsx(Col, { span: 6, children: _jsx(Card, { size: "small", children: _jsx(Statistic, { title: "\u5DF2\u5230\u8D26", value: `¥${received}` }) }) }), _jsx(Col, { span: 6, children: _jsx(Card, { size: "small", children: _jsx(Statistic, { title: "\u6253\u8D4F\u7B14\u6570", value: TIPS.length, suffix: "\u7B14" }) }) }), _jsx(Col, { span: 6, children: _jsx(Card, { size: "small", children: _jsx(Statistic, { title: "\u542B\u7559\u8A00", value: withMsg, suffix: "\u7B14" }) }) })] }), _jsx(Table, { dataSource: TIPS, columns: columns, rowKey: "id", size: "small", pagination: false })] }));
}
