import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Title, Text, Link } = Typography;
export function LoginPage() {
    const navigate = useNavigate();
    return (_jsxs("div", { style: {
            minHeight: '100vh',
            background: '#f0f2f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'radial-gradient(circle at 20% 30%, #e6f4ff 0, transparent 40%), radial-gradient(circle at 80% 70%, #f0f5ff 0, transparent 40%)',
            position: 'relative',
        }, children: [_jsxs("div", { style: { position: 'absolute', top: 32, left: 40, display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: {
                            width: 36,
                            height: 36,
                            background: '#1677ff',
                            borderRadius: 6,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: 14,
                        }, children: "SX" }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 18, fontWeight: 600, color: 'rgba(0,0,0,0.88)' }, children: "SoundX" }), _jsx("div", { style: { fontSize: 12, color: 'rgba(0,0,0,0.45)' }, children: "\u966A\u73A9\u4FF1\u4E50\u90E8 SaaS \u540E\u53F0" })] })] }), _jsxs("div", { style: {
                    width: 420,
                    background: '#fff',
                    borderRadius: 8,
                    padding: '48px 48px 40px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }, children: [_jsx(Title, { level: 3, style: { marginBottom: 8 }, children: "\u4FF1\u4E50\u90E8\u7BA1\u7406\u5458\u767B\u5F55" }), _jsx(Text, { type: "secondary", style: { display: 'block', marginBottom: 32 }, children: "\u8BF7\u4F7F\u7528\u4FF1\u4E50\u90E8\u5206\u914D\u7684\u8D26\u53F7\u767B\u5F55" }), _jsxs(Form, { layout: "vertical", onFinish: () => navigate('/'), initialValues: { username: 'zhou@xingchen-esports', remember: true }, children: [_jsx(Form.Item, { label: "\u8D26\u53F7", name: "username", rules: [{ required: true, message: '请输入账号' }], children: _jsx(Input, { prefix: _jsx(UserOutlined, {}), placeholder: "\u8D26\u53F7 / \u90AE\u7BB1", size: "large" }) }), _jsx(Form.Item, { label: "\u5BC6\u7801", name: "password", rules: [{ required: true, message: '请输入密码' }], children: _jsx(Input.Password, { prefix: _jsx(LockOutlined, {}), placeholder: "\u5BC6\u7801", size: "large", iconRender: (visible) => (visible ? _jsx(EyeOutlined, {}) : _jsx(EyeInvisibleOutlined, {})) }) }), _jsx(Form.Item, { children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx(Form.Item, { name: "remember", valuePropName: "checked", noStyle: true, children: _jsx(Checkbox, { children: "\u8BB0\u4F4F\u6211" }) }), _jsx(Link, { children: "\u5FD8\u8BB0\u5BC6\u7801\uFF1F" })] }) }), _jsx(Form.Item, { children: _jsx(Button, { type: "primary", htmlType: "submit", block: true, size: "large", children: "\u767B \u5F55" }) })] }), _jsxs("div", { style: { textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: 14 }, children: ["\u6CA1\u6709\u8D26\u53F7\uFF1F ", _jsx(Link, { children: "\u8054\u7CFB\u5E73\u53F0\u7533\u8BF7\u5165\u9A7B" })] })] }), _jsx("div", { style: { position: 'absolute', bottom: 24, color: 'rgba(0,0,0,0.45)', fontSize: 12 }, children: "SoundX \u00A9 2026 \u00B7 \u5E73\u53F0\u4E0D\u63A5\u5165\u5728\u7EBF\u652F\u4ED8\uFF0C\u6240\u6709\u8D44\u91D1\u52A8\u4F5C\u7EBF\u4E0B\u786E\u8BA4" })] }));
}
