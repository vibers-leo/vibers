import { Briefcase, ExternalLink, CheckCircle, XCircle } from "lucide-react";

async function getJobs() {
  try {
    const secret = process.env.VIBERS_ADMIN_SECRET ?? "";
    const res = await fetch(
      `${process.env.SEMOPHONE_ADMIN_URL ?? "https://semophone.co.kr"}/api/vibers-admin?resource=jobs`,
      { headers: { "x-vibers-admin-secret": secret }, next: { revalidate: 30 } }
    );
    if (!res.ok) return [];
    return (await res.json()).data ?? [];
  } catch {
    return [];
  }
}

export default async function SemophoneJobsPage() {
  const jobs = await getJobs();
  const active = jobs.filter((j: any) => j.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">세모폰</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--admin-text)]">구인공고 관리</h1>
        </div>
        <a
          href="https://semophone.co.kr/admin/jobs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          원본 어드민
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "전체 공고", value: jobs.length, color: "text-slate-600" },
          { label: "활성 공고", value: active, color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4">
            <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-[var(--admin-text)]">공고 목록</span>
        </div>

        {jobs.length === 0 ? (
          <div className="py-16 text-center text-[var(--admin-text-muted)] text-sm">데이터를 불러올 수 없습니다.</div>
        ) : (
          <div className="divide-y divide-[var(--admin-border)]">
            {jobs.map((job: any) => (
              <div key={job.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--admin-bg)] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--admin-text)]">{job.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {job.type && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {job.type}
                      </span>
                    )}
                    <span className="text-[10px] text-[var(--admin-text-muted)]">{job.location}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-bold`}>
                  {job.isActive
                    ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /><span className="text-emerald-600">활성</span></>
                    : <><XCircle className="w-3.5 h-3.5 text-slate-400" /><span className="text-slate-400">비활성</span></>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
