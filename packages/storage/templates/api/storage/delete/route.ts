/**
 * DELETE /api/storage/delete
 * NCP Object Storage에서 파일 삭제
 *
 * 사용법: 이 파일을 각 앱의 app/api/storage/delete/route.ts 에 복사
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteFile } from '@vibers/storage/server';

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'url 필요' }, { status: 400 });
    }

    await deleteFile(url);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[storage/delete]', err);
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 });
  }
}
