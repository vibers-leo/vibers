import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스를 조건부로 병합하는 유틸리티 함수.
 * clsx로 조건 처리 후 tailwind-merge로 충돌 해결.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
