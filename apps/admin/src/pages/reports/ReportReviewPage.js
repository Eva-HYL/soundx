import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Descriptions, Image, Row, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { GAMES, PENDING_REPORTS } from '../../mock/data';
const { Text, Title, Paragraph } = Typography;
const GAME_MAP = Object.fromEntries(GAMES.map((g) => [g.id, g]));
function QueueCard({ r, active, onClick, }) {
    return (_jsxs("div", { onClick: onClick, style: {
            padding: '12px 14px',
            borderRadius: 6,
            border: `1px solid ${active ? '#1677ff' : '#f0f0f0'}`,
            background: active ? '#e6f4ff' : '#fff',
            cursor: 'pointer',
            marginBottom: 8,
        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(Tag, { color: GAME_MAP[r.game]?.color, style: { margin: 0, fontSize: 11 }, children: GAME_MAP[r.game]?.name }), _jsx(Text, { style: { fontSize: 12, fontFamily: 'monospace' }, children: r.orderNo }), _jsx(Text, { type: "secondary", style: { fontSize: 11, marginLeft: 'auto' }, children: r.ago })] }), _jsxs("div", { style: { display: 'flex', marginTop: 6, fontSize: 13 }, children: [_jsx(Text, { style: { flex: 1 }, children: r.pal }), _jsxs(Text, { strong: true, style: { color: '#52c41a' }, children: ["\u00A5", r.amount] })] }), _jsxs("div", { style: { fontSize: 12, color: '#8c8c8c', marginTop: 2 }, children: [r.svc, " \u00B7 ", r.start, "\u2013", r.end, " (", r.dur, "h)"] })] }));
}
const PLACEHOLDER = (n) => `https://placehold.co/200x150/f5f5f5/999?text=截图${n}`;
export function ReportReviewPage() {
    const [queue, setQueue] = useState(PENDING_REPORTS);
    const [selected, setSelected] = useState(queue[0] ?? null);
    const handle = (r) => {
        const remaining = queue.filter((x) => x.orderNo !== r.orderNo);
        setQueue(remaining);
        setSelected(remaining[0] ?? null);
    };
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: 16, gap: 12 }, children: [_jsx(Title, { level: 4, style: { margin: 0 }, children: "\u62A5\u5907\u5BA1\u6838" }), _jsx(Badge, { count: queue.length, style: { background: '#fa8c16' } })] }), _jsxs(Row, { gutter: 16, children: [_jsx(Col, { span: 8, children: _jsx(Card, { size: "small", title: "\u5F85\u5BA1\u6838\u961F\u5217", bodyStyle: { padding: '8px 12px' }, children: queue.length === 0 ? (_jsx(Text, { type: "secondary", style: { fontSize: 13 }, children: "\u6682\u65E0\u5F85\u5BA1\u6838\u62A5\u5907 \uD83C\uDF89" })) : (queue.map((r) => (_jsx(QueueCard, { r: r, active: selected?.orderNo === r.orderNo, onClick: () => setSelected(r) }, r.orderNo)))) }) }), _jsx(Col, { span: 16, children: selected ? (_jsxs(Card, { size: "small", title: _jsxs("span", { children: [_jsx(Text, { style: { fontFamily: 'monospace', fontSize: 13 }, children: selected.orderNo }), _jsxs(Text, { type: "secondary", style: { fontSize: 12, marginLeft: 12 }, children: ["\u63D0\u4EA4\u4E8E ", selected.ago] })] }), extra: _jsxs(Space, { children: [_jsx(Button, { type: "primary", icon: _jsx(CheckOutlined, {}), onClick: () => handle(selected), children: "\u901A\u8FC7" }), _jsx(Button, { danger: true, icon: _jsx(CloseOutlined, {}), onClick: () => handle(selected), children: "\u9A73\u56DE" })] }), children: [_jsxs(Descriptions, { size: "small", column: 2, style: { marginBottom: 16 }, children: [_jsx(Descriptions.Item, { label: "\u7528\u6237", children: selected.user }), _jsx(Descriptions.Item, { label: "\u966A\u73A9", children: selected.pal }), _jsxs(Descriptions.Item, { label: "\u6E38\u620F / \u670D\u52A1", children: [_jsx(Tag, { color: GAME_MAP[selected.game]?.color, style: { margin: 0 }, children: GAME_MAP[selected.game]?.name }), ' ', selected.svc] }), _jsxs(Descriptions.Item, { label: "\u670D\u52A1\u65F6\u957F", children: [selected.start, " \u2013 ", selected.end, "\uFF08", selected.dur, "h\uFF09"] }), _jsx(Descriptions.Item, { label: "\u7ED3\u7B97\u91D1\u989D", children: _jsxs(Text, { strong: true, style: { color: '#52c41a' }, children: ["\u00A5", selected.amount] }) }), _jsxs(Descriptions.Item, { label: "\u9644\u4EF6\u6570\u91CF", children: [selected.attachments, " \u5F20"] })] }), _jsxs("div", { style: { marginBottom: 12 }, children: [_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u670D\u52A1\u5907\u6CE8" }), _jsx(Paragraph, { style: {
                                                marginTop: 4,
                                                background: '#fafafa',
                                                borderRadius: 6,
                                                padding: '8px 12px',
                                                fontSize: 13,
                                                lineHeight: 1.7,
                                            }, children: selected.note })] }), _jsxs("div", { children: [_jsx(Text, { type: "secondary", style: { fontSize: 12 }, children: "\u670D\u52A1\u622A\u56FE" }), _jsx(Image.PreviewGroup, { children: _jsx("div", { style: { display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }, children: Array.from({ length: selected.attachments }).map((_, i) => (_jsx(Image, { width: 120, height: 80, src: PLACEHOLDER(i + 1), style: { borderRadius: 4, objectFit: 'cover' } }, i))) }) })] })] })) : (_jsx(Card, { size: "small", children: _jsx("div", { style: { textAlign: 'center', padding: 40, color: '#8c8c8c' }, children: "\u5168\u90E8\u5BA1\u6838\u5B8C\u6BD5 \u2705" }) })) })] })] }));
}
