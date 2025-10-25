'use client';
import { ReactNode, cloneElement, isValidElement } from 'react';
import { Tooltip } from 'antd';

interface ProtectedActionProps {
  children: ReactNode;
  allowed: boolean;
  message?: string;
  fallback?: ReactNode;
}

/**
 * Composant pour masquer/afficher du contenu selon les droits
 * Si pas autorisé, affiche fallback (par défaut: nothing)
 * Si allowed=true, affiche children
 *
 * Si children est un Button, le désactive au lieu de le wrapper
 */
export function ProtectedAction({
  children,
  allowed,
  message = 'Vous n\'avez pas les droits pour effectuer cette action',
  fallback = null,
}: ProtectedActionProps) {
  if (!allowed) {
    if (fallback !== null) {
      return <>{fallback}</>;
    }

    // Si c'est un button/element React, le clone et désactive
    if (isValidElement(children)) {
      return (
        <Tooltip title={message}>
          {cloneElement(children as any, { disabled: true })}
        </Tooltip>
      );
    }

    // Sinon, wrapper dans un span désactivé
    return (
      <Tooltip title={message}>
        <span style={{ opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' }}>
          {children}
        </span>
      </Tooltip>
    );
  }

  return <>{children}</>;
}

/**
 * Wrapper pour les boutons avec gestion des droits
 */
export function ProtectedButton({
  children,
  allowed,
  message,
  ...props
}: any) {
  return (
    <ProtectedAction allowed={allowed} message={message}>
      <button {...props} disabled={!allowed}>
        {children}
      </button>
    </ProtectedAction>
  );
}
