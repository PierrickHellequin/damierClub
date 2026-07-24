'use client';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import NewLayout from './Layout';

// La protection des routes est faite côté serveur par bo/middleware.ts :
// ici on ne gère plus que l'affichage (chrome admin vs pages publiques).
export default function LayoutShell({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const currentPage = pathname === '/' ? 'dashboard' : pathname.split('/')[1];
  const isPublicPage = pathname === '/login' || pathname === '/register';

  if (isPublicPage) {
    return children;
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f6f3]">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-[#c99a3f] border-t-transparent"
          role="status"
          aria-label="Chargement"
        />
      </div>
    );
  }

  return <NewLayout currentPage={currentPage}>{children}</NewLayout>;
}
