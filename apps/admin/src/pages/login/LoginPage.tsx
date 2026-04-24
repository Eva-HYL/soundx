import { EyeInvisibleOutlined, EyeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0f2f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage:
          'radial-gradient(circle at 20% 30%, #e6f4ff 0, transparent 40%), radial-gradient(circle at 80% 70%, #f0f5ff 0, transparent 40%)',
        position: 'relative',
      }}
    >
      {/* Logo */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
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
          }}
        >
          SX
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'rgba(0,0,0,0.88)' }}>SoundX</div>
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>陪玩俱乐部 SaaS 后台</div>
        </div>
      </div>

      {/* Login card */}
      <div
        style={{
          width: 420,
          background: '#fff',
          borderRadius: 8,
          padding: '48px 48px 40px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        <Title level={3} style={{ marginBottom: 8 }}>
          俱乐部管理员登录
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
          请使用俱乐部分配的账号登录
        </Text>

        <Form
          layout="vertical"
          onFinish={() => navigate('/')}
          initialValues={{ username: 'zhou@xingchen-esports', remember: true }}
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="账号 / 邮箱" size="large" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
              iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link>忘记密码？</Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              登 录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', color: 'rgba(0,0,0,0.45)', fontSize: 14 }}>
          没有账号？ <Link>联系平台申请入驻</Link>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 24, color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>
        SoundX © 2026 · 平台不接入在线支付，所有资金动作线下确认
      </div>
    </div>
  );
}
