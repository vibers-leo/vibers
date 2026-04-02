'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const { signup, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      await signup(email, password);
      router.push("/");
    } catch {
      setError("회원가입에 실패했습니다. 이미 등록된 이메일일 수 있습니다.");
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

        <h1 className="text-3xl font-black mb-2">회원가입</h1>
        <p className="text-[#888] text-sm mb-8">
          계발자들과 함께 시작하세요
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
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#666] outline-none focus:border-[#39FF14] transition-colors"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-[#666] outline-none focus:border-[#39FF14] transition-colors"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#39FF14] py-3 text-sm font-bold text-black hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "가입 중..." : "회원가입"}
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

        <p className="mt-6 text-center text-sm text-[#888]">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-[#39FF14] hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
