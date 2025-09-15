"use client";
import { useState } from 'react';
import { Table, Typography, Space, Button, Drawer, Form, Input, App } from 'antd';
import { Club } from '@/types/member';
import useClubs from '@/hooks/useClubs';

export default function ClubsPage() {
  const { message } = App.useApp();
  const { clubs, loading, total, createClub, updateClub, deleteClub } = useClubs({ enabled: true });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Club | null>(null);
  const [form] = Form.useForm<Club>();
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const openEdit = (club: Club) => {
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

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>Clubs</Typography.Title>
          <Button type="primary" onClick={openCreate}>Ajouter un club</Button>
        </Space>
        <Table<Club>
          size="small"
          loading={loading}
          dataSource={clubs}
          rowKey={c => c.id}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            onChange: (p, ps) => { setPage(p); setPageSize(ps); }
          }}
          columns={[
            { title: 'ID', dataIndex: 'id', width: 70 },
            { title: 'Nom', dataIndex: 'name' },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Ville', dataIndex: 'city', width: 120 },
            { title: 'Téléphone', dataIndex: 'phone', width: 120 },
            { title: 'Date création', dataIndex: 'creationDate', width: 120, render: (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-' },
            {
              title: 'Actions', width: 150,
              render: (_, record) => (
                <Space size="small">
                  <Button size="small" onClick={() => openEdit(record)}>Modifier</Button>
                  <Button size="small" danger onClick={() => handleDelete(record)}>Supprimer</Button>
                </Space>
              )
            }
          ]}
        />
      </Space>
      <Drawer
        title={editing ? `Modifier ${editing.name}` : 'Nouveau club'}
        open={drawerOpen}
        onClose={closeDrawer}
        width={420}
        destroyOnClose
        extra={
          <Space>
            <Button onClick={closeDrawer}>Annuler</Button>
            <Button type="primary" loading={saving} onClick={submit}>
              {editing ? 'Enregistrer' : 'Créer'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nom du club" rules={[{ required: true, message: 'Nom requis' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email invalide' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Téléphone">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Adresse">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Ville">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="logoUrl" label="URL du logo">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}