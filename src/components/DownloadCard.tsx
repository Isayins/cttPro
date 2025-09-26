import React from 'react';
import { Button, Tag, Tooltip } from 'antd';
import { DownloadOutlined, LockOutlined, LinkOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { QRCode } from 'antd';
import type { DownloadItem } from '../services/downloadService';

export type { DownloadItem } from '../services/downloadService';

type Props = DownloadItem & {
  onLockedClick?: () => void;
};

export default function DownloadBlockSmall({
  title,
  version,
  changelog,
  url,
  icon,
  locked,
  size,
  onLockedClick,
}: Props) {
  const verifyUrl = `https://idncar.com/#/verify?resource=${encodeURIComponent(url)}`;

  return (
    <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* 左侧信息 */}
        <div className="flex items-start gap-3 md:col-span-2">
          <img
            src={icon || '/images/idncar.jpg'}
            alt={title}
            className="w-14 h-14 rounded-xl object-cover shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
              <Tooltip title="更多信息">
                <InfoCircleOutlined className="text-gray-400 text-xs" />
              </Tooltip>
            </div>
            <div className="mt-0.5 text-xs text-gray-500">
              版本: {version || '未知'} {size && `· 大小: ${size}`}
            </div>
            <div className="mt-1">
              {locked ? (
                <Tag icon={<LockOutlined />} color="warning" className="rounded-full px-1 py-0.5 text-xs">
                  需验证码
                </Tag>
              ) : (
                <Tag color="processing" className="rounded-full px-1 py-0.5 text-xs">
                  直接下载
                </Tag>
              )}
            </div>

            {changelog && (
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2 max-h-20 overflow-y-auto leading-relaxed">
                {changelog}
              </div>
            )}
          </div>
        </div>

        {/* 右侧二维码 */}
        <div className="flex flex-col items-center justify-center gap-1">
          <QRCode value={verifyUrl} size={140} />
          <div className="text-[10px] text-gray-400">手机扫码下载</div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 pb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          {locked ? (
            <Button
              type="primary"
              icon={<LockOutlined />}
              onClick={onLockedClick}
              className="flex-1 rounded-lg"
            >
              输入验证码下载
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              href={url}
              className="flex-1 rounded-lg"
            >
              直接下载
            </Button>
          )}
          <Button
            href={url}
            target="_blank"
            icon={<LinkOutlined />}
            className="rounded-lg"
          >
            直链
          </Button>
        </div>
      </div>
    </div>
  );
}
