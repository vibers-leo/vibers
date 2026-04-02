'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Script from 'next/script';
import VibersBanner from '@/components/VibersBanner';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AuthProvider>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7704550771011130"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {isLoginPage ? (
        children
      ) : (
        <div className="flex h-screen bg-gray-100">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
              <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 8 }}>계발자들 프로젝트</p>
                <VibersBanner size="medium" currentProject="semophone" />
              </div>
            </main>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}
