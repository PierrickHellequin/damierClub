"use client";
import { useAuth } from '@/components/AuthProvider';
import { useNotes } from '@/hooks/useNotes';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Building2, StickyNote } from 'lucide-react';
import { apiProvider } from '@/providers/apiProvider';
import NoteCard from '@/components/NoteCard/NoteCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.extend(relativeTime);
dayjs.locale('fr');

interface NotesStats {
  totalNotes?: number;
  pinnedNotes?: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { notes } = useNotes();
  const [stats, setStats] = useState<NotesStats | null>(null);
  const [membersCount, setMembersCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    apiProvider
      .get<NotesStats>('notes/stats')
      .then(setStats)
      .catch((err) => console.error('Error fetching stats:', err));

    apiProvider
      .get<{ totalElements?: number }>('members?page=0&size=1')
      .then((data) => setMembersCount(data.totalElements ?? 0))
      .catch((err) => console.error('Error fetching members:', err));
  }, [user]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#211b12]">Tableau de bord</h2>
        <p className="mt-1 text-[#6d6250]">
          Bienvenue {user?.firstName || user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#e5dcc8]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6d6250]">Membres</CardTitle>
            <Users className="text-[#c99a3f]" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#211b12]">{membersCount ?? '—'}</div>
            <p className="mt-1 text-xs text-[#6d6250]">enregistrés</p>
          </CardContent>
        </Card>

        <Card className="border-[#e5dcc8]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6d6250]">Notes</CardTitle>
            <FileText className="text-[#c99a3f]" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#211b12]">{stats?.totalNotes ?? '—'}</div>
            <p className="mt-1 text-xs text-[#6d6250]">{stats?.pinnedNotes ?? 0} épinglées</p>
          </CardContent>
        </Card>

        <Card className="border-[#e5dcc8]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6d6250]">Mon club</CardTitle>
            <Building2 className="text-[#c99a3f]" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold text-[#211b12]">{user?.clubName || '—'}</div>
            <p className="mt-1 text-xs text-[#6d6250]">{user?.clubRole || user?.role || 'Membre'}</p>
          </CardContent>
        </Card>

        <Card className="border-[#e5dcc8]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#6d6250]">Notes récentes</CardTitle>
            <StickyNote className="text-[#c99a3f]" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#211b12]">{notes?.length ?? 0}</div>
            <p className="mt-1 text-xs text-[#6d6250]">au total</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#e5dcc8]">
        <CardHeader>
          <CardTitle>Notes récentes</CardTitle>
          <p className="mt-1 text-sm text-[#6d6250]">Dernières notes créées</p>
        </CardHeader>
        <CardContent>
          {!notes || notes.length === 0 ? (
            <p className="py-8 text-center text-[#6d6250]">Aucune note disponible</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notes.slice(0, 4).map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
