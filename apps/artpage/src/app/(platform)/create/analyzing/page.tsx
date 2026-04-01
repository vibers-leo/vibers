"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { StyleAnalysisResult } from "@/app/api/ai/analyze-style/route";

const LOADING_MESSAGES = [
  "작품 이미지를 불러오는 중...",
  "AI가 작품 스타일을 분석하고 있습니다...",
  "색감과 분위기를 파악하는 중...",
  "최적의 디자인을 찾고 있습니다...",
  "거의 다 되었습니다!",
];

export default function AnalyzingPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const hasStarted = useRef(false);

  // 메시지 순환
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // 프로그레스 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // 90%에서 멈춤 (완료 전까지)
        return prev + Math.random() * 8;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // AI 분석 실행
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    async function analyze() {
      // sessionStorage에서 이미지 URL 가져오기
      const stored = sessionStorage.getItem("monopage_create_images");
      if (!stored) {
        router.replace("/create/upload");
        return;
      }

      const imageUrls: string[] = JSON.parse(stored);
      if (imageUrls.length === 0) {
        router.replace("/create/upload");
        return;
      }

      try {
        const response = await fetch("/api/ai/analyze-style", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrls }),
        });

        if (!response.ok) throw new Error("분석 실패");

        const result: StyleAnalysisResult = await response.json();

        // 결과를 세션에 저장
        sessionStorage.setItem(
          "monopage_create_analysis",
          JSON.stringify(result)
        );

        // 프로그레스 100%으로 설정 후 이동
        setProgress(100);
        setMessageIndex(LOADING_MESSAGES.length - 1);

        // 약간의 딜레이 후 이동 (UX)
        setTimeout(() => {
          router.push("/create/select");
        }, 800);
      } catch (error) {
        console.error("AI 분석 오류:", error);

        // 실패해도 휴리스틱 결과로 진행
        const fallback: StyleAnalysisResult = {
          recommendedTemplate: "modern-art",
          scores: {
            "modern-art": 70,
            "classic-gallery": 60,
            "minimal-portfolio": 50,
          },
          analysis: {
            artStyle: "분석 대기",
            colorPalette: "분석 대기",
            mood: "분석 대기",
          },
          usedAI: false,
        };

        sessionStorage.setItem(
          "monopage_create_analysis",
          JSON.stringify(fallback)
        );

        setProgress(100);
        setTimeout(() => {
          router.push("/create/select");
        }, 800);
      }
    }

    analyze();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* 애니메이션 원 */}
        <div className="relative w-32 h-32 mx-auto mb-12">
          {/* 외곽 회전 링 */}
          <div className="absolute inset-0 border-2 border-gray-100 rounded-full" />
          <div
            className="absolute inset-0 border-2 border-transparent border-t-black rounded-full animate-spin"
            style={{ animationDuration: "1.5s" }}
          />
          {/* 내부 펄스 */}
          <div className="absolute inset-4 bg-gray-50 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
          </div>
        </div>

        {/* 메시지 */}
        <p className="text-lg font-medium mb-4 transition-all duration-500">
          {LOADING_MESSAGES[messageIndex]}
        </p>

        {/* 프로그레스 바 */}
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-black rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="text-xs text-gray-400">
          {Math.round(Math.min(progress, 100))}%
        </p>
      </div>
    </div>
  );
}
