import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center text-center p-6"
      style={{ backgroundColor: "#050505", color: "#fff" }}
    >
      <h1
        className="text-9xl font-black mb-4"
        style={{ opacity: 0.1, color: "#39FF14" }}
      >
        404
      </h1>
      <h2 className="text-3xl font-bold mb-4">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="mb-10 max-w-md" style={{ color: "#888" }}>
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
        <br />
        입력하신 주소가 정확한지 다시 확인해 주세요.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-lg text-sm font-medium tracking-wide transition hover:opacity-90"
        style={{ backgroundColor: "#39FF14", color: "#000" }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
