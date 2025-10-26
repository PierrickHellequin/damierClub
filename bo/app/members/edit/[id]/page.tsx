"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Form, Input as AntInput, DatePicker, Select, Switch, InputNumber, App } from 'antd';
import { useAuth } from '@/components/AuthProvider';
import useClubs from '@/hooks/useClubs';
import useMember from '@/hooks/useMember';
import { memberProvider } from '@/providers/memberProvider';
import { Member, ClubRole } from '@/types/member';
import dayjs from 'dayjs';

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { message } = App.useApp();
  const idParam = params?.id;
  const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : null;
  const { member, loading, error, reload } = useMember(id);
  const { clubs, loading: clubsLoading } = useClubs({ enabled: true });
  const [form] = Form.useForm<Member & { birthDateObj?: dayjs.Dayjs; clubId?: string }>();
  const [saving, setSaving] = useState(false);

  // Options pour les rôles du club
  const clubRoleOptions = Object.values(ClubRole).map(role => ({
    value: role,
    label: role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));

  // Pré-remplir le formulaire quand le membre est chargé
  useEffect(() => {
    if (member) {
      form.setFieldsValue({
        ...member,
        birthDateObj: member.birthDate ? dayjs(member.birthDate) : undefined,
        clubId: member.clubId
      } as any);
    }
  }, [member, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!member) return;
      setSaving(true);

      const payload: Partial<Member> = {
        ...member,
        ...values,
        birthDate: values.birthDateObj ? values.birthDateObj.format('YYYY-MM-DD') : undefined
      };
      delete (payload as any).birthDateObj;

      // If club is selected, add club object with ID
      if (values.clubId) {
        payload.club = { id: values.clubId } as any;
      } else {
        payload.club = null as any;
      }
      delete (payload as any).clubId;

      await memberProvider.updateMember(member.id, payload);
      message.success('Membre mis à jour avec succès');
      router.push('/members');
    } catch (e: any) {
      console.error('Save error:', e);
      if (!e?.errorFields) {
        message.error(e.message || 'Erreur lors de la mise à jour');
      }
    } finally {
      setSaving(false);
    }
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

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
            <h2 className="text-2xl font-semibold text-gray-900">Modifier le membre</h2>
            <p className="text-gray-500 mt-1">Modifiez les informations du membre</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form form={form} layout="vertical">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label="Pseudo"
                name="name"
                rules={[{ required: true, message: 'Pseudo requis' }]}
              >
                <AntInput placeholder="Ex: martin_d" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Email requis' },
                  { type: 'email', message: 'Email invalide' }
                ]}
              >
                <AntInput type="email" placeholder="martin.dubois@email.com" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label="Prénom" name="firstName">
                <AntInput placeholder="Ex: Martin" />
              </Form.Item>

              <Form.Item label="Nom" name="lastName">
                <AntInput placeholder="Ex: Dubois" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label="Téléphone" name="phone">
                <AntInput placeholder="06 12 34 56 78" />
              </Form.Item>

              <Form.Item label="Date de naissance" name="birthDateObj">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label="Ville" name="city">
                <AntInput placeholder="Ex: Paris" />
              </Form.Item>

              <Form.Item label="Sexe" name="gender">
                <Select
                  allowClear
                  placeholder="Sélectionner"
                  options={[
                    { value: 'M', label: 'Masculin' },
                    { value: 'F', label: 'Féminin' },
                    { value: 'Autre', label: 'Autre' }
                  ]}
                />
              </Form.Item>
            </div>

            <Form.Item label="Adresse" name="address">
              <AntInput placeholder="Adresse complète" />
            </Form.Item>
          </CardContent>
        </Card>

        {/* Club Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations club</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label="Club" name="clubId">
                <Select
                  placeholder="Sélectionner un club"
                  allowClear
                  loading={clubsLoading}
                  disabled={!isSuperAdmin}
                  options={clubs.map(club => ({ value: club.id, label: club.name }))}
                  onChange={(clubId) => {
                    if (!clubId) {
                      form.setFieldValue('clubRole', undefined);
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Rôle dans le club"
                name="clubRole"
                dependencies={['clubId']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const clubId = getFieldValue('clubId');
                      if (value && !clubId) {
                        return Promise.reject(new Error('Vous devez d\'abord sélectionner un club'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Select
                  placeholder="Sélectionner un rôle"
                  allowClear
                  disabled={!form.getFieldValue('clubId')}
                  options={clubRoleOptions}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label="Taux ELO" name="rate">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="1500"
                  min={0}
                  max={3000}
                />
              </Form.Item>

              <Form.Item label="Statut" name="active" valuePropName="checked">
                <div className="flex items-center gap-2">
                  <Switch />
                  <span className="text-sm text-gray-600">Membre actif</span>
                </div>
              </Form.Item>
            </div>
          </CardContent>
        </Card>
      </Form>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={18} className="mr-2" />
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </div>
  );
}
