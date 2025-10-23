'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Dropdown,
  App,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useArticles from '../../hooks/useArticles';
import type {
  Article,
  ArticleStatus,
  ArticleCategory,
  ArticleFilters,
} from '../../types/article';
import {
  ArticleCategoryLabels,
  ArticleStatusLabels,
  ArticleStatusColors,
} from '../../types/article';

const { Title } = Typography;
const { Search } = Input;

export default function ArticlesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ArticleFilters>({
    page: 0,
    size: 10,
    sortBy: 'updatedAt',
    sortDirection: 'desc',
  });
  const { message } = App.useApp();

  const {
    articles,
    loading,
    totalElements,
    totalPages,
    currentPage,
    stats,
    fetchArticles,
    deleteArticle,
    publishArticle,
    unpublishArticle,
    archiveArticle,
  } = useArticles(filters);

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, search: value || undefined, page: 0 };
    setFilters(newFilters);
    fetchArticles(newFilters);
  };

  const handleFilterStatus = (value: ArticleStatus | undefined) => {
    const newFilters = { ...filters, status: value, page: 0 };
    setFilters(newFilters);
    fetchArticles(newFilters);
  };

  const handleFilterCategory = (value: ArticleCategory | undefined) => {
    const newFilters = { ...filters, category: value, page: 0 };
    setFilters(newFilters);
    fetchArticles(newFilters);
  };

  const handleTableChange = (pagination: any) => {
    const newFilters = { ...filters, page: pagination.current - 1, size: pagination.pageSize };
    setFilters(newFilters);
    fetchArticles(newFilters);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id);
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const handlePublish = async (id: string) => {
    const result = await publishArticle(id);
    if (result) {
      message.success('Article publié');
    }
  };

  const handleUnpublish = async (id: string) => {
    const result = await unpublishArticle(id);
    if (result) {
      message.success('Article dépublié');
    }
  };

  const handleArchive = async (id: string) => {
    const result = await archiveArticle(id);
    if (result) {
      message.success('Article archivé');
    }
  };

  const columns: ColumnsType<Article> = [
    {
      title: 'Titre',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      render: (text: string, record: Article) => (
        <Space direction="vertical" size={0}>
          <a
            onClick={() => router.push(`/articles/${record.id}`)}
            style={{ fontWeight: 500 }}
          >
            {text}
          </a>
          {record.featured && <Tag color="gold">À la une</Tag>}
        </Space>
      ),
    },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
      render: (category: ArticleCategory) => (
        <Tag color="blue">{ArticleCategoryLabels[category]}</Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: ArticleStatus) => (
        <Tag color={ArticleStatusColors[status]}>
          {ArticleStatusLabels[status]}
        </Tag>
      ),
    },
    {
      title: 'Auteur',
      dataIndex: ['author', 'name'],
      key: 'author',
    },
    {
      title: 'Vues',
      dataIndex: 'viewCount',
      key: 'viewCount',
      align: 'center',
      sorter: true,
    },
    {
      title: 'Modifié le',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_: any, record: Article) => {
        const menuItems = [
          {
            key: 'view',
            label: 'Voir',
            icon: <EyeOutlined />,
            onClick: () => router.push(`/articles/${record.id}`),
          },
          {
            key: 'edit',
            label: 'Modifier',
            icon: <EditOutlined />,
            onClick: () => router.push(`/articles/${record.id}/edit`),
          },
          { type: 'divider' as const },
        ];

        if (record.status === 'DRAFT') {
          menuItems.push({
            key: 'publish',
            label: 'Publier',
            icon: <CheckCircleOutlined />,
            onClick: () => handlePublish(record.id),
          });
        } else if (record.status === 'PUBLISHED') {
          menuItems.push({
            key: 'unpublish',
            label: 'Dépublier',
            icon: <CloseCircleOutlined />,
            onClick: () => handleUnpublish(record.id),
          });
        }

        menuItems.push({
          key: 'archive',
          label: 'Archiver',
          icon: <InboxOutlined />,
          onClick: () => handleArchive(record.id),
        });

        menuItems.push({ type: 'divider' as const });

        menuItems.push({
          key: 'delete',
          label: 'Supprimer',
          icon: <DeleteOutlined />,
          danger: false,
          onClick: () => {
            message.warning({
              content: (
                <Popconfirm
                  title="Êtes-vous sûr de vouloir supprimer cet article ?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Oui"
                  cancelText="Non"
                >
                  <Button type="link" danger>
                    Confirmer la suppression
                  </Button>
                </Popconfirm>
              ),
              duration: 0,
            });
          },
        } as any);

        return (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => router.push(`/articles/${record.id}/edit`)}
            />
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Articles</Title>

      {/* Statistics */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Publiés"
                value={stats.published}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Brouillons"
                value={stats.draft}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Archivés"
                value={stats.archived}
                valueStyle={{ color: '#8c8c8c' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        {/* Filters */}
        <Space style={{ marginBottom: 16, width: '100%' }} direction="vertical">
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Search
                placeholder="Rechercher un article..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="Statut"
                allowClear
                style={{ width: 150 }}
                onChange={handleFilterStatus}
                options={[
                  { label: 'Brouillon', value: 'DRAFT' },
                  { label: 'Publié', value: 'PUBLISHED' },
                  { label: 'Archivé', value: 'ARCHIVED' },
                ]}
              />
              <Select
                placeholder="Catégorie"
                allowClear
                style={{ width: 150 }}
                onChange={handleFilterCategory}
                options={Object.entries(ArticleCategoryLabels).map(([value, label]) => ({
                  label,
                  value,
                }))}
              />
            </Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/articles/new')}
            >
              Nouvel Article
            </Button>
          </Space>
        </Space>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={articles}
          loading={loading}
          rowKey="id"
          pagination={{
            current: currentPage + 1,
            pageSize: filters.size,
            total: totalElements,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} articles`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}

