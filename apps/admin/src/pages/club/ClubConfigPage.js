import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, InputNumber, Row, Slider, Space, Table, Typography } from 'antd';
import { useState } from 'react';
import { PLAYERS } from '../../mock/data';
const { Title, Text } = Typography;
const initialOverrides = PLAYERS.slice(0, 5).map((p) => ({
    id: p.id,
    name: p.name,
    ratio: null,
}));
export function ClubConfigPage() {
    const [defaultRatio, setDefaultRatio] = useState(70);
    const [overrides, setOverrides] = useState(initialOverrides);
    const [saved, setSaved] = useState(false);
    const setOverride = (id, ratio) => {
        setOverrides((prev) => prev.map((r) => (r.id === id ? { ...r, ratio } : r)));
        setSaved(false);
    };
    const palShare = defaultRatio;
    const clubShare = 100 - defaultRatio;
    const columns = [
        { title: '陪玩', dataIndex: 'name', width: 140 },
        {
            title: '陪玩分成比例',
            width: 200,
            render: (_, r) => (_jsx(InputNumber, { min: 0, max: 100, value: r.ratio ?? defaultRatio, onChange: (v) => setOverride(r.id, v), formatter: (v) => `${v}%`, parser: (v) => Number(v?.replace('%', '')), size: "small", style: { width: 90 } })),
        },
        {
            title: '说明',
            render: (_, r) => r.ratio === null ? (_jsxs(Text, { type: "secondary", style: { fontSize: 12 }, children: ["\u4F7F\u7528\u9ED8\u8BA4 ", defaultRatio, "%"] })) : (_jsxs(Text, { style: { fontSize: 12, color: r.ratio >= defaultRatio ? '#52c41a' : '#ff4d4f' }, children: ["\u81EA\u5B9A\u4E49 ", r.ratio, "%"] })),
        },
        {
            title: '操作',
            width: 100,
            render: (_, r) => r.ratio !== null ? (_jsx(Button, { size: "small", onClick: () => setOverride(r.id, null), children: "\u91CD\u7F6E\u4E3A\u9ED8\u8BA4" })) : null,
        },
    ];
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Title, { level: 4, style: { marginBottom: 20 }, children: "\u4FF1\u4E50\u90E8\u914D\u7F6E" }), _jsxs(Row, { gutter: 24, children: [_jsxs(Col, { span: 12, children: [_jsx(Card, { title: "\u57FA\u7840\u4FE1\u606F", size: "small", style: { marginBottom: 16 }, children: _jsxs(Space, { direction: "vertical", style: { width: '100%' }, size: 12, children: [_jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u4FF1\u4E50\u90E8\u540D\u79F0" }), _jsx("div", { style: { fontSize: 14, marginTop: 4 }, children: "\u661F\u8FB0\u7535\u7ADE\u4FF1\u4E50\u90E8" })] }), _jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u4FF1\u4E50\u90E8 ID" }), _jsx("div", { style: { fontSize: 12, fontFamily: 'monospace', marginTop: 4 }, children: "CLUB-001" })] }), _jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u8054\u7CFB\u65B9\u5F0F" }), _jsx("div", { style: { fontSize: 14, marginTop: 4 }, children: "xingchen_esports" })] })] }) }), _jsxs(Card, { title: "\u516C\u544A", size: "small", children: [_jsx(Text, { style: { fontSize: 13 }, children: "\u6B22\u8FCE\u6765\u5230\u661F\u8FB0\u7535\u7ADE\uFF01\u966A\u73A9\u670D\u52A1 7\u00D712 \u5C0F\u65F6\u5728\u7EBF\uFF0C\u8BF7\u9075\u5B88\u670D\u52A1\u89C4\u8303\u3002" }), _jsx("div", { style: { marginTop: 8 }, children: _jsx(Button, { size: "small", icon: _jsx(EditOutlined, {}), children: "\u7F16\u8F91\u516C\u544A" }) })] })] }), _jsx(Col, { span: 12, children: _jsxs(Card, { title: "\u9ED8\u8BA4\u5206\u6210\u6BD4\u4F8B", size: "small", extra: _jsx(Button, { size: "small", type: "primary", icon: _jsx(SaveOutlined, {}), onClick: () => setSaved(true), children: saved ? '已保存' : '保存' }), children: [_jsx("div", { style: { marginBottom: 8 }, children: _jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u966A\u73A9\u5206\u6210\uFF08%\uFF09\u2014\u2014 \u57FA\u4E8E\u5B9E\u9645\u5230\u8D26\u91D1\u989D\u8BA1\u7B97\uFF0C\u6253\u8D4F100%\u5F52\u966A\u73A9" }) }), _jsx(Slider, { min: 50, max: 95, step: 5, value: defaultRatio, onChange: (v) => {
                                        setDefaultRatio(v);
                                        setSaved(false);
                                    }, marks: { 50: '50%', 60: '60%', 70: '70%', 80: '80%', 90: '90%', 95: '95%' } }), _jsxs("div", { style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        background: '#f6f8fa',
                                        borderRadius: 6,
                                        padding: '10px 16px',
                                        marginTop: 16,
                                    }, children: [_jsxs("div", { style: { textAlign: 'center' }, children: [_jsxs("div", { style: { fontSize: 24, fontWeight: 700, color: '#1677ff' }, children: [palShare, "%"] }), _jsx("div", { style: { fontSize: 12, color: '#8c8c8c' }, children: "\u966A\u73A9\u5206\u6210" })] }), _jsx(Divider, { type: "vertical", style: { height: 48, margin: 'auto 0' } }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsxs("div", { style: { fontSize: 24, fontWeight: 700, color: '#8c8c8c' }, children: [clubShare, "%"] }), _jsx("div", { style: { fontSize: 12, color: '#8c8c8c' }, children: "\u4FF1\u4E50\u90E8\u62BD\u6210" })] })] }), _jsxs("div", { style: { marginTop: 8, fontSize: 12, color: '#8c8c8c' }, children: ["\u793A\u4F8B\uFF1A\u8BA2\u5355 \u00A5100 \u2192 \u966A\u73A9 \u00A5", palShare, "\uFF0C\u4FF1\u4E50\u90E8 \u00A5", clubShare] })] }) })] }), _jsxs(Card, { title: "\u966A\u73A9\u5206\u6210\u8986\u76D6", size: "small", style: { marginTop: 16 }, children: [_jsx("div", { style: { marginBottom: 8, fontSize: 12, color: '#8c8c8c' }, children: "\u53EF\u4E3A\u7279\u5B9A\u966A\u73A9\u8BBE\u7F6E\u72EC\u7ACB\u5206\u6210\u6BD4\u4F8B\uFF0C\u4F18\u5148\u7EA7\u9AD8\u4E8E\u4FF1\u4E50\u90E8\u9ED8\u8BA4\u503C\u3002" }), _jsx(Table, { dataSource: overrides, columns: columns, rowKey: "id", size: "small", pagination: false })] })] }));
}
