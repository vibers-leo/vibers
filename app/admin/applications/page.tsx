'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/contexts/AuthContext';
import { Application } from '@/types/firestore';
import { deleteResumeFile } from '@/lib/firebase/storage';
import { Timestamp } from 'firebase/firestore';

const statusLabels: Record<Application['status'], string> = {
  pending: '대기 중',
  reviewing: '검토 중',
  accepted: '합격',
  rejected: '불합격',
};

const statusColors: Record<Application['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

interface DetailModalProps {
  application: Application | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Application>) => Promise<void>;
}

function DetailModal({ application, onClose, onUpdate }: DetailModalProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState(application?.status || 'pending');
  const [notes, setNotes] = useState(application?.notes || '');
  const [saving, setSaving] = useState(false);

  if (!application) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(application.id, {
        status,
        notes: notes || undefined,
        reviewedAt: Timestamp.now(),
        reviewedBy: user?.email || undefined,
      });
      alert('저장되었습니다.');
      onClose();
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full p-8 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">지원서 상세</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={saving}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* 지원자 정보 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">이름</label>
              <p className="text-gray-900">{application.name}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">지원 직무</label>
              <p className="text-gray-900">{application.position}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">이메일</label>
              <p className="text-gray-900">{application.email}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">연락처</label>
              <p className="text-gray-900">{application.phone}</p>
            </div>
          </div>

          {/* 이력서 다운로드 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">이력서</label>
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              이력서 다운로드
            </a>
          </div>

          {/* 자기소개서 */}
          {application.coverLetter && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">자기소개서</label>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700">
                {application.coverLetter}
              </div>
            </div>
          )}

          {/* 제출일 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">제출일</label>
            <p className="text-gray-900">
              {application.createdAt.toDate().toLocaleString('ko-KR')}
            </p>
          </div>

          {/* 상태 변경 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">지원 상태</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Application['status'])}
              className="w-full px-4 py-2 border rounded-lg"
              disabled={saving}
            >
              <option value="pending">대기 중</option>
              <option value="reviewing">검토 중</option>
              <option value="accepted">합격</option>
              <option value="rejected">불합격</option>
            </select>
          </div>

          {/* 관리자 메모 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">관리자 메모</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
              placeholder="메모를 입력하세요..."
              disabled={saving}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
              disabled={saving}
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-brand text-dark font-bold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
              disabled={saving}
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const { applications, loading, error, updateApplication, deleteApplication } = useApplications();
  const [filterStatus, setFilterStatus] = useState<Application['status'] | 'all'>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filteredApplications = filterStatus === 'all'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  const handleDelete = async (application: Application) => {
    if (confirm(`"${application.name}"님의 지원서를 삭제하시겠습니까?\n이력서 파일도 함께 삭제됩니다.`)) {
      try {
        // 이력서 파일 삭제
        await deleteResumeFile(application.resumeUrl).catch(console.error);
        // 지원서 삭제
        await deleteApplication(application.id);
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">지원서 관리</h1>

          {/* 상태 필터 */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all' ? 'bg-brand text-dark' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체 ({applications.length})
            </button>
            {(Object.keys(statusLabels) as Application['status'][]).map((status) => {
              const count = applications.filter(app => app.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === status ? 'bg-brand text-dark' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {statusLabels[status]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            오류: {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-600">
              {filterStatus === 'all' ? '아직 제출된 지원서가 없습니다.' : `"${statusLabels[filterStatus]}" 상태의 지원서가 없습니다.`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">이름</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">지원 직무</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">연락처</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">제출일</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">상태</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{application.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{application.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{application.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {application.createdAt.toDate().toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[application.status]}`}>
                        {statusLabels[application.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedApp(application)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-4"
                      >
                        상세보기
                      </button>
                      <button
                        onClick={() => handleDelete(application)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedApp && (
          <DetailModal
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onUpdate={updateApplication}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
