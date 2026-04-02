"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setError("등록되지 않은 이메일입니다.");
      } else if (err.code === "auth/invalid-email") {
        setError("올바른 이메일 주소를 입력해주세요.");
      } else if (err.code === "auth/too-many-requests") {
        setError("너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError("오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 animate-fade-in">
      <div className="w-full max-w-sm">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group">
            <div className="w-12 h-12 mx-auto bg-foreground text-background rounded-xl flex items-center justify-center font-serif text-2xl mb-4 group-hover:rotate-6 transition-transform">
              A
            </div>
          </Link>
          <h1 className="text-2xl font-serif font-medium mb-2">
            비밀번호 재설정
          </h1>
          <p className="text-sm text-muted-foreground">
            가입한 이메일을 입력하시면
            <br />
            비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>

        {sent ? (
          /* 전송 완료 */
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="text-green-500" size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                재설정 링크를 전송했습니다.
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{email}</span>
                으로 보낸 메일을 확인해주세요.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                메일이 보이지 않으면 스팸 폴더를 확인해주세요.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-foreground font-medium hover:underline"
            >
              <ArrowLeft size={16} />
              로그인으로 돌아가기
            </Link>
          </div>
        ) : (
          /* 이메일 입력 폼 */
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border rounded-lg focus:outline-none focus:border-foreground focus:bg-background transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-destructive text-sm text-center font-medium bg-destructive/10 py-2 rounded">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <span>재설정 링크 보내기</span>
                )}
              </button>
            </form>

            {/* 푸터 */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1 text-foreground font-medium hover:underline"
              >
                <ArrowLeft size={14} />
                로그인으로 돌아가기
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
