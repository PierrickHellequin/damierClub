'use client';

import React from 'react';
import { Card, Tag, Typography, Space, Tooltip } from 'antd';
import { PushpinOutlined, PushpinFilled, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { Note } from '../../types/note';
import { NoteVisibilityLabels } from '../../types/note';
import './NoteCard.css';

const { Text, Paragraph } = Typography;

interface NoteCardProps {
  note: Note;
  onPin?: (id: string) => void;
  onUnpin?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function NoteCard({ note, onPin, onUnpin, onDelete, onEdit }: NoteCardProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/notes/${note.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(note.id);
    } else {
      router.push(`/notes/${note.id}/edit`);
    }
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.pinned && onUnpin) {
      onUnpin(note.id);
    } else if (!note.pinned && onPin) {
      onPin(note.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(note.id);
    }
  };

  // Strip HTML tags from content for preview
  const getTextPreview = (html: string, maxLength: number = 150) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Card
      className="note-card"
      style={{ backgroundColor: note.color || '#FFFFFF' }}
      hoverable
      onClick={handleView}
      actions={[
        <Tooltip title={note.pinned ? 'Détacher' : 'Épingler'} key="pin">
          {note.pinned ? (
            <PushpinFilled onClick={handlePin} style={{ color: '#ff4d4f' }} />
          ) : (
            <PushpinOutlined onClick={handlePin} />
          )}
        </Tooltip>,
        <Tooltip title="Voir" key="view">
          <EyeOutlined onClick={handleView} />
        </Tooltip>,
        <Tooltip title="Modifier" key="edit">
          <EditOutlined onClick={handleEdit} />
        </Tooltip>,
        <Tooltip title="Supprimer" key="delete">
          <DeleteOutlined onClick={handleDelete} />
        </Tooltip>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text strong style={{ fontSize: '16px', marginBottom: '8px' }}>
            {note.title}
          </Text>
          {note.pinned && <PushpinFilled style={{ color: '#ff4d4f', fontSize: '16px' }} />}
        </div>

        <Paragraph
          ellipsis={{ rows: 3 }}
          style={{ marginBottom: '8px', color: '#666' }}
        >
          {getTextPreview(note.content)}
        </Paragraph>

        <Space size="small" wrap>
          <Tag color="blue">{NoteVisibilityLabels[note.visibility]}</Tag>
          {note.club && <Tag color="green">{note.club.name}</Tag>}
        </Space>

        <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
          <Text type="secondary">
            Par {note.author.firstName} {note.author.lastName}
          </Text>
          <br />
          <Text type="secondary">
            {new Date(note.updatedAt).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </div>
      </Space>
    </Card>
  );
}
