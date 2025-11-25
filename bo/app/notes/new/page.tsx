'use client';

import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, App, Switch, Row, Col } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useNotes } from '../../../hooks/useNotes';
import useClubs from '../../../hooks/useClubs';
import { NoteVisibility, NoteVisibilityLabels, NoteColors } from '../../../types/note';
import type { NoteFormData } from '../../../types/note';

const { TextArea } = Input;
const { Option } = Select;

export default function NewNotePage() {
  const router = useRouter();
  const { createNote } = useNotes();
  const { clubs, loading: clubsLoading } = useClubs();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(NoteColors[0]);
  const { message } = App.useApp();

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const noteData: NoteFormData = {
      title: values.title,
      content: values.content,
      visibility: values.visibility,
      pinned: values.pinned || false,
      color: selectedColor,
      clubId: values.clubId,
    };

    try {
      const result = await createNote(noteData);
      if (result) {
        message.success('Note créée avec succès');
        router.push('/notes');
      } else {
        message.error('Erreur lors de la création de la note');
      }
    } catch (err) {
      message.error('Erreur lors de la création de la note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Retour
        </Button>
      </div>

      <Card title="Nouvelle note">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            visibility: NoteVisibility.PRIVATE,
            pinned: false,
          }}
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
              <Form.Item label="Club" name="clubId">
                <Select
                  placeholder="Sélectionnez un club (optionnel)"
                  allowClear
                  loading={clubsLoading}
                >
                  {clubs.map((club) => (
                    <Option key={club.id} value={club.id}>
                      {club.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Couleur" name="color">
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {NoteColors.map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color,
                    border: selectedColor === color ? '3px solid #1890ff' : '2px solid #d9d9d9',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>
          </Form.Item>

          <Form.Item label="Épingler cette note" name="pinned" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              size="large"
              block
            >
              Créer la note
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
