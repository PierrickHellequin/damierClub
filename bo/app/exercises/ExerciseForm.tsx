'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { App } from 'antd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PositionEditor } from '../../components/dames/PositionEditor';
import { MoveRecorder } from '../../components/dames/MoveRecorder';
import exerciseProvider from '../../providers/exerciseProvider';
import {
  EMPTY_POSITION,
  type Exercise,
  ExerciseDifficulty,
  ExerciseDifficultyLabels,
  type ExerciseFormData,
  type MovePair,
  ExerciseSide,
  ExerciseSideLabels,
} from '../../types/exercise';
import type { Color } from '../../lib/dames/types';

interface Props {
  exercise?: Exercise;
}

export function ExerciseForm({ exercise }: Props) {
  const router = useRouter();
  const { message } = App.useApp();
  const [data, setData] = useState<ExerciseFormData>({
    title: exercise?.title ?? '',
    description: exercise?.description ?? '',
    position: exercise?.position ?? EMPTY_POSITION,
    sideToPlay: exercise?.sideToPlay ?? ExerciseSide.WHITE,
    difficulty: exercise?.difficulty ?? ExerciseDifficulty.BEGINNER,
    solution: exercise?.solution ?? '',
    solutionMoves: exercise?.solutionMoves ?? [],
  });
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof ExerciseFormData>(key: K, value: ExerciseFormData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function submit() {
    if (!data.title.trim()) {
      message.error('Le titre est requis.');
      return;
    }
    if (data.position.length !== 50) {
      message.error('La position doit faire exactement 50 caractères.');
      return;
    }
    if (!/^[.\.wWbB]+$/.test(data.position)) {
      message.error("La position ne peut contenir que '.', 'w', 'W', 'b', 'B'.");
      return;
    }
    setSubmitting(true);
    try {
      if (exercise) {
        await exerciseProvider.updateExercise(exercise.id, data);
        message.success('Exercice mis à jour');
      } else {
        await exerciseProvider.createExercise(data);
        message.success('Exercice créé');
      }
      router.push('/exercises');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {exercise ? 'Modifier un exercice' : 'Nouvel exercice'}
          </h1>
          <Button variant="outline" onClick={() => router.push('/exercises')}>
            Annuler
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Une rafle de deux pièces"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (énoncé)</Label>
              <Textarea
                id="description"
                rows={3}
                value={data.description ?? ''}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Les blancs jouent et capturent au moins deux pions noirs."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trait</Label>
                <Select
                  value={data.sideToPlay}
                  onValueChange={(v) => update('sideToPlay', v as ExerciseSide)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ExerciseSide).map((s) => (
                      <SelectItem key={s} value={s}>
                        {ExerciseSideLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Niveau</Label>
                <Select
                  value={data.difficulty}
                  onValueChange={(v) => update('difficulty', v as ExerciseDifficulty)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ExerciseDifficulty).map((d) => (
                      <SelectItem key={d} value={d}>
                        {ExerciseDifficultyLabels[d]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">Solution / commentaire</Label>
              <Textarea
                id="solution"
                rows={3}
                value={data.solution ?? ''}
                onChange={(e) => update('solution', e.target.value)}
                placeholder="32x23x14 ; le pion blanc termine sur la case 14."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Sélectionnez un outil dans la palette puis cliquez sur les cases
              noires du plateau. Maj+clic ou clic droit pour effacer.
            </p>
            <PositionEditor
              position={data.position}
              onChange={(p) => {
                update('position', p);
                // Position changes invalidate the recorded combination.
                update('solutionMoves', []);
              }}
            />
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer select-none">
                Encodage textuel (avancé)
              </summary>
              <div className="mt-2 space-y-1">
                <Textarea
                  rows={2}
                  value={data.position}
                  onChange={(e) => update('position', e.target.value)}
                  className="font-mono"
                  spellCheck={false}
                />
                <p>
                  50 caractères :{' '}
                  <code className="bg-gray-100 px-1">.</code> vide,{' '}
                  <code className="bg-gray-100 px-1">w</code> pion blanc,{' '}
                  <code className="bg-gray-100 px-1">W</code> dame blanche,{' '}
                  <code className="bg-gray-100 px-1">b</code> pion noir,{' '}
                  <code className="bg-gray-100 px-1">B</code> dame noire.
                </p>
              </div>
            </details>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Combinaison (solution structurée)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Jouez la combinaison attendue sur le plateau ci-dessous : le
              premier coup est celui du joueur, le second la réponse de
              l&apos;adversaire (jouée automatiquement par le coach), et ainsi
              de suite. Le mode entraînement validera la séquence pas à pas.
              Laisser vide si l&apos;exercice n&apos;a pas de solution
              structurée.
            </p>
            <MoveRecorder
              position={data.position}
              sideToPlay={data.sideToPlay === ExerciseSide.WHITE ? ('white' as Color) : ('black' as Color)}
              moves={data.solutionMoves ?? []}
              onChange={(next: MovePair[]) => update('solutionMoves', next)}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push('/exercises')}>
            Annuler
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting ? 'Enregistrement…' : exercise ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
