"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import ArchiveClient from "@/components/ArchiveClient";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export default function ArchivePage() {
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Fix: Role check will be needed later

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(
          collection(db, "exhibitions"), 
          where("is_active", "==", true),
          orderBy("start_date", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setExhibitions(data);
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
          <div className="flex justify-between items-end">
            <h1 className="text-4xl font-serif font-light text-foreground">
              Exhibition Archive
            </h1>

            {/* 관리자 전용 버튼 */}
            {isAdmin && (
              <Button
                asChild
                className="bg-primary text-white hover:bg-primary/90 gap-2"
              >
                <Link href="/admin/exhibition/write">
                  <Plus size={16} /> 전시 등록
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 전시 목록 */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-6">
          {loading ? (
            <div className="py-20 text-center text-gray-400 font-light">Loading archive...</div>
          ) : (
            <ArchiveClient initialData={exhibitions} />
          )}
        </div>
      </section>
    </div>
  );
}
