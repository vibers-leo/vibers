"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// 전시 관리 버튼
export function AdminExhibitionButton() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth) return; // Firebase 미설정 시 무시
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (!isAdmin) return null;

  return (
    <Button asChild className="bg-black text-white hover:bg-gray-800 gap-2">
      <Link href="/admin/exhibition">
        <Plus size={16} /> 전시 등록 및 관리
      </Link>
    </Button>
  );
}

// 미디어 관리 버튼
export function AdminMediaButton() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth) return; // Firebase 미설정 시 무시
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (!isAdmin) return null;

  return (
    <Button asChild className="bg-black text-white hover:bg-gray-800 gap-2">
      <Link href="/admin/media">
        <Plus size={16} /> 보도자료 등록 및 관리
      </Link>
    </Button>
  );
}
