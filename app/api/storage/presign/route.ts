/**
 * POST /api/storage/presign
 * 클라이언트가 NCP Object Storage에 직접 업로드할 수 있는 presigned URL 발급
 *
 * 사용법: 이 파일을 각 앱의 app/api/storage/presign/route.ts 에 복사
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrl, ALLOWED_TYPES } from '@vibers/storage/server';
import type { StoragePlatform, StorageCategory } from '@vibers/storage';

const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType, platform, category, customName } =
      await req.json();

    // 기본 검증
    if (!filename || !contentType || !platform || !category) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: `허용되지 않는 파일 형식: ${contentType}` },
        { status: 400 }
      );
    }

    const result = await getPresignedUploadUrl({
      filename,
      contentType,
      platform: platform as StoragePlatform,
      category: category as StorageCategory,
      customName,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('[storage/presign]', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
