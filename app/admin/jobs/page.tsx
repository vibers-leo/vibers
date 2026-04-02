'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useJobs } from '@/hooks/useJobs';
import { JobOpening } from '@/types/firestore';

interface JobModalProps {
  job: JobOpening | null;
  onClose: () => void;
  onSubmit: (data: Omit<JobOpening, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

function JobModal({ job, onClose, onSubmit }: JobModalProps) {
  const [title, setTitle] = useState(job?.title || '');
  const [department, setDepartment] = useState(job?.department || '');
  const [location, setLocation] = useState(job?.location || '');
  const [type, setType] = useState<'정규직' | '계약직' | '아르바이트'>(job?.type || '정규직');
  const [requirements, setRequirements] = useState(job?.requirements.join('\n') || '');
  const [preferred, setPreferred] = useState(job?.preferred.join('\n') || '');
  const [responsibilities, setResponsibilities] = useState(job?.responsibilities.join('\n') || '');
  const [order, setOrder] = useState(job?.order || 1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({
        title,
        department: department || undefined,
        location,
        type,
        requirements: requirements.split('\n').filter(r => r.trim()),
        preferred: preferred.split('\n').filter(p => p.trim()),
        responsibilities: responsibilities.split('\n').filter(r => r.trim()),
        order,
        isActive: true,
      } as Omit<JobOpening, 'id' | 'createdAt' | 'updatedAt'>);
      onClose();
    } catch (error) {
      console.error('제출 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8">
        <h2 className="text-xl font-bold mb-4">
          {job ? '채용공고 수정' : '채용공고 추가'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                직무명 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="매장 매니저"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                부서 (선택)
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="영업팀"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                근무지 *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="서울 강남구"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                고용형태 *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as '정규직' | '계약직' | '아르바이트')}
                className="w-full px-4 py-2 border rounded-lg"
                required
                disabled={submitting}
              >
                <option value="정규직">정규직</option>
                <option value="계약직">계약직</option>
                <option value="아르바이트">아르바이트</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              자격요건 * (한 줄에 하나씩)
            </label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              placeholder="유통/서비스업 경력 2년 이상&#10;고객 응대 능력 우수자&#10;팀 리더십 경험자"
              rows={4}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              우대사항 (한 줄에 하나씩)
            </label>
            <textarea
              value={preferred}
              onChange={(e) => setPreferred(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              placeholder="통신 업계 경력자 우대&#10;매장 운영 경험자 우대"
              rows={3}
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              담당업무 * (한 줄에 하나씩)
            </label>
            <textarea
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              placeholder="매장 운영 관리 및 매출 목표 달성&#10;직원 교육 및 관리&#10;고객 상담 및 불만 처리"
              rows={4}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              정렬 순서
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg"
              min="1"
              required
              disabled={submitting}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={submitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brand text-dark font-bold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const { jobs, loading, error, createJob, updateJob, deleteJob } = useJobs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);

  const handleSubmit = async (data: Omit<JobOpening, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingJob) {
      await updateJob(editingJob.id, data);
    } else {
      await createJob(data);
    }
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleDelete = async (job: JobOpening) => {
    if (confirm(`"${job.title}" 채용공고를 삭제하시겠습니까?`)) {
      try {
        await deleteJob(job.id);
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">채용공고 관리</h1>
          <button
            onClick={() => {
              setEditingJob(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-brand text-dark font-bold rounded-lg hover:bg-brand-600 transition-colors"
          >
            + 채용공고 추가
          </button>
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
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-600 mb-4">아직 등록된 채용공고가 없습니다.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-brand text-dark font-bold rounded-lg hover:bg-brand-600 transition-colors"
            >
              첫 채용공고 추가하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl text-gray-900">{job.title}</h3>
                      <span className="px-3 py-1 bg-brand/10 text-dark text-sm font-semibold rounded-full">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {job.department && <span>📁 {job.department}</span>}
                      <span>📍 {job.location}</span>
                      <span className="text-gray-400">순서: {job.order}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingJob(job);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(job)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-4 border-t">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">자격요건</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {job.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {job.preferred.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">우대사항</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {job.preferred.map((pref, i) => (
                          <li key={i}>{pref}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">담당업무</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {job.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <JobModal
            job={editingJob}
            onClose={() => {
              setIsModalOpen(false);
              setEditingJob(null);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
