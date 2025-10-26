"use client";
import { useState } from 'react';
import { Member } from '@/types/member';
import useMembers from '@/hooks/useMembers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MapPin, Mail, User, Target, TrendingUp, Award, Eye, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MembersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { members, loading, total } = useMembers({ enabled: true, page, pageSize });
  const [searchQuery, setSearchQuery] = useState('');

  // Filter members based on search
  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalMembers = filteredMembers.length;
  const activeThisMonth = Math.floor(totalMembers * 0.3); // Mock
  const averageRate = members.length > 0
    ? (members.reduce((sum, m) => sum + (m.rate || 0), 0) / members.length).toFixed(0)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Gestion des Membres</h2>
          <p className="text-gray-500 mt-1">Liste des membres et leurs informations</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/members/new')}
        >
          <Plus size={20} className="mr-2" />
          Ajouter un membre
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Membres</CardTitle>
            <Target className="text-blue-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalMembers}</div>
            <p className="text-xs text-gray-500 mt-1">Enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Actifs ce mois</CardTitle>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activeThisMonth}</div>
            <p className="text-xs text-green-600 mt-1">{totalMembers > 0 ? Math.round((activeThisMonth / totalMembers) * 100) : 0}% actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Taux Moyen</CardTitle>
            <TrendingUp className="text-blue-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{averageRate}</div>
            <p className="text-xs text-gray-500 mt-1">Points ELO</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Nouveaux</CardTitle>
            <Award className="text-blue-600" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{Math.min(5, totalMembers)}</div>
            <p className="text-xs text-gray-500 mt-1">Ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Rechercher un membre..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Aucun membre trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Membres ({filteredMembers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="grid w-full max-w-sm grid-cols-2 mb-6">
                <TabsTrigger value="grid">Vue grille</TabsTrigger>
                <TabsTrigger value="table">Vue tableau</TabsTrigger>
              </TabsList>

              <TabsContent value="grid">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMembers.map((member) => {
                    const initials = (member.firstName?.charAt(0) || '') + (member.lastName?.charAt(0) || member.name?.charAt(0) || '?');
                    const fullName = member.firstName && member.lastName
                      ? `${member.firstName} ${member.lastName}`
                      : member.name || 'Sans nom';

                    return (
                      <Card key={member.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/profil/${member.id}`)}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                                {initials.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">{fullName}</h3>
                              {member.name && member.firstName && (
                                <p className="text-sm text-gray-500 truncate">@{member.name}</p>
                              )}

                              <div className="mt-3 space-y-1.5">
                                {member.email && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail size={14} className="text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{member.email}</span>
                                  </div>
                                )}

                                {member.city && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{member.city}</span>
                                  </div>
                                )}

                                {member.rate !== undefined && member.rate !== null && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                      ELO: {member.rate}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Membre</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => {
                      const initials = (member.firstName?.charAt(0) || '') + (member.lastName?.charAt(0) || member.name?.charAt(0) || '?');
                      const fullName = member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.name || 'Sans nom';

                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                  {initials.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">{fullName}</div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">{member.clubName || '-'}</TableCell>
                          <TableCell className="text-gray-600">{member.city || '-'}</TableCell>
                          <TableCell className="font-medium text-gray-900">{member.rate !== undefined && member.rate !== null ? member.rate : '-'}</TableCell>
                          <TableCell>
                            <Badge
                              className={member.active !== false ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}
                            >
                              {member.active !== false ? 'Actif' : 'Inactif'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/profil/${member.id}`)}
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/members/edit/${member.id}`)}
                              >
                                <Edit size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Précédent
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            Page {page} sur {Math.ceil(total / pageSize)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(Math.ceil(total / pageSize), page + 1))}
            disabled={page >= Math.ceil(total / pageSize)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
