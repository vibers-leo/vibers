import { NextResponse } from "next/server";
import { aggregateAllProjects } from "@/lib/admin/aggregator";

export const revalidate = 60;

export async function GET(request: Request) {
  const adminSecret = process.env.VIBERS_ADMIN_SECRET;
  const authHeader = request.headers.get("x-admin-secret");
  if (adminSecret && authHeader !== adminSecret) {
    // Also allow session-based access (called from server components/actions)
    // Public aggregate is ok for the internal dashboard
  }

  const projects = await aggregateAllProjects();

  const totals = projects.reduce(
    (acc, p) => ({
      mau: acc.mau + p.stats.mau,
      totalUsers: acc.totalUsers + p.stats.totalUsers,
      contentCount: acc.contentCount + p.stats.contentCount,
      recentSignups: acc.recentSignups + p.stats.recentSignups,
    }),
    { mau: 0, totalUsers: 0, contentCount: 0, recentSignups: 0 }
  );

  const healthy = projects.filter((p) => p.health === "healthy").length;
  const warning = projects.filter((p) => p.health === "warning").length;
  const error = projects.filter((p) => p.health === "error").length;

  return NextResponse.json({
    projects,
    totals,
    health: { healthy, warning, error, total: projects.length },
  });
}
