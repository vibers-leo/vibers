// src/app/admin/exhibition/write/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamicImport from "next/dynamic";
import { Button } from "@/components/ui/button";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";

// Editor를 동적으로 import (SSR 방지)
const Editor = dynamicImport(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => <div className="min-h-[200px] border rounded-md p-4 flex items-center justify-center text-gray-400">에디터 로딩 중...</div>
});

// 정적 생성 방지
export const dynamic = "force-dynamic";

export default function AdminExhibitionWrite() {
  const router = useRouter();
  const [descHtml, setDescHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const artist = formData.get("subtitle") as string;
      const start_date = formData.get("start_date") as string;
      const end_date = formData.get("end_date") as string;
      const is_main_slider = formData.get("is_main_slider") === "on";
      const youtube_url = formData.get("youtube_url") as string;
      const posterFile = formData.get("poster_image") as File;

      if (!title || !posterFile) {
        toast.error("제목과 포스터 이미지는 필수입니다.");
        setIsLoading(false);
        return;
      }

      // 1. 이미지 업로드 (Firebase Storage)
      const fileExt = posterFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, `exhibitions/${fileName}`);
      
      const uploadResult = await uploadBytes(storageRef, posterFile);
      const poster_url = await getDownloadURL(uploadResult.ref);

      // 2. DB 저장 (Firestore)
      await addDoc(collection(db, "exhibitions"), {
        title,
        artist: artist || null,
        description: descHtml,
        start_date: start_date || null,
        end_date: end_date || null,
        poster_url,
        is_main_slider,
        youtube_url: youtube_url || null,
        is_active: true,
        created_at: serverTimestamp(),
      });

      toast.success("전시가 성공적으로 등록되었습니다.");
      router.push("/admin/exhibition");
      router.refresh();
    } catch (error: any) {
      console.error("Error adding exhibition:", error);
      toast.error("전시 등록 중 오류가 발생했습니다: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 animate-fade-in-up">
      <h1 className="text-3xl font-serif font-bold mb-10 border-b pb-4">
        전시 등록 (Admin)
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">전시 제목 *</label>
            <input
              name="title"
              type="text"
              className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">
              작가명 (부제목)
            </label>
            <input
              name="subtitle"
              type="text"
              className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition"
            />
          </div>
        </div>

        {/* 2. 날짜 및 옵션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-bold mb-2">시작일</label>
            <input
              name="start_date"
              type="date"
              className="w-full border-b border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">종료일</label>
            <input
              name="end_date"
              type="date"
              className="w-full border-b border-gray-300 p-2"
            />
          </div>
          <div className="flex items-center gap-2 pb-2">
            <input
              name="is_main_slider"
              type="checkbox"
              id="main_check"
              className="w-5 h-5 accent-black cursor-pointer"
            />
            <label
              htmlFor="main_check"
              className="text-sm font-bold cursor-pointer"
            >
              메인 슬라이더 노출
            </label>
          </div>
        </div>

        {/* 2.5 유튜브 배경 영상 (Optional) */}
        <div>
          <label className="block text-sm font-bold mb-2">유튜브 배경 영상 URL (옵션)</label>
          <input
            name="youtube_url"
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition"
          />
        </div>

        {/* 3. 포스터 이미지 */}
        <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
          <label className="block text-sm font-bold mb-2">
            대표 포스터 이미지 *
          </label>
          <input
            name="poster_image"
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
            required
          />
        </div>

        {/* 4. 상세 내용 (Editor) */}
        <div>
          <label className="block text-sm font-bold mb-2">전시 상세 설명</label>
          <div className="min-h-[400px] border rounded-md p-1">
            <Editor onChange={(html: string) => setDescHtml(html)} />
          </div>
          <input type="hidden" name="description" value={descHtml} />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-6 text-lg font-bold hover:bg-gray-800 transition"
        >
          {isLoading ? "업로드 중..." : "전시 등록하기"}
        </Button>
      </form>
    </div>
  );
}
