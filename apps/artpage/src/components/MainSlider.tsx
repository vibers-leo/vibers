"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function MainSlider({ exhibitions }: { exhibitions: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? exhibitions.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === exhibitions.length - 1 ? 0 : prev + 1));
  };

  const current = exhibitions[currentIndex];

  return (
    <div className="relative w-full h-full flex items-center justify-center z-10">
      {/* 화살표 버튼 */}
      <button onClick={prevSlide} className="absolute left-4 md:left-10 z-20 text-white/50 hover:text-white transition">
        <ChevronLeft size={40} strokeWidth={1} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 md:right-10 z-20 text-white/50 hover:text-white transition">
        <ChevronRight size={40} strokeWidth={1} />
      </button>

      {/* 컨텐츠 영역 */}
      <div className="flex flex-col items-center text-center max-w-4xl px-6 animate-fade-in">
        
        {/* 1. 포스터 이미지 (흰 박스 문제 해결) */}
        {/* 이미지가 있을 때만 렌더링하며, 크기를 명시적으로 잡아줍니다. */}
        {current.poster_url && (
          <div className="relative w-[200px] h-[280px] md:w-[300px] md:h-[400px] mb-8">
            <Image
              src={current.poster_url}
              alt={current.title}
              fill
              className="object-contain drop-shadow-2xl" // cover 대신 contain 권장
              priority
            />
          </div>
        )}

        {/* 텍스트 정보 */}
        <p className="text-sm md:text-base text-gray-200 font-medium tracking-widest mb-2">
          {current.artist}
        </p>
        <h2 className="text-3xl md:text-5xl font-serif text-white font-bold mb-6 drop-shadow-md">
          {current.title}
        </h2>

        {/* 2. 설명글 태그 문제 해결 (<p> 제거) */}
        {/* line-clamp-3: 3줄까지만 보이고 ... 처리 */}
        <div 
          className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl line-clamp-3 mb-8 prose prose-invert prose-p:my-0"
          dangerouslySetInnerHTML={{ __html: current.description || "" }}
        />

        {/* 자세히 보기 버튼 */}
        <Link href={`/archive`}>
           <button className="border border-white/30 text-white px-8 py-3 text-xs tracking-[0.2em] hover:bg-white hover:text-black transition uppercase">
             View Exhibition
           </button>
        </Link>
      </div>
    </div>
  );
}