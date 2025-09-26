// src/components/DownloadCardAntd.tsx
import React, { useMemo } from 'react';
import { Card, Row, Col, Avatar, Tag, Popover, Typography, Space, Button, Tooltip } from 'antd';
import { DownloadOutlined, LockOutlined, LinkOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { QRCode } from 'antd';
import type { DownloadItem } from '../services/downloadService';

export type { DownloadItem } from '../services/downloadService';

const { Paragraph, Text } = Typography;

type Props = DownloadItem & {
  onLockedClick?: () => void;
  badgeText?: string;
};

/**
 * Ant Design 风格下载卡片
 * - 左侧信息列，右侧二维码（固定宽），底部操作按钮
 * - 使用 Popover 显示放大二维码（hover / click）
 */
export default function DownloadCardAntd({
  title,
  version,
  changelog,
  url,
  icon,
  locked,
  size,
  onLockedClick,
  badgeText,
}: Props) {
  const safeUrl = url ?? '';
  const verifyUrl = useMemo(() => `https://idncar.com/#/verify?resource=${encodeURIComponent(safeUrl)}`, [safeUrl]);

  const qrSmall = 100;
  const qrLarge = 220;

  return (
    <Card
      hoverable
      style={{
        borderRadius: 14,
        overflow: 'visible',
        boxShadow: '0 6px 20px rgba(16,24,40,0.04)',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Row gutter={[16, 12]} align="middle">
        {/* 左侧信息（伸缩） */}
        <Col xs={24} sm={18} style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Avatar
              src={icon || '/images/idncar.jpg'}
              shape="square"
              size={56}
              style={{ borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text strong style={{ fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={title}>
                  {title}
                </Text>
                <Tooltip title="更多信息">
                  <InfoCircleOutlined style={{ color: '#9CA3AF' }} />
                </Tooltip>
                {badgeText && <Tag color="magenta" style={{ marginLeft: 8 }}>{badgeText}</Tag>}
              </div>

              <div style={{ marginTop: 6, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>版本: {version ?? '未知'}</Text>
                {size && <Text type="secondary" style={{ fontSize: 12 }}>· 大小: {size}</Text>}
                {locked ? (
                  <Tag icon={<LockOutlined />} color="warning" style={{ marginLeft: 4 }}>需验证码</Tag>
                ) : (
                  <Tag color="processing" style={{ marginLeft: 4 }}>直接下载</Tag>
                )}
              </div>

              <div style={{ marginTop: 10 }}>
                {changelog ? (
                  <Paragraph
                    ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}
                    style={{ margin: 0, background: '#FAFBFC', padding: 10, borderRadius: 8 }}
                  >
                    {changelog}
                  </Paragraph>
                ) : (
                  <div style={{ color: '#9CA3AF', fontSize: 13 }}>暂无更新日志</div>
                )}
              </div>
            </div>
          </div>
        </Col>

        {/* 右侧二维码（固定列） */}
        <Col xs={24} sm={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Popover
              content={
                <div style={{ padding: 8, background: '#fff', borderRadius: 12 }}>
                  <QRCode value={verifyUrl ?? ''} size={qrLarge} />
                </div>
              }
              trigger={['hover', 'click']}
              overlayStyle={{ padding: 0 }}
              mouseEnterDelay={0.12}
              mouseLeaveDelay={0.12}
            >
              <div style={{ display: 'inline-block', background: '#fff', padding: 6, borderRadius: 10, boxShadow: '0 8px 24px rgba(2,6,23,0.06)' }}>
                <QRCode value={verifyUrl ?? ''} size={qrSmall} />
              </div>
            </Popover>
            <div style={{ marginTop: 6, fontSize: 12, color: '#9CA3AF' }}>手机扫码下载</div>
          </div>
        </Col>

        {/* 底部按钮区域（占据整行） */}
        <Col span={24}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Space style={{ flex: 1 }}>
              {locked ? (
                <Button type="primary" icon={<LockOutlined />} onClick={onLockedClick} style={{ minWidth: 160 }}>
                  输入验证码下载
                </Button>
              ) : (
                <Button type="primary" icon={<DownloadOutlined />} href={safeUrl} target="_blank" style={{ minWidth: 160 }}>
                  直接下载
                </Button>
              )}

              <Button icon={<LinkOutlined />} href={safeUrl} target="_blank">
                直链
              </Button>
            </Space>

            {/* 可在右侧放置次要操作 */}
            <div style={{ marginLeft: 'auto' }}>
              {/* 示例：放一个小操作按钮 */}
              {/* <Button size="small">帮助</Button> */}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
