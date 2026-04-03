'use client';

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-context";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError("등록되지 않은 이메일이거나 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(57,255,20,0.1)]">
            <CheckCircle className="w-8 h-8 text-[#39FF14]" />
          </div>
          <h1 className="text-2xl font-black mb-2">메일을 확인하세요</h1>
          <p className="text-[#888] text-sm mb-8">
            <span className="text-white">{email}</span>으로
            <br />
            비밀번호 재설정 링크를 보냈습니다.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-xl bg-[#39FF14] px-8 py-3 text-sm font-bold text-black hover:opacity-90 transition-opacity"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-[#888] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          로그인으로
        </Link>

        <h1 className="text-3xl font-black mb-2">비밀번호 찾기</h1>
        <p className="text-[#888] text-sm mb-8">
          가입한 이메일을 입력하시면
          <br />
          비밀번호 재설정 링크를 보내드립니다.
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

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#39FF14] py-3 text-sm font-bold text-black hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "전송 중..." : "재설정 링크 보내기"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#888]">
          계정이 기억나셨나요?{" "}
          <Link href="/login" className="text-[#39FF14] hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
