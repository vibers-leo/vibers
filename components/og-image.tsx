'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface OgImageProps {
  url: string;
  color: string; // fallback 그라디언트 포인트 컬러
  alt: string;
}

export default function OgImage({ url, color, alt }: OgImageProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`/api/og?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((d) => { if (d.imageUrl) setImgUrl(d.imageUrl); })
      .catch(() => {});
  }, [url]);

  if (failed || !imgUrl) {
    // fallback: 컬러 그라디언트
    return (
      <div
        className="w-full h-full"
        style={{
          background: `linear-gradient(135deg, ${color}18 0%, ${color}06 100%)`,
        }}
      />
    );
  }

  return (
    <Image
      src={imgUrl}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}
