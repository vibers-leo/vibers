'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface OgImageProps {
  url?: string;
  image?: string;
  color: string; // fallback 그라디언트 포인트 컬러
  alt: string;
}

export default function OgImage({ url, image, color, alt }: OgImageProps) {
  const [ogImgUrl, setOgImgUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!url) return;
    fetch(`/api/og?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((d) => { if (d.imageUrl) setOgImgUrl(d.imageUrl); })
      .catch(() => {});
  }, [url]);

  // url 있고 OG fetch 성공 → object-cover (가로형 꽉 채우기)
  if (url && !failed && ogImgUrl) {
    return (
      <Image
        src={ogImgUrl}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setFailed(true)}
        unoptimized
      />
    );
  }

  // url 없고 image 있으면 → object-contain (세로 포스터 대응)
  if (image) {
    return (
      <Image
        src={image}
        alt={alt}
        fill
        className="object-contain"
        unoptimized
      />
    );
  }

  // 둘 다 없거나 fetch 실패 → 컬러 그라디언트 fallback
  return (
    <div
      className="w-full h-full"
      style={{
        background: `linear-gradient(135deg, ${color}18 0%, ${color}06 100%)`,
      }}
    />
  );
}
