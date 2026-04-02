import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 에이전시 랜딩",
  description: "에이전시 랜딩 테마 쇼케이스 개인정보처리방침",
};

export default function PrivacyPage() {
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
          개인정보처리방침
        </h1>
        <p className="text-sm text-neutral-500 mb-12">
          시행일자: 2026년 3월 28일
        </p>

        <section className="mb-10">
          <p className="text-base text-neutral-700 leading-relaxed">
            주식회사 디랩(이하 &quot;회사&quot;)은 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제1조 (개인정보의 처리 목적)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-neutral-900 mb-2">1. 서비스 제공</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>에이전시 랜딩 테마 쇼케이스 서비스 제공</li>
                <li>고객 상담 및 문의 응대</li>
              </ul>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-bold text-neutral-900 mb-2">2. 민원 처리</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>민원인의 신원 확인 및 처리결과 통보</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제2조 (개인정보의 처리 및 보유기간)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <p>① 회사는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
            <div className="mt-4 p-4 bg-neutral-50 rounded-xl">
              <h3 className="text-base font-bold text-neutral-900 mb-3">개인정보 처리 및 보유기간</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-semibold">• 문의 정보 (이메일)</p>
                  <p className="ml-4 text-neutral-500">보유기간: 문의 처리 완료 후 1년</p>
                </div>
                <div>
                  <p className="font-semibold">• 서비스 이용 기록</p>
                  <p className="ml-4 text-neutral-500">보유기간: 3개월</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제3조 (처리하는 개인정보의 항목)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-neutral-50 rounded-xl">
                <h3 className="text-base font-bold text-neutral-900 mb-2">1. 서비스 이용 시</h3>
                <p className="text-sm text-neutral-500">• 최소 수집: 이메일</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl">
                <h3 className="text-base font-bold text-neutral-900 mb-2">2. 자동 수집 항목</h3>
                <p className="text-sm text-neutral-500">• IP 주소, 쿠키, 서비스 이용 기록, 방문 일시</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제4조 (개인정보의 제3자 제공)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <p>회사는 현재 개인정보를 제3자에게 제공하고 있지 않습니다.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제5조 (개인정보처리의 위탁)</h2>
          <div className="p-4 bg-neutral-50 rounded-xl">
            <p className="text-sm text-neutral-500">현재 개인정보 처리 위탁 업체 없음</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <p>정보주체는 언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구 권리를 행사할 수 있으며, 서면·전자우편 등을 통하여 요청하실 수 있습니다.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제7조 (개인정보의 파기)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <p>회사는 개인정보가 불필요하게 되었을 때에는 지체없이 파기합니다.</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>전자적 파일: 안전하게 삭제</li>
              <li>종이 출력물: 분쇄 또는 소각</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제8조 (개인정보의 안전성 확보조치)</h2>
          <div className="space-y-3 text-base text-neutral-700 leading-relaxed">
            <ul className="list-decimal list-inside space-y-2 ml-4">
              <li>관리적 조치: 내부관리계획 수립·시행</li>
              <li>기술적 조치: 접근권한 관리, 암호화, 보안프로그램 설치</li>
              <li>물리적 조치: 전산실 접근통제</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제9조 (개인정보 보호책임자)</h2>
          <div className="mt-4 p-6 bg-neutral-50 rounded-xl">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">개인정보 보호책임자</h3>
            <div className="space-y-2 text-sm text-neutral-700">
              <p>• 성명: 이준호</p>
              <p>• 직책: 대표</p>
              <p>• 연락처: 010-9249-3872</p>
              <p>• 이메일: contact@vibers.co.kr</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제10조 (권익침해 구제방법)</h2>
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="font-semibold text-neutral-900">개인정보분쟁조정위원회</p>
              <p className="text-sm text-neutral-500">전화: 1833-6972 | www.kopico.go.kr</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="font-semibold text-neutral-900">개인정보침해신고센터</p>
              <p className="text-sm text-neutral-500">전화: 118 | privacy.kisa.or.kr</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="font-semibold text-neutral-900">대검찰청 사이버범죄수사단</p>
              <p className="text-sm text-neutral-500">전화: 1301 | www.spo.go.kr</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl">
              <p className="font-semibold text-neutral-900">경찰청 사이버안전국</p>
              <p className="text-sm text-neutral-500">전화: 182 | cyberbureau.police.go.kr</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">제11조 (개인정보 처리방침 변경)</h2>
          <p className="text-base text-neutral-700 leading-relaxed">
            이 개인정보 처리방침은 2026. 3. 28.부터 적용됩니다.
          </p>
        </section>

        <div className="mt-12 p-6 bg-neutral-50 rounded-2xl border-2 border-neutral-200">
          <h3 className="text-lg font-bold text-neutral-900 mb-3">개인정보 처리방침 관련 문의</h3>
          <div className="text-sm text-neutral-600 space-y-1">
            <p>이메일: contact@vibers.co.kr</p>
            <p>개인정보 보호책임자: 이준호 (대표)</p>
            <p>연락처: 010-9249-3872</p>
          </div>
        </div>
      </div>
    </main>
  );
}
