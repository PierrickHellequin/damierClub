// Built-in training exercises. Encoded with `encodeBoard` (50 chars per
// dark square, top-left → bottom-right). The front displays these directly
// when the API has no exercises seeded.

import { decodeBoard } from "./notation";
import type { Board, Color } from "./types";

export type ExerciseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface Exercise {
  id: string;
  title: string;
  description: string;
  /** 50-char encoded board. */
  position: string;
  sideToPlay: Color;
  difficulty: ExerciseDifficulty;
  /** Plain-text solution shown on demand. */
  solution: string;
}

const empty = ".".repeat(50);

function set(positions: Array<{ index: number; piece: string }>): string {
  const arr = empty.split("");
  for (const { index, piece } of positions) {
    arr[index - 1] = piece;
  }
  return arr.join("");
}

export const BUILTIN_EXERCISES: Exercise[] = [
  {
    id: "rafle-simple",
    title: "Une rafle simple",
    description:
      "Les blancs jouent et capturent au moins deux pions noirs. Trouvez la trajectoire du pion blanc.",
    // White man on 32 (square index), black men on 28 and 19.
    position: set([
      { index: 32, piece: "w" },
      { index: 28, piece: "b" },
      { index: 19, piece: "b" },
    ]),
    sideToPlay: "white",
    difficulty: "BEGINNER",
    solution:
      "32x23x14. Le pion blanc saute par-dessus la pièce 28 puis enchaîne sur 19, et atteint la case 14.",
  },
  {
    id: "longest-rule",
    title: "La rafle la plus longue est obligatoire",
    description:
      "Deux prises sont possibles pour les blancs. La règle vous oblige à choisir la plus longue.",
    position: set([
      { index: 32, piece: "w" },
      { index: 27, piece: "b" }, // would offer a single capture
      { index: 28, piece: "b" },
      { index: 19, piece: "b" }, // chain via 28
    ]),
    sideToPlay: "white",
    difficulty: "BEGINNER",
    solution:
      "On doit prendre 28 puis 19 (deux pièces) plutôt que 27 (une seule). C'est l'application directe de la rafle maximale.",
  },
  {
    id: "promotion",
    title: "Promotion à dame",
    description:
      "Conduisez le pion blanc jusqu'à la rangée la plus haute pour le promouvoir.",
    position: set([
      { index: 6, piece: "w" }, // row 1 dark square
    ]),
    sideToPlay: "white",
    difficulty: "BEGINNER",
    solution:
      "6-1 ou 6-2 (selon la position exacte) : le pion blanc atteint la première rangée et devient une dame.",
  },
  {
    id: "dame-attaque",
    title: "Une dame en chasse",
    description:
      "Les blancs ont une dame ; trouvez le coup qui prend la pièce noire en limitant ses options.",
    position: set([
      { index: 27, piece: "W" }, // white king
      { index: 18, piece: "b" },
    ]),
    sideToPlay: "white",
    difficulty: "INTERMEDIATE",
    solution:
      "La dame glisse en diagonale, saute par-dessus 18 et peut atterrir sur n'importe quelle case libre derrière.",
  },
  {
    id: "menace-double",
    title: "Menace double",
    description:
      "Les blancs jouent et créent deux menaces simultanées. À vous de trouver la position-clé.",
    position: set([
      { index: 33, piece: "w" },
      { index: 28, piece: "b" },
      { index: 29, piece: "b" },
      { index: 38, piece: "w" },
      { index: 39, piece: "w" },
    ]),
    sideToPlay: "white",
    difficulty: "INTERMEDIATE",
    solution:
      "Préparez l'avance d'un pion sur la diagonale qui menace simultanément deux prises adverses.",
  },
];

export function exerciseBoard(exercise: Exercise): Board | null {
  return decodeBoard(exercise.position);
}
