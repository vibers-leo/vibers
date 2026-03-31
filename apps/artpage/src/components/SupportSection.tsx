"use client";

// src/components/SupportSection.tsx
// 후원 섹션 — 감상료 + 방명록
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Sparkles } from "lucide-react";

interface SupportMessage {
  id: string;
  supporter_name: string | null;
  message: string | null;
  amount: number;
  created_at: string;
}

interface SupportSectionProps {
  slug: string;
  artistName?: string;
}

// 후원금 프리셋
const AMOUNT_PRESETS = [
  { label: "☕ 커피 한 잔", value: 3000 },
  { label: "🍚 따뜻한 밥", value: 5000 },
  { label: "🎨 창작 응원", value: 10000 },
  { label: "💫 든든한 후원", value: 30000 },
];

export default function SupportSection({ slug, artistName }: SupportSectionProps) {
  const [amount, setAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // 방명록 로드
  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch(`/api/support/checkout?slug=${slug}`);
        const data = await res.json();
        if (data.success) setMessages(data.data);
      } catch (e) {
        console.warn("방명록 로드 실패:", e);
      }
    }
    loadMessages();
  }, [slug]);

  const handleSupport = async () => {
    const finalAmount = customAmount ? Number(customAmount) : amount;
    if (finalAmount <= 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/support/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_slug: slug,
          amount: finalAmount,
          supporter_name: name || "익명의 팬",
          message: message || null,
          is_public: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // TODO: 토스 결제 페이지로 이동
        // window.location.href = data.data.payment_url;
        alert(`후원이 접수되었습니다! (${finalAmount.toLocaleString()}원)`);
        setShowForm(false);
        setMessage("");
        setName("");
      }
    } catch (e) {
      console.error("후원 처리 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 30) return `${Math.floor(days / 30)}달 전`;
    if (days > 0) return `${days}일 전`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}시간 전`;
    return "방금 전";
  };

  return (
    <section className="py-8 border-t border-gray-100">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full text-xs text-emerald-600 mb-4">
          <Sparkles size={12} />
          이 페이지가 영감이 되었다면
        </div>
        <h2
          className="text-xl md:text-2xl font-bold text-gray-900 mb-2"
          style={{ wordBreak: "keep-all" }}
        >
          {artistName
            ? `${artistName}의 다음 창작을 응원해 주세요`
            : "아티스트의 다음 창작을 응원해 주세요"}
        </h2>
        <p className="text-sm text-gray-400" style={{ wordBreak: "keep-all" }}>
          후원금의 일부는 monopage 커뮤니티의 다른 아티스트를 응원하는 데 사용됩니다
        </p>
      </div>

      {/* 후원 폼 토글 */}
      {!showForm ? (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full
              font-semibold text-sm hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-black/10"
          >
            <Heart size={16} className="group-hover:text-red-400 transition-colors" />
            응원하기
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-2xl p-6 shadow-lg shadow-black/5">
          {/* 금액 프리셋 */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {AMOUNT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  setAmount(preset.value);
                  setCustomAmount("");
                }}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all
                  ${amount === preset.value && !customAmount
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 border"
                    : "bg-gray-50 border border-gray-100 text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <span className="block text-base mb-0.5">{preset.label}</span>
                <span className="text-xs text-gray-400">{preset.value.toLocaleString()}원</span>
              </button>
            ))}
          </div>

          {/* 직접 입력 */}
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="또는 직접 입력 (원)"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 mb-3"
          />

          {/* 이름 */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 (선택)"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 mb-3"
          />

          {/* 메시지 */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="응원 메시지를 남겨주세요 (선택)"
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none
              focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 mb-4"
          />

          {/* 제출 */}
          <button
            onClick={handleSupport}
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm
              hover:bg-emerald-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            {loading
              ? "처리 중..."
              : `${(customAmount ? Number(customAmount) : amount).toLocaleString()}원 응원하기`}
          </button>

          <button
            onClick={() => setShowForm(false)}
            className="w-full mt-2 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            취소
          </button>
        </div>
      )}

      {/* 방명록 */}
      {messages.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium text-gray-500">
              응원의 메시지 ({messages.length})
            </h3>
          </div>

          <div className="space-y-3">
            {messages.slice(0, 10).map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-xl"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Heart size={14} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {msg.supporter_name || "익명"}
                    </span>
                    <span className="text-[10px] text-gray-300">
                      {timeAgo(msg.created_at)}
                    </span>
                  </div>
                  {msg.message && (
                    <p className="text-sm text-gray-500 leading-relaxed">{msg.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
