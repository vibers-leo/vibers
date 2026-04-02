'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error('비밀번호 재설정 오류:', err);
      if (err.code === 'auth/user-not-found') {
        setError('등록되지 않은 이메일입니다.');
      } else if (err.code === 'auth/invalid-email') {
        setError('올바른 이메일 주소를 입력해주세요.');
      } else {
        setError('비밀번호 재설정 이메일 발송에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-medium p-8">
        <Image
          src="/images/logo/기본로고.png"
          alt="세모폰"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-black text-center mb-6">비밀번호 찾기</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
              비밀번호 재설정 이메일을 발송했습니다. 이메일을 확인해주세요.
            </div>
            <Link
              href="/admin/login"
              className="inline-block w-full bg-brand text-dark font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors text-center"
            >
              로그인으로 돌아가기
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 text-center mb-6">
              가입하신 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="admin@semophone.co.kr"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-dark font-bold py-3 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '발송 중...' : '재설정 이메일 발송'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/admin/login"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                로그인으로 돌아가기
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
