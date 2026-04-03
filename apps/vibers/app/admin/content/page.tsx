"use client";

import React, { useEffect, useState } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import { FileText, Plus, Loader2 } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { getAdapterForProject, AdminContent } from '@/lib/admin/api';

const columns: Column[] = [
  { key: 'id', header: 'ID' },
  { key: 'type', header: '분류' },
  { key: 'title', header: '제목' },
  { key: 'author', header: '작성자' },
  { key: 'date', header: '작성일' },
];

export default function ContentPage() {
  const { currentProject } = useProject();
  const [content, setContent] = useState<AdminContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        const adapter = getAdapterForProject(currentProject.slug, currentProject.apiUrl || '');
        const data = await adapter.fetchContent();
        setContent(data);
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, [currentProject]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--admin-card)] p-5 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text)]">
              {currentProject.name} 콘텐츠 관리
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)]">공지사항 및 게시물 콘텐츠를 관리합니다.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--admin-accent-hover)] transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> 게시물 작성
        </button>
      </div>
      
      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] overflow-hidden relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <Loader2 className="w-8 h-8 text-[var(--admin-accent)] animate-spin" />
          </div>
        ) : (
          <DataTable data={content} columns={columns} />
        )}
      </div>
    </div>
  );
}
