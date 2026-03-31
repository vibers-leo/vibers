
import { prisma } from "@/lib/db";
import MainSlider from "@/components/templates/arthyun/MainSlider";
import MainBackground from "@/components/templates/arthyun/MainBackground";
import Image from "next/image";

// 1분마다 갱신 (ISR) - 성능 최적화
export const revalidate = 60;

export default async function HomePage() {
  try {
    const slides: any[] = [];

    // 1. Featured Portfolios 조회 (Prisma)
    try {
      const portfolios = await prisma.portfolio.findMany({
        where: { site_slug: "arthyun", is_featured: true },
      });
      portfolios.forEach((data: any) => {
        slides.push({
          id: String(data.id),
          ...data,
          poster_url: data.thumbnail_url,
          artist: data.client || data.artist || "ART HYUN",
          start_date: data.completion_date || (data.created_at ? new Date(data.created_at).toISOString().substring(0, 10) : null),
          end_date: null,
        });
      });
    } catch (e) {
      console.error("Portfolio 조회 오류:", e);
    }

    // 2. 메인 설정 가져오기 (site_settings)
    let mainSettings: any = null;
    try {
      mainSettings = await prisma.site_settings.findUnique({
        where: { site_slug: "arthyun" },
      });
    } catch (e) {
      console.error("site_settings 조회 오류:", e);
    }

    return (
      <div className="relative w-full h-screen bg-black overflow-hidden">
        {/* 배경 비디오 (항상 표시) */}
        <MainBackground youtubeUrl={mainSettings?.youtube_url} />

        <div className="relative z-10 h-full w-full pt-16">
          {slides.length > 0 ? (
            <MainSlider exhibitions={slides} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/80 gap-8 text-center px-4 animate-fade-in">
              {/* 포스터 이미지 */}
              {mainSettings?.poster_url && (
                <div className="relative w-full max-w-[400px] md:max-w-[500px] h-[50vh] flex items-center justify-center">
                  {mainSettings.link_url ? (
                    <a href={mainSettings.link_url} className="relative w-full h-full block hover:opacity-90 transition-opacity">
                      <Image
                        src={mainSettings.poster_url}
                        alt="Main Poster"
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="(max-width: 768px) 90vw, 500px"
                        priority
                      />
                    </a>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={mainSettings.poster_url}
                        alt="Main Poster"
                        fill
                        className="object-contain drop-shadow-2xl"
                        sizes="(max-width: 768px) 90vw, 500px"
                        priority
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 중앙 텍스트 */}
              {mainSettings?.center_text ? (
                <p className="text-base md:text-xl font-medium tracking-widest leading-relaxed whitespace-pre-wrap drop-shadow-lg max-w-3xl">
                  {mainSettings.center_text}
                </p>
              ) : !mainSettings?.poster_url && (
                <>
                  <p className="text-lg font-light tracking-widest text-white/40">EXHIBITION PREPARING</p>
                  <p className="text-xs text-white/30">현재 진행 중인 전시가 준비 중입니다.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("CRITICAL ERROR IN PAGE:", error);
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-10 text-center">
        <h1 className="text-4xl font-serif mb-4">Art Hyun</h1>
        <p className="text-gray-400 mb-8">System Maintenance</p>
        <p className="text-xs text-red-500">{error.message}</p>
      </div>
    );
  }
}
