import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | 북촌 아트 스페이스",
  description: "북촌 아트 스페이스 이용약관",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          이용약관
        </h1>
        <p className="text-sm text-gray-500 mb-12">
          시행일자: 2026년 3월 28일
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">제1조 (목적)</h2>
          <p className="text-base text-gray-700 leading-relaxed">
            본 약관은 주식회사 디랩(이하 &quot;회사&quot;)이 운영하는 북촌 아트 스페이스 웹사이트(이하 &quot;사이트&quot;)에서 제공하는 서비스(이하 &quot;서비스&quot;)를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">제2조 (정의)</h2>
          <div className="space-y-3 text-base text-gray-700 leading-relaxed">
            <ul className="list-decimal list-inside space-y-2 ml-4">
              <li>&quot;서비스&quot;라 함은 회사가 제공하는 전시 정보, 아티스트 동향 관리 등 제반 서비스를 의미합니다.</li>
              <li>&quot;이용자&quot;라 함은 사이트에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">제3조 (약관의 게시와 개정)</h2>
          <div className="space-y-3 text-base text-gray-700 leading-relaxed">
            <p>① 회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 사이트 내에 게시합니다.</p>
            <p>② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</p>
            <p>③ 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 사이트에 그 적용일자 7일 전부터 공지합니다.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">제4조 (서비스의 제공 및 변경)</h2>
          <div className="space-y-3 text-base text-gray-700 leading-relaxed">
            <p>① 회사는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>전시 정보 안내 서비스</li>
              <li>아티스트 동향 관리 서비스</li>
              <li>웹사이트 빌더 서비스</li>
              <li>문의 및 상담 서비스</li>
            </ul>
            <p>② 회사는 상당한 이유가 있는 경우에 서비스를 변경할 수 있습니다.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">제5조 (서비스의 중단)</h2>
          <div className="space-y-3 text-base text-gray-700 leading-relaxed">
            <p>① 회사는 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우 서비스를 일시적으로 중단할 수 있습니다.</p>
            <p>② 천재지변, 비상사태 등으로 정상적인 서비스 제공이 불가능할 경우 서비스의 전부 또는 일부를 제한하거나 중단할 수 있습니다.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">제6조 (이용자의 의무)</h2>
          <div className="space-y-3 text-base text-gray-700 leading-relaxed">
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 및 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">제7조 (저작권의 귀속 및 이용제한)</h2>
          <div className="space-y-3 text-base text-gray-700 leading-relaxed">
            <p>① 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</p>
            <p>② 이용자는 회사의 사전 승낙 없이 정보를 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">제8조 (분쟁해결)</h2>
          <div className="space-y-3 text-base text-gray-700 leading-relaxed">
            <p>① 회사와 이용자 간에 발생한 분쟁에 대하여는 대한민국 법을 적용합니다.</p>
            <p>② 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.</p>
          </div>
        </section>

        <section className="mb-10 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">부칙</h2>
          <p className="text-base text-gray-700 leading-relaxed">
            본 약관은 2026년 3월 28일부터 시행됩니다.
          </p>
        </section>

        <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-3">이용약관 관련 문의</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>개인정보 보호책임자: 이준호 (대표)</p>
            <p>연락처: 010-9249-3872</p>
            <p>운영회사: 주식회사 디랩 (대표: 이준호, 사업자등록번호: 617-86-11575)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
