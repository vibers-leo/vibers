import { prisma } from "@/lib/db";
import ArchiveClient from "@/components/templates/art-way/ArchiveClient";
import { AdminExhibitionButton } from "@/components/templates/art-way/AdminButtons";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  // 전시 데이터 조회 (Prisma)
  let exhibitions: any[] = [];
  try {
    exhibitions = await prisma.exhibitions.findMany({
      where: { site_slug: "art-way", is_active: true },
      orderBy: { created_at: "desc" },
    });
  } catch (e) {
    console.error("Archive fetch error:", e);
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 mt-8 py-12 md:py-20 relative">
      <div className="flex justify-between items-end mb-12 border-b border-black pb-4">
        <h2 className="font-serif text-2xl md:text-3xl">Exhibition Archive</h2>

        {/* 관리자에게만 보이는 등록 버튼 */}
        <AdminExhibitionButton />
      </div>

      <ArchiveClient initialData={exhibitions || []} />
    </div>
  );
}
