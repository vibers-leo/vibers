import { notFound } from "next/navigation";
import { getTemplateConfig } from "@/lib/templates";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MediaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getTemplateConfig(slug);
  if (!config) notFound();

  // 보도자료 조회 (Prisma)
  let items: any[] = [];
  try {
    items = await prisma.media_releases.findMany({
      where: { site_slug: slug, is_visible: true },
      orderBy: { created_at: "desc" },
    });
  } catch (e) {
    console.error("media_releases 조회 오류:", e);
  }

  const isArthyun = config.template === "arthyun";

  // arthyun은 데이터를 변환
  const displayItems = isArthyun
    ? items.map((item) => ({
        id: `new-${item.id}`,
        realId: item.id,
        type: "new",
        title: item.title,
        date: item.published_date || item.created_at,
        image: item.image_url,
        source: item.press_name || "NEWS",
        link: `/${slug}/media/${item.id}`,
      })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : items;

  // 동적 import: 템플릿별 SocialConnect
  const SocialConnect = isArthyun
    ? (await import("@/components/templates/arthyun/SocialConnect")).default
    : (await import("@/components/templates/art-way/SocialConnect")).default;

  return (
    <div className="max-w-screen-2xl mx-auto px-6 mt-8 py-12 md:py-20 space-y-24">
      <section>
        {isArthyun ? (
          <>
            <div className="mb-12 border-b border-black pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-blue-600 block mb-2">
                  ART HYUN ARCHIVE
                </span>
                <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter uppercase mb-4">
                  Media
                </h1>
                <p className="max-w-xl text-gray-500 font-light leading-relaxed">
                  아트현의 활동 소식과 언론 보도 자료를 확인하실 수 있습니다.
                </p>
              </div>
            </div>
            <ul className="space-y-0">
              {displayItems.length > 0 ? (
                displayItems.map((item: any) => (
                  <li key={item.id} className="group border-b border-gray-100 py-6 transition-colors">
                    <Link href={item.link} className="flex flex-col md:flex-row gap-6 group">
                      {item.image ? (
                        <div className="relative w-full md:w-48 aspect-video shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 192px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className="hidden md:flex w-48 aspect-video bg-gray-50 items-center justify-center text-gray-300 text-xs shrink-0">NO IMAGE</div>
                      )}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-[#E85C4A] font-bold tracking-widest uppercase">{item.source}</span>
                            <div className="flex items-center gap-1 text-gray-400 text-sm shrink-0 font-heading">
                              <span>{new Date(item.date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</span>
                            </div>
                          </div>
                          <h3 className="text-lg md:text-xl font-medium leading-snug group-hover:text-[#E85C4A] transition-colors mb-3">{item.title}</h3>
                        </div>
                        <div className="flex items-center text-xs text-gray-400 mt-2 font-heading tracking-wider">
                          <ExternalLink size={12} className="mr-1" /> READ MORE
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="py-10 text-center text-gray-400">등록된 보도자료가 없습니다.</li>
              )}
            </ul>
          </>
        ) : (
          <>
            <div className="flex justify-between items-end mb-8 border-b border-black pb-4">
              <h2 className="text-3xl font-serif">Press Release</h2>
            </div>
            <ul className="space-y-0">
              {items.length > 0 ? (
                items.map((item: any) => (
                  <li key={item.id} className="group border-b border-gray-100 py-6 transition-colors">
                    <Link href={`/${slug}/media/${item.id}`} className="flex flex-col md:flex-row gap-6 group">
                      {item.image_url && (
                        <div className="relative w-full md:w-48 aspect-video shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Image src={item.image_url} alt={item.title} fill sizes="(max-width: 768px) 100vw, 192px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-blue-600 font-bold">{item.press_name || "NEWS"}</span>
                            <div className="flex items-center gap-1 text-gray-400 text-sm shrink-0">
                              <span>
                                {item.published_date
                                  ? new Date(item.published_date).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
                                  : item.created_at
                                    ? new Date(item.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
                                    : ""}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg md:text-xl font-medium leading-snug group-hover:underline decoration-1 underline-offset-4 mb-3">{item.title}</h3>
                        </div>
                        <div className="flex items-center text-xs text-gray-400 mt-2">
                          <ExternalLink size={12} className="mr-1" /> 자세히 보기
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="py-10 text-center text-gray-400">등록된 보도자료가 없습니다.</li>
              )}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2 className={`text-3xl ${isArthyun ? "font-heading font-bold uppercase tracking-widest" : "font-serif"} mb-10 border-b border-black pb-4`}>
          Connect
        </h2>
        <div className="py-8">
          <SocialConnect />
        </div>
      </section>
    </div>
  );
}
