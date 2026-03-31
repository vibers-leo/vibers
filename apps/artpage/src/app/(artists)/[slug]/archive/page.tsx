import { notFound } from "next/navigation";
import { getTemplateConfig } from "@/lib/templates";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getTemplateConfig(slug);
  if (!config) notFound();

  // 전시 데이터 조회 (Prisma)
  const exhibitions = await prisma.exhibitions.findMany({
    where: { site_slug: slug, is_active: true },
    orderBy: { created_at: "desc" },
  });

  // 템플릿별 ArchiveClient 동적 import
  const isArthyun = config.template === "arthyun";
  const ArchiveClient = isArthyun
    ? (await import("@/components/templates/arthyun/ArchiveClient")).default
    : (await import("@/components/templates/art-way/ArchiveClient")).default;

  return (
    <div className="max-w-screen-2xl mx-auto px-6 mt-8 py-12 md:py-20 relative">
      <div className="flex justify-between items-end mb-12 border-b border-black pb-4">
        <h2 className="font-serif text-2xl md:text-3xl">Exhibition Archive</h2>
      </div>
      <ArchiveClient initialData={exhibitions || []} />
    </div>
  );
}
