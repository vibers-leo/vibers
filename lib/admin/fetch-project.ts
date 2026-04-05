import { VIBERS_PROJECTS_REGISTRY } from "./aggregator";
import type { VibersAdminResponse } from "@vibers/admin-kit/types";

function getProjectUrl(projectId: string): string {
  const p = VIBERS_PROJECTS_REGISTRY.find((x) => x.id === projectId);
  return p?.adminApiUrl ?? "";
}

export async function fetchProjectStats(projectId: string): Promise<VibersAdminResponse | null> {
  const url = getProjectUrl(projectId);
  if (!url) return null;
  try {
    const res = await fetch(url, {
      headers: { "x-vibers-admin-secret": process.env.VIBERS_ADMIN_SECRET ?? "" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchProjectResource<T = unknown>(
  projectId: string,
  resource: string,
  params?: Record<string, string>
): Promise<T[]> {
  const url = getProjectUrl(projectId);
  if (!url) return [];
  try {
    const qs = new URLSearchParams({ resource, ...params }).toString();
    const res = await fetch(`${url}?${qs}`, {
      headers: { "x-vibers-admin-secret": process.env.VIBERS_ADMIN_SECRET ?? "" },
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}
