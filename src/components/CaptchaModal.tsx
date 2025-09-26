// src/components/CaptchaModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Input, Spin, Button, message } from 'antd';
import type { DownloadItem } from '../services/downloadService';
import axios from 'axios';

type Props = {
  open: boolean;
  item: DownloadItem | null;
  onClose: () => void;
  /** 验证通过后什么也不做或你可在这里处理（默认会触发 window.location） */
  onVerified?: (downloadUrl: string) => void;
};

export default function CaptchaModal({ open, item, onClose, onVerified }: Props) {
  const [captchaImg, setCaptchaImg] = useState<string>('');
  const [captchaId, setCaptchaId] = useState<string>('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setValue('');
      setCaptchaImg('');
      setCaptchaId('');
      fetchOne();
    }
  }, [open, item]);

  const fetchOne = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ captchaId: string; image: string }>(
        'https://idncar.com/api/captcha',
        { headers: { 'Cache-Control': 'no-store' } }
      );
      setCaptchaId(response.data.captchaId);
      setCaptchaImg(response.data.image);
    } catch (e) {
      console.error(e);
      message.error('加载验证码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!item) return;
    if (!value.trim()) return message.warning('请输入验证码');
    setVerifyLoading(true);
    try {
      const response = await axios.post<{ downloadToken?: string; message?: string }>(
        'https://idncar.com/api/verify_captcha',
        {
          captchaId,
          answer: value.trim(),
          resource: item.url,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const res = response.data;

      if (res?.downloadToken) {
        const base = 'https://idncar.com';
        const downloadUrl = `${base}/api/download?token=${encodeURIComponent(res.downloadToken)}`;
        onVerified ? onVerified(downloadUrl) : window.location.assign(downloadUrl);
        onClose();
        message.success('下载即将开始');
      } else {
        message.error(res?.message || '验证码错误');
        setValue('');
        await fetchOne();
      }
    } catch (e) {
      console.error(e);
      message.error('校验失败，请稍后重试');
      await fetchOne();
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="请输入验证码以开始下载"
      onCancel={onClose}
      onOk={handleVerify}
      okText="提交"
      cancelText="取消"
      confirmLoading={verifyLoading}
      maskClosable={false}
    >
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded">
            <Spin />
          </div>
        ) : captchaImg ? (
          <img src={captchaImg} alt="captcha" className="w-full h-24 object-contain rounded" />
        ) : (
          <div className="w-full h-24 flex items-center justify-center bg-gray-100 rounded">
            无验证码
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="在此输入验证码"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPressEnter={handleVerify}
            autoFocus
          />
          <Button type="link" onClick={fetchOne}>
            刷新
          </Button>
        </div>
      </div>
    </Modal>
  );
}
