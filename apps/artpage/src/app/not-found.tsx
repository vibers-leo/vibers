import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground text-center p-6">
      <h1 className="text-9xl font-serif font-light mb-4 opacity-10">404</h1>
      <h2 className="text-3xl font-serif font-light mb-4">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="text-muted-foreground mb-10 max-w-md">
        요청하신 페이지를 찾을 수 없습니다. <br />
        입력하신 주소가 정확한지 다시 한번 확인해 주세요.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-foreground text-background hover:opacity-80 transition rounded-full text-sm font-medium tracking-wide"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
