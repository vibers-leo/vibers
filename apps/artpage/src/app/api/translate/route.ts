// 번역 API — Groq 또는 Gemini를 활용한 번역
// POST: { text, targetLang, siteSlug }
// 결과는 DB에 캐싱

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

type TargetLang = "en" | "ja" | "zh" | "ko";

const langNames: Record<TargetLang, string> = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
  zh: "Chinese (Simplified)",
};

// Groq 번역 (llama 모델)
async function translateWithGroq(text: string, targetLang: TargetLang): Promise<string | null> {
  if (!GROQ_API_KEY) return null;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text to ${langNames[targetLang]}. Return ONLY the translated text, nothing else. Maintain the original formatting and tone.`,
          },
          { role: "user", content: text },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

// Gemini 번역 (fallback)
async function translateWithGemini(text: string, targetLang: TargetLang): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Translate the following text to ${langNames[targetLang]}. Return ONLY the translated text:\n\n${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, siteSlug } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: "text와 targetLang 필수" }, { status: 400 });
    }

    const validLangs: TargetLang[] = ["en", "ja", "zh", "ko"];
    if (!validLangs.includes(targetLang)) {
      return NextResponse.json({ error: "지원하지 않는 언어: " + targetLang }, { status: 400 });
    }

    // 원문이 목표 언어와 같으면 그대로 반환
    if (targetLang === "ko") {
      return NextResponse.json({ translated: text, cached: false });
    }

    const slug = siteSlug || "default";

    // DB 캐시 확인
    const cached = await prisma.translation.findUnique({
      where: {
        site_slug_source_text_target_lang: {
          site_slug: slug,
          source_text: text.substring(0, 500), // 긴 텍스트는 500자로 제한
          target_lang: targetLang,
        },
      },
    });

    if (cached) {
      return NextResponse.json({ translated: cached.translated, cached: true });
    }

    // AI 번역 실행 (Groq 우선, Gemini fallback)
    let translated = await translateWithGroq(text, targetLang);
    if (!translated) {
      translated = await translateWithGemini(text, targetLang);
    }

    if (!translated) {
      return NextResponse.json({ error: "번역 실패. API 키를 확인하세요." }, { status: 500 });
    }

    // DB에 캐싱
    await prisma.translation.upsert({
      where: {
        site_slug_source_text_target_lang: {
          site_slug: slug,
          source_text: text.substring(0, 500),
          target_lang: targetLang,
        },
      },
      update: { translated },
      create: {
        site_slug: slug,
        source_text: text.substring(0, 500),
        source_lang: "ko",
        target_lang: targetLang,
        translated,
      },
    });

    return NextResponse.json({ translated, cached: false });
  } catch (error) {
    console.error("Translate API error:", error);
    return NextResponse.json({ error: "번역 서버 오류" }, { status: 500 });
  }
}
