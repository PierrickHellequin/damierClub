'use client';

import React, { useState } from 'react';
import { Row, Col, Button, Input, Select, Space, Pagination, Spin, Alert, Modal, message, Statistic } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useNotes } from '../../hooks/useNotes';
import { useNoteStats } from '../../hooks/useNote';
import NoteCard from '../../components/NoteCard/NoteCard';
import { NoteVisibility, NoteVisibilityLabels } from '../../types/note';

const { Search } = Input;
const { Option } = Select;

export default function NotesPage() {
  const router = useRouter();
  const { notes, page, filters, loading, error, updateFilters, changePage, deleteNote, pinNote, unpinNote } = useNotes();
  const { stats } = useNoteStats();

  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    updateFilters({ search: value || undefined });
  };

  const handleVisibilityFilter = (value: string) => {
    updateFilters({ visibility: value ? (value as NoteVisibility) : undefined });
  };

  const handlePinnedFilter = (value: string) => {
    const pinnedValue = value === 'true' ? true : value === 'false' ? false : undefined;
    updateFilters({ pinned: pinnedValue });
  };

  const handleDelete = (id: string) => {
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
        } else {
          message.error('Erreur lors de la suppression de la note');
        }
      },
    });
  };

  const handlePin = async (id: string) => {
    const result = await pinNote(id);
    if (result) {
      message.success('Note épinglée');
    } else {
      message.error('Erreur lors de l\'épinglage');
    }
  };

  const handleUnpin = async (id: string) => {
    const result = await unpinNote(id);
    if (result) {
      message.success('Note détachée');
    } else {
      message.error('Erreur lors du détachage');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Notes</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/notes/new')}>
          Nouvelle note
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Statistic title="Total" value={stats.total} />
          </Col>
          <Col span={6}>
            <Statistic title="Privées" value={stats.privateNotes} />
          </Col>
          <Col span={6}>
            <Statistic title="Club" value={stats.clubNotes} />
          </Col>
          <Col span={6}>
            <Statistic title="Tous les membres" value={stats.membersNotes} />
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Space style={{ marginBottom: '24px', width: '100%' }} direction="vertical" size="middle">
        <Search
          placeholder="Rechercher dans les notes..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          style={{ maxWidth: '600px' }}
        />

        <Space size="middle">
          <Select
            placeholder="Visibilité"
            allowClear
            style={{ width: 200 }}
            onChange={handleVisibilityFilter}
          >
            <Option value={NoteVisibility.PRIVATE}>{NoteVisibilityLabels[NoteVisibility.PRIVATE]}</Option>
            <Option value={NoteVisibility.CLUB}>{NoteVisibilityLabels[NoteVisibility.CLUB]}</Option>
            <Option value={NoteVisibility.MEMBERS}>{NoteVisibilityLabels[NoteVisibility.MEMBERS]}</Option>
          </Select>

          <Select
            placeholder="Statut"
            allowClear
            style={{ width: 150 }}
            onChange={handlePinnedFilter}
          >
            <Option value="true">Épinglées</Option>
            <Option value="false">Non épinglées</Option>
          </Select>
        </Space>
      </Space>

      {/* Error */}
      {error && (
        <Alert
          message="Erreur"
          description={error}
          type="error"
          closable
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      )}

      {/* Notes Grid */}
      {!loading && notes.length === 0 && (
        <Alert
          message="Aucune note trouvée"
          description="Créez votre première note en cliquant sur le bouton 'Nouvelle note'."
          type="info"
          showIcon
        />
      )}

      {!loading && notes.length > 0 && (
        <>
          <Row gutter={[16, 16]}>
            {notes.map((note) => (
              <Col key={note.id} xs={24} sm={12} md={8} lg={6}>
                <NoteCard
                  note={note}
                  onPin={handlePin}
                  onUnpin={handleUnpin}
                  onDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {page && page.totalPages > 1 && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Pagination
                current={page.number + 1}
                pageSize={page.size}
                total={page.totalElements}
                onChange={(pageNum) => changePage(pageNum - 1)}
                showSizeChanger={false}
                showTotal={(total) => `Total ${total} notes`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
