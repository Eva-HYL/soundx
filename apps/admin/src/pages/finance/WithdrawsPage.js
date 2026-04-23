import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckOutlined, CloseOutlined, DollarOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Statistic, Table, Tabs, Tag, Typography } from 'antd';
import { WITHDRAWALS } from '../../mock/data';
import { WITHDRAW_STATUS } from '../../constants/status';
const { Text } = Typography;
const pendingCols = [
    { title: '编号', dataIndex: 'id', width: 100, render: (v) => _jsx(Text, { style: { fontFamily: 'monospace', fontSize: 12 }, children: v }) },
    { title: '陪玩', dataIndex: 'pal', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 80 },
    { title: '微信号', dataIndex: 'wechat', width: 130, render: (v) => _jsx(Text, { copyable: true, style: { fontSize: 12 }, children: v }) },
    { title: '申请金额', dataIndex: 'amount', width: 100, render: (v) => _jsxs(Text, { strong: true, style: { color: '#1677ff' }, children: ["\u00A5", v] }) },
    { title: '账户余额', dataIndex: 'balance', width: 100, render: (v) => _jsxs(Text, { type: "secondary", children: ["\u00A5", v] }) },
    { title: '申请时间', dataIndex: 'submitted', width: 100 },
    {
        title: '操作',
        width: 160,
        render: () => (_jsxs(Space, { size: 4, children: [_jsx(Button, { size: "small", type: "primary", icon: _jsx(CheckOutlined, {}), children: "\u5BA1\u6838\u901A\u8FC7" }), _jsx(Button, { size: "small", danger: true, icon: _jsx(CloseOutlined, {}), children: "\u9A73\u56DE" })] })),
    },
];
const approvedCols = [
    { title: '编号', dataIndex: 'id', width: 100, render: (v) => _jsx(Text, { style: { fontFamily: 'monospace', fontSize: 12 }, children: v }) },
    { title: '陪玩', dataIndex: 'pal', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 80 },
    { title: '微信号', dataIndex: 'wechat', width: 130, render: (v) => _jsx(Text, { copyable: true, style: { fontSize: 12 }, children: v }) },
    { title: '转账金额', dataIndex: 'amount', width: 100, render: (v) => _jsxs(Text, { strong: true, style: { color: '#52c41a' }, children: ["\u00A5", v] }) },
    { title: '申请时间', dataIndex: 'submitted', width: 120 },
    {
        title: '操作',
        width: 140,
        render: () => (_jsx(Button, { size: "small", type: "primary", icon: _jsx(DollarOutlined, {}), children: "\u786E\u8BA4\u5DF2\u8F6C\u8D26" })),
    },
];
const allCols = [
    { title: '编号', dataIndex: 'id', width: 100, render: (v) => _jsx(Text, { style: { fontFamily: 'monospace', fontSize: 12 }, children: v }) },
    { title: '陪玩', dataIndex: 'pal', width: 120 },
    { title: '姓名', dataIndex: 'name', width: 80 },
    { title: '微信号', dataIndex: 'wechat', width: 130 },
    { title: '金额', dataIndex: 'amount', width: 90, render: (v) => `¥${v}` },
    { title: '申请时间', dataIndex: 'submitted', width: 100 },
    {
        title: '状态',
        dataIndex: 'status',
        width: 90,
        render: (v) => {
            const s = WITHDRAW_STATUS[v];
            return _jsx(Tag, { color: s?.color, children: s?.text });
        },
    },
];
export function WithdrawsPage() {
    const totalPending = WITHDRAWALS.pending_review.reduce((s, r) => s + r.amount, 0);
    const totalApproved = WITHDRAWALS.approved_pending_transfer.reduce((s, r) => s + r.amount, 0);
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsxs(Row, { gutter: 16, style: { marginBottom: 20 }, children: [_jsx(Col, { span: 8, children: _jsxs(Card, { size: "small", children: [_jsx(Statistic, { title: "\u5F85\u5BA1\u6838\u63D0\u73B0", value: WITHDRAWALS.pending_review.length, suffix: "\u7B14", valueStyle: { color: '#faad14' } }), _jsxs(Text, { type: "secondary", style: { fontSize: 12 }, children: ["\u5408\u8BA1 \u00A5", totalPending] })] }) }), _jsx(Col, { span: 8, children: _jsxs(Card, { size: "small", children: [_jsx(Statistic, { title: "\u5F85\u8F6C\u8D26", value: WITHDRAWALS.approved_pending_transfer.length, suffix: "\u7B14", valueStyle: { color: '#1677ff' } }), _jsxs(Text, { type: "secondary", style: { fontSize: 12 }, children: ["\u5408\u8BA1 \u00A5", totalApproved] })] }) }), _jsx(Col, { span: 8, children: _jsxs(Card, { size: "small", children: [_jsx(Statistic, { title: "\u672C\u6708\u5DF2\u5B8C\u6210", value: 28, suffix: "\u7B14" }), _jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u5408\u8BA1 \u00A512,480" })] }) })] }), _jsx(Tabs, { items: [
                    {
                        key: 'pending',
                        label: (_jsxs("span", { children: ["\u5F85\u5BA1\u6838", ' ', _jsx(Tag, { color: "gold", style: { marginLeft: 4 }, children: WITHDRAWALS.pending_review.length })] })),
                        children: (_jsx(Table, { dataSource: WITHDRAWALS.pending_review, columns: pendingCols, rowKey: "id", size: "small", pagination: false })),
                    },
                    {
                        key: 'approved',
                        label: (_jsxs("span", { children: ["\u5F85\u8F6C\u8D26", ' ', _jsx(Tag, { color: "blue", style: { marginLeft: 4 }, children: WITHDRAWALS.approved_pending_transfer.length })] })),
                        children: (_jsx(Table, { dataSource: WITHDRAWALS.approved_pending_transfer, columns: approvedCols, rowKey: "id", size: "small", pagination: false })),
                    },
                    {
                        key: 'all',
                        label: '历史记录',
                        children: (_jsx(Table, { dataSource: WITHDRAWALS.all, columns: allCols, rowKey: "id", size: "small", pagination: false })),
                    },
                ] })] }));
}
