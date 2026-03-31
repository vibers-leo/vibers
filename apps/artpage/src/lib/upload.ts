/**
 * 파일을 NCP 이미지 서버에 업로드하고 퍼블릭 URL을 반환합니다.
 * /api/upload 를 경유하여 NCP (http://49.50.138.93:8090) 로 프록시합니다.
 * @param file 업로드할 파일 객체
 * @param category 카테고리 (기본값: 'monopage')
 * @returns 이미지의 퍼블릭 URL (https://storage.vibers.co.kr/...)
 */
export async function uploadImage(file: File, category = "monopage"): Promise<string> {
  if (!file) {
    throw new Error("파일이 선택되지 않았습니다.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`이미지 업로드 실패: ${text}`);
  }

  const data = await res.json();

  if (!data.url) {
    throw new Error("업로드 응답에 URL이 없습니다.");
  }

  return data.url;
}
