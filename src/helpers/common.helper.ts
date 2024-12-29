import { Context } from 'hono';
import { mightFailSync } from 'might-fail';

export function getFileType(filePath: string) {
  const ext = filePath
    .split('.')
    .pop()
    ?.toLowerCase() as keyof typeof mimeTypes;
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
    tif: 'image/tiff',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    heif: 'image/heif',
    heic: 'image/heic',
    jfif: 'image/jpeg',
  } as const;
  return mimeTypes?.[ext] || 'application/octet-stream';
}

export const getFileExtension = (filename: string) => {
  return filename.split('.').pop();
};

export function customLogger(
  c: Context,
  message: string,
  type: 'info' | 'error',
) {
  const redStart = '\x1b[31m';
  const redEnd = '\x1b[0m';
  const skyStart = '\x1b[36m';
  const skyEnd = '\x1b[0m';
  const color = { start: '', end: '' };
  switch (type) {
    case 'info':
      color.start = skyStart;
      color.end = skyEnd;
      break;
    case 'error':
      color.start = redStart;
      color.end = redEnd;
      break;
    default:
      color.start = '';
      color.end = '';
      break;
  }

  // eslint-disable-next-line no-console
  console[type](
    `${color.start}[${new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    })} - (${
      c.req.raw.cf?.city
    }, ${c.req.raw.cf?.country})]: ${c.req.raw.method} ${c.req.raw.url} ${
      mightFailSync(() => JSON.stringify(message)).result
    }${color.end}`,
  );
}
