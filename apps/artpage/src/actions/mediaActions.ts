// src/actions/mediaActions.ts
"use server";

import { db, storage } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

// ── Firebase 기반 (기존 호환) ──

export async function createMedia(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const press_name = formData.get("press_name") as string;
    const link_url = formData.get("link_url") as string;
    const content = formData.get("content") as string;
    const published_date = formData.get("published_date") as string;
    const imageFile = formData.get("image") as File;
    const site_slug = formData.get("site_slug") as string || "arthyun";

    if (!title || !link_url) throw new Error("필수 정보 누락");

    let image_url = null;
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, `media/${fileName}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      image_url = await getDownloadURL(uploadResult.ref);
    }

    await addDoc(collection(db, "media_releases"), {
      title,
      press_name,
      link_url,
      content,
      image_url,
      published_date: published_date || null,
      site_slug,
      created_at: serverTimestamp(),
    });

    revalidatePath(`/${site_slug}/media`);
    revalidatePath("/admin/media");
  } catch (error) {
    console.error("Error creating media:", error);
    throw error;
  }
  redirect("/admin/media");
}

export async function deleteMedia(id: string) {
  try {
    await deleteDoc(doc(db, "media_releases", id));
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Delete media error:", error);
    throw new Error("보도자료 삭제 실패");
  }
}

// ── Prisma 기반 CRUD (멀티테넌트) ──

export async function getMediaBySlug(siteSlug: string) {
  try {
    return await prisma.media_releases.findMany({
      where: { site_slug: siteSlug },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("getMediaBySlug error:", error);
    return [];
  }
}

export async function createMediaPrisma(
  siteSlug: string,
  data: {
    title: string;
    content?: string;
    press_name?: string;
    source?: string;
    source_url?: string;
    link_url?: string;
    image_url?: string;
    published_date?: string;
  }
) {
  try {
    const result = await prisma.media_releases.create({
      data: {
        site_slug: siteSlug,
        title: data.title,
        content: data.content || null,
        press_name: data.press_name || null,
        source: data.source || null,
        source_url: data.source_url || null,
        link_url: data.link_url || null,
        image_url: data.image_url || null,
        published_date: data.published_date || null,
      },
    });

    revalidatePath(`/${siteSlug}/media`);
    revalidatePath("/admin/media");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("createMediaPrisma error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateMediaPrisma(
  id: number,
  siteSlug: string,
  data: {
    title?: string;
    content?: string;
    press_name?: string;
    source?: string;
    source_url?: string;
    link_url?: string;
    image_url?: string;
    published_date?: string;
    is_visible?: boolean;
  }
) {
  try {
    const result = await prisma.media_releases.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    revalidatePath(`/${siteSlug}/media`);
    revalidatePath("/admin/media");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("updateMediaPrisma error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMediaPrisma(id: number, siteSlug: string) {
  try {
    await prisma.media_releases.delete({ where: { id } });

    revalidatePath(`/${siteSlug}/media`);
    revalidatePath("/admin/media");

    return { success: true };
  } catch (error: any) {
    console.error("deleteMediaPrisma error:", error);
    return { success: false, error: error.message };
  }
}
