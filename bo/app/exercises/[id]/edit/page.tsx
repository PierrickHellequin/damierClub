'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { App } from 'antd';
import { ExerciseForm } from '../../ExerciseForm';
import exerciseProvider from '../../../../providers/exerciseProvider';
import type { Exercise } from '../../../../types/exercise';

export default function EditExercisePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { message } = App.useApp();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    exerciseProvider
      .getExercise(id)
      .then((ex) => {
        if (!cancelled) setExercise(ex);
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Erreur';
        message.error(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, message]);

  if (loading) return <div className="p-6">Chargement…</div>;
  if (!exercise) return <div className="p-6">Exercice introuvable.</div>;
  return <ExerciseForm exercise={exercise} />;
}
