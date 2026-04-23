import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, InputNumber, Row, Slider, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { PLAYERS } from '../../mock/data';

const { Title, Text } = Typography;

type PlayerOverride = {
  id: string;
  name: string;
  ratio: number | null;
};

const initialOverrides: PlayerOverride[] = PLAYERS.slice(0, 5).map((p) => ({
  id: p.id,
  name: p.name,
  ratio: null,
}));

export function ClubConfigPage() {
  const [defaultRatio, setDefaultRatio] = useState(70);
  const [overrides, setOverrides] = useState<PlayerOverride[]>(initialOverrides);
  const [saved, setSaved] = useState(false);

  const setOverride = (id: string, ratio: number | null) => {
    setOverrides((prev) => prev.map((r) => (r.id === id ? { ...r, ratio } : r)));
    setSaved(false);
  };

  const palShare = defaultRatio;
  const clubShare = 100 - defaultRatio;

  const columns: ColumnsType<PlayerOverride> = [
    { title: '陪玩', dataIndex: 'name', width: 140 },
    {
      title: '陪玩分成比例',
      width: 200,
      render: (_, r) => (
        <InputNumber
          min={0}
          max={100}
          value={r.ratio ?? defaultRatio}
          onChange={(v) => setOverride(r.id, v)}
          formatter={(v) => `${v}%`}
          parser={(v) => Number(v?.replace('%', ''))}
          size="small"
          style={{ width: 90 }}
        />
      ),
    },
    {
      title: '说明',
      render: (_, r) =>
        r.ratio === null ? (
          <Text type="secondary" style={{ fontSize: 12 }}>
            使用默认 {defaultRatio}%
          </Text>
        ) : (
          <Text style={{ fontSize: 12, color: r.ratio >= defaultRatio ? '#52c41a' : '#ff4d4f' }}>
            自定义 {r.ratio}%
          </Text>
        ),
    },
    {
      title: '操作',
      width: 100,
      render: (_, r) =>
        r.ratio !== null ? (
          <Button size="small" onClick={() => setOverride(r.id, null)}>
            重置为默认
          </Button>
        ) : null,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 20 }}>
        俱乐部配置
      </Title>

      <Row gutter={24}>
        <Col span={12}>
          <Card title="基础信息" size="small" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>俱乐部名称</Text>
                <div style={{ fontSize: 14, marginTop: 4 }}>星辰电竞俱乐部</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>俱乐部 ID</Text>
                <div style={{ fontSize: 12, fontFamily: 'monospace', marginTop: 4 }}>CLUB-001</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>联系方式</Text>
                <div style={{ fontSize: 14, marginTop: 4 }}>xingchen_esports</div>
              </div>
            </Space>
          </Card>

          <Card title="公告" size="small">
            <Text style={{ fontSize: 13 }}>欢迎来到星辰电竞！陪玩服务 7×12 小时在线，请遵守服务规范。</Text>
            <div style={{ marginTop: 8 }}>
              <Button size="small" icon={<EditOutlined />}>编辑公告</Button>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="默认分成比例"
            size="small"
            extra={
              <Button
                size="small"
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => setSaved(true)}
              >
                {saved ? '已保存' : '保存'}
              </Button>
            }
          >
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                陪玩分成（%）—— 基于实际到账金额计算，打赏100%归陪玩
              </Text>
            </div>
            <Slider
              min={50}
              max={95}
              step={5}
              value={defaultRatio}
              onChange={(v) => {
                setDefaultRatio(v);
                setSaved(false);
              }}
              marks={{ 50: '50%', 60: '60%', 70: '70%', 80: '80%', 90: '90%', 95: '95%' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f6f8fa',
                borderRadius: 6,
                padding: '10px 16px',
                marginTop: 16,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1677ff' }}>{palShare}%</div>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>陪玩分成</div>
              </div>
              <Divider type="vertical" style={{ height: 48, margin: 'auto 0' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#8c8c8c' }}>{clubShare}%</div>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>俱乐部抽成</div>
              </div>
            </div>

            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
              示例：订单 ¥100 → 陪玩 ¥{palShare}，俱乐部 ¥{clubShare}
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="陪玩分成覆盖" size="small" style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 8, fontSize: 12, color: '#8c8c8c' }}>
          可为特定陪玩设置独立分成比例，优先级高于俱乐部默认值。
        </div>
        <Table
          dataSource={overrides}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
        />
      </Card>
    </div>
  );
}
