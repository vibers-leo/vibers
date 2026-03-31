// @vibers/ui -- 계발자들 공통 UI 패키지
// 모든 앱이 공유하는 유틸리티와 컴포넌트를 export 합니다.

// 유틸리티
export { cn } from "./lib/utils";

// clsx 타입도 re-export (앱에서 ClassValue 타입이 필요할 수 있음)
export type { ClassValue } from "clsx";
