"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminSite } from "@/lib/admin-site-context";
import { Heart, MessageCircle, Calendar, User, ArrowUpRight } from "lucide-react";

type Support = {
  id: string;
  supporter_name: string | null;
  supporter_email: string | null;
  amount: number;
  platform_fee: number;
  platform_share: number;
  artist_amount: number;
  message: string | null;
  status: string;
  paid_at: string | null;
  created_at: string;
};

export default function AdminSupportPage() {
  const { currentSite } = useAdminSite();
  const [supports, setSupports] = useState<Support[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalArtistAmount: 0,
    count: 0,
  });

  const fetchSupports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/support/checkout?slug=${currentSite}`);
      const data = await res.json();
      if (data.success) {
        setSupports(data.data);
        
        // 통계 계산
        const total = data.data.reduce((acc: number, s: Support) => acc + s.amount, 0);
        const artistTotal = data.data.reduce((acc: number, s: Support) => acc + s.artist_amount, 0);
        setStats({
          totalAmount: total,
          totalArtistAmount: artistTotal,
          count: data.data.length,
        });
      }
    } catch (e) {
      console.error("후원 내역 로드 실패:", e);
    } finally {
      setLoading(false);
    }
  }, [currentSite]);

  useEffect(() => {
    fetchSupports();
  }, [fetchSupports]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded-xl" />
            <div className="h-32 bg-gray-200 rounded-xl" />
            <div className="h-32 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold mb-2 text-gray-900">후원 내역</h1>
        <p className="text-gray-500">당신의 페이지를 통해 전달된 응원의 마음들입니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Heart size={16} className="text-emerald-600" />
            </div>
            <span className="text-xs text-gray-400 font-medium">누적 후원금</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
            {formatPrice(stats.totalAmount)}원
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ArrowUpRight size={16} className="text-emerald-600" />
            </div>
            <span className="text-xs text-gray-400 font-medium">정산 예정액</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
            {formatPrice(stats.totalArtistAmount)}원
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <MessageCircle size={16} className="text-gray-400" />
            </div>
            <span className="text-xs text-gray-400 font-medium">전체 메시지</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
            {stats.count}건
          </p>
        </div>
      </div>

      {/* 후원 목록 */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm">
        {supports.length === 0 ? (
          <div className="text-center py-32 text-gray-400">
            <Heart size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-1">아직 후원 내역이 없습니다</p>
            <p className="text-sm">매니페스토를 공유하여 응원을 이끌어내보세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">후원자 정보</th>
                  <th className="px-6 py-4">메시지</th>
                  <th className="px-6 py-4 text-right">금액</th>
                  <th className="px-6 py-4 text-right">정산액</th>
                  <th className="px-6 py-4 text-center">상태</th>
                  <th className="px-6 py-4">일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {supports.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <User size={14} className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{s.supporter_name || "익명의 팬"}</p>
                          <p className="text-[10px] text-gray-400">{s.supporter_email || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 max-w-xs">
                      {s.message ? (
                        <p className="text-gray-600 leading-relaxed italic line-clamp-2" style={{ wordBreak: "keep-all" }}>
                          &ldquo;{s.message}&rdquo;
                        </p>
                      ) : (
                        <span className="text-gray-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-6 text-right font-medium text-gray-900 tabular-nums">
                      {formatPrice(s.amount)}원
                    </td>
                    <td className="px-6 py-6 text-right font-bold text-emerald-600 tabular-nums">
                      {formatPrice(s.artist_amount)}원
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                        ${s.status === "completed" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-gray-100 text-gray-400"}`}>
                        {s.status === "completed" ? "Completed" : s.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-gray-400 text-[11px] tabular-nums">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(s.created_at).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
