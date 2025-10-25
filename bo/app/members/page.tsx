"use client";
import { useState } from 'react';
import { Member } from '@/types/member';
import useMembers from '@/hooks/useMembers';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MapPin, Mail, User } from 'lucide-react';

export default function MembersPage() {
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Membres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalMembers}</div>
            <p className="text-xs text-gray-500 mt-1">Enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Actifs ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activeThisMonth}</div>
            <p className="text-xs text-green-600 mt-1">{totalMembers > 0 ? Math.round((activeThisMonth / totalMembers) * 100) : 0}% actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Taux Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{averageRate}</div>
            <p className="text-xs text-gray-500 mt-1">Points ELO</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Nouveaux</CardTitle>
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

      {/* Members Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const initials = (member.firstName?.charAt(0) || '') + (member.lastName?.charAt(0) || member.name?.charAt(0) || '?');
            const fullName = member.firstName && member.lastName
              ? `${member.firstName} ${member.lastName}`
              : member.name || 'Sans nom';

            return (
              <Link key={member.id} href={`/profil/${member.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
              </Link>
            );
          })}
        </div>
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
