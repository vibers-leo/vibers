import { NextRequest, NextResponse } from "next/server";
import type { GenerativeTemplateId } from "@/lib/templates";

// AI 분석 결과 타입
export type StyleAnalysisResult = {
  // 추천 템플릿
  recommendedTemplate: GenerativeTemplateId;
  // 전체 템플릿별 적합도 점수 (0~100)
  scores: Record<GenerativeTemplateId, number>;
  // 분석 결과
  analysis: {
    artStyle: string; // 현대미술, 전통미술, 추상, 사실주의 등
    colorPalette: string; // 따뜻한, 차가운, 모노크롬, 비비드 등
    mood: string; // 차분한, 에너지틱, 극적인, 미니멀 등
  };
  // AI 사용 여부
  usedAI: boolean;
};

// Gemini Vision API로 이미지 분석
async function analyzeWithGemini(
  imageUrls: string[]
): Promise<StyleAnalysisResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    // 최대 5장까지만 분석 (비용 절약)
    const urls = imageUrls.slice(0, 5);

    const prompt = `You are an art curator AI. Analyze the following artwork images and determine:

1. Art style: One of [contemporary, traditional, abstract, realistic, digital, photography, illustration, mixed-media]
2. Color palette: One of [warm, cool, monochrome, vibrant, pastel, dark, earth-tone]
3. Mood: One of [calm, energetic, dramatic, minimal, elegant, playful, contemplative]

Based on your analysis, recommend one of these website templates:
- "modern-art": Clean white background, large image grid, sans-serif. Best for contemporary, digital, abstract art.
- "classic-gallery": Dark background, elegant serif fonts, single-image focus. Best for traditional, oil painting, sculpture.
- "minimal-portfolio": Ultra-minimal, masonry grid, no decoration. Best for photography, illustration, graphic design.

Also score each template from 0-100 for suitability.

Respond in JSON only:
{
  "artStyle": "...",
  "colorPalette": "...",
  "mood": "...",
  "recommendedTemplate": "modern-art" | "classic-gallery" | "minimal-portfolio",
  "scores": { "modern-art": N, "classic-gallery": N, "minimal-portfolio": N }
}`;

    const parts: any[] = [{ text: prompt }];

    // URL 이미지 참조 추가
    for (const url of urls) {
      parts.push({
        text: `\n\nImage URL: ${url}\n(Please analyze this artwork image)`,
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API 응답 오류:", response.status);
      return null;
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // JSON 파싱
    const parsed = JSON.parse(text);

    return {
      recommendedTemplate: parsed.recommendedTemplate as GenerativeTemplateId,
      scores: parsed.scores,
      analysis: {
        artStyle: parsed.artStyle,
        colorPalette: parsed.colorPalette,
        mood: parsed.mood,
      },
      usedAI: true,
    };
  } catch (error) {
    console.error("Gemini 분석 실패:", error);
    return null;
  }
}

// 휴리스틱 폴백 — AI 키가 없거나 실패 시
function heuristicAnalysis(imageCount: number): StyleAnalysisResult {
  // 이미지 수에 따라 추천 (단순 휴리스틱)
  const templates: GenerativeTemplateId[] = [
    "modern-art",
    "classic-gallery",
    "minimal-portfolio",
  ];

  // 이미지가 많으면 → minimal-portfolio (메이슨리 그리드가 유리)
  // 이미지가 적으면 → classic-gallery (단일 포커스가 유리)
  // 중간이면 → modern-art
  let recommended: GenerativeTemplateId;
  let scores: Record<GenerativeTemplateId, number>;

  if (imageCount >= 15) {
    recommended = "minimal-portfolio";
    scores = { "modern-art": 60, "classic-gallery": 40, "minimal-portfolio": 85 };
  } else if (imageCount <= 6) {
    recommended = "classic-gallery";
    scores = { "modern-art": 55, "classic-gallery": 80, "minimal-portfolio": 45 };
  } else {
    recommended = "modern-art";
    scores = { "modern-art": 80, "classic-gallery": 55, "minimal-portfolio": 65 };
  }

  return {
    recommendedTemplate: recommended,
    scores,
    analysis: {
      artStyle: "분석 대기",
      colorPalette: "분석 대기",
      mood: "분석 대기",
    },
    usedAI: false,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrls } = body as { imageUrls: string[] };

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json(
        { error: "이미지 URL이 필요합니다." },
        { status: 400 }
      );
    }

    // 1차: Gemini API 시도
    const aiResult = await analyzeWithGemini(imageUrls);
    if (aiResult) {
      return NextResponse.json(aiResult);
    }

    // 2차: 휴리스틱 폴백
    const fallback = heuristicAnalysis(imageUrls.length);
    return NextResponse.json(fallback);
  } catch (error) {
    console.error("스타일 분석 API 오류:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
