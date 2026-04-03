import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, projects, statusLabel, statusColor, categoryLabel } from "@/data/projects";
import Nav from "@/components/nav";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.name} — ${project.tagline}`,
    description: project.description,
  };
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const others = projects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Nav />

      <div className="mx-auto max-w-4xl px-6 pt-36 pb-24">
        {/* 뒤로가기 */}
        <Link
          href="/projects"
          className="mb-10 inline-flex items-center gap-2 text-sm text-[#666] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          프로젝트 목록
        </Link>

        {/* 상단 배지 */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-sm font-bold"
            style={{
              color: statusColor[project.status],
              backgroundColor: `${statusColor[project.status]}15`,
              border: `1px solid ${statusColor[project.status]}30`,
            }}
          >
            {statusLabel[project.status]}
          </span>
          <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-[#888]">
            {categoryLabel[project.category]}
          </span>
        </div>

        {/* 제목 */}
        <h1 className="text-5xl font-black tracking-tight md:text-7xl mb-2">
          {project.name}
        </h1>
        <p className="text-[#555] text-lg mb-6">{project.nameEn}</p>

        {/* 태그라인 */}
        <p
          className="text-xl md:text-2xl font-medium leading-relaxed mb-10"
          style={{ color: project.color }}
        >
          {project.tagline}
        </p>

        {/* 설명 */}
        <div
          className="rounded-2xl border p-8 mb-10"
          style={{ borderColor: `${project.color}20`, backgroundColor: `${project.color}05` }}
        >
          <p className="text-[#bbb] leading-relaxed text-lg">{project.description}</p>
        </div>

        {/* 하이라이트 */}
        {project.highlights.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold mb-4 text-[#888]">주요 성과 / 목표</h2>
            <ul className="space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: project.color }} />
                  <span className="text-[#ddd]">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 기술 스택 */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4 text-[#888]">기술 스택</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-lg px-3 py-1.5 text-sm font-medium"
                style={{
                  backgroundColor: `${project.color}10`,
                  color: `${project.color}cc`,
                  border: `1px solid ${project.color}20`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* 링크 */}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: project.color, color: "#000" }}
          >
            서비스 방문 <ArrowUpRight className="h-5 w-5" />
          </a>
        )}

        {/* 구분선 */}
        <hr className="my-16 border-white/5" />

        {/* 다른 프로젝트 */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-[#555]">다른 프로젝트</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="mb-2 text-base font-bold text-white group-hover:text-[#39FF14] transition-colors">
                  {p.name}
                </div>
                <p className="text-xs text-[#666] line-clamp-2">{p.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
