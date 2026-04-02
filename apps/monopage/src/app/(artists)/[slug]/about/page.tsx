import { notFound } from "next/navigation";
import { getTemplateConfig } from "@/lib/templates";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getTemplateConfig(slug);
  if (!config) notFound();

  if (config.template === "arthyun") {
    return <ArthyunAbout />;
  }
  return <ArtWayAbout />;
}

// ── arthyun About ──
function ArthyunAbout() {
  return (
    <div className="w-full">
      <div className="max-w-[1280px] mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <div className="w-full max-w-lg mb-12 animate-fade-in-up">
          <Image src="/images/about/logo_detail.png" alt="Art Hyun Logo Detail" width={800} height={400} className="w-full h-auto object-contain" priority />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8 tracking-widest uppercase animate-fade-in-up delay-100">ART HYUN</h1>
        <p className="text-xl md:text-2xl text-gray-600 font-light mb-12 animate-fade-in-up delay-200">예술로 여는 도시재생</p>
        <div className="w-20 h-[1px] bg-black mb-12 animate-fade-in-up delay-300"></div>
        <div className="max-w-3xl text-lg text-gray-600 leading-loose mx-auto animate-fade-in-up delay-400">
          <p className="mb-6">아트현은 공공미술, 공공디자인, 벽화 등 다양한 예술활동을 통해 도시의 이야기를 시각화하고, 지역사회에 활력을 불어넣은 <strong>문화예술 전문 사회적기업</strong>입니다.</p>
          <p>단순한 환경 개선을 넘어, 예술이 가진 힘으로 공간의 가치를 재발견하고, 주민들의 삶 속에 스며드는 따뜻한 문화를 만들어 갑니다.</p>
        </div>
      </div>
      <div className="bg-gray-50 py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">OUR TEAM</h2>
          <div className="w-full flex justify-center">
            <Image src="/images/about/team_cards.png" alt="Art Hyun Team" width={1200} height={600} className="w-full max-w-5xl h-auto object-contain shadow-lg rounded-lg hover:scale-[1.01] transition duration-500" />
          </div>
        </div>
      </div>
      <div className="py-20 md:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center mb-16">HISTORY</h2>
          <div className="w-full flex justify-center">
            <Image src="/images/about/history_timeline.png" alt="Art Hyun History Timeline" width={800} height={1000} className="w-full max-w-xl h-auto object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── art-way About ──
function ArtWayAbout() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-20 md:py-32">
      <div className="text-center mb-16 space-y-6 animate-fade-in-up">
        <h1 className="text-2xl md:text-4xl font-serif font-medium leading-relaxed text-gray-900">
          &quot;오랜 시간 멈춰있던 공간이 <br className="hidden md:block" />
          예술의 숨결로 다시 깨어났습니다.&quot;
        </h1>
        <p className="text-gray-500 text-sm md:text-base leading-loose max-w-2xl mx-auto break-keep">
          부산 동구 좌천동, 오랜 시간 멈춰있던 공간이 예술의 숨결로 다시 깨어났습니다.
          아트웨이 갤러리는 방치되었던 유휴 공간을 지역 예술가들의 열정과 동구청의 협력으로
          재탄생시킨 문화거점 공간입니다. 이번엔 어떤 전시가 열릴까요?
        </p>
      </div>
      <div className="relative w-full aspect-[16/10] md:aspect-[21/9] bg-gray-50 overflow-hidden shadow-sm animate-fade-in">
        <Image src="/view.jpg" alt="Artway Gallery View" fill className="object-cover hover:scale-100 transition-transform duration-1000 ease-out" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw" priority />
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left border-t border-gray-100 pt-16">
        <div>
          <h3 className="font-serif text-lg font-bold mb-2">Location</h3>
          <p className="text-gray-500 text-sm">부산광역시 동구 정공단로 9</p>
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold mb-2">Contact</h3>
          <p className="text-gray-500 text-sm">0507-1369-8386</p>
          <p className="text-gray-500 text-sm">artway_gallery@naver.com</p>
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold mb-2">Hours</h3>
          <p className="text-gray-500 text-sm">Open : 11:00 - 17:30</p>
          <p className="text-gray-400 text-xs mt-1">* 매주 월, 화요일 휴관</p>
        </div>
      </div>
    </div>
  );
}
