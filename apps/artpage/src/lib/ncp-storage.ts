/**
 * ⚠️ 이 파일은 @vibers/storage 패키지로 통합되었습니다 (2026-03-31)
 *
 * 직접 수정하지 마세요. packages/storage/src/server.ts 를 수정하세요.
 * 환경변수: NCP_ACCESS_KEY, NCP_SECRET_KEY, NCP_BUCKET_NAME=wero-bucket
 */

export {
  uploadBuffer as uploadToNCP,
  deleteFile as deleteFromNCP,
  getPublicUrl,
} from '@vibers/storage/server';

/**
 * 외부 URL 이미지를 NCP Object Storage로 복사
 * (artpage 전용 — 마이그레이션 스크립트에서 사용)
 */
import { uploadBuffer } from '@vibers/storage/server';

export async function copyUrlToNCP(
  url: string,
  category = 'artpage'
): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`이미지 다운로드 실패: ${url}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') ?? 'image/jpeg';
  const ext = contentType.split('/')[1]?.split(';')[0] ?? 'jpg';
  const key = `${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  return uploadBuffer(buffer, key, contentType);
}
