"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

type InquiryData = {
  type: "general" | "exhibition";
  name: string;
  phone: string;
  email: string;
  content: string;
  site_slug?: string;
};

// Firebase 기반 (기존 호환)
export async function submitInquiry(data: InquiryData) {
  try {
    await addDoc(collection(db, "inquiries"), {
      ...data,
      site_slug: data.site_slug || "arthyun",
      status: "pending",
      createdAt: serverTimestamp(),
    });

    return { success: true, message: "성공적으로 접수되었습니다. 담당자가 확인 후 연락드리겠습니다." };
  } catch (error) {
    console.error("Inquiry Error:", error);
    return { success: false, message: "접수 중 오류가 발생했습니다." };
  }
}

// ── Prisma 기반 멀티테넌트 ──

export async function getInquiriesBySlug(siteSlug: string) {
  try {
    return await prisma.inquiries.findMany({
      where: { site_slug: siteSlug },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("getInquiriesBySlug error:", error);
    return [];
  }
}

export async function createInquiryPrisma(
  siteSlug: string,
  data: {
    type?: string;
    name: string;
    phone?: string;
    email?: string;
    content?: string;
  }
) {
  try {
    const result = await prisma.inquiries.create({
      data: {
        site_slug: siteSlug,
        type: data.type || "general",
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        content: data.content || null,
      },
    });

    revalidatePath("/admin/inquiries");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("createInquiryPrisma error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateInquiryStatusPrisma(id: number, status: string) {
  try {
    await prisma.inquiries.update({
      where: { id },
      data: { status, updated_at: new Date() },
    });

    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error: any) {
    console.error("updateInquiryStatusPrisma error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteInquiryPrisma(id: number) {
  try {
    await prisma.inquiries.delete({ where: { id } });

    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error: any) {
    console.error("deleteInquiryPrisma error:", error);
    return { success: false, error: error.message };
  }
}
