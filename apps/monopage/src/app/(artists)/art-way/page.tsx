import { prisma } from "@/lib/db";
import MainSlider from "@/components/templates/art-way/MainSlider";

// 데이터가 계속 바뀌므로 캐싱하지 않음
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. 메인 슬라이더용 전시 데이터 조회 (Prisma)
  const exhibitions = await prisma.exhibitions.findMany({
    where: { site_slug: "art-way", is_main_slider: true },
    orderBy: { created_at: "desc" },
  });

  // 2. 사이트 설정에서 youtube_url 조회 (Prisma)
  const siteSettings = await prisma.site_settings.findUnique({
    where: { site_slug: "art-way" },
  });

  const slides = exhibitions || [];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="relative z-10 h-full w-full pt-16">
        {slides.length > 0 ? (
          <MainSlider
            exhibitions={slides}
            fallbackYoutubeUrl={siteSettings?.youtube_url}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white/40 gap-4">
            <p className="text-lg font-light tracking-widest">EXHIBITION PREPARING</p>
            <p className="text-xs">현재 진행 중인 전시가 준비 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
