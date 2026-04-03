import type { Metadata } from "next";
import { projects, statusLabel, categoryLabel, type ProjectStatus, type ProjectCategory } from "@/data/projects";
import Nav from "@/components/nav";
import ProjectCard from "@/components/project-card";

export const metadata: Metadata = {
  title: "프로젝트 아카이브",
  description: "계발자들의 모든 프로젝트 목록. 서비스 중, 개발 중, 기획 중인 프로젝트를 모두 확인하세요.",
};

const statusOrder: ProjectStatus[] = ["live", "beta", "development", "concept"];

export default function ProjectsPage() {
  const sorted = [...projects].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );

  const liveCount = projects.filter((p) => p.status === "live" || p.status === "beta").length;
  const devCount = projects.filter((p) => p.status === "development").length;
  const conceptCount = projects.filter((p) => p.status === "concept").length;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Nav />

      <div className="mx-auto max-w-6xl px-6 pt-36 pb-24">
        {/* 헤더 */}
        <div className="mb-16">
          <h1 className="text-4xl font-black md:text-6xl mb-4">
            프로젝트 아카이브
          </h1>
          <p className="text-[#888] text-lg max-w-2xl leading-relaxed">
            계발자들이 만들고 있는 모든 프로젝트. 아이디어에서 실제 서비스까지.
          </p>

          {/* 요약 통계 */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#39FF14]" />
              <span className="text-sm text-[#888]">서비스 중 <span className="text-white font-bold">{liveCount}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#6C63FF]" />
              <span className="text-sm text-[#888]">개발 중 <span className="text-white font-bold">{devCount}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#555]" />
              <span className="text-sm text-[#888]">기획 중 <span className="text-white font-bold">{conceptCount}</span></span>
            </div>
          </div>
        </div>

        {/* 전체 목록 */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
