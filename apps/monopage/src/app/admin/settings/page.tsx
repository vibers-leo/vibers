"use client";

import { useEffect, useState } from "react";
import { useAdminSite } from "@/lib/admin-site-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { getSiteSettingsBySlug, upsertSiteSettings } from "@/actions/settingsActions";

export default function AdminSettingsPage() {
  const { currentSite, config } = useAdminSite();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    site_name: "",
    site_title: "",
    site_description: "",
    og_description: "",
    og_image_url: "",
    domain: "",
    address: "",
    phone: "",
    email: "",
    instagram_url: "",
    blog_url: "",
    youtube_url: "",
    bio: "",
    youtube_channel_id: "",
    show_instagram: true,
    show_youtube: true,
    show_support: true,
  });

  useEffect(() => {
    setLoading(true);
    getSiteSettingsBySlug(currentSite).then((settings) => {
      if (settings) {
        setFormData({
          site_name: settings.site_name || config.name,
          site_title: settings.site_title || config.meta.title,
          site_description: settings.site_description || "",
          og_description: settings.og_description || config.meta.description,
          og_image_url: settings.og_image_url || "",
          domain: settings.domain || config.meta.domain,
          address: settings.address || config.contact.address,
          phone: settings.phone || config.contact.phone,
          email: settings.email || config.contact.email,
          instagram_url: settings.instagram_url || config.social.instagram || "",
          blog_url: settings.blog_url || config.social.blog || "",
          youtube_url: settings.youtube_url || config.social.youtube || "",
          bio: settings.bio || "",
          youtube_channel_id: settings.youtube_channel_id || "",
          show_instagram: settings.show_instagram ?? true,
          show_youtube: settings.show_youtube ?? true,
          show_support: settings.show_support ?? true,
        });
      } else {
        // 기본값 설정 (config에서)
        setFormData({
          site_name: config.name,
          site_title: config.meta.title,
          site_description: "",
          og_description: config.meta.description,
          og_image_url: "",
          domain: config.meta.domain,
          address: config.contact.address,
          phone: config.contact.phone,
          email: config.contact.email,
          instagram_url: config.social.instagram || "",
          blog_url: config.social.blog || "",
          youtube_url: config.social.youtube || "",
          bio: "",
          youtube_channel_id: "",
          show_instagram: true,
          show_youtube: true,
          show_support: true,
        });
      }
      setLoading(false);
    });
  }, [currentSite, config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await upsertSiteSettings(currentSite, formData);
      if (result.success) {
        toast.success("설정이 저장되었습니다.");
      } else {
        toast.error(result.error || "저장 실패");
      }
    } catch (e: any) {
      toast.error(e.message || "저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">사이트 설정</h1>
          <p className="text-gray-500 mt-1">
            현재 사이트: <strong>{config.name}</strong> ({currentSite})
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white hover:bg-gray-800"
        >
          <Save size={16} className="mr-2" />
          {saving ? "저장 중..." : "설정 저장"}
        </Button>
      </div>

      <div className="space-y-8">
        {/* 기본 정보 */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사이트 이름</label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사이트 타이틀</label>
              <input
                type="text"
                value={formData.site_title}
                onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">도메인</label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>
        </section>

        {/* 바이오 및 모노페이지 설정 */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">프로필 및 기능 설정</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">한 줄 소개 (Bio)</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={2}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                placeholder="아티스트님을 한 줄로 표현해주세요."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Channel ID</label>
                <input
                  type="text"
                  value={formData.youtube_channel_id}
                  onChange={(e) => setFormData({ ...formData, youtube_channel_id: e.target.value })}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="UC..."
                />
                <p className="text-[11px] text-gray-400 mt-1">통합 피드에 표시될 유튜브 채널 ID입니다.</p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_instagram}
                  onChange={(e) => setFormData({ ...formData, show_instagram: e.target.checked })}
                  className="w-4 h-4 rounded text-black focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">인스타그램 피드 표시</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_youtube}
                  onChange={(e) => setFormData({ ...formData, show_youtube: e.target.checked })}
                  className="w-4 h-4 rounded text-black focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">유튜브 피드 표시</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_support}
                  onChange={(e) => setFormData({ ...formData, show_support: e.target.checked })}
                  className="w-4 h-4 rounded text-black focus:ring-black"
                />
                <span className="text-sm font-medium text-gray-700">후원 섹션 활성화</span>
              </label>
            </div>
          </div>
        </section>

        {/* SEO / OG */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">SEO / 소셜 공유</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OG 설명</label>
              <textarea
                value={formData.og_description}
                onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                rows={3}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OG 이미지 URL</label>
              <input
                type="text"
                value={formData.og_image_url}
                onChange={(e) => setFormData({ ...formData, og_image_url: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>
        </section>

        {/* 연락처 */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">연락처</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>
        </section>

        {/* SNS */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">SNS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blog URL</label>
              <input
                type="text"
                value={formData.blog_url}
                onChange={(e) => setFormData({ ...formData, blog_url: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
              <input
                type="text"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
