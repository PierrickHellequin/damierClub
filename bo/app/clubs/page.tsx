"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { App } from 'antd';
import { Club } from '@/types/member';
import useClubs from '@/hooks/useClubs';
import { useAuthorization } from '@/hooks/useAuthorization';
import { ProtectedAction } from '@/components/ProtectedAction/ProtectedAction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Trash2, Users, MapPin, Phone, Mail } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ClubsPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const { clubs, loading, deleteClub } = useClubs({ enabled: true });
  const auth = useAuthorization();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtrer les clubs selon les droits
  console.log("🔐 Auth check - isSuperAdmin:", auth.isSuperAdmin, "clubs count:", clubs.length);
  console.log("🔐 User clubId:", auth.userClubId);
  clubs.forEach(club => {
    console.log(`🏢 Club ${club.name} (${club.id}) - canView:`, auth.canViewClub(club as any));
  });
  const visibleClubs = auth.isSuperAdmin
    ? clubs
    : clubs.filter(club => auth.canViewClub(club as any));
  console.log("👁️ Visible clubs after auth filter:", visibleClubs.length);

  // Filter clubs based on search and status
  const filteredClubs = visibleClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || club.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  console.log("🔍 Filtered clubs after search/status:", filteredClubs.length);

  const handleDelete = async (club: Club) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le club "${club.name}" ?`)) {
      return;
    }
    try {
      await deleteClub(club.id);
      message.success('Club supprimé');
    } catch (e: any) {
      message.error(e?.message || 'Erreur suppression');
    }
  };

  // Calculate stats
  const totalClubs = filteredClubs.length;
  const activeClubs = filteredClubs.filter(c => c.status === 'actif').length;
  const totalMembers = 0; // TODO: calculate from API
  const averageMembers = totalClubs > 0 ? (totalMembers / totalClubs).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Gestion des Clubs</h2>
          <p className="text-gray-500 mt-1">Liste des clubs affiliés et leurs informations</p>
        </div>
        <ProtectedAction allowed={auth.canCreateClub} message="Seuls les super admins peuvent créer des clubs">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push('/clubs/new')}
          >
            <Plus size={20} className="mr-2" />
            Créer un club
          </Button>
        </ProtectedAction>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Clubs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalClubs}</div>
            <p className="text-xs text-gray-500 mt-1">Affiliés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Clubs Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activeClubs}</div>
            <p className="text-xs text-green-600 mt-1">{totalClubs > 0 ? Math.round((activeClubs / totalClubs) * 100) : 0}% actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Membres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalMembers}</div>
            <p className="text-xs text-gray-500 mt-1">Tous les clubs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Moyenne/Club</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{averageMembers}</div>
            <p className="text-xs text-gray-500 mt-1">Membres</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Rechercher un club..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clubs Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : filteredClubs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Aucun club trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClubs.map((club) => (
            <Card key={club.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold">{club.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{club.city || '-'}</span>
                    </div>
                  </div>
                  <Badge
                    variant={club.status === 'actif' ? 'default' : 'secondary'}
                    className={club.status === 'actif' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}
                  >
                    {club.status || 'actif'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Club Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Président</div>
                    <div className="text-gray-900 mt-0.5">{club.president || '-'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Trésorier</div>
                    <div className="text-gray-900 mt-0.5">{club.tresorier || '-'}</div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-2 text-sm pt-3 border-t border-gray-100">
                  {club.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} />
                      <span>{club.email}</span>
                    </div>
                  )}
                  {club.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} />
                      <span>{club.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={14} />
                    <span>0 membres</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/clubs/${club.id}`)}
                  >
                    <Eye size={14} className="mr-1.5" />
                    Voir détails
                  </Button>
                  <ProtectedAction allowed={auth.canEditClub(club as any)} message="Vous n'avez pas les droits de modifier ce club">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/clubs/${club.id}/edit`)}
                    >
                      <Edit size={14} className="mr-1.5" />
                      Modifier
                    </Button>
                  </ProtectedAction>
                  <ProtectedAction allowed={auth.canDeleteClub(club as any)} message="Vous n'avez pas les droits de supprimer ce club">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(club)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </ProtectedAction>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredClubs.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          Aucun club trouvé
        </div>
      )}
    </div>
  );
}
