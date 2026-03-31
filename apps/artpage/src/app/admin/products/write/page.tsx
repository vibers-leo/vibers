"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";

export default function AdminProductWritePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const imageFile = formData.get("image") as File;

            if (!imageFile || imageFile.size === 0) {
                throw new Error("상품 이미지는 필수입니다.");
            }

            // 1. 이미지 업로드
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const storageRef = ref(storage, `products/${fileName}`);
            
            const uploadResult = await uploadBytes(storageRef, imageFile);
            const image_url = await getDownloadURL(uploadResult.ref);

            // 2. Firestore에 저장
            await addDoc(collection(db, "products"), {
                title: formData.get("title") as string,
                artist: formData.get("artist") as string || "Anonymous",
                price: formData.get("price") as string,
                category: formData.get("category") as string,
                description: formData.get("description") as string,
                image_url,
                is_active: true,
                created_at: serverTimestamp(),
            });

            toast.success("상품 등록 완료!");
            router.push("/admin/products");
            router.refresh();
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error("상품 등록 실패: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-20 px-6">
            <h1 className="text-3xl font-serif font-bold mb-10 border-b pb-4">
                새 상품 등록
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2">상품명 *</label>
                    <input
                        name="title"
                        type="text"
                        className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition"
                        placeholder="예: '색의 여정' 포스터"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">작가 / 제조사 *</label>
                        <input
                            name="artist"
                            type="text"
                            className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition"
                            placeholder="예: 김민지 작가"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">가격 (₩) *</label>
                        <input
                            name="price"
                            type="text"
                            className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition"
                            placeholder="예: 35,000"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">카테고리 *</label>
                    <select
                        name="category"
                        className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition bg-white"
                        required
                    >
                        <option value="포스터">포스터</option>
                        <option value="아트프린트">아트프린트</option>
                        <option value="굿즈">굿즈</option>
                        <option value="엽서">엽서</option>
                        <option value="기타">기타</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">설명</label>
                    <textarea
                        name="description"
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-black transition h-32"
                        placeholder="상품에 대한 상세 설명을 입력하세요."
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">상품 이미지 *</label>
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-black transition"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">대표 이미지를 업로드해주세요.</p>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-6 text-lg font-bold hover:bg-gray-800 transition"
                >
                    {isLoading ? "등록 중..." : "상품 등록하기"}
                </Button>
            </form>
        </div>
    );
}
