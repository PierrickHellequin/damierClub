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
import { PositionPreview } from '../../components/dames/PositionPreview';
import exerciseProvider from '../../providers/exerciseProvider';
import {
  EMPTY_POSITION,
  type Exercise,
  ExerciseDifficulty,
  ExerciseDifficultyLabels,
  type ExerciseFormData,
  ExerciseSide,
  ExerciseSideLabels,
} from '../../types/exercise';

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
          <CardContent>
            <p className="text-sm text-gray-600">
              Encodage : 50 caractères pour les 50 cases noires (haut-gauche →
              bas-droite).
              <code className="mx-1 px-1 bg-gray-100">.</code>vide,
              <code className="mx-1 px-1 bg-gray-100">w</code>pion blanc,
              <code className="mx-1 px-1 bg-gray-100">W</code>dame blanche,
              <code className="mx-1 px-1 bg-gray-100">b</code>pion noir,
              <code className="mx-1 px-1 bg-gray-100">B</code>dame noire.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
              <Textarea
                rows={4}
                value={data.position}
                onChange={(e) => update('position', e.target.value)}
                className="font-mono"
                spellCheck={false}
              />
              <PositionPreview position={data.position} />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Longueur actuelle : {data.position.length} / 50
            </p>
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
