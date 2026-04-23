import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Space, Tag, Timeline, Typography } from 'antd';
import { OP_LOGS } from '../../mock/data';
const { Title, Text } = Typography;
const TONE_COLOR = {
    ok: '#52c41a',
    info: '#1677ff',
    warn: '#faad14',
    danger: '#ff4d4f',
    mute: '#d9d9d9',
};
const TONE_TAG = {
    ok: 'green',
    info: 'blue',
    warn: 'gold',
    danger: 'red',
    mute: 'default',
};
export function OpLogsPage() {
    const today = OP_LOGS.filter((l) => l.day === 'today');
    const yesterday = OP_LOGS.filter((l) => l.day === 'yesterday');
    const makeItems = (logs) => logs.map((l) => ({
        key: `${l.t}-${l.target}`,
        color: TONE_COLOR[l.tone],
        children: (_jsxs("div", { style: { paddingBottom: 8 }, children: [_jsxs(Space, { size: 8, align: "center", children: [_jsx(Text, { style: { fontSize: 12, fontFamily: 'monospace', color: '#8c8c8c' }, children: l.t }), _jsx(Tag, { color: TONE_TAG[l.tone], style: { margin: 0 }, children: l.action }), _jsx(Text, { style: { fontFamily: 'monospace', fontSize: 12 }, children: l.target })] }), _jsx("div", { style: { fontSize: 12, color: '#595959', marginTop: 2 }, children: l.detail }), _jsxs("div", { style: { fontSize: 11, color: '#bfbfbf', marginTop: 2 }, children: [l.u, " \u00B7 IP ", l.ip] })] })),
    }));
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Title, { level: 4, style: { marginBottom: 20 }, children: "\u64CD\u4F5C\u65E5\u5FD7" }), _jsx(Card, { title: "\u4ECA\u65E5", size: "small", style: { marginBottom: 16 }, children: _jsx(Timeline, { items: makeItems(today), style: { marginTop: 12 } }) }), _jsx(Card, { title: "\u6628\u65E5", size: "small", children: _jsx(Timeline, { items: makeItems(yesterday), style: { marginTop: 12 } }) })] }));
}
