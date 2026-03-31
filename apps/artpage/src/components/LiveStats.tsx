"use client";

// src/components/LiveStats.tsx
// 실시간 실험 통계 — The Living Statistics
import { useEffect, useState, useRef } from "react";
import { Users, Percent, Heart, TrendingUp } from "lucide-react";

interface GlobalStats {
  total_artists: number;
  avg_share_ratio: number;
  avg_subscription_fee: number;
  total_support_amount: number;
  total_artist_payout: number;
  total_circulation: number;
}

interface LiveStatsProps {
  className?: string;
  variant?: "compact" | "full";
}

// 간단한 카운트업 훅
function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (target === prevTarget.current) return;
    prevTarget.current = target;

    const start = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(start + (target - start) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  description?: string;
}) {
  const animatedValue = useCountUp(value);

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 ring-1 ring-black/5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Icon size={16} className="text-emerald-600" />
        </div>
        <span className="text-xs text-gray-400 font-medium">{label}</span>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
        {suffix === "원"
          ? `${animatedValue.toLocaleString()}${suffix}`
          : suffix === "%"
          ? `${animatedValue}${suffix}`
          : suffix === "명"
          ? `${animatedValue.toLocaleString()}${suffix}`
          : animatedValue.toLocaleString()}
      </p>
      {description && (
        <p className="text-[11px] text-gray-400 mt-1.5" style={{ wordBreak: "keep-all" }}>
          {description}
        </p>
      )}
    </div>
  );
}

export default function LiveStats({ className = "", variant = "full" }: LiveStatsProps) {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats/global");
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch (e) {
        console.warn("통계 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap gap-6 ${className}`}>
        <div>
          <p className="text-2xl font-bold tracking-tight text-gray-900 tabular-nums">
            {stats.total_artists.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">참여 아티스트</p>
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight text-emerald-600 tabular-nums">
            {stats.avg_share_ratio}%
          </p>
          <p className="text-xs text-gray-400 mt-0.5">평균 쉐어 비율</p>
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight text-gray-900 tabular-nums">
            {stats.total_circulation.toLocaleString()}원
          </p>
          <p className="text-xs text-gray-400 mt-0.5">누적 순환</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <StatCard
        icon={Users}
        label="참여 아티스트"
        value={stats.total_artists}
        suffix="명"
        description="이 실험에 동참하고 있습니다"
      />
      <StatCard
        icon={Percent}
        label="평균 쉐어 비율"
        value={stats.avg_share_ratio}
        suffix="%"
        description="아티스트들이 정의한 가치"
      />
      <StatCard
        icon={Heart}
        label="누적 후원금"
        value={stats.total_support_amount}
        suffix="원"
        description="모인 응원의 마음"
      />
      <StatCard
        icon={TrendingUp}
        label="아티스트 정산"
        value={stats.total_artist_payout}
        suffix="원"
        description="아티스트에게 돌아간 가치"
      />
    </div>
  );
}
