import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE_URL = "https://arthyun.co.kr";

export const revalidate = 3600; // 매 시간 갱신

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // 1. 정적 라우트
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/artists`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/media`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/mall`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // 2. 동적 보도자료 라우트 (Prisma)
  try {
    const mediaList = await prisma.media_releases.findMany({
      where: { site_slug: "arthyun" },
      select: { id: true, created_at: true },
    });

    mediaList.forEach((item) => {
      routes.push({
        url: `${BASE_URL}/media/${item.id}`,
        lastModified: item.created_at ? new Date(item.created_at) : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  } catch (e) {
    console.error("사이트맵 생성 오류 (media_releases):", e);
  }

  return routes;
}
