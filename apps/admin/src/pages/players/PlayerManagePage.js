import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Input, Row, Space, Statistic, Switch, Table, Tag, Typography } from 'antd';
import { useState } from 'react';
import { GAMES, PLAYERS } from '../../mock/data';
import { PLAYER_WORK_STATUS } from '../../constants/status';
const { Text } = Typography;
const GAME_MAP = Object.fromEntries(GAMES.map((g) => [g.id, g]));
export function PlayerManagePage() {
    const [keyword, setKeyword] = useState('');
    const filtered = PLAYERS.filter((p) => !keyword || p.name.includes(keyword) || p.wechat.includes(keyword));
    const online = PLAYERS.filter((p) => ['online', 'in_service'].includes(p.status)).length;
    const pending = PLAYERS.filter((p) => p.status === 'pending').length;
    const columns = [
        {
            title: '陪玩',
            width: 160,
            render: (_, r) => (_jsxs(Space, { children: [_jsx(Avatar, { size: 28, style: { background: '#1677ff', fontSize: 12 }, children: r.name[0] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 13, fontWeight: 500 }, children: r.name }), _jsx("div", { style: { fontSize: 11, color: '#8c8c8c' }, children: r.wechat })] })] })),
        },
        {
            title: '游戏',
            dataIndex: 'games',
            width: 160,
            render: (v) => (_jsx(Space, { size: 4, wrap: true, children: v.map((g) => (_jsx(Tag, { color: GAME_MAP[g]?.color, style: { margin: 0, fontSize: 11 }, children: GAME_MAP[g]?.name }, g))) })),
        },
        { title: '段位', dataIndex: 'tier', width: 100 },
        {
            title: '状态',
            dataIndex: 'status',
            width: 80,
            render: (v) => {
                const s = PLAYER_WORK_STATUS[v];
                return (_jsxs(Space, { size: 4, children: [_jsx("span", { style: {
                                display: 'inline-block',
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                background: s?.color,
                            } }), _jsx(Text, { style: { fontSize: 12 }, children: s?.text })] }));
            },
        },
        {
            title: '订单数',
            dataIndex: 'orders',
            width: 80,
            sorter: (a, b) => a.orders - b.orders,
        },
        {
            title: '评分',
            dataIndex: 'rating',
            width: 70,
            render: (v) => (v > 0 ? _jsxs(Text, { style: { color: '#faad14' }, children: ["\u2605 ", v] }) : '—'),
        },
        {
            title: '累计流水',
            dataIndex: 'income',
            width: 100,
            sorter: (a, b) => a.income - b.income,
            render: (v) => `¥${v.toLocaleString()}`,
        },
        {
            title: '当前余额',
            dataIndex: 'balance',
            width: 90,
            render: (v) => _jsxs(Text, { style: { color: '#1677ff' }, children: ["\u00A5", v] }),
        },
        {
            title: '入驻日期',
            dataIndex: 'join',
            width: 110,
        },
        {
            title: '启用',
            width: 70,
            render: (_, r) => (_jsx(Switch, { size: "small", defaultChecked: r.status !== 'pending', disabled: r.status === 'pending' })),
        },
    ];
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Row, { gutter: 16, style: { marginBottom: 20 }, children: [
                    { title: '在册陪玩', value: PLAYERS.length, suffix: '人', color: undefined },
                    { title: '在线 / 服务中', value: online, suffix: '人', color: '#52c41a' },
                    { title: '待审核入驻', value: pending, suffix: '人', color: '#faad14' },
                    { title: '本月新增', value: 2, suffix: '人', color: undefined },
                ].map((s) => (_jsx(Col, { span: 6, children: _jsx(Card, { size: "small", children: _jsx(Statistic, { title: s.title, value: s.value, suffix: s.suffix, valueStyle: { color: s.color } }) }) }, s.title))) }), _jsx("div", { style: { marginBottom: 12 }, children: _jsx(Input, { prefix: _jsx(SearchOutlined, {}), placeholder: "\u641C\u7D22\u6635\u79F0 / \u5FAE\u4FE1\u53F7", value: keyword, onChange: (e) => setKeyword(e.target.value), style: { width: 240 }, allowClear: true }) }), _jsx(Table, { dataSource: filtered, columns: columns, rowKey: "id", size: "small", pagination: false, scroll: { x: 1000 } })] }));
}
