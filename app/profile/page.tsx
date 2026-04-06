'use client';

import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, LogOut, Loader2, Link2, Link2Off } from "lucide-react";
import type { Provider } from "@/lib/permissions";
import { PROVIDER_LABELS } from "@/lib/permissions";

const PROVIDER_COLORS: Record<Provider, string> = {
  google: 'border-blue-500/30 bg-blue-500/10',
  naver: 'border-green-500/30 bg-green-500/10',
  kakao: 'border-yellow-500/30 bg-yellow-500/10',
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: '최고관리자',
  owner: '소유자',
  admin: '관리자',
  business: '사업자회원',
  member: '일반회원',
};

type SocialAccount = { provider: Provider; created_at: string };

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [fetching, setFetching] = useState(true);
  const [unlinking, setUnlinking] = useState<Provider | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/auth/social')
      .then(r => r.json())
      .then(d => setAccounts(d.accounts ?? []))
      .finally(() => setFetching(false));
  }, [user]);

  const handleUnlink = async (provider: Provider) => {
    setUnlinking(provider);
    setMessage(null);
    const res = await fetch('/api/auth/social', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    });
    const data = await res.json();
    if (data.ok) {
      setAccounts(prev => prev.filter(a => a.provider !== provider));
      setMessage({ type: 'ok', text: `${PROVIDER_LABELS[provider]} 연동이 해제되었습니다.` });
    } else {
      setMessage({ type: 'err', text: data.error ?? '해제에 실패했습니다.' });
    }
    setUnlinking(null);
  };

  const handleLink = (provider: Provider) => {
    window.location.href = `/api/auth/${provider}?redirect=/profile`;
  };

  const connectedProviders = new Set(accounts.map(a => a.provider));
  const allProviders: Provider[] = ['google', 'naver', 'kakao'];

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-black mb-8">프로필 설정</h1>

        {/* 기본 정보 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#39FF14]/20 flex items-center justify-center">
                <User className="w-8 h-8 text-[#39FF14]" />
              </div>
            )}
            <div>
              <p className="font-bold text-lg">{user.name ?? '이름 없음'}</p>
              <p className="text-sm text-white/50">{user.email}</p>
              <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full bg-[#39FF14]/10 text-[#39FF14] font-medium">
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
          </div>
        </div>

        {/* 소셜 계정 연동 */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-base font-bold mb-4">소셜 로그인 연동</h2>

          {message && (
            <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${
              message.type === 'ok'
                ? 'border border-green-500/30 bg-green-500/10 text-green-400'
                : 'border border-red-500/30 bg-red-500/10 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {fetching ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-white/40" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allProviders.map(provider => {
                const connected = connectedProviders.has(provider);
                const account = accounts.find(a => a.provider === provider);
                return (
                  <div key={provider} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${PROVIDER_COLORS[provider]}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{PROVIDER_LABELS[provider]}</span>
                      {connected && (
                        <span className="text-xs text-white/30">
                          {new Date(account!.created_at).toLocaleDateString('ko-KR')} 연동
                        </span>
                      )}
                    </div>
                    {connected ? (
                      <button
                        onClick={() => handleUnlink(provider)}
                        disabled={unlinking === provider}
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        {unlinking === provider
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Link2Off className="w-3.5 h-3.5" />
                        }
                        연동 해제
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLink(provider)}
                        className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        연동하기
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-white/40 hover:text-white hover:border-white/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </div>
  );
}
