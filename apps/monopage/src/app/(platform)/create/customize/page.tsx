"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Trash2, Globe, Instagram, Youtube, ShoppingBag, Music, Twitter, Github, Linkedin } from "lucide-react";
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
  const [showSupport, setShowSupport] = useState(true);
  const [showInstagram, setShowInstagram] = useState(true);
  const [customLinks, setCustomLinks] = useState<{ id: string; title: string; url: string; icon: string }[]>([]);

  // 아이콘 자동 추측 헬퍼
  const guessIcon = (url: string) => {
    const u = url.toLowerCase();
    if (u.includes("shop") || u.includes("store")) return "shop";
    if (u.includes("music") || u.includes("spotify") || u.includes("soundcloud")) return "music";
    if (u.includes("github")) return "github";
    if (u.includes("linkedin")) return "linkedin";
    return "globe";
  };

  const addLink = () => {
    setCustomLinks([...customLinks, { id: Math.random().toString(36).substr(2, 9), title: "", url: "", icon: "globe" }]);
  };

  const updateLink = (id: string, field: "title" | "url", value: string) => {
    setCustomLinks(customLinks.map(l => {
      if (l.id === id) {
        const newLink = { ...l, [field]: value };
        if (field === "url") newLink.icon = guessIcon(value);
        return newLink;
      }
      return l;
    }));
  };

  const removeLink = (id: string) => {
    setCustomLinks(customLinks.filter(l => l.id !== id));
  };

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
      setShowInstagram(true);
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
        show_support: showSupport,
        show_instagram: showInstagram,
        customLinks: customLinks.map(l => ({ title: l.title, url: l.url, icon: l.icon })),
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

          {/* 링크트리 스타일 멀티 링크 */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest">Profile Links</label>
                <p className="text-xs text-gray-400 mt-1">자신의 링크를 추가하고 꾸며보세요 (Linktree 스타일)</p>
              </div>
              <button
                type="button"
                onClick={addLink}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors"
              >
                + 링크 추가
              </button>
            </div>

            <div className="space-y-4">
              {customLinks.map((link) => (
                <div key={link.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3 relative group">
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="grid gap-3 pr-8">
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateLink(link.id, "title", e.target.value)}
                      placeholder="링크 제목 (예: 포트폴리오 보기, 스마트스토어)"
                      className="w-full bg-transparent border-none p-0 text-sm font-bold placeholder:text-gray-300 focus:ring-0"
                    />
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-md bg-white border border-gray-100 flex items-center justify-center">
                          <Globe size={12} className="text-gray-400" />
                       </div>
                       <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, "url", e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-transparent border-none p-0 text-xs text-gray-400 placeholder:text-gray-200 focus:ring-0"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {customLinks.length === 0 && (
                <div className="py-12 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-200">
                    <Plus size={24} />
                  </div>
                  <p className="text-xs text-gray-300 font-medium whitespace-pre-line">
                    아직 등록된 링크가 없습니다.{"\n"}[링크 추가] 버튼을 눌러 시작하세요!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 에러 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 페이지 옵션 */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Page Options</label>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer">
                <span className="text-sm font-bold text-gray-700">후원 기능 (Support) 활성화</span>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                  checked={showSupport}
                  onChange={(e) => setShowSupport(e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-all cursor-pointer">
                <span className="text-sm font-bold text-gray-700">인스타그램 피드 연동</span>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                  checked={showInstagram}
                  onChange={(e) => setShowInstagram(e.target.checked)}
                />
              </label>
            </div>
          </div>

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
