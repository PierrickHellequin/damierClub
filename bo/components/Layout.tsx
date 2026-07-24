"use client";
import { ReactNode } from 'react';
import {
  LayoutDashboard,
  FileText,
  StickyNote,
  Users,
  Building2,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface LayoutProps {
  children: ReactNode;
  currentPage?: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, href: '/' },
  { id: 'articles', label: 'Actus', icon: FileText, href: '/articles' },
  { id: 'members', label: 'Membres', icon: Users, href: '/members' },
  { id: 'clubs', label: 'Clubs', icon: Building2, href: '/clubs' },
  { id: 'notes', label: 'Notes internes', icon: StickyNote, href: '/notes' },
];

/** Petit damier 4x4, signature visuelle du produit (cf. maquettes docs/mockups). */
function DamierLogo() {
  return (
    <div
      aria-hidden="true"
      className="grid h-9 w-9 shrink-0 grid-cols-4 overflow-hidden rounded-md border-2 border-[#c99a3f]"
    >
      {Array.from({ length: 16 }, (_, i) => (
        <span key={i} className={i % 2 === 0 ? 'aspect-square bg-[#f7f2e8]' : 'aspect-square bg-[#1e1a14]'} />
      ))}
    </div>
  );
}

export default function Layout({ children, currentPage }: LayoutProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayName = user?.firstName || user?.name || 'Utilisateur';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-[#f7f6f3]">
      {/* Sidebar — identité damier : noir profond + or */}
      <aside className="flex w-64 flex-col bg-[#14110d] text-[#f7f2e8]">
        <div className="flex items-center gap-3 border-b border-[#c99a3f]/25 p-5">
          <DamierLogo />
          <div>
            <h1 className="text-[15px] font-extrabold leading-tight">Damier Wattrelos</h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e3b95c]">
              Administration
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Navigation admin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#c99a3f] text-[#14110d]'
                    : 'text-[#cfc6b4] hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#c99a3f]/25 p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#cfc6b4] transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink size={18} />
            <span>Voir sur le site</span>
          </a>

          <div className="mt-2 flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c99a3f] text-sm font-bold text-[#14110d]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <button
                onClick={() => router.push('/profil/' + user?.id)}
                className="block w-full truncate text-left text-sm font-semibold text-white hover:underline"
              >
                {displayName}
              </button>
              <p className="truncate text-xs text-[#a89b83]">{user?.clubRole || user?.role || 'Membre'}</p>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Se déconnecter"
              title="Se déconnecter"
              className="rounded-md p-2 text-[#a89b83] transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
