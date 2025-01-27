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

export function customLogger({
  context,
  message,
  type,
  name,
}: {
  context: Context;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message?: any;
  type: 'info' | 'error';
  name: string;
}): string {
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

  const e =
    mightFailSync(() => JSON.stringify(message)).result === '{}' ||
    !mightFailSync(() => JSON.stringify(message)).result
      ? String(message)
      : JSON.stringify(message);

  // eslint-disable-next-line no-console
  console[type](
    `${color.start}[${name} - ${new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    })} - (${
      context.req?.raw.cf?.city || ''
    }, ${context.req?.raw.cf?.country || ''})]: ${context.req?.raw.method || ''} ${context.req?.raw.url || ''} ${
      e
    }${color.end}`,
  );

  return e;
}
