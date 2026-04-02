"use server";

import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

/**
 * 게시물 본문 콘텐츠를 업데이트하는 서버 액션
 * (이미지 복구 등에서 사용)
 */
export async function updatePostContent(postId: number | string, newContent: string) {
  try {
    const docRef = doc(db, "posts", String(postId));
    await updateDoc(docRef, {
      content: newContent,
    });
    revalidatePath("/admin");
  } catch (error: any) {
    throw new Error("콘텐츠 업데이트 실패: " + error.message);
  }
}
