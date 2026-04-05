import { fetchProjectResource } from "@/lib/admin/fetch-project";
import { Users } from "lucide-react";

interface User {
  id: string;
  email?: string;
  name?: string;
  nickname?: string;
  createdAt?: string;
  created_at?: string;
  provider?: string;
}

export default async function WhymoveUsersPage() {
  const items = await fetchProjectResource<User>("whymove", "users");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">와이무브</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">사용자 관리</h1>
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4">
        <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-1">전체 사용자</p>
        <p className="text-3xl font-black text-violet-600">{items.length}</p>
      </div>

      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-bold text-[var(--admin-text)]">사용자 목록</span>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center text-[var(--admin-text-muted)] text-sm">사용자가 없습니다.</div>
        ) : (
          <div className="divide-y divide-[var(--admin-border)]">
            {items.map((item) => {
              const createdAt = item.createdAt ?? item.created_at;
              return (
                <div key={item.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--admin-bg)] transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-[var(--admin-text)]">{item.name ?? item.nickname ?? "이름 없음"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.email && <span className="text-[11px] text-[var(--admin-text-muted)]">{item.email}</span>}
                      {item.provider && (
                        <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{item.provider}</span>
                      )}
                    </div>
                  </div>
                  {createdAt && (
                    <span className="text-[11px] text-[var(--admin-text-muted)] shrink-0">
                      {new Date(createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
