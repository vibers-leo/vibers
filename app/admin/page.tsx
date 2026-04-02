'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-6">관리자 대시보드</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center text-2xl">
                💎
              </div>
              <div>
                <p className="text-sm text-gray-600">혜택 관리</p>
                <p className="text-2xl font-bold">4개</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center text-2xl">
                🏪
              </div>
              <div>
                <p className="text-sm text-gray-600">매장 관리</p>
                <p className="text-2xl font-bold">50개+</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center text-2xl">
                📊
              </div>
              <div>
                <p className="text-sm text-gray-600">방문자 통계</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">시작하기</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Firebase 프로젝트 설정 및 SDK 설치 완료</li>
            <li>✅ 인증 시스템 구현 완료</li>
            <li>✅ 관리자 레이아웃 구현 완료</li>
            <li>🔄 다음: 혜택(Benefits) CRUD 구현</li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
}
