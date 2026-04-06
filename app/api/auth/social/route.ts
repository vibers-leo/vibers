import { getSession, getUserSocialAccounts, unlinkSocialAccount } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { Provider } from "@/lib/permissions";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const accounts = await getUserSocialAccounts(user.id);
  return NextResponse.json({ accounts });
}

export async function DELETE(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { provider } = await request.json();
  const result = await unlinkSocialAccount(user.id, provider as Provider);
  if ("error" in result) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
