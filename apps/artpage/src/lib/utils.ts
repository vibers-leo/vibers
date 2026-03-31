import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * HTML 콘텐츠에서 첫 번째 <img> 태그의 src를 추출합니다.
 * 이미지가 없으면 null을 반환합니다.
 */
export function extractFirstImage(html: string | null | undefined): string | null {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

/**
 * HTML 콘텐츠에서 이미지 태그를 제거합니다.
 * posterUrl이 주어지면 해당 이미지만 제거하고, 없으면 첫 번째 이미지를 제거합니다.
 */
export function stripImageFromContent(html: string | null | undefined, posterUrl?: string | null): string {
  if (!html) return "";
  if (posterUrl) {
    // posterUrl과 일치하는 img 태그 제거
    const escaped = posterUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`<img[^>]+src=["']${escaped}["'][^>]*>`, "gi");
    return html.replace(regex, "");
  }
  // posterUrl이 없으면 첫 번째 img 태그만 제거
  return html.replace(/<img[^>]+>/i, "");
}
