/**
 * @vibers/storage/client
 * 브라우저 사이드 전용
 * - /api/storage/presign 에서 presigned URL 받아서 NCP에 직접 PUT
 * - Firebase Storage 대비 동일한 uploadFile / deleteFile 인터페이스 유지
 */

import { v4 as uuidv4 } from 'uuid';
import type { StoragePlatform, StorageCategory } from './types';

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
 * 파일을 NCP Object Storage에 업로드하고 공개 URL 반환
 * Firebase Storage의 uploadFile과 동일한 인터페이스
 *
 * @param file 업로드할 File 객체
 * @param platform 플랫폼 구분 (faneasy, vibefolio 등)
 * @param category 카테고리 (profiles, banners 등)
 * @param customName 파일명 커스텀 (선택)
 * @param presignEndpoint presign API 경로 (기본: /api/storage/presign)
 */
export async function uploadFile(
  file: File,
  platform: StoragePlatform,
  category: StorageCategory,
  customName?: string,
  presignEndpoint = '/api/storage/presign'
): Promise<string> {
  if (!file) throw new Error('파일이 없습니다.');

  // HWP/HWPX 확장자 체크
  if (file.type === 'application/octet-stream') {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'hwp' && ext !== 'hwpx') {
      throw new Error('application/octet-stream 타입은 HWP/HWPX 파일만 허용됩니다.');
    }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`지원하지 않는 파일 형식입니다. (현재: ${file.type})`);
  }

  if (file.size > MAX_SIZE) {
    throw new Error('파일 크기는 10MB 이하여야 합니다.');
  }

  // 1. 서버에서 presigned URL 발급
  const res = await fetch(presignEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      platform,
      category,
      customName,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`presign 실패: ${err}`);
  }

  const { uploadUrl, publicUrl } = await res.json();

  // 2. NCP Object Storage에 직접 PUT
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error(`NCP 업로드 실패: ${uploadRes.status}`);
  }

  return publicUrl;
}

/**
 * NCP에서 파일 삭제 (서버 API 경유)
 * @param url 공개 URL 또는 object key
 * @param deleteEndpoint 삭제 API 경로 (기본: /api/storage/delete)
 */
export async function deleteFile(
  url: string,
  deleteEndpoint = '/api/storage/delete'
): Promise<void> {
  const res = await fetch(deleteEndpoint, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    throw new Error(`삭제 실패: ${await res.text()}`);
  }
}
