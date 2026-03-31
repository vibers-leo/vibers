
import { prisma } from "@/lib/db";
import ArchiveClient from "@/components/templates/arthyun/ArchiveClient";
import AdminPortfolioButtonClient from "@/components/templates/arthyun/AdminPortfolioButtonClient";
import { extractFirstImage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {

  // 사이트 설정 조회 (Prisma)
  let settings: any = null;
  let instagramData: any[] | null = null;

  try {
    settings = await prisma.site_settings.findUnique({
      where: { site_slug: "arthyun" },
    });
  } catch (e) {
    console.error("site_settings 조회 오류:", e);
  }

  // Instagram 연동이 활성화된 경우 인스타그램 피드 우선 사용
  if (settings?.is_instagram_active && settings?.instagram_access_token) {
    const { fetchInstagramFeed } = await import("@/actions/instagramActions");
    const igItems = await fetchInstagramFeed(settings.instagram_access_token, settings.instagram_user_id);

    if (igItems && Array.isArray(igItems)) {
      instagramData = igItems.map((item: any) => ({
        id: item.id,
        title: item.caption ? item.caption.split("\n")[0].substring(0, 50) + (item.caption.length > 50 ? "..." : "") : "No Title",
        artist: "@" + item.username,
        start_date: item.timestamp,
        end_date: null,
        poster_url: item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url,
        description: item.caption || "",
        source: "instagram",
        category: "Instagram",
        created_at: item.timestamp,
        permalink: item.permalink,
      }));
    }
  }

  let formattedData: any[] = [];

  if (instagramData) {
    // Instagram 데이터 우선
    formattedData = instagramData;
  } else {
    // Prisma Portfolio 조회 (Fallback)
    let portfolios: any[] = [];
    try {
      portfolios = await prisma.portfolio.findMany({
        where: { site_slug: "arthyun" },
      });
    } catch (e) {
      console.error("Portfolio 조회 오류:", e);
    }

    formattedData = portfolios.map((item: any) => ({
      id: String(item.id),
      title: item.title,
      artist: item.artist || item.client || "ART HYUN",
      start_date: item.completion_date,
      end_date: null,
      poster_url: item.thumbnail_url || extractFirstImage(item.description),
      description: item.description,
      source: "portfolio",
      category: item.category,
      created_at: item.created_at,
    }));

    formattedData.sort((a, b) => {
      const dateA = a.start_date ? new Date(a.start_date).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
      const dateB = b.start_date ? new Date(b.start_date).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
      return dateB - dateA;
    });
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-screen-2xl mx-auto px-6">

        {/* 헤더 */}
        <div className="mb-16 border-b border-black pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-blue-600 block mb-2">
              ART HYUN ARCHIVE
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter uppercase mb-4">
              아티스트 동향
            </h1>
            <p className="max-w-xl text-gray-500 font-light leading-relaxed">
              아트현이 진행한 다양한 공공미술, 디자인, 벽화 프로젝트를 소개합니다.
              <br className="hidden md:block" />
              예술을 통해 도시와 공간에 새로운 가치를 더합니다.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-mono text-gray-400">TOTAL PROJECTS</p>
            <p className="text-4xl font-bold font-serif">{formattedData.length}</p>
          </div>

          {/* 관리자 버튼 */}
          <div className="absolute top-0 right-0 p-6 md:p-0 md:relative md:top-auto md:right-auto">
            <AdminPortfolioButtonClient />
          </div>
        </div>

        {/* 그리드 & 모달 */}
        {formattedData.length > 0 ? (
          <ArchiveClient initialData={formattedData} />
        ) : (
          <div className="py-20 text-center text-gray-400">
            <p>등록된 아티스트 동향이 없습니다.</p>
          </div>
        )}

      </div>
    </div>
  );
}
