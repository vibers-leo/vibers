'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Upload, CheckCircle2, AlertCircle, Monitor, Smartphone,
  Globe, Image as ImageIcon, Wand2, Camera, Loader2, RefreshCw
} from 'lucide-react';
import { uploadFile } from '@vibers/storage/client';

interface IconData {
  favicon?: string;
  appleTouchIcon?: string;
  androidIcon512?: string;
  ogImage?: string;
}

/* ── Canvas 리사이즈 ── */
function resizeImageBlob(source: string | File, w: number, h: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const url = source instanceof File ? URL.createObjectURL(source) : source;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      // 비율 유지 center-crop
      const scale = Math.max(w / img.width, h / img.height);
      const sw = w / scale, sh = h / scale;
      const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      if (source instanceof File) URL.revokeObjectURL(url);
      canvas.toBlob(
        blob => blob
          ? resolve(new File([blob], `icon_${w}x${h}_${Date.now()}.png`, { type: 'image/png' }))
          : reject(new Error('변환 실패')),
        'image/png', 0.95
      );
    };
    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.src = url;
  });
}

/* ── NCP 업로드 래퍼 ── */
async function uploadIcon(source: string | File, w: number, h: number): Promise<string> {
  const file = await resizeImageBlob(source, w, h);
  return uploadFile(file, 'vibers-home', 'images');
}

/* ── OG 이미지 생성 (Microlink 스크린샷) ── */
async function captureHeroOg(siteUrl: string): Promise<string> {
  const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(siteUrl)}&screenshot=true&waitFor=1000&viewport.width=1200&viewport.height=630`;
  const res = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
  const data = await res.json();
  if (data.status !== 'success' || !data.data?.screenshot?.url) {
    throw new Error('스크린샷 생성 실패');
  }
  const screenshotUrl: string = data.data.screenshot.url;
  // 스크린샷을 1200×630으로 리사이즈 후 NCP 업로드
  const file = await resizeImageBlob(screenshotUrl, 1200, 630);
  return uploadFile(file, 'vibers-home', 'images');
}

/* ── 저장 헬퍼 ── */
async function saveIcons(patch: Partial<IconData>) {
  await fetch('/api/admin/icons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

/* ══════════════════════════════════════════
   자동생성 패널
══════════════════════════════════════════ */
interface AutoGeneratePanelProps {
  icons: IconData;
  onGenerated: (data: Partial<IconData>) => void;
  siteUrl?: string;
}

function AutoGeneratePanel({ icons, onGenerated, siteUrl = 'https://vibers.co.kr' }: AutoGeneratePanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [generating, setGenerating] = useState(false);
  const [ogLoading, setOgLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleLogo = (file: File) => {
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setDone(false);
    setError('');
  };

  const generateAllFromLogo = async () => {
    if (!logoFile) return;
    setGenerating(true); setError(''); setDone(false);
    try {
      const result: Partial<IconData> = {};

      setProgress('파비콘 생성 중 (32×32)...');
      result.favicon = await uploadIcon(logoFile, 32, 32);

      setProgress('Apple Touch Icon 생성 중 (180×180)...');
      result.appleTouchIcon = await uploadIcon(logoFile, 180, 180);

      setProgress('앱 아이콘 생성 중 (512×512)...');
      result.androidIcon512 = await uploadIcon(logoFile, 512, 512);

      setProgress('저장 중...');
      await saveIcons(result);
      onGenerated(result);
      setDone(true);
      setProgress('');
    } catch (e: any) {
      setError(e.message ?? '생성 실패');
    } finally {
      setGenerating(false);
    }
  };

  const generateOg = async () => {
    setOgLoading(true); setError('');
    try {
      const url = await captureHeroOg(siteUrl);
      await saveIcons({ ogImage: url });
      onGenerated({ ogImage: url });
    } catch (e: any) {
      setError(`OG: ${e.message ?? '캡처 실패'}`);
    } finally {
      setOgLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-violet-50/60 to-indigo-50/40 dark:from-violet-950/20 dark:to-indigo-950/10 border border-violet-200 dark:border-violet-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
          <Wand2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--admin-text)]">자동 생성</p>
          <p className="text-xs text-[var(--admin-text-muted)]">로고 1장으로 파비콘·앱아이콘 전부 자동 제작</p>
        </div>
      </div>

      {/* 로고 업로드 */}
      <div className="flex gap-3 items-center">
        <div
          onClick={() => inputRef.current?.click()}
          className="w-20 h-20 rounded-xl border-2 border-dashed border-violet-300 dark:border-violet-700 flex items-center justify-center cursor-pointer hover:border-violet-500 transition-colors overflow-hidden shrink-0 bg-white dark:bg-zinc-900"
        >
          {logoPreview
            ? <img src={logoPreview} className="w-full h-full object-contain p-1" alt="logo" />
            : <Upload className="w-6 h-6 text-violet-400" />}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/svg+xml,image/jpeg,image/webp"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleLogo(f); e.target.value = ''; }}
        />

        <div className="flex-1 space-y-2">
          <p className="text-xs text-[var(--admin-text-muted)]">
            로고를 업로드하면 아래 3가지를 자동 생성합니다<br />
            <span className="font-medium text-violet-600 dark:text-violet-400">파비콘 32×32 · iOS 180×180 · Android 512×512</span>
          </p>
          <button
            onClick={generateAllFromLogo}
            disabled={!logoFile || generating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors"
          >
            {generating
              ? <><Loader2 className="w-3 h-3 animate-spin" />{progress}</>
              : <><Wand2 className="w-3 h-3" />전부 자동생성</>}
          </button>
          {done && (
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 3종 아이콘 생성 완료!
            </p>
          )}
        </div>
      </div>

      {/* OG 히어로 캡처 */}
      <div className="border-t border-violet-200 dark:border-violet-800 pt-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[var(--admin-text)]">
            <Camera className="w-3.5 h-3.5 inline mr-1 text-violet-500" />
            OG 이미지 — 히어로 섹션 자동 캡처
          </p>
          <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">
            {siteUrl} 히어로를 1200×630으로 캡처해 적용
          </p>
        </div>
        <button
          onClick={generateOg}
          disabled={ogLoading}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition-colors"
        >
          {ogLoading
            ? <><Loader2 className="w-3 h-3 animate-spin" />캡처 중...</>
            : <><Camera className="w-3 h-3" />지금 캡처</>}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   단일 아이콘 업로더
══════════════════════════════════════════ */
interface IconSpec {
  key: keyof IconData;
  label: string;
  desc: string;
  sizeLabel: string;
  optimal: string;
  icon: React.ReactNode;
  accept: string;
  w: number;
  h: number;
}

const ICON_SPECS: IconSpec[] = [
  {
    key: 'favicon', label: '파비콘 (브라우저 탭)', desc: '크롬/사파리 탭, 북마크바에 표시',
    sizeLabel: '32×32', optimal: '32×32 PNG 권장',
    icon: <Monitor className="w-4 h-4" />, accept: 'image/png,image/x-icon', w: 32, h: 32,
  },
  {
    key: 'appleTouchIcon', label: 'Apple Touch Icon (iOS)', desc: 'iPhone/iPad 홈화면 아이콘',
    sizeLabel: '180×180', optimal: '180×180 PNG 필수',
    icon: <Smartphone className="w-4 h-4" />, accept: 'image/png', w: 180, h: 180,
  },
  {
    key: 'androidIcon512', label: '앱 아이콘 (Android/PWA)', desc: '안드로이드 홈화면, PWA, 스플래시',
    sizeLabel: '512×512', optimal: '512×512 PNG 필수',
    icon: <Globe className="w-4 h-4" />, accept: 'image/png', w: 512, h: 512,
  },
  {
    key: 'ogImage', label: 'OG 이미지 (SNS 공유)', desc: '카카오·트위터·페이스북 공유 미리보기',
    sizeLabel: '1200×630', optimal: '1200×630 PNG/JPG',
    icon: <ImageIcon className="w-4 h-4" />, accept: 'image/png,image/jpeg', w: 1200, h: 630,
  },
];

function SingleIconUploader({ spec, currentUrl, onUploaded }: {
  spec: IconSpec; currentUrl?: string; onUploaded: (key: keyof IconData, url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentUrl ?? '');

  useEffect(() => { setPreview(currentUrl ?? ''); }, [currentUrl]);

  const handleFile = async (file: File) => {
    setError(''); setUploading(true);
    try {
      const url = await uploadIcon(file, spec.w, spec.h);
      setPreview(url);
      onUploaded(spec.key, url);
    } catch (e: any) {
      setError(e.message ?? '업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl p-4 flex gap-4 items-start">
      {/* 미리보기 */}
      <div className="shrink-0 flex flex-col items-center gap-1">
        {spec.key === 'favicon' ? (
          <>
            <div className="w-44 rounded-t-lg bg-zinc-200 dark:bg-zinc-700 px-3 py-1.5 flex items-center gap-2 border border-b-0 border-zinc-300 dark:border-zinc-600 shadow-sm">
              {preview
                ? <img src={preview} alt="" className="w-4 h-4 object-contain rounded-sm" />
                : <div className="w-4 h-4 rounded-sm bg-zinc-400/40" />}
              <span className="text-[11px] text-zinc-500 truncate">vibers.co.kr</span>
            </div>
            <div className="w-44 h-1.5 rounded-b-sm bg-zinc-300 dark:bg-zinc-600" />
          </>
        ) : spec.key === 'ogImage' ? (
          <div className="w-44 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="aspect-[1200/630] bg-zinc-100 dark:bg-zinc-800">
              {preview
                ? <img src={preview} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">1200×630</div>}
            </div>
            <div className="p-2 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-700">
              <p className="text-[10px] text-zinc-400 truncate">vibers.co.kr</p>
            </div>
          </div>
        ) : (
          <div className={`overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-md bg-zinc-100 dark:bg-zinc-800 ${
            spec.key === 'appleTouchIcon' ? 'w-14 h-14 rounded-[12px]' : 'w-14 h-14 rounded-2xl'
          }`}>
            {preview
              ? <img src={preview} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full" />}
          </div>
        )}
      </div>

      {/* 정보 + 업로드 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-semibold text-[var(--admin-text)] flex items-center gap-1.5">
              <span className="text-[var(--admin-accent)]">{spec.icon}</span>{spec.label}
            </p>
            <p className="text-xs text-[var(--admin-text-muted)]">{spec.desc}</p>
          </div>
          <span className="text-[10px] font-bold text-[var(--admin-accent)] bg-[var(--admin-accent)]/10 px-2 py-0.5 rounded-full shrink-0">
            {spec.sizeLabel}
          </span>
        </div>

        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          className="border border-dashed border-[var(--admin-border)] hover:border-[var(--admin-accent)] rounded-lg p-3 cursor-pointer transition-colors text-center"
        >
          {uploading
            ? <div className="flex items-center justify-center gap-2 text-xs text-[var(--admin-text-muted)]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />리사이즈 & 업로드 중...
              </div>
            : <p className="text-xs text-[var(--admin-text-muted)]">
                클릭 또는 드래그 · <span className="opacity-60">{spec.optimal}</span>
              </p>}
        </div>
        <input ref={inputRef} type="file" accept={spec.accept} className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />

        {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
        {preview && !error && !uploading && <p className="mt-1 text-xs text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />적용됨</p>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   메인 컴포넌트
══════════════════════════════════════════ */
export default function IconManager() {
  const [icons, setIcons] = useState<IconData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/icons').then(r => r.json()).then(setIcons).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUploaded = useCallback(async (key: keyof IconData, url: string) => {
    setIcons(prev => ({ ...prev, [key]: url }));
    setSaving(true);
    try {
      await saveIcons({ [key]: url });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }, []);

  const handleAutoGenerated = useCallback((data: Partial<IconData>) => {
    setIcons(prev => ({ ...prev, ...data }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, []);

  if (loading) {
    return <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-20 rounded-xl bg-[var(--admin-border)] animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--admin-text-muted)]">업로드 시 자동 리사이즈 후 NCP에 저장됩니다</p>
        <div className="flex items-center gap-2">
          {saving && <span className="text-xs text-[var(--admin-accent)] flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />저장 중...</span>}
          {saved && !saving && <span className="text-xs text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />저장됨</span>}
        </div>
      </div>

      {/* 자동생성 패널 */}
      <AutoGeneratePanel icons={icons} onGenerated={handleAutoGenerated} />

      {/* 개별 아이콘 업로더 */}
      {ICON_SPECS.map(spec => (
        <SingleIconUploader key={spec.key} spec={spec} currentUrl={icons[spec.key]} onUploaded={handleUploaded} />
      ))}
    </div>
  );
}
