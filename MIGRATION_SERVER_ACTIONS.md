# Migration vers les Server Actions

## 🎯 Objectif

Sécuriser l'application en déplaçant toutes les requêtes API sensibles vers des **Server Actions Next.js**.

## ✅ Déjà fait

### 1. Infrastructure de base
- ✅ Création du dossier `bo/actions/`
- ✅ `actions/auth.ts` : Server Actions pour l'authentification
- ✅ `actions/api.ts` : Server Actions génériques pour l'API
- ✅ `actions/README.md` : Documentation complète
- ✅ Mise à jour d'`AuthProvider` pour utiliser les Server Actions

### 2. Fonctionnalités sécurisées
- ✅ Login : mot de passe invisible dans le réseau
- ✅ Register : inscription sécurisée
- ✅ Logout : suppression des cookies HTTP-only
- ✅ Cookies HTTP-only pour le stockage de l'email utilisateur

## 📋 À faire (optionnel)

### Étape 1 : Migrer les providers

Les providers actuels (`noteProvider`, `clubProvider`, `memberProvider`, etc.) peuvent continuer à fonctionner **OU** être migrés vers les Server Actions pour plus de sécurité.

**Exemple : Migration de `noteProvider.ts`**

#### Avant (appel direct)
```typescript
// providers/noteProvider.ts
async getNotes(filters?: NoteFilters): Promise<NotePage> {
  return apiProvider.call<NotePage>({
    url: 'notes',
    method: 'GET',
  });
}
```

#### Après (via Server Action)
```typescript
// providers/noteProvider.ts
import { getNotesAction } from '@/actions/api';

async getNotes(filters?: NoteFilters): Promise<NotePage> {
  const result = await getNotesAction(filters);
  if (!result.success) {
    throw new Error(result.error || 'Erreur de chargement');
  }
  return result.data;
}
```

### Étape 2 : Avantages de la migration complète

| Aspect | Avant | Après |
|--------|-------|-------|
| **Mot de passe visible** | ⚠️ Oui (Network tab) | ✅ Non (Server-side) |
| **Headers API exposés** | ⚠️ Oui | ✅ Non |
| **Stockage du token** | ⚠️ localStorage | ✅ Cookie HTTP-only |
| **Protection XSS** | ⚠️ Limitée | ✅ Maximale |
| **Inspection réseau** | ⚠️ Tout visible | ✅ Requêtes masquées |

### Étape 3 : Migration progressive

Vous pouvez migrer **progressivement** :

1. **Phase 1** (✅ Fait) : Authentification (login/register/logout)
2. **Phase 2** (Optionnel) : Opérations sensibles (création/suppression)
3. **Phase 3** (Optionnel) : Toutes les requêtes API

### Étape 4 : Vérifier que tout fonctionne

```bash
# Démarrer l'environnement
make up-all

# Tester la connexion
# - Ouvrir http://localhost:3000/login
# - Se connecter avec pkhv@hotmail.fr / 123456
# - Vérifier dans l'onglet Network :
#   ✅ Le mot de passe ne doit PAS apparaître dans les requêtes
#   ✅ Un cookie 'user-email' doit être présent
```

## 🔐 Sécurité renforcée

### Avant
```
Client → [POST /api/login { email, password }] → Backend
         ⚠️ Mot de passe visible dans Network tab
```

### Après
```
Client → [Server Action] → Next.js Server → Backend
                           ✅ Mot de passe masqué
                           ✅ Cookie HTTP-only
```

## 📚 Documentation

Voir [`bo/actions/README.md`](bo/actions/README.md) pour :
- Exemples d'utilisation
- Guide de migration des providers
- Bonnes pratiques de sécurité

## 🚀 Next Steps

1. **Tester** la connexion/déconnexion
2. **(Optionnel)** Migrer progressivement les autres providers
3. **(Futur)** Implémenter JWT/sessions côté serveur
4. **(Futur)** Ajouter un système de rate limiting

## ⚠️ Important

- L'authentification utilise maintenant des **Server Actions**
- Les mots de passe ne sont **plus exposés** dans le réseau
- Les cookies HTTP-only protègent contre les **attaques XSS**
- Les providers existants continuent de fonctionner normalement

---

**Date de migration** : 2025-11-25
**Version** : 1.2.0
