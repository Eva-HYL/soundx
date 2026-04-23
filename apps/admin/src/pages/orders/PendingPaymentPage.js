import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { CheckOutlined, CloseOutlined, EyeOutlined, PictureOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, Image, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { GAMES, PENDING_PAYMENTS } from '../../mock/data';
const { Text, Title } = Typography;
const GAME_MAP = Object.fromEntries(GAMES.map((g) => [g.id, g]));
const VOUCHER_PLACEHOLDER = 'https://placehold.co/480x320/f5f5f5/999?text=付款凭证';
function SplitPreview({ amount, ratio = 70 }) {
    const pal = ((amount * ratio) / 100).toFixed(2);
    const club = ((amount * (100 - ratio)) / 100).toFixed(2);
    return (_jsxs("div", { style: { background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 6, padding: '10px 14px' }, children: [_jsxs("div", { style: { fontSize: 12, color: '#8c8c8c', marginBottom: 6 }, children: ["\u7ED3\u7B97\u9884\u89C8\uFF08\u9ED8\u8BA4\u6BD4\u4F8B ", ratio, "%\uFF09"] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13 }, children: [_jsx("span", { children: "\u966A\u73A9\u5206\u6210" }), _jsxs(Text, { style: { color: '#1677ff' }, children: ["\u00A5", pal] })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4 }, children: [_jsx("span", { children: "\u4FF1\u4E50\u90E8\u62BD\u6210" }), _jsxs(Text, { type: "secondary", children: ["\u00A5", club] })] }), _jsxs("div", { style: { borderTop: '1px solid #f0f0f0', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }, children: [_jsx("span", { children: "\u8BA2\u5355\u91D1\u989D" }), _jsxs(Text, { strong: true, children: ["\u00A5", amount.toFixed(2)] })] })] }));
}
export function PendingPaymentPage() {
    const [gameFilter, setGameFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [drawerOrder, setDrawerOrder] = useState(null);
    const [confirmed, setConfirmed] = useState(new Set());
    const [rejected, setRejected] = useState(new Set());
    const data = PENDING_PAYMENTS.filter((r) => (gameFilter === 'all' || r.game === gameFilter) &&
        (typeFilter === 'all' || r.type === typeFilter));
    const handleConfirm = useCallback((orderNo) => {
        setConfirmed((p) => new Set(p).add(orderNo));
        if (drawerOrder?.orderNo === orderNo)
            setDrawerOrder(null);
    }, [drawerOrder]);
    const handleReject = useCallback((orderNo) => {
        setRejected((p) => new Set(p).add(orderNo));
        if (drawerOrder?.orderNo === orderNo)
            setDrawerOrder(null);
    }, [drawerOrder]);
    useEffect(() => {
        if (!drawerOrder)
            return;
        const handler = (e) => {
            if (e.key === 'y' || e.key === 'Y')
                handleConfirm(drawerOrder.orderNo);
            if (e.key === 'n' || e.key === 'N')
                handleReject(drawerOrder.orderNo);
            if (e.key === 'Escape')
                setDrawerOrder(null);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [drawerOrder, handleConfirm, handleReject]);
    const columns = [
        {
            title: '订单号',
            dataIndex: 'orderNo',
            width: 140,
            render: (v) => _jsx(Text, { copyable: true, style: { fontSize: 12, fontFamily: 'monospace' }, children: v }),
        },
        { title: '用户', dataIndex: 'user', width: 120 },
        {
            title: '陪玩',
            dataIndex: 'pal',
            width: 120,
            render: (v) => v ? _jsx(Text, { children: v }) : _jsx(Tag, { color: "gold", children: "\u5F85\u6D3E\u53D1" }),
        },
        {
            title: '游戏 / 服务',
            width: 160,
            render: (_, r) => {
                const g = GAME_MAP[r.game];
                return (_jsxs(Space, { size: 4, direction: "vertical", style: { lineHeight: 1.4 }, children: [_jsx(Tag, { color: g?.color, style: { margin: 0, fontSize: 11 }, children: g?.name }), _jsxs(Text, { style: { fontSize: 12 }, children: [r.service, " \u00B7 ", r.duration, "h"] })] }));
            },
        },
        {
            title: '金额',
            dataIndex: 'amount',
            width: 90,
            render: (v) => _jsxs(Text, { strong: true, style: { color: '#52c41a' }, children: ["\u00A5", v] }),
        },
        {
            title: '类型',
            dataIndex: 'type',
            width: 80,
            render: (v) => _jsx(Tag, { color: v === 'assign' ? 'blue' : 'default', children: v === 'assign' ? '指定' : '随机' }),
        },
        {
            title: '凭证',
            width: 70,
            render: () => (_jsx(Tooltip, { title: "\u67E5\u770B\u51ED\u8BC1", children: _jsx(PictureOutlined, { style: { fontSize: 18, color: '#1677ff', cursor: 'pointer' } }) })),
        },
        {
            title: '等待',
            dataIndex: 'ago',
            width: 100,
            render: (v) => {
                const mins = parseInt(v);
                return _jsx(Text, { type: mins > 20 ? 'danger' : 'secondary', style: { fontSize: 12 }, children: v });
            },
        },
        {
            title: '操作',
            width: 150,
            render: (_, r) => {
                if (confirmed.has(r.orderNo))
                    return _jsx(Tag, { color: "green", children: "\u5DF2\u786E\u8BA4" });
                if (rejected.has(r.orderNo))
                    return _jsx(Tag, { color: "red", children: "\u5DF2\u62D2\u7EDD" });
                return (_jsxs(Space, { size: 4, children: [_jsx(Button, { size: "small", type: "primary", icon: _jsx(CheckOutlined, {}), onClick: () => handleConfirm(r.orderNo), children: "\u786E\u8BA4" }), _jsx(Button, { size: "small", danger: true, icon: _jsx(CloseOutlined, {}), onClick: () => handleReject(r.orderNo), children: "\u62D2\u7EDD" }), _jsx(Button, { size: "small", icon: _jsx(EyeOutlined, {}), onClick: () => setDrawerOrder(r) })] }));
            },
        },
    ];
    const pending = data.filter((r) => !confirmed.has(r.orderNo) && !rejected.has(r.orderNo));
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }, children: [_jsx(Title, { level: 4, style: { margin: 0 }, children: "\u5F85\u786E\u8BA4\u4ED8\u6B3E" }), _jsx(Badge, { count: pending.length, style: { background: '#faad14' } }), _jsx("div", { style: { flex: 1 } }), _jsx(Select, { value: gameFilter, onChange: setGameFilter, style: { width: 120 }, options: [{ value: 'all', label: '全部游戏' }, ...GAMES.map((g) => ({ value: g.id, label: g.name }))] }), _jsx(Select, { value: typeFilter, onChange: setTypeFilter, style: { width: 100 }, options: [
                            { value: 'all', label: '全部类型' },
                            { value: 'assign', label: '指定陪玩' },
                            { value: 'normal', label: '随机派单' },
                        ] })] }), _jsx(Table, { dataSource: data, columns: columns, rowKey: "orderNo", size: "small", pagination: false, rowClassName: (r) => confirmed.has(r.orderNo) || rejected.has(r.orderNo) ? 'ant-table-row-disabled' : '', onRow: (r) => ({
                    style: { opacity: confirmed.has(r.orderNo) || rejected.has(r.orderNo) ? 0.4 : 1 },
                }), scroll: { x: 900 } }), _jsx(Drawer, { open: !!drawerOrder, onClose: () => setDrawerOrder(null), width: 720, title: _jsxs("span", { children: ["\u786E\u8BA4\u4ED8\u6B3E\u51ED\u8BC1", _jsx(Text, { type: "secondary", style: { fontSize: 12, marginLeft: 12 }, children: "\u6309 Y \u786E\u8BA4 \u00B7 N \u62D2\u7EDD \u00B7 Esc \u5173\u95ED" })] }), footer: drawerOrder && !confirmed.has(drawerOrder.orderNo) && !rejected.has(drawerOrder.orderNo) ? (_jsxs(Space, { children: [_jsx(Button, { type: "primary", icon: _jsx(CheckOutlined, {}), onClick: () => handleConfirm(drawerOrder.orderNo), children: "\u786E\u8BA4\u5230\u8D26 (Y)" }), _jsx(Button, { danger: true, icon: _jsx(CloseOutlined, {}), onClick: () => handleReject(drawerOrder.orderNo), children: "\u51ED\u8BC1\u6709\u8BEF (N)" })] })) : null, children: drawerOrder && (_jsxs("div", { style: { display: 'flex', gap: 24, height: '100%' }, children: [_jsx("div", { style: { flex: 1 }, children: _jsx(Image, { src: VOUCHER_PLACEHOLDER, alt: "\u4ED8\u6B3E\u51ED\u8BC1", style: { width: '100%', borderRadius: 8 }, preview: { mask: '点击预览' } }) }), _jsxs("div", { style: { width: 240, flexShrink: 0 }, children: [_jsxs("div", { style: { marginBottom: 16 }, children: [_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u8BA2\u5355\u53F7" }), _jsx("div", { style: { fontFamily: 'monospace', fontSize: 13, marginTop: 2 }, children: drawerOrder.orderNo })] }), _jsxs("div", { style: { marginBottom: 16 }, children: [_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u7528\u6237 / \u966A\u73A9" }), _jsxs("div", { style: { fontSize: 13, marginTop: 2 }, children: [drawerOrder.user, " \u2192 ", drawerOrder.pal ?? '待派发'] })] }), _jsxs("div", { style: { marginBottom: 16 }, children: [_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u670D\u52A1" }), _jsxs("div", { style: { fontSize: 13, marginTop: 2 }, children: [GAME_MAP[drawerOrder.game]?.name, " \u00B7 ", drawerOrder.service, " \u00B7 ", drawerOrder.duration, "h"] })] }), _jsxs("div", { style: { marginBottom: 16 }, children: [_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u5E94\u4ED8\u91D1\u989D" }), _jsxs("div", { style: { fontSize: 20, fontWeight: 600, color: '#52c41a', marginTop: 2 }, children: ["\u00A5", drawerOrder.amount] })] }), _jsx(SplitPreview, { amount: drawerOrder.amount }), _jsxs("div", { style: { marginTop: 12, fontSize: 12, color: '#8c8c8c' }, children: ["\u63D0\u4EA4\u4E8E ", drawerOrder.ago] })] })] })) })] }));
}
