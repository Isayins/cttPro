// src/services/downloadService.ts
const API_BASE =  'https://idncar.com';

export type DownloadItem = {
  title: string;
  version?: string;
  changelog?: string;
  url: string;
  icon?: string;
  locked?: boolean;
  size?: string; // 可选，服务端可能会返回或前端用 getFileSize 填充
};

async function fetchJson(input: RequestInfo, init?: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    clearTimeout(id);
    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch (e) { throw new Error(`Invalid JSON from ${input}`); }
    if (!res.ok) {
      const err = (json && (json.message || json.error)) || res.statusText || 'Request failed';
      throw new Error(err);
    }
    return json;
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timeout');
    throw err;
  }
}

/** 获取 downloads.json（建议放在 public/download/download.json） */
export async function getDownloads(): Promise<DownloadItem[]> {
  return fetchJson('/download/download.json', { cache: 'no-store' }, 10000) as Promise<DownloadItem[]>;
}

/** 获取验证码图片 */
export async function getCaptcha(): Promise<{ captchaId: string; image: string }> {
  return fetchJson(`${API_BASE}/api/captcha`, { cache: 'no-store' }, 8000);
}

/** 校验验证码，返回可能包含 downloadToken */
export async function verifyCaptcha(
  captchaId: string,
  answer: string,
  resource: string
): Promise<{ ok?: boolean; downloadToken?: string; message?: string }> {
  return fetchJson(
    `${API_BASE}/api/verify_captcha`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ captchaId, answer, resource }),
    },
    10000
  );
}

/** 可选：请求后端获取文件大小并格式化（如果后端提供 file_size 接口） */
export async function getFileSize(resource: string): Promise<string> {
  try {
    const json: any = await fetchJson(`${API_BASE}/api/file_size?resource=${encodeURIComponent(resource)}`, undefined, 8000);
    if (json && typeof json.size === 'number') {
      const bytes = json.size;
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
      if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return '未知';
  } catch {
    return '未知';
  }
}
