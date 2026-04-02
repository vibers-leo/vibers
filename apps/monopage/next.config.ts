import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      // NCP VM 이미지 서버
      {
        protocol: 'https',
        hostname: 'storage.vibers.co.kr',
      },
      // NCP Object Storage (wero-bucket)
      {
        protocol: 'https',
        hostname: '*.kr.object.ncloudstorage.com',
      },
      {
        protocol: 'https',
        hostname: 'bk-art-space.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
