"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import dynamicImport from "next/dynamic";
import { Button } from "@/components/ui/button";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { toast } from "sonner";

// Editor를 동적으로 import (SSR 방지)
const Editor = dynamicImport(() => import("@/components/Editor"), {
    ssr: false,
    loading: () => <div className="min-h-[200px] border rounded-md p-4 flex items-center justify-center text-gray-400">에디터 로딩 중...</div>
});

// 정적 생성 방지
export const dynamic = "force-dynamic";

export default function EditExhibitionPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [descHtml, setDescHtml] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [exhibition, setExhibition] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadExhibition() {
            try {
                const docRef = doc(db, "exhibitions", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setExhibition({ id: docSnap.id, ...data });
                    setDescHtml(data.description || "");
                } else {
                    toast.error("전시 정보를 찾을 수 없습니다.");
                    router.push("/admin/exhibition");
                }
            } catch (error) {
                console.error("Error loading exhibition:", error);
                toast.error("데이터 로딩 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        }

        loadExhibition();
    }, [id, router]);

    const handleDeleteImage = async () => {
        if (!confirm("이미지를 삭제하시겠습니까?")) return;

        try {
            await updateDoc(doc(db, "exhibitions", id), {
                poster_url: null
            });
            setExhibition({ ...exhibition, poster_url: null });
            toast.success("이미지가 삭제되었습니다.");
        } catch (error) {
            console.error("Image delete error:", error);
            toast.error("이미지 삭제 실패");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const imageFile = formData.get("poster") as File;
            let poster_url = exhibition.poster_url;

            // 새 이미지가 업로드된 경우
            if (imageFile && imageFile.size > 0) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const storageRef = ref(storage, `exhibitions/${fileName}`);
                
                const uploadResult = await uploadBytes(storageRef, imageFile);
                poster_url = await getDownloadURL(uploadResult.ref);
            }

            await updateDoc(doc(db, "exhibitions", id), {
                title: formData.get("title") as string,
                artist: formData.get("artist") as string,
                start_date: formData.get("start_date") as string,
                end_date: formData.get("end_date") as string,
                description: descHtml,
                poster_url,
                youtube_url: formData.get("youtube_url") as string || null,
                is_active: formData.get("is_active") === "on",
                is_main_slider: formData.get("is_main_slider") === "on",
            });

            toast.success("수정 완료!");
            router.push("/admin/exhibition");
            router.refresh();
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error("수정 실패: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return <div className="max-w-3xl mx-auto py-20 px-6">로딩 중...</div>;
    }

    if (!exhibition) {
        return <div className="max-w-3xl mx-auto py-20 px-6">전시를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto py-20 px-6 animate-fade-in-up">
            <h1 className="text-3xl font-serif font-bold mb-10 border-b pb-4">
                전시 수정
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">전시 제목 *</label>
                        <input
                            name="title"
                            type="text"
                            defaultValue={exhibition.title}
                            className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">작가명 *</label>
                        <input
                            name="artist"
                            type="text"
                            defaultValue={exhibition.artist}
                            className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">시작일 *</label>
                            <input
                                name="start_date"
                                type="date"
                                defaultValue={exhibition.start_date}
                                className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">종료일 *</label>
                            <input
                                name="end_date"
                                type="date"
                                defaultValue={exhibition.end_date}
                                className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* 유튜브 URL */}
                <div>
                    <label className="block text-sm font-bold mb-2">유튜브 배경 영상 URL (옵션)</label>
                    <input
                        name="youtube_url"
                        type="text"
                        defaultValue={exhibition.youtube_url}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black transition"
                    />
                </div>

                {/* 포스터 이미지 */}
                <div>
                    <label className="block text-sm font-bold mb-2">포스터 이미지</label>
                    {exhibition.poster_url && (
                        <div className="mb-4">
                            <div className="flex items-start gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">현재 이미지:</p>
                                    <img src={exhibition.poster_url} alt="현재 포스터" className="w-32 h-auto rounded" />
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleDeleteImage}
                                    variant="outline"
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                    이미지 삭제
                                </Button>
                            </div>
                        </div>
                    )}
                    <input
                        name="poster"
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-black transition"
                    />
                    <p className="text-xs text-gray-500 mt-1">새 이미지를 선택하면 기존 이미지가 자동으로 삭제됩니다.</p>
                </div>

                {/* 상세 설명 */}
                <div>
                    <label className="block text-sm font-bold mb-2">상세 설명</label>
                    <div className="min-h-[200px] border rounded-md p-1">
                        <Editor onChange={(html: string) => setDescHtml(html)} initialContent={exhibition.description} />
                    </div>
                </div>

                {/* 옵션 */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            defaultChecked={exhibition.is_active}
                            className="w-4 h-4"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium">
                            활성화 (체크하면 공개 페이지에 표시됩니다)
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="is_main_slider"
                            id="is_main_slider"
                            defaultChecked={exhibition.is_main_slider}
                            className="w-4 h-4"
                        />
                        <label htmlFor="is_main_slider" className="text-sm font-medium">
                            메인 슬라이더에 표시
                        </label>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-6 text-lg font-bold hover:bg-gray-800 transition"
                >
                    {isLoading ? "수정 중..." : "수정 완료"}
                </Button>
            </form>
        </div>
    );
}
