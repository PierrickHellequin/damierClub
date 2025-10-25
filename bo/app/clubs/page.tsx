"use client";
import { useState } from 'react';
import { App, Drawer, Form, Input as AntInput } from 'antd';
import { Club } from '@/types/member';
import useClubs from '@/hooks/useClubs';
import { useAuthorization } from '@/hooks/useAuthorization';
import { ProtectedAction } from '@/components/ProtectedAction/ProtectedAction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';

export default function ClubsPage() {
  const { message } = App.useApp();
  const { clubs, loading, createClub, updateClub, deleteClub } = useClubs({ enabled: true });
  const auth = useAuthorization();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Club | null>(null);
  const [form] = Form.useForm<Club>();
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les clubs selon les droits
  const visibleClubs = auth.isSuperAdmin
    ? clubs
    : clubs.filter(club => auth.canViewClub(club as any));

  // Filter clubs based on search
  const filteredClubs = visibleClubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const openEdit = (club: Club) => {
    if (!auth.canEditClub(club as any)) {
      message.error('Vous n\'avez pas les droits de modifier ce club');
      return;
    }
    setEditing(club);
    form.setFieldsValue(club);
    setDrawerOpen(true);
  };

  const closeDrawer = () => { setDrawerOpen(false); };

  const submit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      if (editing) {
        await updateClub(editing.id, values);
        message.success('Club mis à jour');
      } else {
        await createClub(values);
        message.success('Club créé');
      }
      closeDrawer();
    } catch (e: any) {
      if (!e?.errorFields) message.error(e?.message || 'Erreur formulaire');
    } finally { setSaving(false); }
  };

  const handleDelete = async (club: Club) => {
    try {
      await deleteClub(club.id);
      message.success('Club supprimé');
    } catch (e: any) {
      message.error(e?.message || 'Erreur suppression');
    }
  };

  // Calculate stats
  const totalClubs = filteredClubs.length;
  const activeClubs = filteredClubs.filter(c => c.name).length; // Mock active status
  const totalMembers = 0; // Mock - would come from API

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
            onClick={openCreate}
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
            <div className="text-2xl font-bold text-gray-900">{totalClubs > 0 ? (totalMembers / totalClubs).toFixed(1) : 0}</div>
            <p className="text-xs text-gray-500 mt-1">Membres</p>
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
                placeholder="Rechercher un club..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
                    <CardTitle className="text-lg">{club.name}</CardTitle>
                    {club.city && (
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{club.city}</span>
                      </div>
                    )}
                  </div>
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-700"
                  >
                    actif
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact */}
                <div className="space-y-2 text-sm">
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
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <ProtectedAction allowed={auth.canEditClub(club as any)} message="Vous n'avez pas les droits de modifier ce club">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEdit(club)}
                    >
                      <Edit size={14} className="mr-1.5" />
                      Modifier
                    </Button>
                  </ProtectedAction>
                  <ProtectedAction allowed={auth.canDeleteClub(club as any)} message="Vous n'avez pas les droits de supprimer ce club">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
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

      {/* Ant Design Drawer for Create/Edit Form */}
      <Drawer
        title={editing ? `Modifier ${editing.name}` : 'Nouveau club'}
        open={drawerOpen}
        onClose={closeDrawer}
        width={420}
        destroyOnClose
        extra={
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeDrawer}>Annuler</Button>
            <Button onClick={submit} disabled={saving}>
              {saving ? 'Enregistrement...' : (editing ? 'Enregistrer' : 'Créer')}
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nom du club" rules={[{ required: true, message: 'Nom requis' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email invalide' }]}>
            <AntInput />
          </Form.Item>
          <Form.Item name="phone" label="Téléphone">
            <AntInput />
          </Form.Item>
          <Form.Item name="address" label="Adresse">
            <AntInput />
          </Form.Item>
          <Form.Item name="city" label="Ville">
            <AntInput />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <AntInput.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="logoUrl" label="URL du logo">
            <AntInput placeholder="https://..." />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
