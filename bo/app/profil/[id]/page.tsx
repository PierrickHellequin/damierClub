"use client";
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useMember from '@/hooks/useMember';
import useMemberStats from '@/hooks/useMemberStats';
import useMemberPointsEvolution from '@/hooks/useMemberPointsEvolution';
import useMemberParticipations from '@/hooks/useMemberParticipations';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trophy,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';
import {
  Line,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

dayjs.extend(relativeTime);
dayjs.locale('fr');

// Mock data for points evolution - in real app would come from API
const mockPointsEvolutionData = [
  { date: 'Jan 2024', points: 1620, tournoi: 'Open Paris', gain: 0 },
  { date: 'Fév 2024', points: 1680, tournoi: 'Championnat IDF', gain: 60 },
  { date: 'Mar 2024', points: 1720, tournoi: 'Blitz National', gain: 40 },
  { date: 'Avr 2024', points: 1750, tournoi: 'Open Lyon', gain: 30 },
  { date: 'Mai 2024', points: 1790, tournoi: 'Championnat France', gain: 40 },
  { date: 'Juin 2024', points: 1850, tournoi: 'Open Marseille', gain: 60 },
];

// Mock tournament history - would come from API
const mockTournamentsHistory = [
  {
    id: 1,
    date: '15 Oct 2024',
    type: 'Tournoi',
    nom: 'Open International Paris',
    categorie: 'Open',
    place: '5ème',
    points: -40,
    victoires: 6,
    defaites: 3,
    nuls: 1,
    games: [
      { opponentName: 'Sophie Bernard', opponentPoints: 1820, result: 'WIN' as const, score: '2-0' },
      { opponentName: 'Jean Martin', opponentPoints: 1750, result: 'LOSS' as const, score: '0-2' },
      { opponentName: 'Paul Lefebvre', opponentPoints: 1680, result: 'DRAW' as const, score: '1-1' },
    ],
    pointsApres: 1850
  },
  {
    id: 2,
    date: '22 Sep 2024',
    type: 'Championnat',
    nom: 'Championnat Île-de-France',
    categorie: 'Régional',
    place: '3ème',
    points: 20,
    victoires: 8,
    defaites: 2,
    nuls: 0,
    games: [
      { opponentName: 'Thomas Blanc', opponentPoints: 1800, result: 'WIN' as const, score: '2-0' },
      { opponentName: 'Julie Roux', opponentPoints: 1770, result: 'LOSS' as const, score: '0-2' },
    ],
    pointsApres: 1890
  },
];

// Mock stats - would be calculated from tournaments
const mockStatsData = [
  { label: 'Victoires', value: 78, color: 'bg-green-100 text-green-700' },
  { label: 'Défaites', value: 21, color: 'bg-red-100 text-red-700' },
  { label: 'Nuls', value: 9, color: 'bg-gray-100 text-gray-700' },
  { label: 'Taux victoire', value: '72%', color: 'bg-blue-100 text-blue-700' },
];

export default function ProfilPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const idParam = params?.id;
  const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : null;
  const { member, loading, error } = useMember(id);

  // État pour gérer l'onglet actif
  const [activeTab, setActiveTab] = useState('table');

  // Charger les vraies données
  const { stats } = useMemberStats(id);
  const { evolution } = useMemberPointsEvolution(id);
  const { participations } = useMemberParticipations(id, { size: 100 });

  // Transformer les stats en format pour l'affichage
  const statsData = stats ? [
    { label: 'Victoires', value: stats.totalVictories, color: 'bg-green-100 text-green-700' },
    { label: 'Défaites', value: stats.totalDefeats, color: 'bg-red-100 text-red-700' },
    { label: 'Nuls', value: stats.totalDraws, color: 'bg-gray-100 text-gray-700' },
    { label: 'Taux victoire', value: `${stats.winRate.toFixed(1)}%`, color: 'bg-blue-100 text-blue-700' },
  ] : mockStatsData;

  // Transformer l'évolution des points pour le graphique
  const pointsEvolutionData = evolution && evolution.length > 0
    ? evolution.map(e => ({
        date: dayjs(e.date).format('MMM YYYY'),
        points: e.points,
        tournoi: e.tournamentName || e.reason || '',
        gain: e.pointsChange,
      }))
    : mockPointsEvolutionData;

  // Transformer les participations pour l'affichage
  const tournamentsHistory = participations && participations.length > 0
    ? participations.map(p => ({
        id: p.participationId,
        date: dayjs(p.tournamentDate).format('DD MMM YYYY'),
        type: p.tournamentType,
        nom: p.tournamentName,
        categorie: p.tournamentCategory,
        place: p.place || '-',
        points: p.pointsChange || 0,
        victoires: p.victories,
        defaites: p.defeats,
        nuls: p.draws,
        games: p.games || [],
        pointsApres: p.pointsAfter || 0,
      }))
    : mockTournamentsHistory;

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error || 'Membre non trouvé'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = (member.firstName?.charAt(0) || '') + (member.lastName?.charAt(0) || member.name?.charAt(0) || '?');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Profil du membre</h2>
            <p className="text-gray-500 mt-1">Détails et historique des performances</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/members/edit/${member.id}`)}
          >
            <Edit size={18} className="mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-blue-600 text-white text-2xl">
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : member.name}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline" className="text-base">
                    {member.name || 'Membre'}
                  </Badge>
                  <Badge className={member.active !== false ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                    {member.active !== false ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="text-gray-900">{member.email}</div>
                  </div>
                </div>

                {member.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <div className="text-sm text-gray-500">Téléphone</div>
                      <div className="text-gray-900">{member.phone}</div>
                    </div>
                  </div>
                )}

                {member.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <div className="text-sm text-gray-500">Adresse</div>
                      <div className="text-gray-900">{member.address}</div>
                    </div>
                  </div>
                )}

                {member.clubName && (
                  <div className="flex items-start gap-3">
                    <Trophy className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <div className="text-sm text-gray-500">Club</div>
                      <div className="text-gray-900">{member.clubName}</div>
                      {member.clubRole && (
                        <div className="text-xs text-gray-500">
                          {member.clubRole.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {member.birthDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <div className="text-sm text-gray-500">Date de naissance</div>
                      <div className="text-gray-900">{dayjs(member.birthDate).format('DD/MM/YYYY')}</div>
                    </div>
                  </div>
                )}

                {member.city && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <div className="text-sm text-gray-500">Ville</div>
                      <div className="text-gray-900">{member.city}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Points Display */}
            {member.rate !== null && member.rate !== undefined && (
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Target className="text-blue-600 mx-auto mb-2" size={32} />
                <div className="text-sm text-gray-500">Points actuels</div>
                <div className="text-4xl font-bold text-blue-600 mt-1">{member.rate}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className={`inline-block px-3 py-1 rounded-full mt-2 text-lg font-semibold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Points Evolution Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Évolution des points</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Progression par tournoi sur l'année 2024</p>
            </div>
            <Badge variant="outline" className="gap-2">
              <TrendingUp size={16} className="text-green-600" />
              {pointsEvolutionData.length > 0
                ? `${pointsEvolutionData[pointsEvolutionData.length - 1].points - pointsEvolutionData[0].points >= 0 ? '+' : ''}${pointsEvolutionData[pointsEvolutionData.length - 1].points - pointsEvolutionData[0].points} points`
                : '0 points'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pointsEvolutionData}>
                <defs>
                  <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[1500, 1950]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="points"
                  stroke="none"
                  fill="url(#colorPoints)"
                />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Points"
                />
                <Bar
                  dataKey="gain"
                  fill="#10b981"
                  name="Gain/Perte"
                  radius={[4, 4, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tournament History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des tournois</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{tournamentsHistory.length} tournois participés</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
              <TabsTrigger value="table">Vue tableau</TabsTrigger>
              <TabsTrigger value="detailed">Vue détaillée</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Nom du tournoi</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Place</TableHead>
                    <TableHead>V-D-N</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Points après</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournamentsHistory.map((tournament) => (
                    <TableRow
                      key={tournament.id}
                      onClick={() => {
                        setActiveTab('detailed');
                        setTimeout(() => {
                          const element = document.getElementById(`tournament-${tournament.id}`);
                          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="text-gray-600">{tournament.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {tournament.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{tournament.nom}</TableCell>
                      <TableCell className="text-gray-600">{tournament.categorie}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            tournament.place.startsWith('1')
                              ? 'bg-yellow-100 text-yellow-700'
                              : tournament.place.startsWith('2') || tournament.place.startsWith('3')
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-gray-50 text-gray-600'
                          }
                        >
                          {tournament.place}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {tournament.victoires}-{tournament.defaites}-{tournament.nuls}
                      </TableCell>
                      <TableCell>
                        <span className={tournament.points >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {tournament.points >= 0 ? '+' : ''}{tournament.points}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{tournament.pointsApres}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="detailed">
              <div className="space-y-4">
                {tournamentsHistory.map((tournament) => (
                  <Card key={tournament.id} id={`tournament-${tournament.id}`} className="border border-gray-200 scroll-mt-4">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{tournament.nom}</h4>
                            <Badge variant="outline">{tournament.type}</Badge>
                            <Badge variant="secondary">{tournament.categorie}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {tournament.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award size={14} />
                              {tournament.place}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${tournament.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {tournament.points >= 0 ? '+' : ''}{tournament.points}
                          </div>
                          <div className="text-sm text-gray-500">points</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{tournament.victoires}</div>
                          <div className="text-sm text-gray-500">Victoires</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{tournament.defaites}</div>
                          <div className="text-sm text-gray-500">Défaites</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-600">{tournament.nuls}</div>
                          <div className="text-sm text-gray-500">Nuls</div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm text-gray-500 mb-2">Adversaires rencontrés:</div>
                        <div className="flex flex-wrap gap-2">
                          {tournament.games.map((game, index) => {
                            const colorClass = game.result === 'WIN'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : game.result === 'LOSS'
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200';

                            return (
                              <Badge key={index} variant="outline" className={`text-xs ${colorClass}`}>
                                {game.opponentName} ({game.score})
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          Points après le tournoi: <span className="font-semibold text-gray-900">{tournament.pointsApres}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

    </div>
  );
}
