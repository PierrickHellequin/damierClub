"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { App } from 'antd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { clubProvider } from '@/providers/clubProvider';
import useClub from '@/hooks/useClub';

export default function EditClubPage() {
  const router = useRouter();
  const params = useParams();
  const clubId = params.id as string;
  const { message } = App.useApp();
  const { club, loading: loadingClub } = useClub(clubId, { enabled: true });
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    description: '',
    creationDate: '',
    status: 'actif',
    address: '',
    email: '',
    phone: '',
    website: '',
    president: '',
    vicePresident: '',
    tresorier: '',
    secretaire: '',
  });

  // Load club data when available
  useEffect(() => {
    if (club) {
      setFormData({
        name: club.name || '',
        city: club.city || '',
        description: club.description || '',
        creationDate: club.creationDate ? new Date(club.creationDate).getFullYear().toString() : '',
        status: club.status || 'actif',
        address: club.address || '',
        email: club.email || '',
        phone: club.phone || '',
        website: club.website || '',
        president: club.president || '',
        vicePresident: club.vicePresident || '',
        tresorier: club.tresorier || '',
        secretaire: club.secretaire || '',
      });
    }
  }, [club]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      message.error('Le nom du club est requis');
      return;
    }
    if (!formData.city.trim()) {
      message.error('La ville est requise');
      return;
    }

    setLoading(true);
    try {
      // Prepare data for API
      const clubData = {
        ...formData,
        creationDate: formData.creationDate ? `${formData.creationDate}-01-01` : null,
      };

      await clubProvider.updateClub(clubId, clubData);
      message.success('Club modifié avec succès');
      router.push(`/clubs/${clubId}`);
    } catch (error: any) {
      message.error(error?.message || 'Erreur lors de la modification du club');
    } finally {
      setLoading(false);
    }
  };

  if (loadingClub) {
    return <div className="p-6">Chargement...</div>;
  }

  if (!club) {
    return <div className="p-6">Club non trouvé</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/clubs/${clubId}`)}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Modifier le club
            </h2>
            <p className="text-gray-500 mt-1">
              Modifiez les informations du club
            </p>
          </div>
        </div>
      </div>

      {/* Form - Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du club *</Label>
              <Input
                id="name"
                placeholder="Ex: Paris Dames Club"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                placeholder="Ex: Paris"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre club, son histoire, ses objectifs..."
              className="min-h-[100px]"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="creationDate">Année de création</Label>
              <Input
                id="creationDate"
                type="number"
                placeholder="Ex: 2015"
                value={formData.creationDate}
                onChange={(e) => handleChange('creationDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Coordonnées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              placeholder="Ex: 15 rue de la République, 75001 Paris"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@club.fr"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01 23 45 67 89"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Site web</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://www.club.fr"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bureau */}
      <Card>
        <CardHeader>
          <CardTitle>Bureau du club</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Membres dirigeants</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="president">Président</Label>
              <Input
                id="president"
                placeholder="Nom du président"
                value={formData.president}
                onChange={(e) => handleChange('president', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vicePresident">Vice-Président</Label>
              <Input
                id="vicePresident"
                placeholder="Nom du vice-président"
                value={formData.vicePresident}
                onChange={(e) => handleChange('vicePresident', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tresorier">Trésorier</Label>
              <Input
                id="tresorier"
                placeholder="Nom du trésorier"
                value={formData.tresorier}
                onChange={(e) => handleChange('tresorier', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretaire">Secrétaire</Label>
              <Input
                id="secretaire"
                placeholder="Nom du secrétaire"
                value={formData.secretaire}
                onChange={(e) => handleChange('secretaire', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/clubs/${clubId}`)}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Save size={18} className="mr-2" />
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </div>
  );
}
