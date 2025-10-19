'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Space,
  Tag,
  Typography,
  Spin,
  Descriptions,
  Popconfirm,
  message,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import useArticle from '../../../hooks/useArticle';
import useArticles from '../../../hooks/useArticles';
import {
  ArticleCategoryLabels,
  ArticleStatusLabels,
  ArticleStatusColors,
} from '../../../types/article';

const { Title, Text, Paragraph } = Typography;

// Dynamically import Editor in read-only mode
const EditorComponent = dynamic(
  () => import('../../../components/Editor/EditorComponent'),
  { ssr: false }
);

export default function ArticleViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { article, loading: articleLoading } = useArticle(resolvedParams.id);
  const { deleteArticle, publishArticle, unpublishArticle, archiveArticle } = useArticles();

  const handleEdit = () => {
    router.push(`/articles/${resolvedParams.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(resolvedParams.id);
      message.success('Article supprimé');
      router.push('/articles');
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const handlePublish = async () => {
    const result = await publishArticle(resolvedParams.id);
    if (result) {
      message.success('Article publié');
      // Refresh page to show updated status
      window.location.reload();
    }
  };

  const handleUnpublish = async () => {
    const result = await unpublishArticle(resolvedParams.id);
    if (result) {
      message.success('Article dépublié');
      window.location.reload();
    }
  };

  const handleArchive = async () => {
    const result = await archiveArticle(resolvedParams.id);
    if (result) {
      message.success('Article archivé');
      window.location.reload();
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
      {/* Header Actions */}
      <Space style={{ marginBottom: 24, width: '100%', justifyContent: 'space-between' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/articles')}>
          Retour aux articles
        </Button>

        <Space>
          {article.status === 'DRAFT' && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handlePublish}
            >
              Publier
            </Button>
          )}
          {article.status === 'PUBLISHED' && (
            <Button
              icon={<CloseCircleOutlined />}
              onClick={handleUnpublish}
            >
              Dépublier
            </Button>
          )}
          <Button
            icon={<InboxOutlined />}
            onClick={handleArchive}
          >
            Archiver
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Modifier
          </Button>
          <Popconfirm
            title="Supprimer cet article ?"
            description="Cette action est irréversible."
            onConfirm={handleDelete}
            okText="Oui, supprimer"
            cancelText="Annuler"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      </Space>

      {/* Article Metadata */}
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Space>
              <Tag color={ArticleStatusColors[article.status]}>
                {ArticleStatusLabels[article.status]}
              </Tag>
              <Tag color="blue">{ArticleCategoryLabels[article.category]}</Tag>
              {article.featured && <Tag color="gold">À la une</Tag>}
            </Space>
          </div>

          <Title level={1} style={{ marginBottom: 0 }}>
            {article.title}
          </Title>

          {article.excerpt && (
            <Paragraph type="secondary" style={{ fontSize: 16 }}>
              {article.excerpt}
            </Paragraph>
          )}

          <Descriptions column={2}>
            <Descriptions.Item label="Auteur">
              {article.author.name}
            </Descriptions.Item>
            <Descriptions.Item label="Vues">
              <Space>
                <EyeOutlined />
                {article.viewCount}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Créé le">
              {dayjs(article.createdAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Modifié le">
              {dayjs(article.updatedAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            {article.publishedAt && (
              <Descriptions.Item label="Publié le">
                {dayjs(article.publishedAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Slug">
              <Text code>{article.slug}</Text>
            </Descriptions.Item>
          </Descriptions>

          {article.tags && article.tags.length > 0 && (
            <div>
              <Text strong>Tags : </Text>
              <Space wrap>
                {article.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </div>
          )}

          {article.coverImage && (
            <div>
              <Text strong>Image de couverture :</Text>
              <div style={{ marginTop: 8 }}>
                <img
                  src={article.coverImage}
                  alt={article.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 400,
                    borderRadius: 8,
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
          )}
        </Space>
      </Card>

      {/* Article Content */}
      <Card title="Contenu de l'Article">
        <EditorComponent
          value={article.content}
          readOnly={true}
        />
      </Card>
    </div>
  );
}
