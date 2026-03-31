// src/app/(artists)/[slug]/shop/ShopClient.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ShoppingBag } from "lucide-react";
import type { TemplateConfig } from "@/lib/templates";

type Artwork = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string;
  is_sold: boolean;
};

export default function ShopClient({
  artworks,
  slug,
  config,
}: {
  artworks: Artwork[];
  slug: string;
  config: TemplateConfig;
}) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [buyerInfo, setBuyerInfo] = useState({ name: "", email: "", phone: "" });
  const [processing, setProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handlePurchase = async () => {
    if (!selectedArtwork || !buyerInfo.email) return;

    setProcessing(true);
    try {
      const res = await fetch("/api/payment/artwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artwork_id: selectedArtwork.id,
          site_slug: slug,
          buyer_email: buyerInfo.email,
          buyer_name: buyerInfo.name,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowConfirm(true);
        setBuyerInfo({ name: "", email: "", phone: "" });
      } else {
        alert(data.error || "결제 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      alert("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessing(false);
    }
  };

  const closeModal = () => {
    setSelectedArtwork(null);
    setBuyerInfo({ name: "", email: "", phone: "" });
    setShowConfirm(false);
  };

  const isArthyun = config.template === "arthyun";

  return (
    <div className={`min-h-screen ${isArthyun ? "bg-[#f5f0eb]" : "bg-white"}`}>
      {/* 페이지 헤더 */}
      <section
        className={`pt-32 pb-16 px-6 ${
          isArthyun ? "text-gray-800" : "text-gray-900"
        }`}
      >
        <div className="max-w-screen-xl mx-auto">
          <p className="text-xs font-mono tracking-widest text-gray-500 mb-4 uppercase">
            Shop
          </p>
          <h1
            className={`text-3xl md:text-5xl font-bold leading-tight ${
              isArthyun ? "font-heading" : "font-serif"
            }`}
          >
            작품 구매
          </h1>
          <p className="text-gray-500 mt-4 max-w-lg text-base leading-relaxed">
            작가의 원본 작품을 직접 소장하세요.
            각 작품은 유일한 원본이며, 구매 즉시 소유권이 이전됩니다.
          </p>
        </div>
      </section>

      {/* 작품 그리드 */}
      <section className="px-6 pb-32">
        <div className="max-w-screen-xl mx-auto">
          {artworks.length === 0 ? (
            <div className="text-center py-32 text-gray-400">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-xl mb-2">아직 판매 중인 작품이 없습니다</p>
              <p className="text-sm">곧 새로운 작품이 등록될 예정입니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="group cursor-pointer"
                  onClick={() => !artwork.is_sold && setSelectedArtwork(artwork)}
                >
                  {/* 이미지 */}
                  <div
                    className={`relative aspect-square overflow-hidden mb-4 ${
                      isArthyun
                        ? "rounded-none shadow-lg"
                        : "rounded-2xl"
                    } bg-gray-100`}
                  >
                    <Image
                      src={artwork.image_url}
                      alt={artwork.title}
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        artwork.is_sold
                          ? "grayscale opacity-60"
                          : "group-hover:scale-105"
                      }`}
                    />
                    {artwork.is_sold && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`px-6 py-2 bg-black/70 text-white text-sm font-medium tracking-widest uppercase ${
                            isArthyun ? "" : "rounded-full"
                          }`}
                        >
                          SOLD
                        </span>
                      </div>
                    )}
                  </div>
                  {/* 작품 정보 */}
                  <div>
                    <h3
                      className={`text-lg font-medium mb-1 ${
                        isArthyun ? "font-heading tracking-wide" : ""
                      }`}
                    >
                      {artwork.title}
                    </h3>
                    {artwork.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {artwork.description}
                      </p>
                    )}
                    <p className="text-lg font-bold">
                      {artwork.is_sold ? (
                        <span className="text-gray-400 line-through">
                          {formatPrice(artwork.price)}원
                        </span>
                      ) : (
                        <>{formatPrice(artwork.price)}원</>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 구매 모달 */}
      {selectedArtwork && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            className={`bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
              isArthyun ? "rounded-none" : "rounded-2xl"
            }`}
          >
            {showConfirm ? (
              /* 결제 완료 화면 */
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">구매 요청이 접수되었습니다</h3>
                <p className="text-gray-500 mb-6">
                  입력하신 이메일로 결제 안내를 보내드립니다.
                  <br />
                  확인 후 결제를 진행해주세요.
                </p>
                <button
                  onClick={closeModal}
                  className={`px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors ${
                    isArthyun ? "" : "rounded-full"
                  }`}
                >
                  확인
                </button>
              </div>
            ) : (
              /* 구매 정보 입력 폼 */
              <>
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-lg font-bold">구매하기</h2>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  {/* 작품 미리보기 */}
                  <div className="flex gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={selectedArtwork.image_url}
                        alt={selectedArtwork.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">{selectedArtwork.title}</h3>
                      {selectedArtwork.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {selectedArtwork.description}
                        </p>
                      )}
                      <p className="text-lg font-bold mt-2">
                        {formatPrice(selectedArtwork.price)}원
                      </p>
                    </div>
                  </div>

                  {/* 구매자 정보 */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이름
                      </label>
                      <input
                        type="text"
                        value={buyerInfo.name}
                        onChange={(e) =>
                          setBuyerInfo((p) => ({ ...p, name: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black outline-none text-sm"
                        placeholder="홍길동"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이메일 *
                      </label>
                      <input
                        type="email"
                        value={buyerInfo.email}
                        onChange={(e) =>
                          setBuyerInfo((p) => ({ ...p, email: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black outline-none text-sm"
                        placeholder="buyer@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        연락처
                      </label>
                      <input
                        type="tel"
                        value={buyerInfo.phone}
                        onChange={(e) =>
                          setBuyerInfo((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black/10 focus:border-black outline-none text-sm"
                        placeholder="010-1234-5678"
                      />
                    </div>
                  </div>

                  {/* 안내 문구 */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
                    <p>- 구매 요청 후 결제 안내 이메일이 발송됩니다.</p>
                    <p>- 결제 완료 후 작품 배송이 시작됩니다.</p>
                    <p>- 문의사항은 작가에게 직접 연락해주세요.</p>
                  </div>

                  {/* 구매 버튼 */}
                  <button
                    onClick={handlePurchase}
                    disabled={!buyerInfo.email || processing}
                    className={`mt-6 w-full py-4 bg-black text-white font-medium text-base hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      isArthyun ? "" : "rounded-full"
                    }`}
                  >
                    {processing
                      ? "처리 중..."
                      : `${formatPrice(selectedArtwork.price)}원 구매하기`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
