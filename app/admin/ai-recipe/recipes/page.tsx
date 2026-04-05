import type { ReactNode } from "react";
import { ChefHat, ExternalLink, Eye, PenLine, CheckCircle, Clock } from "lucide-react";

async function getRecipes() {
  try {
    const secret = process.env.VIBERS_ADMIN_SECRET ?? "";
    const res = await fetch(
      `${process.env.AI_RECIPE_ADMIN_URL ?? "https://ai.vibers.co.kr"}/api/vibers-admin?resource=recipes`,
      { headers: { "x-vibers-admin-secret": secret }, next: { revalidate: 30 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

const difficultyMap: Record<string, { label: string; color: string }> = {
  Easy:   { label: "초급", color: "text-emerald-600 bg-emerald-50" },
  Medium: { label: "중급", color: "text-amber-600 bg-amber-50" },
  Hard:   { label: "고급", color: "text-red-600 bg-red-50" },
};

const statusMap: Record<string, { label: string; icon: ReactNode; color: string }> = {
  published: { label: "발행됨", icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-emerald-600 bg-emerald-50" },
  draft:     { label: "초안", icon: <Clock className="w-3.5 h-3.5" />, color: "text-amber-600 bg-amber-50" },
};

export default async function AIRecipeRecipesPage() {
  const recipes = await getRecipes();
  const published = recipes.filter((r) => r.status === "published").length;
  const drafts = recipes.filter((r) => r.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[var(--admin-text-muted)]">AI Recipe</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--admin-text)]">레시피 관리</h1>
        </div>
        <a
          href="https://ai.vibers.co.kr/admin/recipes"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          원본 어드민 열기
        </a>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "전체", value: recipes.length, color: "text-slate-600" },
          { label: "발행됨", value: published, color: "text-emerald-600" },
          { label: "초안", value: drafts, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4">
            <p className="text-[11px] font-bold text-[var(--admin-text-muted)] uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* 레시피 목록 */}
      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-bold text-[var(--admin-text)]">레시피 목록</span>
          <span className="ml-auto text-[11px] text-[var(--admin-text-muted)]">최근 50개</span>
        </div>

        {recipes.length === 0 ? (
          <div className="py-16 text-center text-[var(--admin-text-muted)] text-sm">
            레시피 데이터를 불러올 수 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-[var(--admin-border)]">
            {recipes.map((recipe) => {
              const diff = recipe.difficulty ? difficultyMap[recipe.difficulty] : null;
              const status = statusMap[recipe.status] ?? { label: recipe.status, icon: null, color: "text-slate-500 bg-slate-50" };
              return (
                <div
                  key={recipe.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--admin-bg)] transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--admin-text)] truncate">{recipe.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
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
                      <span className="text-[10px] text-[var(--admin-text-muted)]">
                        {recipe.author_name ?? "작성자 없음"} · {new Date(recipe.created_at).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={`https://ai.vibers.co.kr/recipe/${recipe.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-[var(--admin-text-muted)] hover:text-indigo-600 transition-colors"
                      title="보기"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://ai.vibers.co.kr/admin/recipes/${recipe.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-[var(--admin-text-muted)] hover:text-indigo-600 transition-colors"
                      title="편집"
                    >
                      <PenLine className="w-4 h-4" />
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
