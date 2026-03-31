import { S3Client } from '@aws-sdk/client-s3';

// NCP Object Storage는 AWS S3 호환 API 제공
// endpoint: kr-standard 리전
export function createNcpClient() {
  return new S3Client({
    region: 'kr-standard',
    endpoint: 'https://kr.object.ncloudstorage.com',
    credentials: {
      accessKeyId: process.env.NCP_ACCESS_KEY!,
      secretAccessKey: process.env.NCP_SECRET_KEY!,
    },
    // NCP는 path-style URL 사용
    forcePathStyle: true,
  });
}

export const ncpClient = createNcpClient();
export const NCP_BUCKET = process.env.NCP_BUCKET_NAME ?? 'wero-bucket';

// 업로드된 파일의 공개 URL 생성
export function getPublicUrl(key: string): string {
  const cdnUrl = process.env.NCP_CDN_URL;
  if (cdnUrl) return `${cdnUrl}/${key}`;
  return `https://kr.object.ncloudstorage.com/${NCP_BUCKET}/${key}`;
}
