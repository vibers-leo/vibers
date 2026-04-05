import { ChefHat, ExternalLink, PenLine, Clock, AlertCircle } from "lucide-react";

async function getDraftRecipes() {
  try {
    const secret = process.env.VIBERS_ADMIN_SECRET ?? "";
    const res = await fetch(
      `${process.env.AI_RECIPE_ADMIN_URL ?? "https://ai.vibers.co.kr"}/api/vibers-admin?resource=recipes&status=draft`,
      { headers: { "x-vibers-admin-secret": secret }, next: { revalidate: 30 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).filter((r: { status: string }) => r.status === "draft");
  } catch {
    return [];
  }
}

const difficultyMap: Record<string, { label: string; color: string }> = {
  Easy:   { label: "초급", color: "text-emerald-600 bg-emerald-50" },
  Medium: { label: "중급", color: "text-amber-600 bg-amber-50" },
  Hard:   { label: "고급", color: "text-red-600 bg-red-50" },
};

export default async function DraftRecipesPage() {
  const drafts = await getDraftRecipes();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">AI Recipe</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--admin-text)]">초안 검토</h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-0.5">발행 전 검토가 필요한 레시피 초안 목록입니다.</p>
        </div>
        <a
          href="https://ai.vibers.co.kr/admin/recipes?status=draft"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          원본 어드민에서 편집
        </a>
      </div>

      {/* 초안 수 */}
      <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        <span className="text-sm font-semibold text-amber-800">
          검토 대기 중인 초안이 <strong>{drafts.length}개</strong> 있습니다.
        </span>
      </div>

      {/* 목록 */}
      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-[var(--admin-text)]">초안 레시피</span>
          <span className="ml-auto flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            {drafts.length}건 대기
          </span>
        </div>

        {drafts.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <ChefHat className="w-10 h-10 text-[var(--admin-text-muted)] mx-auto opacity-30" />
            <p className="text-sm text-[var(--admin-text-muted)]">검토 대기 중인 초안이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--admin-border)]">
            {drafts.map((recipe: {
              id: string;
              title: string;
              category?: string;
              difficulty?: string;
              author_name?: string;
              created_at: string;
              tags?: string[];
            }) => {
              const diff = recipe.difficulty ? difficultyMap[recipe.difficulty] : null;
              return (
                <div
                  key={recipe.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--admin-bg)] transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--admin-text)] truncate">{recipe.title}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {recipe.category && (
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {recipe.category}
                        </span>
                      )}
                      {diff && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff.color}`}>
                          {diff.label}
                        </span>
                      )}
                      {recipe.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] text-[var(--admin-text-muted)] bg-slate-100 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
                      {recipe.author_name ?? "작성자 없음"} · {new Date(recipe.created_at).toLocaleDateString("ko-KR")} 작성
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={`https://ai.vibers.co.kr/admin/recipes/${recipe.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      <PenLine className="w-3.5 h-3.5" />
                      편집 및 발행
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
