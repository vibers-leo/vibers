"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 기존 타입 (호환용)
export type PortfolioItem = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  external_url: string | null;
  internal_path: string | null;
  category: string | null;
  is_active: boolean;
  created_at: any;
};

// 기존 호환: 빈 배열 반환 (Firebase 기반 admin은 클라이언트에서 직접 조회)
export async function getPortfolios() {
  return [];
}

export async function deletePortfolio(id: string | number) {
  throw new Error("아티스트 동향 삭제 기능이 아직 구현되지 않았습니다.");
}

// ── Prisma 기반 Portfolio CRUD (멀티테넌트) ──

export async function getPortfoliosBySlug(siteSlug: string) {
  try {
    return await prisma.portfolio.findMany({
      where: { site_slug: siteSlug },
      orderBy: { sort_order: "asc" },
    });
  } catch (error) {
    console.error("getPortfoliosBySlug error:", error);
    return [];
  }
}

export async function createPortfolioPrisma(
  siteSlug: string,
  data: {
    title: string;
    description?: string;
    image_url?: string;
    category?: string;
    is_featured?: boolean;
    sort_order?: number;
  }
) {
  try {
    const result = await prisma.portfolio.create({
      data: {
        site_slug: siteSlug,
        title: data.title,
        description: data.description || null,
        image_url: data.image_url || null,
        category: data.category || null,
        is_featured: data.is_featured ?? false,
        sort_order: data.sort_order ?? 0,
      },
    });

    revalidatePath(`/${siteSlug}/artists`);
    revalidatePath("/admin/artists");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("createPortfolioPrisma error:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePortfolioPrisma(
  id: string,
  siteSlug: string,
  data: {
    title?: string;
    description?: string;
    image_url?: string;
    category?: string;
    is_featured?: boolean;
    sort_order?: number;
  }
) {
  try {
    const result = await prisma.portfolio.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    revalidatePath(`/${siteSlug}/artists`);
    revalidatePath("/admin/artists");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("updatePortfolioPrisma error:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePortfolioPrisma(id: string, siteSlug: string) {
  try {
    await prisma.portfolio.delete({ where: { id } });

    revalidatePath(`/${siteSlug}/artists`);
    revalidatePath("/admin/artists");

    return { success: true };
  } catch (error: any) {
    console.error("deletePortfolioPrisma error:", error);
    return { success: false, error: error.message };
  }
}

export async function getFeaturedPortfoliosBySlug(siteSlug: string) {
  try {
    return await prisma.portfolio.findMany({
      where: {
        site_slug: siteSlug,
        is_featured: true,
      },
      orderBy: { sort_order: "asc" },
    });
  } catch (error) {
    console.error("getFeaturedPortfoliosBySlug error:", error);
    return [];
  }
}
