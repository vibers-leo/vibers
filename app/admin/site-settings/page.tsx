'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { RefreshCw, Globe, Eye, ExternalLink } from 'lucide-react';

export default function SiteSettingsPage() {
  const [liveMeta, setLiveMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchMeta = async () => {
    setLoading(true);
    try {
      // faneasy의 site-meta API를 활용하거나, 직접 크롤링
      const res = await fetch(`/api/site-meta?url=${encodeURIComponent('https://semophone.co.kr')}`);
      const data = await res.json();
      if (data.success) setLiveMeta(data.meta);
      else throw new Error(data.error);
    } catch (e: any) {
      // 직접 파싱 시도
      try {
        const res = await fetch('/api/site-meta?url=' + encodeURIComponent('https://semophone.co.kr'));
        const data = await res.json();
        if (data.success) setLiveMeta(data.meta);
      } catch {
        alert('불러오기 실패: ' + e.message);
      }
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">사이트 설정</h1>

        {/* 기본 정보 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">기본 정보</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-400">도메인</p>
              <p className="text-sm font-medium text-gray-900">semophone.co.kr</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">운영 회사</p>
              <p className="text-sm font-medium text-gray-900">주식회사 승승장구</p>
            </div>
          </div>
        </div>

        {/* 실제 사이트 현황 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">
              실제 사이트 현황
              <span className="ml-2 text-[10px] font-normal text-blue-500 normal-case">라이브 체크</span>
            </h3>
            <button
              onClick={fetchMeta}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '체크 중...' : '현재 상태 불러오기'}
            </button>
          </div>

          {liveMeta ? (
            <div className="space-y-4">
              {/* OG 미리보기 */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                {liveMeta.ogImage ? (
                  <img src={liveMeta.ogImage} alt="OG" className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <p className="text-xs text-gray-400">OG 이미지 없음</p>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs text-gray-400">semophone.co.kr</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{liveMeta.ogTitle || liveMeta.title || '(타이틀 없음)'}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{liveMeta.ogDescription || liveMeta.description || '(설명 없음)'}</p>
                </div>
              </div>

              {/* 체크 결과 */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { ok: !!liveMeta.ogTitle, label: 'OG 타이틀', value: liveMeta.ogTitle },
                  { ok: !!liveMeta.ogDescription, label: 'OG 설명', value: liveMeta.ogDescription },
                  { ok: !!liveMeta.ogImage, label: 'OG 이미지', value: liveMeta.ogImage ? '설정됨' : '' },
                  { ok: !!liveMeta.naverVerification, label: '네이버 인증', value: liveMeta.naverVerification || '' },
                  { ok: !!liveMeta.description, label: 'Meta Description', value: liveMeta.description },
                  { ok: !!liveMeta.canonical, label: 'Canonical URL', value: liveMeta.canonical },
                ].map((item) => (
                  <div key={item.label} className={`p-3 rounded-xl border ${item.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className={`text-xs font-medium ${item.ok ? 'text-green-700' : 'text-red-600'}`}>
                      {item.ok ? '✓' : '✗'} {item.label}
                    </div>
                    {item.value && (
                      <p className="text-[10px] text-gray-500 mt-1 truncate">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-xs text-gray-400">&quot;현재 상태 불러오기&quot; 버튼으로 사이트의 OG/SEO 상태를 확인하세요.</p>
            </div>
          )}
        </div>

        {/* 외부 도구 링크 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">SEO 도구</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: '네이버 서치어드바이저', url: 'https://searchadvisor.naver.com' },
              { name: '구글 서치콘솔', url: 'https://search.google.com/search-console' },
              { name: 'OG 미리보기 테스트', url: 'https://www.opengraph.xyz/url/https://semophone.co.kr' },
              { name: 'Google PageSpeed', url: 'https://pagespeed.web.dev/analysis?url=https://semophone.co.kr' },
            ].map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-colors text-sm text-gray-700"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
                {tool.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
