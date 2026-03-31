// src/actions/artworkActions.ts
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 커미션 비율 (8%)
const COMMISSION_RATE = 0.08;

// ── 작품 CRUD ──

export async function createArtwork(
  siteSlug: string,
  data: {
    title: string;
    description?: string;
    price: number;
    currency?: string;
    image_url: string;
  }
) {
  try {
    const result = await prisma.artwork.create({
      data: {
        site_slug: siteSlug,
        title: data.title,
        description: data.description || null,
        price: data.price,
        currency: data.currency || "KRW",
        image_url: data.image_url,
      },
    });

    revalidatePath(`/${siteSlug}/shop`);
    revalidatePath("/admin/artworks");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("createArtwork error:", error);
    return { success: false, error: error.message };
  }
}

export async function getArtworks(siteSlug: string) {
  try {
    return await prisma.artwork.findMany({
      where: { site_slug: siteSlug },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("getArtworks error:", error);
    return [];
  }
}

export async function getActiveArtworks(siteSlug: string) {
  try {
    return await prisma.artwork.findMany({
      where: {
        site_slug: siteSlug,
        is_active: true,
      },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("getActiveArtworks error:", error);
    return [];
  }
}

export async function getArtworkById(id: string) {
  try {
    return await prisma.artwork.findUnique({ where: { id } });
  } catch (error) {
    console.error("getArtworkById error:", error);
    return null;
  }
}

export async function updateArtwork(
  id: string,
  siteSlug: string,
  data: {
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    image_url?: string;
    is_active?: boolean;
    is_sold?: boolean;
  }
) {
  try {
    const result = await prisma.artwork.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    revalidatePath(`/${siteSlug}/shop`);
    revalidatePath("/admin/artworks");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("updateArtwork error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteArtwork(id: string, siteSlug: string) {
  try {
    await prisma.artwork.delete({ where: { id } });

    revalidatePath(`/${siteSlug}/shop`);
    revalidatePath("/admin/artworks");

    return { success: true };
  } catch (error: any) {
    console.error("deleteArtwork error:", error);
    return { success: false, error: error.message };
  }
}

// ── 거래 관련 ──

export async function createTransaction(data: {
  artwork_id: string;
  site_slug: string;
  buyer_email: string;
  buyer_name?: string;
  amount: number;
}) {
  const commission = Math.round(data.amount * COMMISSION_RATE);
  const artist_payout = data.amount - commission;

  try {
    const result = await prisma.artTransaction.create({
      data: {
        artwork_id: data.artwork_id,
        site_slug: data.site_slug,
        buyer_email: data.buyer_email,
        buyer_name: data.buyer_name || null,
        amount: data.amount,
        commission,
        artist_payout,
        status: "pending",
      },
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error("createTransaction error:", error);
    return { success: false, error: error.message };
  }
}

export async function getTransactions(siteSlug: string) {
  try {
    return await prisma.artTransaction.findMany({
      where: { site_slug: siteSlug },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("getTransactions error:", error);
    return [];
  }
}

export async function updateTransactionStatus(
  id: string,
  status: string,
  paymentId?: string
) {
  try {
    const result = await prisma.artTransaction.update({
      where: { id },
      data: {
        status,
        payment_id: paymentId || undefined,
        paid_at: status === "paid" ? new Date() : undefined,
      },
    });

    // 결제 완료 시 작품을 판매완료로 표시
    if (status === "paid") {
      const tx = await prisma.artTransaction.findUnique({ where: { id } });
      if (tx) {
        await prisma.artwork.update({
          where: { id: tx.artwork_id },
          data: { is_sold: true, buyer_email: tx.buyer_email },
        });
      }
    }

    revalidatePath("/admin/artworks");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("updateTransactionStatus error:", error);
    return { success: false, error: error.message };
  }
}
