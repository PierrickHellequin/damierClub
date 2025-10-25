'use client';
import { Spin } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useEffect } from 'react';
import NewLayout from './Layout';

export default function LayoutShell({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = pathname === '/' ? 'dashboard' : pathname.split('/')[1];

  // Redirection (hook toujours appelé, plus dans un if)
  useEffect(() => {
    if (!loading && !user && pathname !== '/login' && pathname !== '/register') {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Cas non authentifié sur page protégée: attendre redirection
  if (!user && pathname !== '/login' && pathname !== '/register') {
    return null;
  }

  // Cas pages publiques (login/register)
  if (!user) {
    return children;
  }

  return (
    <NewLayout currentPage={currentPage}>
      {children}
    </NewLayout>
  );
}
