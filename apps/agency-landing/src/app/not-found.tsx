import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 text-center p-6">
      <h1 className="text-9xl font-black mb-4 opacity-10 text-white">404</h1>
      <h2 className="text-3xl font-bold mb-4 text-white">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="text-neutral-400 mb-10 max-w-md">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
        <br />
        입력하신 주소가 정확한지 다시 확인해 주세요.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-emerald-500 text-white hover:bg-emerald-600 transition rounded-lg text-sm font-medium tracking-wide"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
