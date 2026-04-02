import { notFound } from "next/navigation";
import { getTemplateConfig } from "@/lib/templates";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SlugHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getTemplateConfig(slug);
  if (!config) notFound();

  if (config.template === "arthyun") {
    return <ArthyunHome />;
  }

  if (config.template === "art-way") {
    return <ArtWayHome />;
  }

  // 기본 모노페이지 템플릿 (바이오 링크 스타일)
  return <MonopageHome slug={slug} />;
}

// ── Monopage 메인 페이지 (신규) ──
async function MonopageHome({ slug }: { slug: string }) {
  const Image = (await import("next/image")).default;
  const LinkButtons = (await import("@/components/LinkButtons")).default;
  const IntegratedFeed = (await import("@/components/IntegratedFeed")).default;
  const SupportSection = (await import("@/components/SupportSection")).default;
  const { Instagram, Youtube, Globe } = await import("lucide-react");

  const siteSettings = await prisma.site_settings.findUnique({
    where: { site_slug: slug },
  });

  if (!siteSettings) notFound();

  // 업로드한 작품들 가져오기
  const portfolios = await prisma.portfolio.findMany({
    where: { site_slug: slug },
    orderBy: { sort_order: 'asc' }
  });

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 프로필 헤더 */}
      <div className="max-w-screen-md mx-auto px-6 pt-32 pb-16 text-center">
        <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <Image
            src={siteSettings.og_image_url || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=200&auto=format&fit=crop"}
            alt={siteSettings.site_name || slug}
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {siteSettings.site_name || slug}
        </h1>
        {(siteSettings as any).bio && (
          <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-xs mx-auto" style={{ wordBreak: "keep-all" }}>
            {(siteSettings as any).bio}
          </p>
        )}

        {/* 소셜 아이콘 바 (자동 연동) */}
        <div className="flex items-center justify-center gap-5 mb-10">
          {siteSettings.instagram_url && (
            <a 
              href={siteSettings.instagram_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-all duration-300"
            >
              <Instagram size={20} />
            </a>
          )}
          {siteSettings.youtube_url && (
            <a 
              href={siteSettings.youtube_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
            >
              <Youtube size={20} />
            </a>
          )}
          {siteSettings.blog_url && (
            <a 
              href={siteSettings.blog_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all duration-300"
            >
              <Globe size={20} />
            </a>
          )}
        </div>
        
        {/* 링크 버튼 그리드 */}
        <div className="mb-16">
          <LinkButtons slug={slug} />
        </div>
      </div>

      {/* 작품 갤러리 (업로드된 이미지 반영) */}
      {portfolios.length > 0 && (
        <div className="max-w-screen-xl mx-auto px-4 mb-24">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-px flex-1 bg-gray-100" />
            <h2 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Selected Works</h2>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {portfolios.map((item, idx) => (
              <div key={item.id} className="group relative">
                <div className="aspect-square relative overflow-hidden bg-gray-50">
                  <Image
                    src={item.image_url || "/fallback-work.jpg"}
                    alt={item.title || `Work ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="33vw"
                  />
                  {/* 오버레이 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 통합 피드 */}
      {((siteSettings as any).show_instagram || (siteSettings as any).show_youtube) && (
        <div className="max-w-screen-xl mx-auto px-4 mb-20">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-px flex-1 bg-gray-100" />
            <h2 className="text-xs font-bold text-gray-300 uppercase tracking-widest">The Feed</h2>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <IntegratedFeed slug={slug} />
        </div>
      )}

      {/* 후원 섹션 */}
      {(siteSettings as any).show_support && (
        <div className="max-w-screen-md mx-auto px-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-px flex-1 bg-gray-100" />
            <h2 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Support</h2>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <SupportSection slug={slug} artistName={siteSettings.site_name || slug} />
        </div>
      )}
    </div>
  );
}

// ── arthyun 메인 페이지 ──
async function ArthyunHome() {
  const MainSlider = (await import("@/components/templates/arthyun/MainSlider")).default;
  const MainBackground = (await import("@/components/templates/arthyun/MainBackground")).default;
  const Image = (await import("next/image")).default;

  try {
    const slides: any[] = [];

    // Featured Portfolios 조회 (Prisma)
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

    // 메인 설정 조회 (Prisma)
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
        <MainBackground youtubeUrl={mainSettings?.youtube_url} />
        <div className="relative z-10 h-full w-full pt-24">
          {slides.length > 0 ? (
            <MainSlider exhibitions={slides} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/80 gap-8 text-center px-4 animate-fade-in">
              {mainSettings?.poster_url && (
                <div className="relative w-full max-w-[400px] md:max-w-[500px] h-[50vh] flex items-center justify-center">
                  {mainSettings.link_url ? (
                    <a href={mainSettings.link_url} className="relative w-full h-full block hover:opacity-90 transition-opacity">
                      <Image src={mainSettings.poster_url} alt="Main Poster" fill className="object-contain drop-shadow-2xl" sizes="(max-width: 768px) 90vw, 500px" priority />
                    </a>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image src={mainSettings.poster_url} alt="Main Poster" fill className="object-contain drop-shadow-2xl" sizes="(max-width: 768px) 90vw, 500px" priority />
                    </div>
                  )}
                </div>
              )}
              {mainSettings?.center_text ? (
                <p className="text-base md:text-xl font-medium tracking-widest leading-relaxed whitespace-pre-wrap drop-shadow-lg max-w-3xl">
                  {mainSettings.center_text}
                </p>
              ) : (
                !mainSettings?.poster_url && (
                  <>
                    <p className="text-lg font-light tracking-widest text-white/40">EXHIBITION PREPARING</p>
                    <p className="text-xs text-white/30">현재 진행 중인 전시가 준비 중입니다.</p>
                  </>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("CRITICAL ERROR:", error);
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-10 text-center">
        <h1 className="text-4xl font-serif mb-4">Art Hyun</h1>
        <p className="text-gray-400 mb-8">System Maintenance</p>
        <p className="text-xs text-red-500">{error.message}</p>
      </div>
    );
  }
}

// ── art-way 메인 페이지 ──
async function ArtWayHome() {
  const MainSlider = (await import("@/components/templates/art-way/MainSlider")).default;

  // 전시 슬라이더 데이터 조회 (Prisma)
  const exhibitions = await prisma.exhibitions.findMany({
    where: { site_slug: "art-way", is_main_slider: true },
    orderBy: { created_at: "desc" },
  });

  // 사이트 설정에서 youtube_url 조회 (Prisma)
  const siteSettings = await prisma.site_settings.findUnique({
    where: { site_slug: "art-way" },
  });

  const slides = exhibitions || [];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="relative z-10 h-full w-full pt-24">
        {slides.length > 0 ? (
          <MainSlider exhibitions={slides} fallbackYoutubeUrl={siteSettings?.youtube_url} />
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
