/**
 * @vibers/storage/server
 * 서버 사이드 전용 (Node.js 환경, API Route / Server Action에서 사용)
 */

import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { ncpClient, NCP_BUCKET, getPublicUrl } from './ncp-client';
import type { PresignedUploadRequest, PresignedUploadResult } from './types';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/x-hwp',
  'application/haansofthwp',
  'application/vnd.hancom.hwpx',
  'application/octet-stream',
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * 클라이언트가 직접 NCP에 업로드할 수 있는 presigned URL 발급
 * 유효 시간: 5분
 */
export async function getPresignedUploadUrl(
  req: PresignedUploadRequest
): Promise<PresignedUploadResult> {
  const { filename, contentType, platform, category, customName } = req;

  const ext = filename.split('.').pop() ?? 'bin';
  const objectName = customName ? `${customName}.${ext}` : `${uuidv4()}.${ext}`;
  const key = `${platform}/${category}/${objectName}`;

  const command = new PutObjectCommand({
    Bucket: NCP_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(ncpClient, command, { expiresIn: 300 });

  return {
    uploadUrl,
    key,
    publicUrl: getPublicUrl(key),
  };
}

/**
 * 서버에서 직접 파일 업로드 (Buffer / Blob)
 * 주로 서버 사이드 처리(리사이징, 변환 등) 후 업로드 시 사용
 */
export async function uploadBuffer(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await ncpClient.send(
    new PutObjectCommand({
      Bucket: NCP_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return getPublicUrl(key);
}

/**
 * NCP Object Storage에서 파일 삭제
 * @param keyOrUrl Object key 또는 공개 URL
 */
export async function deleteFile(keyOrUrl: string): Promise<void> {
  // URL이 들어온 경우 key만 추출
  const key = keyOrUrl.startsWith('http')
    ? extractKeyFromUrl(keyOrUrl)
    : keyOrUrl;

  await ncpClient.send(
    new DeleteObjectCommand({
      Bucket: NCP_BUCKET,
      Key: key,
    })
  );
}

/**
 * 다운로드용 presigned URL 발급 (비공개 버킷일 때)
 * 유효 시간: 1시간
 */
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: NCP_BUCKET,
    Key: key,
  });
  return getSignedUrl(ncpClient, command, { expiresIn: 3600 });
}

// ---- 유틸 ----

function extractKeyFromUrl(url: string): string {
  // https://kr.object.ncloudstorage.com/{bucket}/{key}
  // https://{cdn}/{key}
  try {
    const u = new URL(url);
    // path-style: /{bucket}/{key...}
    const parts = u.pathname.replace(/^\//, '').split('/');
    // 첫 번째 segment가 bucket이면 제거
    if (parts[0] === NCP_BUCKET) parts.shift();
    return parts.join('/');
  } catch {
    return url;
  }
}

export { ALLOWED_TYPES, MAX_SIZE, getPublicUrl, ncpClient, NCP_BUCKET };
