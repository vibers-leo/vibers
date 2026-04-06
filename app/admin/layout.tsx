'use client';

import { useAuth } from '@/components/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import "./admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { ProjectProvider } from "@/context/ProjectContext";

const SUPER_ADMINS = [
  'designd@designd.co.kr',
  'juuuno@naver.com',
  'juuuno1116@gmail.com',
  'duscontactus@gmail.com',
  'designdlab@designdlab.co.kr',
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!SUPER_ADMINS.includes(user.email)) {
        router.push('/login?error=unauthorized');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--admin-accent)]" />
      </div>
    );
  }

  if (!user || !SUPER_ADMINS.includes(user.email)) return null;

  return (
    <ProjectProvider>
      <div id="admin-root" className="flex h-screen w-full bg-[var(--admin-bg)] !text-[var(--admin-text)] overflow-hidden font-[Pretendard]">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[var(--admin-bg)] relative">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 text-[var(--admin-text)] bg-[var(--admin-bg)]">
            <div className="max-w-7xl mx-auto pb-20">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}
