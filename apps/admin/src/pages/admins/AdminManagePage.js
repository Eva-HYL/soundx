import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Space, Table, Tag, Typography } from 'antd';
const { Title, Text } = Typography;
const ADMINS = [
    { id: 'A001', name: '王超', wechat: 'wangchao_sx', role: 'super_admin', since: '2024-01-01', active: true },
    { id: 'A002', name: '李敏', wechat: 'li_ops', role: 'ops', since: '2024-01-15', active: true },
    { id: 'A003', name: '张涛', wechat: 'zt_finance', role: 'finance', since: '2024-02-01', active: true },
    { id: 'A004', name: '陈静', wechat: 'chen_jing', role: 'club_admin', since: '2024-03-01', active: false },
];
const PERMISSIONS = [
    { label: '确认付款', super_admin: true, club_admin: true, ops: true, finance: false },
    { label: '审核报备', super_admin: true, club_admin: true, ops: true, finance: false },
    { label: '审核提现', super_admin: true, club_admin: true, ops: false, finance: true },
    { label: '确认转账', super_admin: true, club_admin: false, ops: false, finance: true },
    { label: '陪玩管理', super_admin: true, club_admin: true, ops: true, finance: false },
    { label: '俱乐部配置', super_admin: true, club_admin: true, ops: false, finance: false },
    { label: '管理员管理', super_admin: true, club_admin: false, ops: false, finance: false },
    { label: '数据看板', super_admin: true, club_admin: true, ops: true, finance: true },
    { label: '操作日志', super_admin: true, club_admin: true, ops: true, finance: true },
];
const ROLE_LABELS = {
    super_admin: '超级管理员',
    club_admin: '俱乐部管理员',
    ops: '运营',
    finance: '财务',
};
const ROLE_COLORS = {
    super_admin: 'red',
    club_admin: 'blue',
    ops: 'cyan',
    finance: 'gold',
};
const adminCols = [
    { title: '姓名', dataIndex: 'name', width: 100 },
    { title: '微信号', dataIndex: 'wechat', width: 140 },
    {
        title: '角色',
        dataIndex: 'role',
        width: 120,
        render: (v) => _jsx(Tag, { color: ROLE_COLORS[v], children: ROLE_LABELS[v] }),
    },
    { title: '加入时间', dataIndex: 'since', width: 120 },
    {
        title: '状态',
        dataIndex: 'active',
        width: 80,
        render: (v) => _jsx(Tag, { color: v ? 'green' : 'default', children: v ? '正常' : '已停用' }),
    },
    {
        title: '操作',
        width: 100,
        render: (_, r) => (_jsxs(Space, { size: 4, children: [_jsx(Button, { size: "small", children: "\u7F16\u8F91" }), r.role !== 'super_admin' && (_jsx(Button, { size: "small", danger: r.active, type: "text", children: r.active ? '停用' : '启用' }))] })),
    },
];
const permCols = [
    { title: '功能', dataIndex: 'label', width: 120 },
    {
        title: '超级管理员',
        dataIndex: 'super_admin',
        width: 100,
        render: (v) => _jsx(Checkbox, { checked: v, disabled: true }),
    },
    {
        title: '俱乐部管理员',
        dataIndex: 'club_admin',
        width: 110,
        render: (v) => _jsx(Checkbox, { checked: v, disabled: true }),
    },
    {
        title: '运营',
        dataIndex: 'ops',
        width: 80,
        render: (v) => _jsx(Checkbox, { checked: v, disabled: true }),
    },
    {
        title: '财务',
        dataIndex: 'finance',
        width: 80,
        render: (v) => _jsx(Checkbox, { checked: v, disabled: true }),
    },
];
export function AdminManagePage() {
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx(Title, { level: 4, style: { marginBottom: 20 }, children: "\u7BA1\u7406\u5458\u7BA1\u7406" }), _jsx(Card, { title: "\u7BA1\u7406\u5458\u5217\u8868", size: "small", extra: _jsx(Button, { type: "primary", size: "small", icon: _jsx(PlusOutlined, {}), children: "\u6DFB\u52A0\u7BA1\u7406\u5458" }), style: { marginBottom: 16 }, children: _jsx(Table, { dataSource: ADMINS, columns: adminCols, rowKey: "id", size: "small", pagination: false }) }), _jsxs(Card, { title: "\u89D2\u8272\u6743\u9650\u77E9\u9635", size: "small", children: [_jsx(Text, { type: "secondary", style: { fontSize: 12, display: 'block', marginBottom: 12 }, children: "\u6743\u9650\u914D\u7F6E\u7531\u5E73\u53F0\u7EDF\u4E00\u7BA1\u7406\uFF0C\u4E0D\u53EF\u5728\u6B64\u4FEE\u6539\u3002" }), _jsx(Table, { dataSource: PERMISSIONS, columns: permCols, rowKey: "label", size: "small", pagination: false })] })] }));
}
