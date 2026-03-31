"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // 👈 여기가 중요합니다! (lucide-react 아님)
import { X } from "lucide-react"; // 닫기 버튼용 아이콘
import { Button } from "@/components/ui/button";

type SortType = "date" | "name";

export default function ArchiveClient({ initialData }: { initialData: any[] }) {
  // 모달 상태 관리
  const [selectedExhibition, setSelectedExhibition] = useState<any>(null);
  const [sortType, setSortType] = useState<SortType>("date");
  const [exhibitions, setExhibitions] = useState(initialData);

  // 정렬 함수
  useEffect(() => {
    const sorted = [...initialData].sort((a, b) => {
      if (sortType === "date") {
        // 최신순 (start_date 기준 내림차순)
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      } else {
        // 가나다순 (title 기준 오름차순)
        return a.title.localeCompare(b.title, 'ko-KR');
      }
    });
    setExhibitions(sorted);
  }, [sortType, initialData]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedExhibition) {
        setSelectedExhibition(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [selectedExhibition]);

  return (
    <>
      {/* 정렬 버튼 */}
      <div className="flex justify-end gap-2 mb-6">
        <Button
          onClick={() => setSortType("date")}
          variant={sortType === "date" ? "default" : "outline"}
          size="sm"
          className={sortType === "date" ? "bg-black text-white" : ""}
        >
          최신순
        </Button>
        <Button
          onClick={() => setSortType("name")}
          variant={sortType === "name" ? "default" : "outline"}
          size="sm"
          className={sortType === "name" ? "bg-black text-white" : ""}
        >
          가나다순
        </Button>
      </div>

      {/* 1. 전시 리스트 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {exhibitions.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer"
            onClick={() => setSelectedExhibition(item)}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4 shadow-sm border border-gray-100">
              {/* 포스터 이미지 */}
              {item.poster_url ? (
                <Image
                  src={item.poster_url}
                  alt={item.title}
                  fill
                  className="object-contain group-hover:scale-100 transition duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                  NO IMAGE
                </div>
              )}

              {/* 호버 시 VIEW 버튼 */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white border border-white px-6 py-2 text-xs tracking-[0.2em] font-light hover:bg-white hover:text-black transition">
                  VIEW
                </span>
              </div>
            </div>

            <h3 className="text-base font-serif font-bold truncate text-gray-900 group-hover:text-blue-600 transition">
              {item.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
              {item.artist || item.subtitle}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              {item.start_date} ~ {item.end_date}
            </p>
          </div>
        ))}
      </div>

      {/* 2. 전시 정보 모달 (클릭 시 뜸) */}
      {selectedExhibition && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          {/* 배경 클릭 시 닫기 */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedExhibition(null)}
          />

          {/* 모달 크기 확대: max-w-4xl → max-w-6xl, max-h-[90vh] → max-h-[95vh] */}
          <div className="bg-white max-w-6xl w-full max-h-[95vh] overflow-y-auto relative shadow-2xl animate-fade-in-up">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setSelectedExhibition(null)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition z-10"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-5">
              {/* 왼쪽: 포스터 이미지 - 2/5 */}
              <div className="relative bg-white p-4 min-h-[500px] md:W-full md:col-span-2">
                {selectedExhibition.poster_url && (
                  <Image
                    src={selectedExhibition.poster_url}
                    alt="Poster"
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              {/* 오른쪽: 상세 내용 - 3/5 */}
              <div className="p-8 md:p-12 space-y-8 md:col-span-3">
                <div>
                  <p className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">
                    Exhibition
                  </p>
                  <h2 className="text-3xl font-serif font-bold mb-2">
                    {selectedExhibition.title}
                  </h2>
                  <p className="text-lg text-gray-600 font-serif italic mb-4">
                    {selectedExhibition.artist || selectedExhibition.subtitle}
                  </p>
                  <p className="text-xs text-gray-400 border-t border-gray-100 pt-4">
                    {selectedExhibition.start_date} ~{" "}
                    {selectedExhibition.end_date}
                  </p>
                </div>

                {/* BlockNote 이미지 표시를 위한 스타일 개선 */}
                <div
                  className="text-sm text-gray-600 leading-loose text-justify max-h-[400px] overflow-y-auto pr-2 custom-scrollbar prose prose-sm max-w-none"
                  style={{
                    wordBreak: "break-word"
                  }}
                  // HTML 태그가 포함된 에디터 내용을 안전하게 렌더링
                  dangerouslySetInnerHTML={{
                    __html: selectedExhibition.description || "",
                  }}
                />

                <button
                  onClick={() => setSelectedExhibition(null)}
                  className="w-full border border-black py-3 text-xs tracking-widest hover:bg-black hover:text-white transition"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
