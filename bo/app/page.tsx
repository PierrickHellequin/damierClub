"use client";
import { useAuth } from '@/components/AuthProvider';
import { useNotes } from '@/hooks/useNotes';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, FileText, Building2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8090';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { notes } = useNotes();
  const [stats, setStats] = useState<any>(null);
  const [membersCount, setMembersCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Fetch notes stats
      fetch(`${API_BASE}/api/notes/stats`, {
        headers: { 'X-User-Email': user.email }
      })
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error('Error fetching stats:', err));

      // Fetch members count
      fetch(`${API_BASE}/api/members?page=0&size=1`, {
        headers: { 'X-User-Email': user.email }
      })
        .then(res => res.json())
        .then(data => setMembersCount(data.totalElements || 0))
        .catch(err => console.error('Error fetching members:', err));
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900">Bienvenue</h2>
        <p className="text-gray-500 mt-2">Veuillez vous connecter pour accéder au tableau de bord.</p>
      </div>
    );
  }

  // Mock data for charts (you can replace with real API data later)
  const performanceData = [
    { mois: 'Jan', membres: 45 },
    { mois: 'Fév', membres: 48 },
    { mois: 'Mar', membres: 52 },
    { mois: 'Avr', membres: 55 },
    { mois: 'Mai', membres: 58 },
    { mois: 'Juin', membres: 62 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Bienvenue {user.firstName || user.name} - {user.clubName || 'Damier Club'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Membres</CardTitle>
            <Users className="text-blue-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{membersCount}</div>
            <p className="text-xs text-green-600 mt-1">Enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Mes Notes</CardTitle>
            <FileText className="text-blue-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalNotes || 0}</div>
            <p className="text-xs text-gray-500 mt-1">{stats?.pinnedNotes || 0} épinglées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Mon Club</CardTitle>
            <Building2 className="text-blue-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-base font-bold text-gray-900">{user.clubName || 'N/A'}</div>
            <p className="text-xs text-gray-500 mt-1">{user.role || 'Membre'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Activité</CardTitle>
            <TrendingUp className="text-blue-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{notes?.length || 0}</div>
            <p className="text-xs text-green-600 mt-1">+{Math.min(3, notes?.length || 0)} cette semaine</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des membres</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Nombre de membres par mois</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="membres" stroke="#3b82f6" strokeWidth={2} name="Membres" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité par mois</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Nombre d'actions par mois</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="membres" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Notes récentes - visibles par tous */}
      <Card>
        <CardHeader>
          <CardTitle>Notes récentes</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Dernières notes créées</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!notes || notes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune note disponible</p>
            ) : (
              notes.slice(0, 5).map((note) => (
                <div key={note.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      note.visibility === 'PRIVATE' ? 'bg-blue-500' :
                      note.visibility === 'CLUB' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{note.title}</div>
                      <p className="text-sm text-gray-500 mt-0.5">{dayjs(note.updatedAt).fromNow()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    note.visibility === 'PRIVATE' ? 'bg-blue-100 text-blue-700' :
                    note.visibility === 'CLUB' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {note.visibility.toLowerCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
