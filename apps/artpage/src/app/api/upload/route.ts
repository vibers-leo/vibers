// api/upload/route.ts — VM 업로드 서버 프록시 (VM이 NCP Object Storage로 전송)
import { NextRequest, NextResponse } from "next/server";

const UPLOAD_SERVER = "http://49.50.138.93:8091";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const res = await fetch(`${UPLOAD_SERVER}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `업로드 실패: ${text}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: `서버 오류: ${String(error)}` }, { status: 500 });
  }
}
