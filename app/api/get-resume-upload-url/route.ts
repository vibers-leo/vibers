/**
 * NCP Object Storage Presigned URL 발급
 *
 * 클라이언트가 이 엔드포인트에 파일명/타입을 보내면
 * 서버가 15분짜리 일회성 PUT URL을 반환함.
 * NCP 인증키는 서버에만 있고 클라이언트에 노출되지 않음.
 */

import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export async function POST(req: Request) {
  try {
    const { fileName, fileType, applicantName } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: '파일명과 타입이 필요합니다.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ error: 'PDF 또는 Word 파일만 허용됩니다.' }, { status: 400 });
    }

    const {
      NCP_STORAGE_ACCESS_KEY,
      NCP_STORAGE_SECRET_KEY,
      NCP_STORAGE_BUCKET,
      NCP_STORAGE_ENDPOINT = 'https://kr.object.ncloudstorage.com',
    } = process.env;

    if (!NCP_STORAGE_ACCESS_KEY || !NCP_STORAGE_SECRET_KEY || !NCP_STORAGE_BUCKET) {
      return NextResponse.json({ error: 'NCP 스토리지 환경변수가 설정되지 않았습니다.' }, { status: 500 });
    }

    const client = new S3Client({
      region: 'kr-standard',
      endpoint: NCP_STORAGE_ENDPOINT,
      credentials: {
        accessKeyId: NCP_STORAGE_ACCESS_KEY,
        secretAccessKey: NCP_STORAGE_SECRET_KEY,
      },
      forcePathStyle: true,
    });

    // 저장 경로: resumes/타임스탬프_지원자명.확장자
    const timestamp = Date.now();
    const safeName = (applicantName || 'applicant').replace(/[^a-zA-Z0-9가-힣]/g, '_');
    const ext = fileName.split('.').pop() || 'pdf';
    const key = `resumes/${timestamp}_${safeName}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: NCP_STORAGE_BUCKET,
      Key: key,
      ContentType: fileType,
      ACL: 'public-read',
    });

    // 15분 유효 Presigned URL 발급
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });
    const publicUrl = `${NCP_STORAGE_ENDPOINT}/${NCP_STORAGE_BUCKET}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (e) {
    console.error('Presigned URL 발급 실패:', e);
    return NextResponse.json({ error: 'URL 발급 실패' }, { status: 500 });
  }
}
