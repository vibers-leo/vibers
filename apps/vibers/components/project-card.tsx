import Link from "next/link";
import type { Project } from "@/data/projects";
import { statusLabel, statusColor, categoryLabel } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  variant?: "default" | "featured";
}

export default function ProjectCard({ project, variant = "default" }: ProjectCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group block rounded-2xl border p-6 transition-all duration-300 hover:border-opacity-60 hover:-translate-y-0.5 ${
        isFeatured ? "md:p-8" : ""
      }`}
      style={{
        borderColor: `${project.color}30`,
        backgroundColor: `${project.color}06`,
      }}
    >
      {/* 상단: 카테고리 + 상태 배지 */}
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-[#888]">
          {categoryLabel[project.category]}
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-bold"
          style={{
            color: statusColor[project.status],
            backgroundColor: `${statusColor[project.status]}15`,
            border: `1px solid ${statusColor[project.status]}30`,
          }}
        >
          {statusLabel[project.status]}
        </span>
      </div>

      {/* 프로젝트명 */}
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className={`font-black tracking-tight text-white ${isFeatured ? "text-2xl" : "text-xl"}`}>
          {project.name}
          <span className="ml-2 text-sm font-normal text-[#555]">{project.nameEn}</span>
        </h3>
        <ArrowUpRight
          className="h-5 w-5 shrink-0 text-[#444] transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>

      {/* 태그라인 */}
      <p className={`text-[#888] leading-relaxed ${isFeatured ? "text-base mb-5" : "text-sm mb-4"}`}>
        {project.tagline}
      </p>

      {/* 하이라이트 (featured만) */}
      {isFeatured && project.highlights.length > 0 && (
        <ul className="mb-5 space-y-1.5">
          {project.highlights.slice(0, 2).map((h) => (
            <li key={h} className="flex items-center gap-2 text-sm text-[#aaa]">
              <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
              {h}
            </li>
          ))}
        </ul>
      )}

      {/* 기술 태그 */}
      <div className="flex flex-wrap gap-1.5">
        {project.tech.slice(0, isFeatured ? 5 : 3).map((t) => (
          <span
            key={t}
            className="rounded-md px-2 py-0.5 text-xs"
            style={{
              backgroundColor: `${project.color}10`,
              color: `${project.color}cc`,
            }}
          >
            {t}
          </span>
        ))}
        {project.tech.length > (isFeatured ? 5 : 3) && (
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-[#555]">
            +{project.tech.length - (isFeatured ? 5 : 3)}
          </span>
        )}
      </div>
    </Link>
  );
}
