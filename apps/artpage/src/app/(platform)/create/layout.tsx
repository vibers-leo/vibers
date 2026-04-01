import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "사이트 만들기 | 모노페이지",
  description: "이미지만 올리면 AI가 홈페이지를 만들어드립니다",
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-platform min-h-screen bg-white text-black">
      {children}
    </div>
  );
}
