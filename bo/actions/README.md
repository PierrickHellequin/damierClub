# Server Actions - DamierClub

## Pourquoi les Server Actions ?

Les Server Actions Next.js permettent de :
- ✅ **Sécuriser les données sensibles** : Les mots de passe et tokens ne transitent jamais par le navigateur
- ✅ **Protéger contre l'inspection réseau** : Les requêtes sont invisibles dans l'onglet Network du navigateur
- ✅ **Utiliser des cookies HTTP-only** : Protection contre les attaques XSS
- ✅ **Centraliser la logique d'authentification** : Un seul point d'entrée côté serveur

## Architecture

```
Client (Navigateur)
    ↓
Server Action (Next.js Server)
    ↓
Backend API (Spring Boot)
```

Les données sensibles (mot de passe, tokens) ne passent **jamais** par le client.

## Utilisation

### Authentification

```typescript
import { loginAction, registerAction, logoutAction } from '@/actions/auth';

// Connexion
const result = await loginAction(email, password);
if (result.success && result.user) {
  // Succès
} else {
  // Erreur: result.error
}

// Inscription
const result = await registerAction(name, email, password);

// Déconnexion
await logoutAction();
```

### Appels API génériques

```typescript
import { apiCall } from '@/actions/api';

// GET
const result = await apiCall({ endpoint: 'clubs' });

// POST
const result = await apiCall({
  endpoint: 'clubs',
  method: 'POST',
  body: { name: 'Mon Club' }
});

// PUT
const result = await apiCall({
  endpoint: 'clubs/123',
  method: 'PUT',
  body: { name: 'Nouveau nom' }
});

// DELETE
const result = await apiCall({
  endpoint: 'clubs/123',
  method: 'DELETE'
});
```

### Actions spécifiques

Des actions prêtes à l'emploi sont disponibles pour les opérations courantes :

```typescript
import {
  getNotesAction,
  createNoteAction,
  getClubsAction,
  getMembersAction,
  // ...
} from '@/actions/api';

// Notes
const notesResult = await getNotesAction({ page: 0, size: 10 });

// Clubs
const clubsResult = await getClubsAction({ search: 'Wattrelos' });

// Membres
const membersResult = await getMembersAction({ page: 0 });
```

## Migration des providers existants

Pour migrer un provider existant :

1. **Avant** (appel direct depuis le client) :
```typescript
async function getClubs() {
  const res = await fetch(`${API_BASE}/api/clubs`, {
    headers: { 'X-User-Email': user.email }
  });
  return res.json();
}
```

2. **Après** (via Server Action) :
```typescript
import { getClubsAction } from '@/actions/api';

async function getClubs() {
  const result = await getClubsAction();
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error);
}
```

## Sécurité

### Cookies HTTP-only

L'email de l'utilisateur est stocké dans un cookie HTTP-only :
- ❌ Inaccessible depuis JavaScript (`document.cookie`)
- ✅ Automatiquement envoyé avec chaque requête serveur
- ✅ Protection contre les attaques XSS
- ✅ Option `secure` en production (HTTPS uniquement)

### Headers d'authentification

Le header `X-User-Email` est ajouté automatiquement par les Server Actions, jamais exposé côté client.

## TODO

- [ ] Implémenter un vrai système de JWT/sessions côté serveur
- [ ] Ajouter la validation des tokens
- [ ] Implémenter le refresh token
- [ ] Ajouter un système de rate limiting
