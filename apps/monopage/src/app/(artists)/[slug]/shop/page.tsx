// src/app/(artists)/[slug]/shop/page.tsx
import { notFound } from "next/navigation";
import { getTemplateConfig } from "@/lib/templates";
import { getActiveArtworks } from "@/actions/artworkActions";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getTemplateConfig(slug);
  if (!config) notFound();

  const artworks = await getActiveArtworks(slug);

  return <ShopClient artworks={artworks} slug={slug} config={config} />;
}
