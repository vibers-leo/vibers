import { notFound } from "next/navigation";
import { getTemplateConfig } from "@/lib/templates";
import { prisma } from "@/lib/db";
import ArchiveClient from "@/components/templates/arthyun/ArchiveClient";
import AdminPortfolioButtonClient from "@/components/templates/arthyun/AdminPortfolioButtonClient";
import { extractFirstImage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getTemplateConfig(slug);
  if (!config) notFound();

  // Portfolio 데이터 조회 (Prisma)
  let formattedData: any[] = [];

  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { site_slug: slug },
    });

    formattedData = portfolios.map((item: any) => ({
      id: String(item.id),
      title: item.title,
      artist: item.artist || item.client || config.name,
      start_date: item.completion_date,
      end_date: null,
      poster_url: item.thumbnail_url || extractFirstImage(item.description),
      description: item.description,
      source: "portfolio",
      category: item.category,
      created_at: item.created_at,
    }));

    formattedData.sort((a: any, b: any) => {
      const dateA = a.start_date ? new Date(a.start_date).getTime() : a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.start_date ? new Date(b.start_date).getTime() : b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  } catch (e) {
    console.error("Portfolio 조회 오류:", e);
  }

  const isArthyun = config.template === "arthyun";

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="mb-16 border-b border-black pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-blue-600 block mb-2">
              {config.name.toUpperCase()} ARCHIVE
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter uppercase mb-4">
              아티스트 동향
            </h1>
            <p className="max-w-xl text-gray-500 font-light leading-relaxed">
              {isArthyun
                ? "아트현이 진행한 다양한 공공미술, 디자인, 벽화 프로젝트를 소개합니다."
                : "아트웨이 갤러리의 아티스트 동향을 소개합니다."}
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-mono text-gray-400">TOTAL PROJECTS</p>
            <p className="text-4xl font-bold font-serif">{formattedData.length}</p>
          </div>
          <div className="absolute top-0 right-0 p-6 md:p-0 md:relative md:top-auto md:right-auto">
            <AdminPortfolioButtonClient />
          </div>
        </div>

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
