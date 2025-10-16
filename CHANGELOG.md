# Changelog - DamierClub

## [2025-10-16] - Correction critique UUID + Tests

### 🐛 Bugs Corrigés

#### Problème 403 - Truncation UUID → Number
**Symptôme:** Erreur `GET http://localhost:8090/api/members/199 403 (Forbidden)` lors de l'accès à `/profil/0199ee84-e695-7d1e-83df-a9f953867224`

**Cause Racine:**
- Le backend utilise des UUID (strings) pour les IDs des membres
- Le frontend définissait `Member.id` comme `number`
- L'UUID était parsé avec `parseInt()`, tronquant `0199ee84-e695-7d1e-83df-a9f953867224` en `199`
- L'API recevait l'ID tronqué et retournait 403

**Solution:**
1. ✅ Changé `Member.id` de `number` à `string` dans `types/member.ts`
2. ✅ Supprimé `parseInt()` dans `app/profil/[id]/page.tsx`
3. ✅ Mis à jour tous les hooks (`useMember`, `useMembers`)
4. ✅ Mis à jour tous les providers (`memberProvider`)
5. ✅ Forcé le rebuild de Next.js (suppression `.next/`)

**Fichiers Modifiés:**
- `bo/types/member.ts` - Type `Member.id: string`
- `bo/app/profil/[id]/page.tsx` - Plus de parsing en entier
- `bo/hooks/useMember.ts` - Signature `(id: string | null)`
- `bo/hooks/useMembers.ts` - Signatures avec `string`
- `bo/providers/memberProvider.ts` - Toutes les méthodes avec `string`

---

### 🔧 Corrections Docker & Authentification

#### Docker BO - Dépendances Manquantes
**Problème:** Le conteneur `club-bo` crashait (Exit 1) avec `sh: next: not found`

**Solution:**
- ✅ Ajouté `pnpm install --frozen-lockfile` dans `bo/Dockerfile.dev`
- ✅ Copié `package.json` et `pnpm-lock.yaml` avant installation

#### Suppression HMAC (Authentification Simplifiée)
**Problème:** Ancien système HMAC obsolète et inutilisé

**Solution:**
- ✅ Supprimé tout le code HMAC de `AuthProvider.tsx`
- ✅ Supprimé tout le code HMAC de `apiProvider.ts`
- ✅ Simplifié `HeaderAuthenticationFilter.java` (backend)
- ✅ Supprimé `NEXT_PUBLIC_HMAC_SECRET` de `docker-compose.yml`

**Nouveau système:** Authentification basique avec header `X-User-Email` uniquement

#### Configuration Réseau
**Problème:** URL API incorrecte (8080 vs 8090)

**Solution:**
- ✅ Corrigé `apiProvider.ts` pour utiliser `http://localhost:8090`
- ✅ Mis à jour `docker-compose.yml` avec `NEXT_PUBLIC_API_BASE=http://localhost:8090`

---

### ✅ Tests Ajoutés (Protection contre Régressions)

#### Tests Unitaires (Vitest)

**Nouveau:** `tests/types/member.test.ts`
- ✅ Vérifie que `Member.id` est un string (UUID)
- ✅ Valide le format UUID (regex)
- ✅ Rejette les `number` à la compilation (TypeScript)
- ✅ Teste les relations Club

**Nouveau:** `tests/providers/memberProvider.test.ts`
- ✅ Vérifie que `getMember(id)` accepte un UUID string
- ✅ Vérifie que les URLs API contiennent l'UUID complet
- ✅ Vérifie que `updateMember` et `deleteMember` utilisent UUID
- ✅ Mock des appels `apiProvider` pour isolation

**Résultats:** ✅ **11 tests passent** (2 suites)

#### Tests E2E (Cypress)

**Nouveau:** `cypress/e2e/member-profile.cy.ts`
- ✅ Accès au profil avec UUID complet (pas tronqué)
- ✅ Vérification que l'API reçoit l'UUID complet
- ✅ Test du flux complet: liste → clic → profil
- ✅ Test de modification avec préservation UUID
- ✅ Test d'erreur 404 pour ID invalide

**Nouveau:** `cypress/e2e/auth.cy.ts`
- ✅ Enregistrement avec UUID retourné
- ✅ Connexion et localStorage avec UUID

**Nouveau:** Commandes personnalisées Cypress
- `cy.login(email, password)` - Connexion rapide
- `cy.createTestUser()` - Création utilisateur via API

---

### 📦 Dépendances Ajoutées

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitest/ui": "^2.1.8",
    "cypress": "^13.17.0",
    "jsdom": "^25.0.1",
    "start-server-and-test": "^2.0.9",
    "vitest": "^2.1.8"
  }
}
```

---

### 📝 Scripts NPM Ajoutés

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "cypress": "cypress open",
    "cypress:headless": "cypress run",
    "test:e2e": "start-server-and-test dev http://localhost:3009 cypress:headless"
  }
}
```

---

### 📖 Documentation Ajoutée

- ✅ `bo/README.md` - Guide complet tests + développement
- ✅ `CHANGELOG.md` - Ce fichier
- ✅ Configuration Vitest (`vitest.config.ts`)
- ✅ Configuration Cypress (`cypress.config.ts`)

---

## Comment Tester

### Vérification Rapide
```bash
# Dans le dossier bo/
pnpm test --run
```

### Tests Complets
```bash
# Tests unitaires avec UI
pnpm test:ui

# Tests E2E (nécessite le serveur en cours)
docker-compose up -d
pnpm test:e2e
```

### Vérification Manuelle
```bash
# Créer un utilisateur
curl -X POST http://localhost:8090/api/internal/register \
  -H "Content-Type: application/json" \
  -d '{"name":"test","email":"test@test.com","password":"pass123"}'

# Réponse attendue: {"id":"0199...-...","name":"test",...}

# Accéder au profil (utiliser l'ID retourné)
curl http://localhost:8090/api/members/0199... \
  -H "X-User-Email: test@test.com"
```

---

## État des Services

✅ **PostgreSQL** - Port 5433 - Fonctionnel
✅ **API Spring Boot** - Port 8090 - Fonctionnel
✅ **BO Next.js** - Port 3009 - Fonctionnel
✅ **Tests Unitaires** - 11/11 passent
✅ **Types TypeScript** - Aucune erreur

---

## Prochaines Étapes Recommandées

1. ⚠️ **Exécuter les tests E2E Cypress** pour validation complète
2. 📊 **Ajouter des tests de couverture** pour atteindre 80%+
3. 🔒 **Implémenter Better Auth** si prévu (remplacer X-User-Email)
4. 🚀 **CI/CD** - Intégrer tests dans pipeline (GitHub Actions)
5. 📱 **Tests mobile** - Ajouter tests Cypress pour responsive

---

## Notes Techniques

### Pourquoi UUID v7 ?
Le backend génère des UUID v7 (temps-ordonné) via `UuidGenerator.generateUuidV7()`. C'est optimal pour:
- Index de base de données (order naturel)
- Debugging (timestamp inclus)
- Performance (meilleure que v4 random)

### Migration de Données
**Aucune migration nécessaire** - Le backend utilisait déjà UUID. Seul le frontend a été corrigé.

### Compatibilité
- ✅ Compatible avec tous les navigateurs modernes
- ✅ Compatible avec PostgreSQL 17.5
- ✅ Compatible avec Java 21 + Spring Boot 3.x
