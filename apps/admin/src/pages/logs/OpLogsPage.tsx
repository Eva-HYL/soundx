import { Card, Space, Tag, Timeline, Typography } from 'antd';
import { OP_LOGS } from '../../mock/data';

const { Title, Text } = Typography;

const TONE_COLOR: Record<string, string> = {
  ok: '#52c41a',
  info: '#1677ff',
  warn: '#faad14',
  danger: '#ff4d4f',
  mute: '#d9d9d9',
};

const TONE_TAG: Record<string, string> = {
  ok: 'green',
  info: 'blue',
  warn: 'gold',
  danger: 'red',
  mute: 'default',
};

export function OpLogsPage() {
  const today = OP_LOGS.filter(l => l.day === 'today');
  const yesterday = OP_LOGS.filter(l => l.day === 'yesterday');

  const makeItems = (logs: typeof OP_LOGS) =>
    logs.map(l => ({
      key: `${l.t}-${l.target}`,
      color: TONE_COLOR[l.tone],
      children: (
        <div style={{ paddingBottom: 8 }}>
          <Space size={8} align="center">
            <Text style={{ fontSize: 12, fontFamily: 'monospace', color: '#8c8c8c' }}>{l.t}</Text>
            <Tag color={TONE_TAG[l.tone]} style={{ margin: 0 }}>
              {l.action}
            </Tag>
            <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{l.target}</Text>
          </Space>
          <div style={{ fontSize: 12, color: '#595959', marginTop: 2 }}>{l.detail}</div>
          <div style={{ fontSize: 11, color: '#bfbfbf', marginTop: 2 }}>
            {l.u} · IP {l.ip}
          </div>
        </div>
      ),
    }));

  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 20 }}>
        操作日志
      </Title>

      <Card title="今日" size="small" style={{ marginBottom: 16 }}>
        <Timeline items={makeItems(today)} style={{ marginTop: 12 }} />
      </Card>

      <Card title="昨日" size="small">
        <Timeline items={makeItems(yesterday)} style={{ marginTop: 12 }} />
      </Card>
    </div>
  );
}
