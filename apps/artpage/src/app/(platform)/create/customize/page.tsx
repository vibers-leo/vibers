"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createArtistSite } from "@/actions/siteActions";

export default function CustomizePage() {
  const router = useRouter();
  const [template, setTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [artistName, setArtistName] = useState("");
  const [bio, setBio] = useState("");
  const [slug, setSlug] = useState("");
  const [instagram, setInstagram] = useState("");
  const [blog, setBlog] = useState("");
  const [youtube, setYoutube] = useState("");

  // 쿠키 읽기 헬퍼
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || "");
    return null;
  };

  // 데이터 로드 (세션 및 인스타그램 쿠키)
  useEffect(() => {
    let t = sessionStorage.getItem("monopage_create_template");
    
    // 온보딩 모드인 경우 기본 템플릿 설정
    if (!t) {
      t = "monopage";
      sessionStorage.setItem("monopage_create_template", t);
    }
    setTemplate(t);

    // 인스타그램 쿠키 데이터 확인
    const igName = getCookie("monopage_onboarding_name");
    const igImagesRaw = getCookie("monopage_instagram_images");

    if (igName) {
      setArtistName(igName);
      setInstagram(`https://instagram.com/${igName}`);
    }
    if (igImagesRaw) {
      try {
        const urls = JSON.parse(igImagesRaw);
        sessionStorage.setItem("monopage_create_images", JSON.stringify(urls));
      } catch (e) {
        console.error("IG Images parse error", e);
      }
    }
  }, [router]);

  // 이름에서 자동 slug 생성
  useEffect(() => {
    if (!artistName) {
      setSlug("");
      return;
    }
    const auto = artistName
      .toLowerCase()
      .replace(/[가-힣]/g, (ch) => {
        // 한글 → 로마자 간이 변환 (slug용)
        return encodeURIComponent(ch).replace(/%/g, "").toLowerCase();
      })
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 30);
    setSlug(auto || "my-art");
  }, [artistName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;

    setLoading(true);
    setError(null);

    try {
      // 세션에서 이미지 URL 가져오기
      const imagesRaw = sessionStorage.getItem("monopage_create_images");
      const imageUrls: string[] = imagesRaw ? JSON.parse(imagesRaw) : [];

      const result = await createArtistSite({
        slug,
        name: artistName,
        bio,
        template,
        imageUrls,
        social: {
          instagram: instagram || undefined,
          blog: blog || undefined,
          youtube: youtube || undefined,
        },
      });

      if (result.success) {
        // 완료 정보 세션에 저장
        sessionStorage.setItem(
          "monopage_create_result",
          JSON.stringify({
            slug: result.slug,
            name: artistName,
            url: result.url,
          })
        );

        // 세션 정리
        sessionStorage.removeItem("monopage_create_images");
        sessionStorage.removeItem("monopage_create_analysis");
        sessionStorage.removeItem("monopage_create_template");

        router.push("/create/complete");
      } else {
        setError(result.error || "사이트 생성에 실패했습니다.");
      }
    } catch {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (!template) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-12">
        <h1 className="text-2xl font-semibold mb-2">사이트 정보 입력</h1>
        <p className="text-gray-500 mb-8">
          기본 정보만 입력하면 바로 홈페이지가 생성됩니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 작가명 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              작가명 / 갤러리명 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="예: 김아트, Studio Minimal"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* 소개 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              짧은 소개
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="한 줄로 자신을 소개해주세요"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          {/* 사이트 주소 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              사이트 주소 <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-black transition-colors">
                <span className="px-4 py-3 bg-gray-50 text-gray-400 text-sm border-r border-gray-200 whitespace-nowrap">
                  monopage.kr/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-")
                        .slice(0, 30)
                    )
                  }
                  placeholder="my-gallery"
                  required
                  className="flex-1 px-4 py-3 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-gray-400">
                  {slug ? `${slug}.monopage.kr` : "슬러그.monopage.kr"} (자동 등록)
                </p>
                <p className="text-[10px] text-gray-300 font-light uppercase tracking-widest">
                  Anytime accessible
                </p>
              </div>
            </div>
          </div>

          {/* SNS 링크 */}
          <div>
            <label className="block text-sm font-medium mb-3">
              SNS 링크 <span className="text-xs text-gray-400">(선택)</span>
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-20">Instagram</span>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-20">Blog</span>
                <input
                  type="url"
                  value={blog}
                  onChange={(e) => setBlog(e.target.value)}
                  placeholder="https://blog.naver.com/..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-20">YouTube</span>
                <input
                  type="url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                />
              </div>
            </div>
          </div>

          {/* 에러 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 제출 */}
          <button
            type="submit"
            disabled={loading || !artistName.trim() || !slug.trim()}
            className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                홈페이지 생성 중...
              </>
            ) : (
              "홈페이지 생성"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
