export interface Club {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  creationDate?: string; // ISO date
  description?: string;
  logoUrl?: string;
}

export enum ClubRole {
  PRESIDENT = "PRESIDENT",
  VICE_PRESIDENT = "VICE_PRESIDENT",
  SECRETAIRE = "SECRETAIRE",
  TRESORIER = "TRESORIER",
  MEMBRE = "MEMBRE",
  ENTRAINEUR = "ENTRAINEUR",
  ARBITRE = "ARBITRE",
}

export interface Member {
  id: number;
  name: string; // pseudo
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  rate?: number;
  role?: string; // rôle système (ROLE_USER, ROLE_ADMIN)
  // Champs profil
  firstName?: string;
  lastName?: string;
  birthDate?: string; // ISO string (YYYY-MM-DD)
  gender?: string; // 'M' | 'F' | 'Autre'
  active?: boolean;
  // Relations club
  club?: Pick<Club, "id"> | null; // Relation backend : objet avec id uniquement
  clubId?: number; // ID du club (pour formulaires)
  clubName?: string; // nom du club (pour affichage, retourné par backend)
  clubRole?: ClubRole; // rôle dans le club
}

// Alias éventuel si l'on souhaite distinguer plus tard
export type User = Member;
