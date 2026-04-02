"use server";

import { db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

// ── Firebase 기반 설정 (기존 호환) ──

// 설정 조회 (Firebase)
export async function getSiteSettings() {
  try {
    const docRef = doc(db, "site_settings", "default");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

// 설정 업데이트 (Firebase — 기존 호환)
export async function updateSiteSettings(formData: FormData) {
  try {
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;
    let imageUrl = formData.get("existingImage") as string;

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `og-image-${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, `settings/${fileName}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(uploadResult.ref);
    }

    const docRef = doc(db, "site_settings", "default");
    const docSnap = await getDoc(docRef);

    const updateData = {
      og_description: description,
      og_image_url: imageUrl,
      updated_at: serverTimestamp(),
    };

    if (docSnap.exists()) {
      await updateDoc(docRef, updateData);
    } else {
      await setDoc(docRef, { ...updateData, id: 1 });
    }

    revalidatePath("/");
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error: any) {
    console.error("Settings Update Error:", error);
    return { error: "설정 저장 실패: " + error.message };
  }
}

// ── Prisma 기반 멀티테넌트 설정 ──

// slug별 사이트 설정 조회 (Prisma)
export async function getSiteSettingsBySlug(siteSlug: string) {
  try {
    const settings = await prisma.site_settings.findUnique({
      where: { site_slug: siteSlug },
    });
    return settings;
  } catch (error) {
    console.error("Error fetching site settings by slug:", error);
    return null;
  }
}

// slug별 사이트 설정 upsert (Prisma)
export async function upsertSiteSettings(
  siteSlug: string,
  data: {
    site_name?: string;
    site_title?: string;
    site_description?: string;
    og_description?: string;
    og_image_url?: string;
    domain?: string;
    address?: string;
    phone?: string;
    email?: string;
    instagram_url?: string;
    blog_url?: string;
    youtube_url?: string;
  }
) {
  try {
    await prisma.site_settings.upsert({
      where: { site_slug: siteSlug },
      update: {
        ...data,
        updated_at: new Date(),
      },
      create: {
        site_slug: siteSlug,
        template: siteSlug === "art-way" ? "art-way" : "arthyun",
        ...data,
      },
    });

    revalidatePath("/");
    revalidatePath(`/${siteSlug}`);
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error: any) {
    console.error("Upsert site settings error:", error);
    return { success: false, error: error.message };
  }
}
