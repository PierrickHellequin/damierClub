'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { App, Popconfirm, Select as AntSelect, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Send, Archive, Undo2 } from 'lucide-react';
import dayjs from 'dayjs';
import exerciseProvider from '../../providers/exerciseProvider';
import {
  type Exercise,
  ExerciseDifficultyLabels,
  ExerciseSideLabels,
  ExerciseStatus,
  ExerciseStatusColors,
  ExerciseStatusLabels,
} from '../../types/exercise';

export default function ExercisesPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [items, setItems] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ExerciseStatus | undefined>();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await exerciseProvider.getExercises({
        size: 100,
        status: statusFilter,
      });
      setItems(res.content);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur';
      message.error(`Chargement impossible : ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [message, statusFilter]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function publish(id: string) {
    try {
      await exerciseProvider.publishExercise(id);
      message.success('Exercice publié');
      fetchAll();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur';
      message.error(msg);
    }
  }
  async function unpublish(id: string) {
    try {
      await exerciseProvider.unpublishExercise(id);
      message.success('Exercice repassé en brouillon');
      fetchAll();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur';
      message.error(msg);
    }
  }
  async function archive(id: string) {
    try {
      await exerciseProvider.archiveExercise(id);
      message.success('Exercice archivé');
      fetchAll();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur';
      message.error(msg);
    }
  }
  async function remove(id: string) {
    try {
      await exerciseProvider.deleteExercise(id);
      message.success('Exercice supprimé');
      fetchAll();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur';
      message.error(msg);
    }
  }

  const columns: ColumnsType<Exercise> = [
    {
      title: 'Titre',
      dataIndex: 'title',
      key: 'title',
      render: (value: string, row: Exercise) => (
        <div>
          <div className="font-medium">{value}</div>
          {row.description ? (
            <div className="text-xs text-gray-500 line-clamp-1">{row.description}</div>
          ) : null}
        </div>
      ),
    },
    {
      title: 'Niveau',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 140,
      render: (v: keyof typeof ExerciseDifficultyLabels) => ExerciseDifficultyLabels[v],
    },
    {
      title: 'Trait',
      dataIndex: 'sideToPlay',
      key: 'sideToPlay',
      width: 90,
      render: (v: keyof typeof ExerciseSideLabels) => ExerciseSideLabels[v],
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (v: ExerciseStatus) => (
        <Tag color={ExerciseStatusColors[v]}>{ExerciseStatusLabels[v]}</Tag>
      ),
    },
    {
      title: 'Mis à jour',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 140,
      render: (v: string) => dayjs(v).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 280,
      render: (_: unknown, row: Exercise) => (
        <div className="flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/exercises/${row.id}/edit`)}
          >
            <Pencil className="size-4 mr-1" /> Éditer
          </Button>
          {row.status !== ExerciseStatus.PUBLISHED ? (
            <Button variant="ghost" size="sm" onClick={() => publish(row.id)}>
              <Send className="size-4 mr-1" /> Publier
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => unpublish(row.id)}>
              <Undo2 className="size-4 mr-1" /> Brouillon
            </Button>
          )}
          {row.status !== ExerciseStatus.ARCHIVED ? (
            <Button variant="ghost" size="sm" onClick={() => archive(row.id)}>
              <Archive className="size-4 mr-1" /> Archiver
            </Button>
          ) : null}
          <Popconfirm
            title="Supprimer cet exercice ?"
            okText="Oui"
            cancelText="Non"
            onConfirm={() => remove(row.id)}
          >
            <Button variant="ghost" size="sm" className="text-red-600">
              <Trash2 className="size-4 mr-1" /> Supprimer
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>{`Positions d'entraînement`}</CardTitle>
          <div className="flex items-center gap-3">
            <AntSelect
              allowClear
              placeholder="Filtrer par statut"
              style={{ minWidth: 180 }}
              value={statusFilter}
              onChange={(v) => setStatusFilter(v)}
              options={Object.values(ExerciseStatus).map((s) => ({
                value: s,
                label: ExerciseStatusLabels[s],
              }))}
            />
            <Button onClick={() => router.push('/exercises/new')}>
              <Plus className="size-4 mr-1" /> Nouvel exercice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table
            rowKey="id"
            loading={loading}
            dataSource={items}
            columns={columns}
            pagination={{ pageSize: 20 }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
