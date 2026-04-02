import Link from 'next/link';

const FEATURED_ARTISTS = [
  {
    name: '김서윤',
    genre: '수채화 · 일러스트',
    description: '자연의 빛과 색을 담은 수채화 작업',
    color: 'bg-sky-100',
    accent: 'text-sky-600',
  },
  {
    name: '이준혁',
    genre: '디지털 아트',
    description: 'AI와 협업하는 미래지향적 디지털 아트',
    color: 'bg-violet-100',
    accent: 'text-violet-600',
  },
  {
    name: '박하늘',
    genre: '사진 · 영상',
    description: '도시의 순간을 포착하는 스트리트 포토',
    color: 'bg-amber-100',
    accent: 'text-amber-600',
  },
  {
    name: '최민지',
    genre: '도예 · 공예',
    description: '흙과 불로 빚어내는 일상의 아름다움',
    color: 'bg-rose-100',
    accent: 'text-rose-600',
  },
  {
    name: '정우진',
    genre: '그래픽 디자인',
    description: '브랜드 아이덴티티와 타이포그래피 전문',
    color: 'bg-emerald-100',
    accent: 'text-emerald-600',
  },
  {
    name: '한소율',
    genre: '설치미술',
    description: '공간과 빛을 활용한 몰입형 설치 작업',
    color: 'bg-indigo-100',
    accent: 'text-indigo-600',
  },
];

export default function TossGalleryPage() {
  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      {/* 헤더 */}
      <h2 className="mb-1 text-[22px] font-bold text-gray-900">아티스트 갤러리</h2>
      <p className="mb-6 text-[14px] text-gray-500">
        아트페이지로 만든 아티스트 사이트를 둘러보세요
      </p>

      {/* 아티스트 그리드 */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        {FEATURED_ARTISTS.map((artist) => (
          <div
            key={artist.name}
            className={`flex flex-col rounded-2xl ${artist.color} p-4`}
          >
            <div className="mb-3 flex h-20 items-center justify-center rounded-xl bg-white/60 text-3xl">
              🖼️
            </div>
            <p className="text-[14px] font-semibold text-gray-900">
              {artist.name}
            </p>
            <p className={`mt-0.5 text-[11px] font-medium ${artist.accent}`}>
              {artist.genre}
            </p>
            <p className="mt-1.5 text-[12px] leading-snug text-gray-600">
              {artist.description}
            </p>
          </div>
        ))}
      </div>

      {/* 하단 */}
      <div className="mt-auto space-y-3 pb-4">
        <Link
          href="/toss/create"
          className="flex w-full items-center justify-center rounded-xl bg-emerald-500 py-4 text-[16px] font-semibold text-white transition-colors active:bg-emerald-600"
        >
          나도 만들기
        </Link>
        <Link
          href="/toss"
          className="flex w-full items-center justify-center rounded-xl bg-gray-100 py-3.5 text-[15px] font-medium text-gray-600 transition-colors active:bg-gray-200"
        >
          돌아가기
        </Link>
      </div>
    </div>
  );
}
