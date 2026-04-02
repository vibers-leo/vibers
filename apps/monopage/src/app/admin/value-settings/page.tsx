"use client";

import { useEffect, useState } from "react";
import { useAdminSite } from "@/lib/admin-site-context";
import ValueSlider from "@/components/ValueSlider";
import { Heart } from "lucide-react";

export default function AdminValueSettingsPage() {
  const { currentSite, config } = useAdminSite();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<{
    revenue_share_ratio: number;
    subscription_fee: number;
  } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`/api/settings/value?slug=${currentSite}`);
        const data = await res.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (e) {
        console.error("가치 설정 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [currentSite]);

  if (loading) {
    return <div className="p-10 text-center text-gray-400">로딩 중...</div>;
  }

  return (
    <div className="max-w-screen-md mx-auto py-12 px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold mb-2">가치 설정</h1>
        <p className="text-gray-500 leading-relaxed" style={{ wordBreak: "keep-all" }}>
          플랫폼 수수료와 월 구독료를 직접 결정합니다. 이 설정은 당신의 페이지에서 투명하게 공개되며,
          모인 수익금은 monopage 커뮤니티의 아티스트들을 지원하는 데 사용됩니다.
        </p>
      </div>

      <div className="space-y-8">
        <ValueSlider
          siteSlug={currentSite}
          initialRatio={settings?.revenue_share_ratio}
          initialFee={settings?.subscription_fee}
          onSave={(ratio, fee) => {
            setSettings({ revenue_share_ratio: ratio, subscription_fee: fee });
          }}
        />

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Heart size={16} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-emerald-900">가치 순환의 원리</h3>
          </div>
          <div className="space-y-3 text-sm text-emerald-800/80 leading-relaxed" style={{ wordBreak: "keep-all" }}>
            <p>
              1. 아티스트가 설정한 <strong>플랫폼 쉐어 비율</strong>만큼의 금액이 서비스 운영 및 커뮤니티 펀드로 적립됩니다.
            </p>
            <p>
              2. 적립된 펀드는 매월 다른 아티스트의 작품을 구매하거나, 로컬 크리에이터의 활동을 후원하는 데 투명하게 사용됩니다.
            </p>
            <p>
              3. 당신의 선택이 창작 생태계의 선순환을 만듭니다. 고맙습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
