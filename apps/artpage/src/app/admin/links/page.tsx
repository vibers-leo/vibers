"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminSite } from "@/lib/admin-site-context";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ExternalLink, 
  Link as LinkIcon, 
  Save, 
  Loader2,
  Instagram,
  Youtube,
  Globe,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

type ProfileLink = {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
};

const iconOptions = [
  { value: "instagram", icon: Instagram },
  { value: "youtube", icon: Youtube },
  { value: "globe", icon: Globe },
  { value: "mail", icon: Mail },
  { value: "shop", icon: ShoppingBag },
  { value: "link", icon: LinkIcon },
];

export default function AdminLinksPage() {
  const { currentSite } = useAdminSite();
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "", icon: "link" });

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/links?slug=${currentSite}`);
      const data = await res.json();
      if (data.success) setLinks(data.data);
    } catch (e) {
      console.error("링크 로드 실패:", e);
    } finally {
      setLoading(false);
    }
  }, [currentSite]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;

    setSaving(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_slug: currentSite,
          ...newLink,
        }),
      });
      if (res.ok) {
        toast.success("링크가 추가되었습니다.");
        setNewLink({ title: "", url: "", icon: "link" });
        fetchLinks();
      }
    } catch (e) {
      toast.error("링크 추가 실패");
    } finally {
      setSaving(true); // fetching will reset it
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/links?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("링크가 삭제되었습니다.");
        fetchLinks();
      }
    } catch (e) {
      toast.error("링크 삭제 실패");
    }
  };

  const handleToggleActive = async (link: ProfileLink) => {
    try {
      const res = await fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: link.id, is_active: !link.is_active }),
      });
      if (res.ok) fetchLinks();
    } catch (e) {
      toast.error("업데이트 실패");
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="max-w-screen-md mx-auto py-12 px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold mb-2">링크 관리</h1>
        <p className="text-gray-500">당신의 페이지 최상단에 노출될 링크 버튼들을 관리하세요.</p>
      </div>

      {/* 새 링크 추가 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8 ring-1 ring-black/5">
        <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Plus size={16} /> 새 링크 추가
        </h2>
        <form onSubmit={handleAddLink} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="링크 제목 (예: 인스타그램, 포폴 사이트)"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black/5"
              required
            />
            <input
              type="url"
              placeholder="URL (https://...)"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black/5"
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex gap-2 overflow-x-auto pb-1">
              {iconOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setNewLink({ ...newLink, icon: opt.value })}
                  className={`p-2.5 rounded-lg border transition-all ${
                    newLink.icon === opt.value 
                      ? "bg-black text-white border-black" 
                      : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                  }`}
                >
                  <opt.icon size={18} />
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={saving || !newLink.title || !newLink.url}
              className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 disabled:opacity-50 shrink-0"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : "추가"}
            </button>
          </div>
        </form>
      </div>

      {/* 링크 목록 */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">등록된 링크가 없습니다.</p>
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className={`flex items-center gap-4 bg-white border p-4 rounded-2xl transition-all shadow-sm ring-1 ring-black/5 hover:shadow-md ${
                !link.is_active ? "opacity-50" : ""
              }`}
            >
              <div className="cursor-grab text-gray-300">
                <GripVertical size={20} />
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                {iconOptions.find(o => o.value === link.icon)?.icon ? (
                  (() => {
                    const IconComp = iconOptions.find(o => o.value === link.icon)!.icon;
                    return <IconComp size={18} className="text-gray-600" />;
                  })()
                ) : (
                  <LinkIcon size={18} className="text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{link.title}</h3>
                <p className="text-xs text-gray-400 truncate">{link.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(link)}
                  className={`p-2 rounded-lg transition-colors ${
                    link.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
                  }`}
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
