'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      router.push("/");
    } catch {
      setError("Google 로그인에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#888] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          홈으로
        </Link>

        <h1 className="text-3xl font-black mb-2">로그인</h1>
        <p className="text-[#888] text-sm mb-8">
          계발자들에 오신 것을 환영합니다
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#666] outline-none focus:border-[#39FF14] transition-colors"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#666] outline-none focus:border-[#39FF14] transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#39FF14] py-3 text-sm font-bold text-black hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-[#666]">또는</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          Google로 계속하기
        </button>

        <div className="mt-6 flex flex-col gap-2 text-center text-sm text-[#888]">
          <Link href="/forgot-password" className="hover:text-[#39FF14] transition-colors">
            비밀번호를 잊으셨나요?
          </Link>
          <p>
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-[#39FF14] hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
