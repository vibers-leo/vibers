import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관 | 에이전시 랜딩",
  description: "에이전시 랜딩 테마 쇼케이스 이용약관",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 transition-colors mb-12"
        >
          <span>&larr;</span> 홈으로 돌아가기
        </Link>

        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-4">
          이용약관
        </h1>
        <p className="text-sm text-neutral-500 mb-12">
          시행일자: 2026년 3월 28일
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제1조 (목적)</h2>
          <p className="text-base text-neutral-700 leading-relaxed">
            본 약관은 주식회사 디랩(이하 &quot;회사&quot;)이 운영하는 에이전시 랜딩 테마 쇼케이스(이하 &quot;서비스&quot;)를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제2조 (정의)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>&quot;서비스&quot;라 함은 회사가 제공하는 랜딩 페이지 디자인 테마 쇼케이스 및 관련 제반 서비스를 의미합니다.</li>
              <li>&quot;이용자&quot;라 함은 서비스에 접속하여 본 약관에 따라 서비스를 이용하는 고객을 말합니다.</li>
            </ol>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제3조 (약관의 게시와 개정)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <p>① 회사는 본 약관의 내용을 사이트 내에 게시합니다.</p>
            <p>② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</p>
            <p>③ 약관 개정 시 적용일자 7일 전부터 공지합니다.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제4조 (서비스의 제공 및 변경)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <p>① 회사는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>30가지 프리미엄 디자인 테마 쇼케이스</li>
              <li>랜딩 페이지 프리뷰 서비스</li>
              <li>고객센터 운영 및 문의 응대</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제5조 (서비스의 중단)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <p>① 회사는 정보통신설비의 보수점검, 교체 및 고장, 통신 두절 등의 사유가 발생한 경우 서비스를 일시적으로 중단할 수 있습니다.</p>
            <p>② 회사에 고의 또는 중과실이 없는 한 서비스 중단으로 인한 손해를 배상하지 아니합니다.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제6조 (이용자의 의무)</h2>
          <ul className="list-disc list-inside space-y-2 ml-4 text-base text-neutral-700 leading-relaxed">
            <li>허위 정보 등록 또는 타인의 정보 도용 금지</li>
            <li>회사의 저작권 등 지적재산권 침해 금지</li>
            <li>회사 및 제3자의 명예 손상 또는 업무 방해 금지</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제7조 (저작권의 귀속 및 이용제한)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <p>① 회사가 작성한 저작물에 대한 저작권은 회사에 귀속합니다.</p>
            <p>② 이용자는 서비스에서 얻은 정보를 회사의 사전 승낙 없이 영리목적으로 이용할 수 없습니다.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제8조 (분쟁해결)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <p>회사는 이용자의 정당한 의견이나 불만을 반영하고 우선적으로 처리합니다.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제9조 (재판권 및 준거법)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <p>① 서비스 이용에 관한 분쟁에 대하여는 대한민국 법을 적용합니다.</p>
            <p>② 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.</p>
          </div>
        </section>

        <section className="mb-10 pt-8 border-t border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">부칙</h2>
          <p className="text-base text-neutral-700 leading-relaxed">
            본 약관은 2026년 3월 28일부터 시행됩니다.
          </p>
        </section>

        <div className="mt-12 p-6 bg-neutral-50 rounded-2xl border-2 border-neutral-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-3">이용약관 관련 문의</h3>
          <div className="text-sm text-neutral-600 space-y-1">
            <p>이메일: contact@vibers.co.kr</p>
            <p>운영: 주식회사 디랩 (대표: 이준호, 사업자등록번호: 617-86-11575)</p>
          </div>
        </div>
      </div>
    </main>
  );
}
