'use client';
import { useAuth } from '@/components/AuthProvider';
import { Member, Club, ClubRole } from '@/types/member';

export interface AuthorizationRights {
  // Clubs
  canCreateClub: boolean;
  canEditClub: (club: Club & { id: string | number }) => boolean;
  canDeleteClub: (club: Club & { id: string | number }) => boolean;
  canViewClub: (club: Club & { id: string | number }) => boolean;

  // Members
  canCreateMember: boolean;
  canEditMember: (member: Member) => boolean;
  canDeleteMember: (member: Member) => boolean;
  canViewMembers: boolean;
  canManageClubMembers: (clubId: string | number) => boolean;

  // Articles
  canCreateArticle: boolean;
  canEditArticle: (article: any) => boolean;
  canDeleteArticle: (article: any) => boolean;
  canPublishArticle: (article: any) => boolean;

  // Notes
  canViewAllNotes: boolean;
  canCreateNote: boolean;
  canEditNote: (note: any) => boolean;
  canDeleteNote: (note: any) => boolean;

  // User info
  isSuperAdmin: boolean;
  isClubPresident: (clubId: string | number) => boolean;
  isClubTresorier: (clubId: string | number) => boolean;
  isClubSecretaire: (clubId: string | number) => boolean;
  isClubManager: (clubId: string | number) => boolean;
  userClubId: string | number | null;
}

export function useAuthorization(): AuthorizationRights {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const userClubId = user?.clubId || user?.club?.id || null;
  const userClubRole = user?.clubRole;

  const isClubPresident = (clubId: string | number) => {
    if (isSuperAdmin) return true;
    return userClubId === clubId && userClubRole === ClubRole.PRESIDENT;
  };

  const isClubTresorier = (clubId: string | number) => {
    if (isSuperAdmin) return true;
    return userClubId === clubId && userClubRole === ClubRole.TRESORIER;
  };

  const isClubSecretaire = (clubId: string | number) => {
    if (isSuperAdmin) return true;
    return userClubId === clubId && userClubRole === ClubRole.SECRETAIRE;
  };

  const isClubManager = (clubId: string | number) => {
    if (isSuperAdmin) return true;
    return userClubId === clubId &&
      (userClubRole === ClubRole.PRESIDENT ||
       userClubRole === ClubRole.TRESORIER ||
       userClubRole === ClubRole.SECRETAIRE);
  };

  return {
    // Clubs
    canCreateClub: isSuperAdmin,
    canEditClub: (club) => isSuperAdmin,
    canDeleteClub: (club) => isSuperAdmin,
    canViewClub: (club) => isSuperAdmin || userClubId === club.id,

    // Members
    canCreateMember: isSuperAdmin,
    canEditMember: (member) => {
      if (isSuperAdmin) return true;
      // Non-admins ne peuvent éditer que leur propre profil
      return member.id === user?.id;
    },
    canDeleteMember: (member) => isSuperAdmin,
    canViewMembers: isSuperAdmin || !!userClubId,
    canManageClubMembers: (clubId) => isClubManager(clubId),

    // Articles
    canCreateArticle: isSuperAdmin,
    canEditArticle: (article) => {
      if (isSuperAdmin) return true;
      // Les auteurs peuvent éditer leurs propres articles
      return article.author?.id === user?.id;
    },
    canDeleteArticle: (article) => {
      if (isSuperAdmin) return true;
      return article.author?.id === user?.id;
    },
    canPublishArticle: (article) => isSuperAdmin,

    // Notes
    canViewAllNotes: isSuperAdmin,
    canCreateNote: !!user,
    canEditNote: (note) => {
      if (isSuperAdmin) return true;
      return note.author?.id === user?.id;
    },
    canDeleteNote: (note) => {
      if (isSuperAdmin) return true;
      return note.author?.id === user?.id;
    },

    // User info
    isSuperAdmin,
    isClubPresident,
    isClubTresorier,
    isClubSecretaire,
    isClubManager,
    userClubId,
  };
}
