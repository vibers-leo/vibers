// src/app/(platform)/archive/page.tsx
// 실험 아카이브 — The Living Archive
import { prisma } from "@/lib/db";
import LiveStats from "@/components/LiveStats";
import { ArrowLeft, BookOpen, Clock, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

// 서버 컴포넌트 — 실험 로그 조회
async function getExperimentLogs() {
  try {
    const logs = await prisma.experimentLog.findMany({
      orderBy: { created_at: "desc" },
      take: 50,
    });
    return logs;
  } catch {
    return [];
  }
}

const typeIcons: Record<string, React.ElementType> = {
  milestone: Sparkles,
  support_chain: Heart,
  artwork_donation: BookOpen,
  stat_snapshot: Clock,
};

const typeLabels: Record<string, string> = {
  milestone: "마일스톤",
  support_chain: "순환 기록",
  artwork_donation: "작품 기증",
  stat_snapshot: "통계 스냅샷",
};

export default async function ArchivePage() {
  const logs = await getExperimentLogs();

  return (
    <div
      className="bg-white text-gray-900 min-h-screen"
      style={{ fontFamily: "'Pretendard', system-ui, sans-serif" }}
    >
      {/* 헤더 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          돌아가기
        </Link>

        <p className="text-xs font-mono tracking-widest text-emerald-600 mb-4 uppercase">
          The Living Archive
        </p>
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8 text-gray-900"
          style={{ wordBreak: "keep-all" }}
        >
          실험 아카이브
        </h1>

        {/* 제작 의도 — 에세이 */}
        <div className="mb-16">
          <div
            className="prose prose-lg text-gray-600 leading-relaxed"
            style={{
              fontFamily: "'Noto Serif KR', Georgia, serif",
              wordBreak: "keep-all",
            }}
          >
            <p>
              이미지 홍수의 시대에, 아티스트에게는 단 하나의 순수한 면(面)이
              필요해 보였다.
            </p>
            <p>
              인스타그램과 유튜브에 흩어진 창작물을 한 곳에 모으고,
              관리의 번거로움을 걷어내면 어떨까.
              그리고 이 공간의 유지비를 아티스트가 스스로 정하게 한다면?
            </p>
            <p>
              0%를 선택하는 작가도, 50%를 설정하는 작가도 있을 것이다.
              그 분포 자체가 예술가의 가치관을 보여주는 하나의 데이터가 된다.
            </p>
            <p>
              우리의 수익금은 다른 아티스트와 로컬 크리에이터의 작품을
              구매하고 응원하는 데 사용된다.
              선순환. 그것이 이 실험의 전부이다.
            </p>
          </div>
        </div>

        {/* 실시간 통계 */}
        <div className="mb-16">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            실시간 데이터
          </h2>
          <LiveStats variant="full" />
        </div>

        {/* 타임라인 */}
        {logs.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-8">실험 기록</h2>
            <div className="relative">
              {/* 타임라인 세로줄 */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />

              <div className="space-y-6">
                {logs.map((log) => {
                  const Icon = typeIcons[log.type] || Clock;
                  return (
                    <div key={log.id} className="relative flex gap-6 pl-10">
                      {/* 아이콘 */}
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center z-10">
                        <Icon size={14} className="text-emerald-600" />
                      </div>

                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded-full font-medium">
                            {typeLabels[log.type] || log.type}
                          </span>
                          <span className="text-[11px] text-gray-300">
                            {new Date(log.created_at).toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 mb-1">
                          {log.title}
                        </h3>
                        {log.description && (
                          <p
                            className="text-sm text-gray-500 leading-relaxed"
                            style={{ wordBreak: "keep-all" }}
                          >
                            {log.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 비어있을 때 */}
        {logs.length === 0 && (
          <div className="text-center py-20 bg-gray-50/50 rounded-2xl">
            <Sparkles size={32} className="text-emerald-300 mx-auto mb-4" />
            <p className="text-sm text-gray-400" style={{ wordBreak: "keep-all" }}>
              실험이 시작되면 이곳에 모든 기록이 아카이빙됩니다.
              <br />
              첫 번째 아티스트의 참여를 기다리고 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
