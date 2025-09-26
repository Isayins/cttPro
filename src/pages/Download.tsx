// src/pages/Downloads.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Skeleton, Spin, Button, Empty, message } from 'antd';
import MainLayout from '../layouts/MainLayout';
import DownloadCard from '../components/DownloadCard';
import CaptchaModal from '../components/CaptchaModal';
import type { DownloadItem } from '../services/downloadService';
import { getDownloads, getFileSize } from '../services/downloadService';

export default function Downloads() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<DownloadItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await getDownloads();
      // 可选：并发填充 size（如果后端提供 getFileSize）
      const withSize = await Promise.all(
        (Array.isArray(json) ? json : []).map(async (it) => {
          try {
            const size = await getFileSize(it.url);
            return { ...it, size };
          } catch {
            return { ...it, size: undefined };
          }
        })
      );
      setItems(withSize);
    } catch (e) {
      console.error(e);
      setError('下载列表加载失败');
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCaptcha = (item: DownloadItem) => {
    setModalItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalItem(null);
  };

  const handleVerified = (downloadUrl: string) => {
    // 如果你想在验证通过后做额外处理，可以写在这里
    // 默认 CaptchaModal 会直接跳转下载，所以这个回调可选
    window.location.href = downloadUrl;
    console.log('download url', downloadUrl);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold"></h2>
            <p className="text-sm text-gray-500"></p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={load}>刷新列表</Button>
            <Button type="text" onClick={() => message.info('如需帮助请联系管理员')}>帮助</Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl p-4">
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12">
            <Empty description={error}>
              <Button onClick={load} type="primary">重试</Button>
            </Empty>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12">
            <Empty description="暂无下载项">
              <Button onClick={load} type="primary">刷新</Button>
            </Empty>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {items.map((it) => (
              <Col key={it.url} xs={24} sm={12} md={8}>
                <DownloadCard {...it} onLockedClick={() => openCaptcha(it)} />
              </Col>
            ))}
          </Row>
        )}

        <CaptchaModal open={modalOpen} item={modalItem} onClose={closeModal} onVerified={handleVerified} />
      </div>
    </MainLayout>
  );
}
