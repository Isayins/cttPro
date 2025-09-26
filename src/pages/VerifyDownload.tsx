// src/pages/VerifyDownload.tsx
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCaptcha, verifyCaptcha } from '../services/downloadService';
import { Input, Button, Image, message, Spin } from 'antd';

export default function VerifyDownload() {
  const [params] = useSearchParams();
  const resource = params.get('resource') || '';
  const [captchaImg, setCaptchaImg] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshCaptcha = async () => {
    try {
      const j = await getCaptcha();
      setCaptchaId(j.captchaId);
      setCaptchaImg(j.image);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleSubmit = async () => {
    try {
      const d = await verifyCaptcha(captchaId, input, resource);
      window.location.href = `https://idncar.com/api/download?token=${encodeURIComponent(d.downloadToken!)}`;
    } catch (e) {
      message.error('验证码错误，请重试');
      setInput('');
      refreshCaptcha();
    }
  };

  if (!resource) {
    return <div style={{ padding: 20 }}>缺少资源参数</div>;
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center' }}>
      <h3>下载前请输入验证码</h3>
      {loading ? (
        <Spin />
      ) : (
        <>
          {captchaImg && (
            <Image
              src={captchaImg}
              alt="验证码"
              preview={false}
              style={{ width: '100%', height: 80, objectFit: 'contain', borderRadius: 8, marginTop: 10 }}
            />
          )}
          <Input
            placeholder="输入验证码"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ width: '100%', marginTop: 10 }}
          />
          <Button onClick={handleSubmit} type="primary" style={{ width: '100%', marginTop: 10 }}>
            确认下载
          </Button>
        </>
      )}
    </div>
  );
}
