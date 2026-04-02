"use client";

// src/components/ValueSlider.tsx
// 자율 수수료/구독료 설정 카드 — The Value Setting
import { useState, useCallback, useEffect } from "react";
import { Percent, Heart, Info } from "lucide-react";

interface ValueSliderProps {
  siteSlug: string;
  initialRatio?: number;
  initialFee?: number;
  onSave?: (ratio: number, fee: number) => void;
}

export default function ValueSlider({
  siteSlug,
  initialRatio = 10,
  initialFee = 0,
  onSave,
}: ValueSliderProps) {
  const [ratio, setRatio] = useState(initialRatio);
  const [fee, setFee] = useState(initialFee);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 예시 계산 (10,000원 판매 기준)
  const exampleAmount = 10000;
  const pgFee = Math.floor(exampleAmount * 0.033);
  const net = exampleAmount - pgFee;
  const platformShare = Math.floor(net * (ratio / 100));
  const artistAmount = net - platformShare;

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/value", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_slug: siteSlug,
          subscription_fee: fee,
          revenue_share_ratio: ratio,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        onSave?.(ratio, fee);
      }
    } catch (e) {
      console.error("가치 설정 저장 실패:", e);
    } finally {
      setSaving(false);
    }
  }, [siteSlug, ratio, fee, onSave]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Heart size={20} className="text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">가치 설정</h3>
          <p className="text-xs text-gray-400">The Value Setting</p>
        </div>
      </div>

      {/* 수수료 비율 슬라이더 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Percent size={14} />
            플랫폼 쉐어 비율
          </label>
          <span className="text-2xl font-bold text-emerald-600 tabular-nums">
            {ratio}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={ratio}
          onChange={(e) => setRatio(Number(e.target.value))}
          className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <div className="flex justify-between text-[10px] text-gray-300 mt-1 px-0.5">
          <span>0% 전액 아티스트</span>
          <span>100% 전액 플랫폼</span>
        </div>
      </div>

      {/* 예상 분배 미리보기 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-400 mb-3 font-medium">
          {exampleAmount.toLocaleString()}원 판매 시 예상 분배
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">PG 수수료 (3.3%)</span>
            <span className="text-gray-400 tabular-nums">-{pgFee.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">플랫폼 몫 ({ratio}%)</span>
            <span className="text-gray-600 tabular-nums">{platformShare.toLocaleString()}원</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-semibold">
            <span className="text-emerald-700">아티스트 수익</span>
            <span className="text-emerald-600 tabular-nums">{artistAmount.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="flex items-start gap-2 mb-6 p-3 bg-emerald-50/50 rounded-lg">
        <Info size={14} className="text-emerald-500 mt-0.5 shrink-0" />
        <p className="text-xs text-emerald-700 leading-relaxed" style={{ wordBreak: "keep-all" }}>
          이 비율은 monopage 커뮤니티의 지속과 다른 아티스트를 응원하는 데 사용됩니다.
          모든 수익금의 흐름은 투명하게 공개됩니다.
        </p>
      </div>

      {/* 월 구독료 (옵션) */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          월 자율 구독료 (선택)
        </label>
        <div className="relative">
          <input
            type="number"
            min={0}
            step={1000}
            value={fee}
            onChange={(e) => setFee(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-right text-lg font-medium
              text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 tabular-nums"
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">원/월</span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5">
          {fee === 0 ? "무료로 사용 중 — 언제든 변경 가능합니다" : `월 ${fee.toLocaleString()}원으로 monopage를 응원합니다`}
        </p>
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300
          ${saved
            ? "bg-emerald-100 text-emerald-700"
            : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]"
          }
          disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {saving ? "저장 중..." : saved ? "✓ 저장되었습니다" : "설정 저장"}
      </button>
    </div>
  );
}
