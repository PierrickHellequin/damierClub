'use client';

import React from 'react';
import { Card, Button, Tag, Space, Spin, Alert, Typography, Descriptions, message, Modal } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, PushpinOutlined, PushpinFilled } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { useNote } from '../../../hooks/useNote';
import { useNotes } from '../../../hooks/useNotes';
import { NoteVisibilityLabels } from '../../../types/note';

const { Title, Paragraph, Text } = Typography;

export default function NoteViewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { note, loading, error } = useNote(id);
  const { deleteNote, pinNote, unpinNote } = useNotes();

  const handleEdit = () => {
    router.push(`/notes/${id}/edit`);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Supprimer cette note ?',
      content: 'Cette action est irréversible.',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        const success = await deleteNote(id);
        if (success) {
          message.success('Note supprimée avec succès');
          router.push('/notes');
        } else {
          message.error('Erreur lors de la suppression de la note');
        }
      },
    });
  };

  const handleTogglePin = async () => {
    if (!note) return;

    if (note.pinned) {
      const result = await unpinNote(id);
      if (result) {
        message.success('Note détachée');
        window.location.reload(); // Reload to update the note
      } else {
        message.error('Erreur lors du détachage');
      }
    } else {
      const result = await pinNote(id);
      if (result) {
        message.success('Note épinglée');
        window.location.reload(); // Reload to update the note
      } else {
        message.error('Erreur lors de l\'épinglage');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Erreur"
          description={error || 'Note non trouvée'}
          type="error"
          showIcon
        />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/notes')}
          style={{ marginTop: '16px' }}
        >
          Retour aux notes
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Retour
        </Button>

        <Space>
          <Button
            icon={note.pinned ? <PushpinFilled /> : <PushpinOutlined />}
            onClick={handleTogglePin}
            type={note.pinned ? 'primary' : 'default'}
          >
            {note.pinned ? 'Détacher' : 'Épingler'}
          </Button>
          <Button icon={<EditOutlined />} onClick={handleEdit}>
            Modifier
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={handleDelete}>
            Supprimer
          </Button>
        </Space>
      </div>

      <Card style={{ backgroundColor: note.color || '#FFFFFF' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Title level={2} style={{ marginBottom: '8px' }}>
              {note.title}
              {note.pinned && (
                <PushpinFilled style={{ marginLeft: '12px', color: '#ff4d4f', fontSize: '24px' }} />
              )}
            </Title>

            <Space size="small" wrap>
              <Tag color="blue">{NoteVisibilityLabels[note.visibility]}</Tag>
              {note.club && <Tag color="green">{note.club.name}</Tag>}
              {note.pinned && <Tag color="red">Épinglée</Tag>}
            </Space>
          </div>

          <Descriptions column={1} bordered>
            <Descriptions.Item label="Auteur">
              {note.author.firstName} {note.author.lastName} ({note.author.email})
            </Descriptions.Item>
            <Descriptions.Item label="Créée le">
              {new Date(note.createdAt).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Modifiée le">
              {new Date(note.updatedAt).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Descriptions.Item>
          </Descriptions>

          <div>
            <Title level={4}>Contenu</Title>
            <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
              <Paragraph style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {note.content}
              </Paragraph>
            </Card>
          </div>
        </Space>
      </Card>
    </div>
  );
}
