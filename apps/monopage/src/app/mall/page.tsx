"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function MallPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, "products"), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* 통일된 페이지 헤더 */}
      <section className="pt-20 pb-12 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-4xl font-serif font-light text-foreground">
            Art Shop
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            갤러리 전시 작품의 포스터, 아트 굿즈, 도서 등을 만나보세요.
          </p>
        </div>
      </section>

      {/* 상품 목록 */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/mall/${product.id}`}
                className="group cursor-pointer"
              >
                {/* 상품 이미지 */}
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-muted border border-border">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">NO IMAGE</div>
                  )}
                  {/* 카테고리 뱃지 */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-medium rounded-full border border-border">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* 상품 정보 */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">{product.artist}</p>
                  <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-lg font-serif text-foreground">
                    ₩{product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Coming Soon 안내 */}
          <div className="mt-20 p-12 bg-muted/30 rounded-lg text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-serif text-foreground mb-4">
              온라인 스토어 준비 중
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              현재 온라인 구매 시스템을 준비하고 있습니다.<br />
              상품 문의는 갤러리로 직접 연락 주시기 바랍니다.
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <a
                href="tel:02-1234-5678"
                className="px-6 py-2 border border-border rounded-md hover:border-primary hover:text-primary transition-colors text-sm"
              >
                전화 문의
              </a>
              <a
                href="/contact"
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
              >
                문의하기
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
