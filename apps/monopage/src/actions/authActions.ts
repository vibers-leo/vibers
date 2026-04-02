// src/actions/authActions.ts
"use server";

import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const cookieStore = await cookies();

  try {
    // Firebase 로그인 시도
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      // 세션 유지를 위한 쿠키 설정 (간단한 구현을 위해 uid 저장)
      // 실제 운영 환경에서는 Firebase Admin SDK를 사용하여 sessionCookie를 생성하는 것이 권장됩니다.
      cookieStore.set("session", user.uid, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1주일
      });
    }
  } catch (error: any) {
    console.error("Login Error:", error.code, error.message);
    return { error: "로그인 정보가 올바르지 않거나 시스템 오류가 발생했습니다." };
  }

  redirect("/admin/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  // Firebase 클라이언트 사이드 로그아웃은 컴포넌트에서 수행하거나 
  // 여기서는 쿠키만 삭제하여 미들웨어 접근을 막습니다.
  redirect("/login");
}
