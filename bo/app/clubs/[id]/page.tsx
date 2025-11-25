"use client";
import { useRouter, useParams } from 'next/navigation';
import { App } from 'antd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trophy,
  Target,
  Medal,
  Eye,
  Globe
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import useClub from '@/hooks/useClub';
import useClubStats from '@/hooks/useClubStats';
import { clubProvider } from '@/providers/clubProvider';
import { useState, useEffect } from 'react';
import { Member } from '@/types/member';

export default function ClubDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clubId = params.id as string;
  const { message } = App.useApp();
  const { club, loading: loadingClub } = useClub(clubId, { enabled: true });
  const { stats, loading: loadingStats } = useClubStats(clubId, { enabled: true });
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Load club members
  useEffect(() => {
    const fetchMembers = async () => {
      if (!clubId) return;
      setLoadingMembers(true);
      try {
        const data = await clubProvider.getClubMembers(clubId);
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, [clubId]);

  const handleDelete = async () => {
    if (!club) return;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le club "${club.name}" ?`)) {
      return;
    }
    try {
      await clubProvider.deleteClub(clubId);
      message.success('Club supprimé');
      router.push('/clubs');
    } catch (error: any) {
      message.error(error?.message || 'Erreur suppression');
    }
  };

  if (loadingClub) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!club) {
    return <div className="p-6">Club non trouvé</div>;
  }

  // Prepare data for charts
  const levelDistribution = [
    { name: 'Expert', value: members.filter(m => (m.currentPoints || 0) >= 1800).length, color: '#3b82f6' },
    { name: 'Avancé', value: members.filter(m => (m.currentPoints || 0) >= 1600 && (m.currentPoints || 0) < 1800).length, color: '#8b5cf6' },
    { name: 'Intermédiaire', value: members.filter(m => (m.currentPoints || 0) >= 1400 && (m.currentPoints || 0) < 1600).length, color: '#06b6d4' },
    { name: 'Débutant', value: members.filter(m => (m.currentPoints || 0) < 1400).length, color: '#10b981' },
  ];

  // Top 5 members
  const topMembers = [...members]
    .sort((a, b) => (b.currentPoints || 0) - (a.currentPoints || 0))
    .slice(0, 5);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/clubs')}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Fiche du club</h2>
            <p className="text-gray-500 mt-1">{club.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/clubs/${clubId}/edit`)}
          >
            <Edit size={18} className="mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 size={18} className="mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Club Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>Informations générales</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Coordonnées et détails du club</p>
            </div>
            <Badge
              className={club.status === 'actif' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700'}
            >
              {club.status || 'actif'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {club.description && (
            <p className="text-gray-700">{club.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {club.address && (
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <div className="text-sm text-gray-500">Adresse</div>
                  <div className="text-gray-900 mt-0.5">{club.address}</div>
                </div>
              </div>
            )}

            {club.email && (
              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-gray-900 mt-0.5">{club.email}</div>
                </div>
              </div>
            )}

            {club.phone && (
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <div className="text-sm text-gray-500">Téléphone</div>
                  <div className="text-gray-900 mt-0.5">{club.phone}</div>
                </div>
              </div>
            )}

            {club.creationDate && (
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <div className="text-sm text-gray-500">Date de création</div>
                  <div className="text-gray-900 mt-0.5">{new Date(club.creationDate).getFullYear()}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Users className="text-gray-400 mt-0.5" size={18} />
              <div>
                <div className="text-sm text-gray-500">Nombre de membres</div>
                <div className="text-gray-900 mt-0.5">{stats?.totalMembers || members.length} membres actifs</div>
              </div>
            </div>

            {club.website && (
              <div className="flex items-start gap-3">
                <Globe className="text-gray-400 mt-0.5" size={18} />
                <div>
                  <div className="text-sm text-gray-500">Site web</div>
                  <div className="text-gray-900 mt-0.5">{club.website}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bureau du club */}
      {(club.president || club.vicePresident || club.tresorier || club.secretaire) && (
        <Card>
          <CardHeader>
            <CardTitle>Bureau du club</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Membres dirigeants</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {club.president && (
                <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <Avatar className="w-20 h-20 mb-3">
                    <AvatarFallback className="bg-blue-600 text-white text-xl">
                      {getInitials(club.president)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-gray-500 mb-1">Président</div>
                  <div className="font-medium text-gray-900">{club.president}</div>
                </div>
              )}

              {club.vicePresident && (
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <Avatar className="w-20 h-20 mb-3">
                    <AvatarFallback className="bg-purple-600 text-white text-xl">
                      {getInitials(club.vicePresident)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-gray-500 mb-1">Vice-Président</div>
                  <div className="font-medium text-gray-900">{club.vicePresident}</div>
                </div>
              )}

              {club.tresorier && (
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <Avatar className="w-20 h-20 mb-3">
                    <AvatarFallback className="bg-green-600 text-white text-xl">
                      {getInitials(club.tresorier)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-gray-500 mb-1">Trésorier</div>
                  <div className="font-medium text-gray-900">{club.tresorier}</div>
                </div>
              )}

              {club.secretaire && (
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <Avatar className="w-20 h-20 mb-3">
                    <AvatarFallback className="bg-orange-600 text-white text-xl">
                      {getInitials(club.secretaire)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-gray-500 mb-1">Secrétaire</div>
                  <div className="font-medium text-gray-900">{club.secretaire}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {!loadingStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Membres</CardTitle>
              <Users className="text-blue-600" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalMembers}</div>
              <p className="text-xs text-gray-500 mt-1">Membres actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Points moyens</CardTitle>
              <Target className="text-blue-600" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.averagePoints}</div>
              <p className="text-xs text-gray-500 mt-1">Moyenne du club</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Top joueur</CardTitle>
              <Medal className="text-yellow-600" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.highestPoints} pts</div>
              <p className="text-xs text-gray-500 mt-1">{stats.topPlayerName || '-'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Victoires totales</CardTitle>
              <Trophy className="text-green-600" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalVictories}</div>
              <p className="text-xs text-green-600 mt-1">{Math.round(stats.victoryRatio * 100)}% ratio victoires</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {members.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Level Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par niveau</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Distribution des membres</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={levelDistribution.filter(d => d.value > 0)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {levelDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Placeholder for performance chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance du club</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Évolution à venir</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                Données d'évolution disponibles prochainement
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Palmarès - Top 5 */}
      {topMembers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Palmarès</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Top 5 des joueurs du club</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rang</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Licence</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">V-D-N</TableHead>
                  <TableHead className="text-right">Ratio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topMembers.map((member, index) => {
                  return (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {index === 0 && <Medal className="inline text-yellow-500" size={18} />}
                        {index === 1 && <Medal className="inline text-gray-400" size={18} />}
                        {index === 2 && <Medal className="inline text-orange-600" size={18} />}
                        {index > 2 && index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{`${member.firstName || ''} ${member.lastName || ''}`}</TableCell>
                      <TableCell>{member.licenceNumber}</TableCell>
                      <TableCell className="text-right font-medium">{member.currentPoints || 0}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">-</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* All Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les membres ({members.length})</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Liste complète des membres du club</p>
        </CardHeader>
        <CardContent>
          {loadingMembers ? (
            <div className="text-center py-8 text-gray-500">Chargement des membres...</div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucun membre trouvé</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Licence</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">V-D-N</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-mono text-sm">{member.licenceNumber}</TableCell>
                    <TableCell className="font-medium">{`${member.firstName || ''} ${member.lastName || ''}`}</TableCell>
                    <TableCell>{member.birthDate ? new Date(member.birthDate).toLocaleDateString('fr-FR') : '-'}</TableCell>
                    <TableCell className="text-right font-medium">{member.currentPoints || 0}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell>
                      <Badge variant={member.active ? 'default' : 'secondary'} className={member.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {member.active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/profil/${member.id}`)}
                      >
                        <Eye size={14} className="mr-1" />
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
