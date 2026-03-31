/**
 * @vibers/storage/dual
 *
 * Firebase Storage + NCP Object Storage 이중 쓰기(Dual Write) 유틸
 *
 * 마이그레이션 3단계:
 *   NEXT_PUBLIC_STORAGE_MODE=firebase-only  → Firebase만 (기존)
 *   NEXT_PUBLIC_STORAGE_MODE=dual           → 둘 다 저장, NCP URL 반환 (검증 기간)
 *   NEXT_PUBLIC_STORAGE_MODE=ncp-only       → NCP만 (마이그레이션 완료)
 *
 * 기본값: 'dual'
 */

import type { StoragePlatform, StorageCategory } from './types';

export type StorageMode = 'firebase-only' | 'dual' | 'ncp-only';

function getMode(): StorageMode {
  const mode = (
    process.env.NEXT_PUBLIC_STORAGE_MODE ??
    process.env.STORAGE_MODE ??
    'dual'
  ) as StorageMode;
  return mode;
}

export interface DualUploadResult {
  /** 최종 사용할 URL (NCP 우선, 실패 시 Firebase) */
  url: string;
  ncpUrl?: string;
  firebaseUrl?: string;
  /** 어떤 스토리지에서 온 URL인지 */
  source: 'ncp' | 'firebase';
}

/**
 * 브라우저 클라이언트 이중 업로드
 *
 * @param file 업로드할 파일
 * @param firebaseUploader 기존 Firebase 업로드 함수 (앱별로 다름)
 * @param platform NCP 경로 prefix (예: 'faneasy', 'semophone')
 * @param category NCP 경로 category (예: 'images', 'profiles')
 * @param presignEndpoint presigned URL API 경로 (기본: /api/storage/presign)
 */
export async function dualUploadFile(
  file: File,
  firebaseUploader: (file: File) => Promise<string>,
  platform: StoragePlatform,
  category: StorageCategory,
  presignEndpoint = '/api/storage/presign'
): Promise<DualUploadResult> {
  const mode = getMode();

  if (mode === 'firebase-only') {
    const firebaseUrl = await firebaseUploader(file);
    return { url: firebaseUrl, firebaseUrl, source: 'firebase' };
  }

  if (mode === 'ncp-only') {
    const ncpUrl = await uploadToNcpViaPresign(file, platform, category, presignEndpoint);
    return { url: ncpUrl, ncpUrl, source: 'ncp' };
  }

  // dual 모드: 둘 다 시도, NCP 우선
  const [ncpResult, firebaseResult] = await Promise.allSettled([
    uploadToNcpViaPresign(file, platform, category, presignEndpoint),
    firebaseUploader(file),
  ]);

  const ncpUrl = ncpResult.status === 'fulfilled' ? ncpResult.value : undefined;
  const firebaseUrl = firebaseResult.status === 'fulfilled' ? firebaseResult.value : undefined;

  if (ncpResult.status === 'rejected') {
    console.warn('[storage:dual] NCP 업로드 실패, Firebase로 fallback:', ncpResult.reason);
  }
  if (firebaseResult.status === 'rejected') {
    console.warn('[storage:dual] Firebase 업로드 실패:', firebaseResult.reason);
  }

  const url = ncpUrl ?? firebaseUrl;
  if (!url) throw new Error('[storage:dual] NCP, Firebase 모두 업로드 실패');

  return {
    url,
    ncpUrl,
    firebaseUrl,
    source: ncpUrl ? 'ncp' : 'firebase',
  };
}

/**
 * presigned URL 경유로 NCP에 직접 PUT
 */
async function uploadToNcpViaPresign(
  file: File,
  platform: StoragePlatform,
  category: StorageCategory,
  presignEndpoint: string
): Promise<string> {
  const res = await fetch(presignEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      platform,
      category,
    }),
  });

  if (!res.ok) throw new Error(`presign 실패: ${await res.text()}`);
  const { uploadUrl, publicUrl } = await res.json();

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error(`NCP PUT 실패: ${uploadRes.status}`);
  return publicUrl;
}
