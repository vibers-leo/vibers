// api/upload/route.ts — NCP Object Storage 직접 업로드
import { NextRequest, NextResponse } from "next/server";
import { ncpClient, NCP_BUCKET, getPublicUrl } from "@vibers/storage/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "monopage";

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 파일 데이터를 Buffer로 변환
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${category}/${Date.now()}_${file.name}`;

    // NCP Object Storage 업로드 명령
    const command = new PutObjectCommand({
      Bucket: NCP_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read", // 퍼블릭 읽기 권한 부여
    });

    await ncpClient.send(command);

    // 업로드된 파일의 퍼블릭 URL 반환
    const publicUrl = getPublicUrl(fileName);

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      key: fileName 
    });

  } catch (error) {
    console.error("NCP Upload Error:", error);
    return NextResponse.json(
      { error: `서버 오류: ${String(error)}` }, 
      { status: 500 }
    );
  }
}
