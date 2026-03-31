"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Instagram } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";

export default function MediaPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(
          collection(db, "media_releases"), 
          orderBy("created_at", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(data);
      } catch (error) {
        console.error("Firebase fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* 통일된 페이지 헤더 */}
      <section className="pt-20 pb-12 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6">
          <h1 className="text-4xl font-serif font-light text-foreground">
            Media
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            북촌 아트 스페이스의 전시 소식과 보도자료를 확인하세요.
          </p>
        </div>
      </section>

      {/* Instagram Feed 섹션 - 메인 */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-light text-foreground">
              Instagram
            </h2>
            <a
              href="https://www.instagram.com/bukchonart/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Instagram size={18} />
              <span>@bukchonart</span>
            </a>
          </div>

          {/* Instagram 임베드 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 예시 Instagram 포스트 카드 */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <a
                key={i}
                href="https://www.instagram.com/bukchonart/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square bg-muted rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300"
              >
                {/* 이미지 플레이스홀더 */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Instagram size={48} className="text-muted-foreground opacity-20" />
                </div>
                
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Instagram size={32} className="mx-auto mb-2" />
                    <p className="text-sm">Instagram에서 보기</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Instagram 안내 */}
          <div className="mt-12 p-8 bg-background rounded-lg border border-border text-center">
            <Instagram size={40} className="mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-serif text-foreground mb-3">
              Instagram에서 더 많은 소식을 만나보세요
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              전시 오프닝, 작가 인터뷰, 갤러리 일상 등<br />
              다양한 콘텐츠를 Instagram에서 실시간으로 확인하실 수 있습니다.
            </p>
            <a
              href="https://www.instagram.com/bukchonart/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Instagram size={18} />
              <span>팔로우하기</span>
            </a>
          </div>
        </div>
      </section>

      {/* Press Release 섹션 */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-2xl font-serif font-light text-foreground mb-8">
            Press Release
          </h2>

          {loading ? (
            <div className="py-20 text-center text-gray-400">Loading media...</div>
          ) : items.length > 0 ? (
            <ul className="space-y-0">
              {items.map((item) => (
                <li key={item.id} className="group border-b border-border py-6 transition-colors hover:bg-muted/30">
                  <Link href={`/media/${item.id}`} className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-primary font-medium mb-1 block uppercase tracking-wider">
                        {item.press_name || "NEWS"}
                      </span>
                      <h3 className="text-lg md:text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm shrink-0">
                      <span>
                        {item.created_at?.toDate 
                          ? item.created_at.toDate().toLocaleDateString() 
                          : item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                      </span>
                      <ExternalLink size={14} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">등록된 보도자료가 없습니다.</p>
              <p className="text-sm text-muted-foreground/60 mt-2">
                최신 소식은 Instagram에서 확인하세요.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}