"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Sparkles, Star } from "lucide-react";
import { GENERATIVE_TEMPLATES } from "@/lib/templates";
import type { GenerativeTemplateId } from "@/lib/templates";
import type { StyleAnalysisResult } from "@/app/api/ai/analyze-style/route";

// 템플릿별 미니 프리뷰 목업
function TemplateMockup({ templateId }: { templateId: GenerativeTemplateId }) {
  if (templateId === "modern-art") {
    return (
      <div className="w-full aspect-[4/3] bg-white border border-gray-200 rounded-lg p-3 overflow-hidden">
        {/* 미니 헤더 */}
        <div className="flex justify-between items-center mb-3">
          <div className="w-16 h-1.5 bg-gray-800 rounded" />
          <div className="flex gap-1">
            <div className="w-6 h-1 bg-gray-200 rounded" />
            <div className="w-6 h-1 bg-gray-200 rounded" />
          </div>
        </div>
        {/* 3열 그리드 */}
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-sm"
              style={{
                backgroundColor: ["#E8E8E8", "#D4D4D4", "#F0F0F0", "#DCDCDC", "#E0E0E0", "#EBEBEB"][i],
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (templateId === "classic-gallery") {
    return (
      <div className="w-full aspect-[4/3] bg-[#0A0A0A] border border-gray-700 rounded-lg p-3 overflow-hidden">
        {/* 미니 헤더 */}
        <div className="text-center mb-3">
          <div className="w-20 h-1.5 bg-stone-300 rounded mx-auto" />
        </div>
        {/* 단일 큰 이미지 */}
        <div className="aspect-[16/9] bg-[#1A1A1A] rounded-sm mb-2" />
        {/* 제목 */}
        <div className="w-24 h-1 bg-stone-500 rounded" />
      </div>
    );
  }

  // minimal-portfolio
  return (
    <div className="w-full aspect-[4/3] bg-[#FAFAFA] border border-gray-200 rounded-lg p-3 overflow-hidden">
      {/* 미니 헤더 */}
      <div className="flex justify-between items-center mb-3">
        <div className="w-12 h-1 bg-gray-400 rounded" />
        <div className="w-4 h-1 bg-gray-200 rounded" />
      </div>
      {/* 메이슨리 느낌 */}
      <div className="flex gap-1">
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-8 bg-gray-200 rounded-sm" />
          <div className="h-12 bg-gray-150 rounded-sm" style={{ backgroundColor: "#E8E8E8" }} />
          <div className="h-6 bg-gray-200 rounded-sm" />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-12 bg-gray-150 rounded-sm" style={{ backgroundColor: "#ECECEC" }} />
          <div className="h-6 bg-gray-200 rounded-sm" />
          <div className="h-10 bg-gray-150 rounded-sm" style={{ backgroundColor: "#E0E0E0" }} />
        </div>
      </div>
    </div>
  );
}

export default function SelectPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<StyleAnalysisResult | null>(null);
  const [selected, setSelected] = useState<GenerativeTemplateId | null>(null);

  // 분석 결과 로드
  useEffect(() => {
    const stored = sessionStorage.getItem("monopage_create_analysis");
    if (!stored) {
      router.replace("/create/upload");
      return;
    }
    const result: StyleAnalysisResult = JSON.parse(stored);
    setAnalysis(result);
    setSelected(result.recommendedTemplate);
  }, [router]);

  const handleSelect = (templateId: GenerativeTemplateId) => {
    setSelected(templateId);
  };

  const handleNext = () => {
    if (!selected) return;
    sessionStorage.setItem("monopage_create_template", selected);
    router.push("/create/customize");
  };

  if (!analysis) return null;

  // 점수 기준 정렬 (AI 추천 순)
  const sortedTemplates = [...GENERATIVE_TEMPLATES].sort(
    (a, b) => (analysis.scores[b.id] || 0) - (analysis.scores[a.id] || 0)
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
        <Link
          href="/create/upload"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          돌아가기
        </Link>
        <span className="text-sm text-gray-400">2/4 단계</span>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <h1 className="text-2xl font-semibold mb-2">디자인을 선택하세요</h1>
        <p className="text-gray-500 mb-3">
          AI가 작품을 분석하여 가장 잘 어울리는 디자인을 추천했습니다.
        </p>

        {/* AI 분석 요약 */}
        {analysis.usedAI && (
          <div className="mb-8 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
              <Sparkles size={12} />
              스타일: {analysis.analysis.artStyle}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
              색감: {analysis.analysis.colorPalette}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
              분위기: {analysis.analysis.mood}
            </span>
          </div>
        )}

        {/* 템플릿 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedTemplates.map((template, i) => {
            const isRecommended =
              template.id === analysis.recommendedTemplate;
            const isSelected = template.id === selected;
            const score = analysis.scores[template.id] || 0;

            return (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className={`
                  relative text-left p-4 rounded-2xl border-2 transition-all
                  ${
                    isSelected
                      ? "border-black shadow-lg"
                      : "border-gray-100 hover:border-gray-300"
                  }
                `}
              >
                {/* AI 추천 뱃지 */}
                {isRecommended && (
                  <div className="absolute -top-3 left-4 inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                    <Star size={10} />
                    AI 추천
                  </div>
                )}

                {/* 선택 체크 */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center">
                    <Check size={14} />
                  </div>
                )}

                {/* 프리뷰 목업 */}
                <div className="mb-4 mt-2">
                  <TemplateMockup templateId={template.id} />
                </div>

                {/* 정보 */}
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  {template.description}
                </p>

                {/* 적합도 & 태그 */}
                <div className="flex flex-wrap gap-1">
                  {template.goodFor.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-50 text-[11px] text-gray-500 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 적합도 바 */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 w-8 text-right">
                    {score}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-400">
            {selected
              ? `${GENERATIVE_TEMPLATES.find((t) => t.id === selected)?.name} 선택됨`
              : "디자인을 선택해주세요"}
          </p>
          <button
            onClick={handleNext}
            disabled={!selected}
            className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            이 디자인으로 시작
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
