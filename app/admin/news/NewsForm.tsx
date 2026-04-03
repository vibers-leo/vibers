'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clients, type FeedItem, type FeedType } from '@/lib/feed-data';

const typeOptions: { value: FeedType; label: string }[] = [
  { value: 'launch', label: '런칭' },
  { value: 'update', label: '업데이트' },
  { value: 'insight', label: '인사이트' },
  { value: 'collab', label: '협업' },
];

const colorOptions = [
  '#39FF14', '#6C63FF', '#E94560', '#0EA5E9',
  '#00C896', '#FFD700', '#A78BFA', '#00FFAA', '#C5A55A', '#888',
];

interface Props {
  initial?: Partial<FeedItem>;
  mode: 'create' | 'edit';
}

export default function NewsForm({ initial, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<FeedItem>>({
    id: '',
    clientId: clients[0].id,
    type: 'launch',
    title: '',
    date: new Date().toISOString().slice(0, 7).replace('-', '.'),
    body: '',
    fullBody: '',
    tag: '',
    url: '',
    color: '#39FF14',
    size: 'md',
    ...initial,
  });

  const set = (key: keyof FeedItem, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id || !form.title) return alert('ID와 제목은 필수입니다.');
    setSaving(true);

    const secret = process.env.NEXT_PUBLIC_VIBERS_ADMIN_SECRET ?? '';
    const url = mode === 'create'
      ? '/api/admin/news'
      : `/api/admin/news/${initial?.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-vibers-secret': secret },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (res.ok) {
      router.push('/admin/news');
      router.refresh();
    } else {
      alert('저장에 실패했습니다.');
    }
  }

  const inputCls = "w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600";
  const labelCls = "block text-xs font-semibold text-neutral-400 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        {/* ID */}
        <div>
          <label className={labelCls}>ID <span className="text-red-400">*</span></label>
          <input
            className={inputCls}
            placeholder="예: yahwa-open-2025"
            value={form.id ?? ''}
            onChange={(e) => set('id', e.target.value)}
            disabled={mode === 'edit'}
          />
          <p className="mt-1 text-[10px] text-neutral-600">영문·숫자·하이픈, 고유값</p>
        </div>
        {/* 날짜 */}
        <div>
          <label className={labelCls}>날짜</label>
          <input
            className={inputCls}
            placeholder="2026.03"
            value={form.date ?? ''}
            onChange={(e) => set('date', e.target.value)}
          />
        </div>
      </div>

      {/* 제목 */}
      <div>
        <label className={labelCls}>제목 <span className="text-red-400">*</span></label>
        <input
          className={inputCls}
          placeholder="소식 제목"
          value={form.title ?? ''}
          onChange={(e) => set('title', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 클라이언트 */}
        <div>
          <label className={labelCls}>클라이언트</label>
          <select
            className={inputCls}
            value={form.clientId ?? ''}
            onChange={(e) => set('clientId', e.target.value)}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        {/* 타입 */}
        <div>
          <label className={labelCls}>타입</label>
          <select
            className={inputCls}
            value={form.type ?? 'launch'}
            onChange={(e) => set('type', e.target.value as FeedType)}
          >
            {typeOptions.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 미리보기 본문 */}
      <div>
        <label className={labelCls}>카드 미리보기 텍스트</label>
        <textarea
          className={`${inputCls} h-20 resize-none`}
          placeholder="소식 카드에 보이는 짧은 설명"
          value={form.body ?? ''}
          onChange={(e) => set('body', e.target.value)}
        />
      </div>

      {/* 상세 본문 */}
      <div>
        <label className={labelCls}>상세 본문 (모달)</label>
        <textarea
          className={`${inputCls} h-32 resize-none`}
          placeholder="모달에서 보여줄 전체 내용 (비워두면 미리보기 텍스트 사용)"
          value={form.fullBody ?? ''}
          onChange={(e) => set('fullBody', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* URL */}
        <div>
          <label className={labelCls}>사이트 URL</label>
          <input
            className={inputCls}
            placeholder="https://..."
            value={form.url ?? ''}
            onChange={(e) => set('url', e.target.value)}
          />
          <p className="mt-1 text-[10px] text-neutral-600">OG 이미지 자동 표시에 사용</p>
        </div>
        {/* 태그 */}
        <div>
          <label className={labelCls}>태그</label>
          <input
            className={inputCls}
            placeholder="#런칭 #웹사이트"
            value={form.tag ?? ''}
            onChange={(e) => set('tag', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 카드 크기 */}
        <div>
          <label className={labelCls}>카드 크기</label>
          <select
            className={inputCls}
            value={form.size ?? 'md'}
            onChange={(e) => set('size', e.target.value as 'sm' | 'md' | 'lg')}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
        {/* 컬러 */}
        <div>
          <label className={labelCls}>포인트 컬러</label>
          <div className="flex gap-2 flex-wrap mt-1">
            {colorOptions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set('color', c)}
                className="h-6 w-6 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: c,
                  borderColor: form.color === c ? 'white' : 'transparent',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-[#39FF14] text-black text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? '저장 중...' : mode === 'create' ? '소식 발행' : '수정 저장'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/news')}
          className="px-6 py-2.5 rounded-lg border border-neutral-800 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
}
