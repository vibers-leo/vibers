// src/app/admin/artworks/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Upload, Eye, EyeOff } from "lucide-react";
import { useAdminSite } from "@/lib/admin-site-context";
import {
  getArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getTransactions,
} from "@/actions/artworkActions";

type Artwork = {
  id: string;
  site_slug: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string;
  is_sold: boolean;
  is_active: boolean;
  buyer_email: string | null;
  created_at: Date;
};

type Transaction = {
  id: string;
  artwork_id: string;
  buyer_email: string;
  buyer_name: string | null;
  amount: number;
  commission: number;
  artist_payout: number;
  status: string;
  paid_at: Date | null;
  created_at: Date;
};

export default function AdminArtworksPage() {
  const { currentSite } = useAdminSite();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"artworks" | "sales">("artworks");

  // 폼 상태
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image_url: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [artworksData, txData] = await Promise.all([
      getArtworks(currentSite),
      getTransactions(currentSite),
    ]);
    setArtworks(artworksData as Artwork[]);
    setTransactions(txData as Transaction[]);
    setLoading(false);
  }, [currentSite]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setForm({ title: "", description: "", price: "", image_url: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (artwork: Artwork) => {
    setForm({
      title: artwork.title,
      description: artwork.description || "",
      price: artwork.price.toString(),
      image_url: artwork.image_url,
    });
    setEditingId(artwork.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "artworks");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.url) {
        setForm((prev) => ({ ...prev, image_url: data.url }));
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(form.price);
    if (!form.title || !form.image_url || isNaN(price)) return;

    if (editingId) {
      await updateArtwork(editingId, currentSite, {
        title: form.title,
        description: form.description || undefined,
        price,
        image_url: form.image_url,
      });
    } else {
      await createArtwork(currentSite, {
        title: form.title,
        description: form.description || undefined,
        price,
        image_url: form.image_url,
      });
    }

    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await deleteArtwork(id, currentSite);
    fetchData();
  };

  const handleToggleActive = async (artwork: Artwork) => {
    await updateArtwork(artwork.id, currentSite, {
      is_active: !artwork.is_active,
    });
    fetchData();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">작품 판매 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentSite} — 등록 {artworks.length}건
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
        >
          <Plus size={16} />
          작품 등록
        </button>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("artworks")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "artworks"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          작품 목록
        </button>
        <button
          onClick={() => setTab("sales")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "sales"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          판매 내역 ({transactions.filter((t) => t.status === "paid").length})
        </button>
      </div>

      {/* 작품 등록/수정 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">
                {editingId ? "작품 수정" : "작품 등록"}
              </h2>
              <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  작품 이미지 *
                </label>
                {form.image_url ? (
                  <div className="relative aspect-square w-full max-w-[300px] rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={form.image_url}
                      alt="미리보기"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, image_url: "" }))}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition-colors">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      {uploading ? "업로드 중..." : "클릭하여 이미지 선택"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  작품명 *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black outline-none text-sm"
                  placeholder="작품 제목을 입력하세요"
                  required
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black outline-none text-sm resize-none"
                  rows={3}
                  placeholder="작품에 대한 설명 (선택)"
                />
              </div>

              {/* 가격 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  가격 (원) *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black outline-none text-sm"
                  placeholder="100000"
                  min="1000"
                  required
                />
                {form.price && (
                  <p className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>* 설정하신 쉐어 비율에 따라 정산됩니다.</span>
                    <Link href="/admin/value-settings" className="text-emerald-600 hover:underline">
                      가치 설정 확인 &rarr;
                    </Link>
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!form.title || !form.image_url || !form.price}
                  className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
                >
                  {editingId ? "수정" : "등록"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 작품 목록 탭 */}
      {tab === "artworks" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-400">
              <p className="text-lg mb-2">등록된 작품이 없습니다</p>
              <p className="text-sm">작품을 등록하여 판매를 시작하세요</p>
            </div>
          ) : (
            artworks.map((artwork) => (
              <div
                key={artwork.id}
                className={`group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all ${
                  !artwork.is_active ? "opacity-60" : ""
                }`}
              >
                {/* 이미지 */}
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={artwork.image_url}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                  {/* 상태 뱃지 */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {artwork.is_sold ? (
                      <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        판매완료
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        판매중
                      </span>
                    )}
                    {!artwork.is_active && (
                      <span className="px-2.5 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">
                        비공개
                      </span>
                    )}
                  </div>
                  {/* 액션 버튼 */}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleActive(artwork)}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm"
                      title={artwork.is_active ? "비공개로 전환" : "공개로 전환"}
                    >
                      {artwork.is_active ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(artwork)}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {/* 정보 */}
                <div className="p-4">
                  <h3 className="font-medium text-sm truncate">{artwork.title}</h3>
                  {artwork.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {artwork.description}
                    </p>
                  )}
                  <p className="text-base font-bold mt-2">
                    {formatPrice(artwork.price)}
                    <span className="text-xs font-normal text-gray-500 ml-1">원</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 판매 내역 탭 */}
      {tab === "sales" && (
        <div className="bg-white border rounded-xl overflow-hidden">
          {transactions.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">판매 내역이 없습니다</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-6 py-3">구매자</th>
                  <th className="text-left px-6 py-3">작품</th>
                  <th className="text-right px-6 py-3">금액</th>
                  <th className="text-right px-6 py-3">수수료</th>
                  <th className="text-right px-6 py-3">정산금</th>
                  <th className="text-center px-6 py-3">상태</th>
                  <th className="text-left px-6 py-3">일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{tx.buyer_name || "-"}</p>
                        <p className="text-xs text-gray-500">{tx.buyer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {artworks.find((a) => a.id === tx.artwork_id)?.title || tx.artwork_id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatPrice(tx.amount)}원
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {formatPrice(tx.commission)}원
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      {formatPrice(tx.artist_payout)}원
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                          tx.status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : tx.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.status === "paid"
                          ? "결제완료"
                          : tx.status === "pending"
                            ? "대기중"
                            : "실패"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(tx.created_at).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
