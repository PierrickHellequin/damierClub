"use client";
import { useParams, useRouter } from 'next/navigation';
import useMember from '@/hooks/useMember';
import useClubs from '@/hooks/useClubs';
import { Card, Space, Typography, Tag, Button, Descriptions, Skeleton, Form, Input, DatePicker, Select, Switch, InputNumber, App } from 'antd';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Member, ClubRole } from '@/types/member';
import { memberProvider } from '@/providers/memberProvider';

export default function ProfilPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { message } = App.useApp();
  const idParam = params?.id;
  const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : null;
  const { member, loading, error, reload } = useMember(id);
  const { clubs, loading: clubsLoading } = useClubs({ enabled: true });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Options pour les rôles du club
  const clubRoleOptions = Object.values(ClubRole).map(role => ({
    value: role,
    label: role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));

  // Créer le form seulement quand nécessaire (après le premier render)
  const [form] = Form.useForm<Member & { birthDateObj?: dayjs.Dayjs; clubId?: number }>();

  // Pré-remplir le formulaire dès que member est chargé
  useEffect(() => {
    if (member) {
      form.setFieldsValue({
        ...member,
        birthDateObj: member.birthDate ? dayjs(member.birthDate) : undefined,
        clubId: member.clubId
      } as any);
    }
  }, [member, form]);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const startEdit = () => {
    if (!member) return;
    setEditing(true);
  };
  const cancelEdit = () => {
    if (member) {
      form.setFieldsValue({
        ...member,
        birthDateObj: member.birthDate ? dayjs(member.birthDate) : undefined
      } as any);
    }
    setEditing(false);
  };

  const save = async () => {
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

      // Si un club est sélectionné, ajouter l'objet club avec l'ID
      if (values.clubId) {
        payload.club = { id: values.clubId } as any;
        console.log('Saving with club:', { id: values.clubId });
      } else {
        payload.club = null as any;
        console.log('Saving without club');
      }
      delete (payload as any).clubId;

      console.log('Payload to send:', payload);
      await memberProvider.updateMember(member.id, payload);
      message.success('Profil mis à jour');
      setEditing(false);
      await reload();
    } catch (e: any) {
      console.error('Save error:', e);
      if (!e?.errorFields) message.error(e.message || 'Erreur sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Profil membre</Typography.Title>
        <Space>
          {!loading && !error && member && !editing && (
            <Button onClick={startEdit} type="primary" disabled={loading || saving}>Éditer</Button>
          )}
          {editing && (
            <>
              <Button onClick={cancelEdit}>Annuler</Button>
              <Button type="primary" loading={saving} onClick={save}>Enregistrer</Button>
            </>
          )}
          <Button onClick={() => router.back()}>Retour</Button>
        </Space>
      </Space>
      <Card>
        {loading && <Skeleton active />}
        {!loading && error && <Typography.Text type="danger">{error}</Typography.Text>}
        {!loading && !error && member && !editing && (
          <Descriptions bordered size="small" column={1} styles={{ label: { width: 180 } }}>
            <Descriptions.Item label="ID">{member.id}</Descriptions.Item>
            <Descriptions.Item label="Pseudo">{member.name}</Descriptions.Item>
            <Descriptions.Item label="Prénom">{member.firstName || '-'}</Descriptions.Item>
            <Descriptions.Item label="Nom">{member.lastName || '-'}</Descriptions.Item>
            <Descriptions.Item label="Email">{member.email}</Descriptions.Item>
            <Descriptions.Item label="Date de naissance">{member.birthDate ? dayjs(member.birthDate).format('DD/MM/YYYY') : '-'}</Descriptions.Item>
            <Descriptions.Item label="Sexe">{member.gender || '-'}</Descriptions.Item>
            <Descriptions.Item label="Club">{member.clubName || '-'}</Descriptions.Item>
            <Descriptions.Item label="Rôle dans le club">{member.clubRole ? member.clubRole.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : '-'}</Descriptions.Item>
            <Descriptions.Item label="Actif">{member.active === false ? <Tag color="red">Inactif</Tag> : <Tag color="green">Actif</Tag>}</Descriptions.Item>
            <Descriptions.Item label="Ville">{member.city || '-'}</Descriptions.Item>
            <Descriptions.Item label="Téléphone">{member.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="Adresse">{member.address || '-'}</Descriptions.Item>
            <Descriptions.Item label="Taux">{member.rate ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Rôle système">{member.role || '-'}</Descriptions.Item>
          </Descriptions>
        )}
        {!loading && !error && member && editing && (
          <Form layout="vertical" form={form} style={{ maxWidth: 560 }}>
            <Form.Item label="Pseudo" name="name" rules={[{ required: true, message: 'Pseudo requis' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Prénom" name="firstName">
              <Input />
            </Form.Item>
            <Form.Item label="Nom" name="lastName">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Email valide requis' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Date de naissance" name="birthDateObj">
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item label="Sexe" name="gender">
              <Select allowClear options={[{ value: 'M', label: 'M' }, { value: 'F', label: 'F' }, { value: 'Autre', label: 'Autre' }]} />
            </Form.Item>
            <Form.Item label="Club" name="clubId">
              <Select
                placeholder="Sélectionner un club"
                allowClear
                loading={clubsLoading}
                disabled={!isSuperAdmin}
                options={clubs.map(club => ({ value: club.id, label: club.name }))}
                onChange={(clubId) => {
                  // Si on supprime le club, supprimer aussi le rôle
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
                disabled={!form.getFieldValue('clubId')} // Désactivé si pas de club
                options={clubRoleOptions}
              />
            </Form.Item>
            <Form.Item label="Actif" name="active" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="Ville" name="city">
              <Input />
            </Form.Item>
            <Form.Item label="Téléphone" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Adresse" name="address">
              <Input />
            </Form.Item>
            <Form.Item label="Taux" name="rate">
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Rôle système" name="role">
              <Input disabled />
            </Form.Item>
          </Form>
        )}
      </Card>
    </Space>
  );
}
