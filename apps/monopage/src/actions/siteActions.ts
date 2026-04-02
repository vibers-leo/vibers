"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type CreateSiteInput = {
  slug: string;
  name: string;
  bio?: string;
  template: string;
  imageUrls: string[];
  social?: {
    instagram?: string;
    blog?: string;
    youtube?: string;
  };
  show_support?: boolean;
  show_instagram?: boolean;
  customLinks?: { title: string; url: string; icon?: string }[];
};

type CreateSiteResult =
  | { success: true; slug: string; url: string }
  | { success: false; error: string };

/**
 * AI 사이트 생성 — DB에 사이트 설정 + 포트폴리오 이미지 삽입
 */
export async function createArtistSite(
  data: CreateSiteInput
): Promise<CreateSiteResult> {
  try {
    const { slug, name, bio, template, imageUrls, social } = data;

    // slug 유효성 검증
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return {
        success: false,
        error: "사이트 주소는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.",
      };
    }

    if (slug.length < 2 || slug.length > 30) {
      return {
        success: false,
        error: "사이트 주소는 2~30자여야 합니다.",
      };
    }

    // 이름 필수
    if (!name || name.trim().length === 0) {
      return { success: false, error: "작가명은 필수입니다." };
    }

    // slug 중복 확인
    const existing = await prisma.site_settings.findUnique({
      where: { site_slug: slug },
    });

    if (existing) {
      return {
        success: false,
        error: "이미 사용 중인 주소입니다. 다른 주소를 입력해주세요.",
      };
    }

    // 1. site_settings 생성
    await prisma.site_settings.create({
      data: {
        site_slug: slug,
        site_name: name,
        site_title: `${name} | 모노페이지`,
        site_description: bio || `${name}의 아트 포트폴리오`,
        template: template,
        og_description: bio || `${name}의 아트 포트폴리오`,
        domain: `https://monopage.kr/${slug}`,
        instagram_url: social?.instagram || null,
        blog_url: social?.blog || null,
        youtube_url: social?.youtube || null,
        bio: bio || null,
        show_support: data.show_support ?? true,
        show_instagram: data.show_instagram ?? true,
        is_active: true,
      },
    });

    // 2. 이미지들을 Portfolio로 삽입
    if (imageUrls.length > 0) {
      const portfolioData = imageUrls.map((url, i) => ({
        site_slug: slug,
        title: `작품 ${i + 1}`,
        image_url: url,
        sort_order: i,
        is_featured: i < 3, // 처음 3개는 대표작
      }));

      await prisma.portfolio.createMany({
        data: portfolioData,
      });
    }

    // 3. 커스텀 링크 (Linktree 스타일) 삽입
    if (data.customLinks && data.customLinks.length > 0) {
      const linkData = data.customLinks.map((l, i) => ({
        site_slug: slug,
        title: l.title || "Link",
        url: l.url,
        icon: l.icon || "globe",
        sort_order: i,
        is_active: true,
      }));

      await prisma.profileLink.createMany({
        data: linkData,
      });
    }

    // 4. 캐시 무효화
    revalidatePath(`/${slug}`);
    revalidatePath("/");

    const siteUrl = `https://monopage.kr/${slug}`;

    return {
      success: true,
      slug,
      url: siteUrl,
    };
  } catch (error: any) {
    console.error("createArtistSite 오류:", error);
    return {
      success: false,
      error: error?.message || "사이트 생성 중 오류가 발생했습니다.",
    };
  }
}
