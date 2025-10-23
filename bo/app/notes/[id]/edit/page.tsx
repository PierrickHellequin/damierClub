'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, App, Switch, Row, Col, Spin, Alert } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { useNote } from '../../../../hooks/useNote';
import { useNotes } from '../../../../hooks/useNotes';
import { NoteVisibility, NoteVisibilityLabels, NoteColors } from '../../../../types/note';
import type { NoteFormData } from '../../../../types/note';

const { TextArea } = Input;
const { Option } = Select;

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { note, loading: noteLoading, error: noteError } = useNote(id);
  const { updateNote } = useNotes();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(NoteColors[0]);
  const { message } = App.useApp();

  useEffect(() => {
    if (note) {
      form.setFieldsValue({
        title: note.title,
        content: note.content,
        visibility: note.visibility,
        pinned: note.pinned,
      });
      setSelectedColor(note.color);
    }
  }, [note, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const noteData: Partial<NoteFormData> = {
      title: values.title,
      content: values.content,
      visibility: values.visibility,
      pinned: values.pinned || false,
      color: selectedColor,
    };

    try {
      const result = await updateNote(id, noteData);
      if (result) {
        message.success('Note mise à jour avec succès');
        router.push(`/notes/${id}`);
      } else {
        message.error('Erreur lors de la mise à jour de la note');
      }
    } catch (err) {
      message.error('Erreur lors de la mise à jour de la note');
    } finally {
      setLoading(false);
    }
  };

  if (noteLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (noteError || !note) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Erreur"
          description={noteError || 'Note non trouvée'}
          type="error"
          showIcon
        />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginTop: '16px' }}
        >
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Retour
        </Button>
      </div>

      <Card title="Éditer la note">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Titre"
            name="title"
            rules={[
              { required: true, message: 'Le titre est requis' },
              { max: 200, message: 'Le titre ne peut pas dépasser 200 caractères' },
            ]}
          >
            <Input placeholder="Titre de la note" size="large" />
          </Form.Item>

          <Form.Item
            label="Contenu"
            name="content"
            rules={[{ required: true, message: 'Le contenu est requis' }]}
          >
            <TextArea
              rows={10}
              placeholder="Contenu de la note..."
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Visibilité"
                name="visibility"
                rules={[{ required: true, message: 'La visibilité est requise' }]}
              >
                <Select placeholder="Sélectionnez la visibilité">
                  <Option value={NoteVisibility.PRIVATE}>
                    {NoteVisibilityLabels[NoteVisibility.PRIVATE]}
                  </Option>
                  <Option value={NoteVisibility.CLUB}>
                    {NoteVisibilityLabels[NoteVisibility.CLUB]}
                  </Option>
                  <Option value={NoteVisibility.MEMBERS}>
                    {NoteVisibilityLabels[NoteVisibility.MEMBERS]}
                  </Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Couleur"
                name="color"
              >
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {NoteColors.map((color) => (
                    <div
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: color,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: selectedColor === color ? '3px solid #1890ff' : '2px solid #ddd',
                      }}
                    />
                  ))}
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Épinglée"
            name="pinned"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
              Enregistrer
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
