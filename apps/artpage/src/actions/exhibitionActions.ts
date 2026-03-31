// src/actions/exhibitionActions.ts
"use server";

import { db, storage } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

// ── Firebase 기반 (기존 호환) ──

export async function createExhibition(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string || formData.get("subtitle") as string;
    const description = formData.get("description") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const is_main_slider = formData.get("is_main_slider") === "on";
    const file = formData.get("poster_image") as File;
    const youtube_url = formData.get("youtube_url") as string;
    const site_slug = formData.get("site_slug") as string || "arthyun";

    if (!title) {
      return { success: false, message: "제목은 필수입니다." };
    }

    let poster_url = null;
    if (file && file.size > 0) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, `exhibitions/${fileName}`);
      const uploadResult = await uploadBytes(storageRef, file);
      poster_url = await getDownloadURL(uploadResult.ref);
    }

    await addDoc(collection(db, "exhibitions"), {
      title,
      artist: artist || null,
      description: description || null,
      start_date: start_date || null,
      end_date: end_date || null,
      is_active: true,
      poster_url,
      is_main_slider,
      youtube_url: youtube_url || null,
      site_slug,
      created_at: serverTimestamp(),
    });

    revalidatePath("/");
    revalidatePath(`/${site_slug}`);
    revalidatePath(`/${site_slug}/archive`);
    revalidatePath("/admin/exhibition");

    return { success: true };
  } catch (error: any) {
    console.error("Exhibition Action Error:", error);
    return { success: false, message: error.message || "서버 내부 오류 발생" };
  }
}

export async function deleteExhibition(id: string) {
  try {
    await deleteDoc(doc(db, "exhibitions", id));
    revalidatePath("/admin/exhibition");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Exhibition Error:", error);
    throw new Error(error.message || "전시 삭제 실패");
  }
}

// ── Prisma 기반 CRUD (멀티테넌트) ──

export async function getExhibitionsBySlug(siteSlug: string) {
  try {
    return await prisma.exhibitions.findMany({
      where: { site_slug: siteSlug },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("getExhibitionsBySlug error:", error);
    return [];
  }
}

export async function createExhibitionPrisma(
  siteSlug: string,
  data: {
    title: string;
    subtitle?: string;
    artist?: string;
    category?: string;
    poster_url?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    is_main_slider?: boolean;
    youtube_url?: string;
  }
) {
  try {
    const result = await prisma.exhibitions.create({
      data: {
        site_slug: siteSlug,
        title: data.title,
        subtitle: data.subtitle || null,
        artist: data.artist || null,
        category: data.category || null,
        poster_url: data.poster_url || null,
        description: data.description || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        is_main_slider: data.is_main_slider ?? false,
        youtube_url: data.youtube_url || null,
      },
    });

    revalidatePath(`/${siteSlug}`);
    revalidatePath(`/${siteSlug}/archive`);
    revalidatePath("/admin/exhibition");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("createExhibitionPrisma error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateExhibitionPrisma(
  id: number,
  siteSlug: string,
  data: {
    title?: string;
    subtitle?: string;
    artist?: string;
    category?: string;
    poster_url?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    is_active?: boolean;
    is_visible?: boolean;
    is_main_slider?: boolean;
    youtube_url?: string;
    sort_order?: number;
  }
) {
  try {
    const result = await prisma.exhibitions.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    revalidatePath(`/${siteSlug}`);
    revalidatePath(`/${siteSlug}/archive`);
    revalidatePath("/admin/exhibition");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("updateExhibitionPrisma error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteExhibitionPrisma(id: number, siteSlug: string) {
  try {
    await prisma.exhibitions.delete({ where: { id } });

    revalidatePath(`/${siteSlug}`);
    revalidatePath(`/${siteSlug}/archive`);
    revalidatePath("/admin/exhibition");

    return { success: true };
  } catch (error: any) {
    console.error("deleteExhibitionPrisma error:", error);
    return { success: false, error: error.message };
  }
}
