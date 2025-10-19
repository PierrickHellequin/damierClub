'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Space,
  Switch,
  message,
  Typography,
  Spin,
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import useArticle from '../../../../hooks/useArticle';
import useArticles from '../../../../hooks/useArticles';
import type { ArticleFormData } from '../../../../types/article';
import { ArticleCategoryLabels } from '../../../../types/article';

const { Title } = Typography;
const { TextArea } = Input;

// Dynamically import Lexical Editor to avoid SSR issues
const LexicalEditor = dynamic(
  () => import('../../../../components/Editor/LexicalEditor'),
  { ssr: false }
);

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [form] = Form.useForm();
  const { article, loading: articleLoading } = useArticle(resolvedParams.id);
  const { updateArticle } = useArticles();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (article) {
      form.setFieldsValue({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        category: article.category,
        coverImage: article.coverImage,
        tags: article.tags,
        featured: article.featured,
      });

      // Set content - support both HTML (new) and JSON (old Editor.js format)
      if (article.content) {
        try {
          // Try to parse as JSON (old format)
          JSON.parse(article.content);
          // If it parses, it's old Editor.js JSON - convert to plain text for now
          // TODO: Implement proper JSON to HTML conversion if needed
          setContent('<p>Ancien format Editor.js - veuillez rééditer le contenu</p>');
        } catch (e) {
          // Not JSON, assume it's HTML (new format)
          setContent(article.content);
        }
      }
    }
  }, [article, form]);

  const handleEditorChange = (htmlContent: string) => {
    setContent(htmlContent);
  };

  const handleSubmit = async (values: any) => {
    if (!content || content.trim() === '') {
      message.error('Le contenu de l\'article est requis');
      return;
    }

    setLoading(true);

    try {
      const formData: Partial<ArticleFormData> = {
        title: values.title,
        slug: values.slug,
        content: content, // Store HTML directly
        excerpt: values.excerpt,
        category: values.category,
        coverImage: values.coverImage,
        tags: values.tags,
        featured: values.featured || false,
      };

      const result = await updateArticle(resolvedParams.id, formData);

      if (result) {
        message.success('Article modifié avec succès');
        router.push(`/articles/${result.id}`);
      }
    } catch (error) {
      console.error('Failed to update article:', error);
      message.error('Échec de la modification de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/articles/${resolvedParams.id}`);
  };

  const generateSlug = () => {
    const title = form.getFieldValue('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setFieldValue('slug', slug);
    }
  };

  if (articleLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" tip="Chargement de l'article..." />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Title level={3}>Article non trouvé</Title>
        <Button onClick={() => router.push('/articles')}>
          Retour aux articles
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleCancel}>
          Retour
        </Button>
      </Space>

      <Title level={2}>Modifier l'Article</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Card title="Informations générales" style={{ marginBottom: 16 }}>
          <Form.Item
            label="Titre"
            name="title"
            rules={[{ required: true, message: 'Le titre est requis' }]}
          >
            <Input
              placeholder="Titre de l'article"
              size="large"
              onBlur={generateSlug}
            />
          </Form.Item>

          <Form.Item
            label="Slug (URL)"
            name="slug"
            rules={[
              { required: true, message: 'Le slug est requis' },
              {
                pattern: /^[a-z0-9-]+$/,
                message: 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets',
              },
            ]}
            extra="URL-friendly version du titre"
          >
            <Input placeholder="mon-article" />
          </Form.Item>

          <Form.Item
            label="Extrait / Résumé"
            name="excerpt"
            extra="Court résumé de l'article pour les listes et les previews"
          >
            <TextArea
              placeholder="Résumé de l'article..."
              rows={3}
              maxLength={300}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Catégorie"
            name="category"
            rules={[{ required: true, message: 'La catégorie est requise' }]}
          >
            <Select
              placeholder="Sélectionner une catégorie"
              options={Object.entries(ArticleCategoryLabels).map(([value, label]) => ({
                label,
                value,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Image de couverture"
            name="coverImage"
            extra="URL de l'image de couverture"
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item
            label="Tags"
            name="tags"
            extra="Mots-clés pour faciliter la recherche"
          >
            <Select
              mode="tags"
              placeholder="Ajouter des tags"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="À la une"
            name="featured"
            valuePropName="checked"
            extra="Afficher cet article dans la section À la une"
          >
            <Switch />
          </Form.Item>
        </Card>

        <Card title="Contenu" style={{ marginBottom: 16 }}>
          <Form.Item
            extra="Utilisez l'éditeur pour modifier le contenu de votre article"
            style={{ marginBottom: 0 }}
          >
            <LexicalEditor
              value={content}
              onChange={handleEditorChange}
              placeholder="Commencez à écrire votre article..."
              height={600}
            />
          </Form.Item>
        </Card>

        <Card>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>Annuler</Button>
            <Button
              type="default"
              icon={<EyeOutlined />}
              disabled
            >
              Aperçu
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              Enregistrer les Modifications
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
}
