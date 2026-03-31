"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Upload, X, ArrowLeft, ArrowRight, ImagePlus } from "lucide-react";
import { uploadImage } from "@/lib/upload";

const MIN_IMAGES = 5;
const MAX_IMAGES = 20;

type UploadedImage = {
  file: File;
  preview: string;
  url?: string; // Firebase Storage URL
  uploading: boolean;
  error?: string;
};

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 파일 추가 처리
  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );

      // 최대 개수 제한
      const remaining = MAX_IMAGES - images.length;
      const toAdd = fileArray.slice(0, remaining);

      const newImages: UploadedImage[] = toAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploading: false,
      }));

      setImages((prev) => [...prev, ...newImages]);
    },
    [images.length]
  );

  // 드래그 앤 드롭
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  // 파일 선택
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(e.target.files);
        e.target.value = ""; // 리셋
      }
    },
    [addFiles]
  );

  // 이미지 제거
  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const img = prev[index];
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // Firebase에 이미지 업로드 후 다음 페이지로
  const handleNext = async () => {
    if (images.length < MIN_IMAGES) return;

    setIsUploading(true);

    try {
      // 모든 이미지를 Firebase Storage에 업로드
      const uploadedUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        setImages((prev) =>
          prev.map((img, idx) =>
            idx === i ? { ...img, uploading: true } : img
          )
        );

        try {
          const url = await uploadImage(images[i].file, "monopage/create");
          uploadedUrls.push(url);

          setImages((prev) =>
            prev.map((img, idx) =>
              idx === i ? { ...img, uploading: false, url } : img
            )
          );
        } catch (error) {
          setImages((prev) =>
            prev.map((img, idx) =>
              idx === i
                ? { ...img, uploading: false, error: "업로드 실패" }
                : img
            )
          );
        }
      }

      if (uploadedUrls.length >= MIN_IMAGES) {
        // 세션에 업로드된 URL 저장
        sessionStorage.setItem(
          "monopage_create_images",
          JSON.stringify(uploadedUrls)
        );
        router.push("/create/analyzing");
      }
    } catch {
      alert("이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  const canProceed = images.length >= MIN_IMAGES && !isUploading;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
        <Link
          href="/create"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          돌아가기
        </Link>
        <span className="text-sm text-gray-400">1/4 단계</span>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <h1 className="text-2xl font-semibold mb-2">작품 이미지 업로드</h1>
        <p className="text-gray-500 mb-8">
          {MIN_IMAGES}~{MAX_IMAGES}장의 작품 이미지를 올려주세요.
          AI가 스타일을 분석해 최적의 디자인을 추천합니다.
        </p>

        {/* 드래그 앤 드롭 영역 */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
            ${
              isDragOver
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload
            size={40}
            className={`mx-auto mb-4 ${isDragOver ? "text-black" : "text-gray-300"}`}
          />
          <p className="text-lg font-medium mb-1">
            이미지를 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-sm text-gray-400">
            JPG, PNG, WebP &middot; 최대 {MAX_IMAGES}장
          </p>
        </div>

        {/* 업로드된 이미지 그리드 */}
        {images.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium">
                업로드된 이미지{" "}
                <span
                  className={`${images.length >= MIN_IMAGES ? "text-green-600" : "text-gray-400"}`}
                >
                  ({images.length}/{MAX_IMAGES})
                </span>
              </p>
              {images.length < MAX_IMAGES && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors"
                >
                  <ImagePlus size={14} />
                  더 추가
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square group">
                  <Image
                    src={img.preview}
                    alt={`작품 ${i + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes="120px"
                  />
                  {/* 업로드 중 */}
                  {img.uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {/* 에러 */}
                  {img.error && (
                    <div className="absolute inset-0 bg-red-500/50 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs">실패</span>
                    </div>
                  )}
                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            {images.length < MIN_IMAGES && (
              <p className="mt-4 text-sm text-gray-400">
                최소 {MIN_IMAGES}장이 필요합니다. (현재 {images.length}장)
              </p>
            )}
          </div>
        )}
      </main>

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-end">
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                업로드 중...
              </>
            ) : (
              <>
                다음
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
