'use client';

import React, { useState } from 'react';
import { App, Modal, Select as AntSelect } from 'antd';
import { useRouter } from 'next/navigation';
import { useNotes } from '../../hooks/useNotes';
import { useNoteStats } from '../../hooks/useNote';
import NoteCard from '../../components/NoteCard/NoteCard';
import { NoteVisibility, NoteVisibilityLabels } from '../../types/note';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

const { Option } = AntSelect;

export default function NotesPage() {
  const router = useRouter();
  const { notes, page, filters, loading, error, updateFilters, changePage, deleteNote, pinNote, unpinNote } = useNotes();
  const { stats } = useNoteStats();
  const { message } = App.useApp();

  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Notes Internes</h2>
          <p className="text-gray-500 mt-1">Gérez vos notes et mémos personnels</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/notes/new')}
        >
          <Plus size={20} className="mr-2" />
          Nouvelle note
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">Notes créées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Privées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.privateNotes}</div>
              <p className="text-xs text-blue-600 mt-1">Visibles par vous</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Club</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.clubNotes}</div>
              <p className="text-xs text-green-600 mt-1">Visibles par le club</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Membres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.membersNotes}</div>
              <p className="text-xs text-gray-500 mt-1">Visibles par tous</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Rechercher dans les notes..."
                className="pl-10"
                value={searchValue}
                onChange={handleSearch}
              />
            </div>

            <div className="flex gap-4">
              <AntSelect
                placeholder="Visibilité"
                allowClear
                style={{ width: 200 }}
                onChange={handleVisibilityFilter}
              >
                <Option value={NoteVisibility.PRIVATE}>{NoteVisibilityLabels[NoteVisibility.PRIVATE]}</Option>
                <Option value={NoteVisibility.CLUB}>{NoteVisibilityLabels[NoteVisibility.CLUB]}</Option>
                <Option value={NoteVisibility.MEMBERS}>{NoteVisibilityLabels[NoteVisibility.MEMBERS]}</Option>
              </AntSelect>

              <AntSelect
                placeholder="Statut"
                allowClear
                style={{ width: 150 }}
                onChange={handlePinnedFilter}
              >
                <Option value="true">Épinglées</Option>
                <Option value="false">Non épinglées</Option>
              </AntSelect>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-gray-500">Chargement...</div>
        </div>
      )}

      {/* Notes Grid */}
      {!loading && notes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Aucune note trouvée</p>
            <p className="text-sm text-gray-400 mt-2">Créez votre première note en cliquant sur le bouton "Nouvelle note"</p>
          </CardContent>
        </Card>
      )}

      {!loading && notes.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPin={handlePin}
                onUnpin={handleUnpin}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {page && page.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => changePage(Math.max(0, page.number - 1))}
                disabled={page.number === 0}
              >
                Précédent
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {page.number + 1} sur {page.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => changePage(Math.min(page.totalPages - 1, page.number + 1))}
                disabled={page.number >= page.totalPages - 1}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
