"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { logout } from "@/actions/authActions";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Firebase 클라이언트 로그아웃
      await signOut(auth);
      // 2. 서버 사이드 세션 쿠키 삭제 (Server Action)
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} className="hover:bg-gray-100">
      로그아웃
    </Button>
  );
}
