# Guide de Test - DamierClub

## ✅ Vérification Rapide (5 minutes)

### 1. Vérifier que tous les services sont actifs

```bash
docker ps --filter "name=club-"
```

Vous devriez voir 3 conteneurs en état **Up**:
- `club-db` (PostgreSQL)
- `club-api` (Spring Boot)
- `club-bo` (Next.js)

---

### 2. Créer un utilisateur de test

```bash
curl -X POST http://localhost:8090/api/internal/register \
  -H "Content-Type: application/json" \
  -d '{"name":"testuser","email":"test@example.com","password":"password123"}'
```

**Résultat attendu:**
```json
{
  "id": "0199ee89-af5f-76df-9bfc-d343d49f1d38",
  "name": "testuser",
  "email": "test@example.com",
  "role": "ROLE_USER"
}
```

⚠️ **IMPORTANT:** Notez l'`id` retourné (c'est un UUID, pas un nombre!)

---

### 3. Tester l'accès au profil via API

Remplacez `{UUID}` par l'ID obtenu à l'étape 2 :

```bash
curl -s "http://localhost:8090/api/members/{UUID}" \
  -H "X-User-Email: test@example.com" | jq
```

**Exemple:**
```bash
curl -s "http://localhost:8090/api/members/0199ee89-af5f-76df-9bfc-d343d49f1d38" \
  -H "X-User-Email: test@example.com" | jq
```

**Résultat attendu:** Le profil complet du membre en JSON

---

### 4. Tester dans le navigateur

1. **Ouvrir:** http://localhost:3009/login

2. **Se connecter avec:**
   - Email: `test@example.com`
   - Password: `password123`

3. **Accéder au profil:**
   - URL: `http://localhost:3009/profil/{UUID}`
   - Exemple: `http://localhost:3009/profil/0199ee89-af5f-76df-9bfc-d343d49f1d38`

4. **Vérifications:**
   - ✅ La page charge sans erreur 403
   - ✅ L'URL contient l'UUID complet (pas `199` ou un nombre tronqué)
   - ✅ Les informations du profil s'affichent correctement

5. **Ouvrir la console (F12) et vérifier:**
   - ✅ Aucune erreur `ERR_ABORTED 403`
   - ✅ L'appel API utilise l'UUID complet: `GET http://localhost:8090/api/members/{UUID-complet}`

---

### 5. Tester la page Members

1. **Aller sur:** http://localhost:3009/members

2. **Vérifications:**
   - ✅ Le tableau affiche des UUIDs dans la colonne ID (format: `0199ee89-...`)
   - ✅ Pas de nombres courts comme `199` ou `123`

3. **Cliquer sur "Profil"** pour un membre

4. **Vérifier:**
   - ✅ L'URL contient l'UUID complet
   - ✅ La page charge sans erreur 403

---

## 🧪 Tests Automatisés

### Tests Unitaires (Vitest)

```bash
cd bo
pnpm test --run
```

**Résultat attendu:**
```
✓ tests/types/member.test.ts (5 tests)
✓ tests/providers/memberProvider.test.ts (6 tests)

Test Files  2 passed (2)
Tests  11 passed (11)
```

**Mode interactif (avec UI):**
```bash
cd bo
pnpm test:ui
```

---

### Tests E2E (Cypress)

**Prérequis:** Les services Docker doivent être actifs

```bash
cd bo
pnpm cypress
```

Cela ouvre l'interface Cypress. Sélectionnez les tests:
- `auth.cy.ts` - Tests d'authentification
- `member-profile.cy.ts` - Tests du profil membre avec UUID

**Mode headless (CI/CD):**
```bash
cd bo
pnpm test:e2e
```

---

## 🐛 Debugging

### Problème: Erreur 403 sur `/profil/{uuid}`

**Vérifications:**
1. Vérifier que l'utilisateur est connecté (localStorage `sessionUser`)
2. Ouvrir la console et vérifier l'URL de l'appel API
3. L'URL doit contenir l'UUID complet, **pas un nombre**

**Mauvais:**
```
GET http://localhost:8090/api/members/199
```

**Bon:**
```
GET http://localhost:8090/api/members/0199ee89-af5f-76df-9bfc-d343d49f1d38
```

### Problème: Le BO ne démarre pas

```bash
# Vérifier les logs
docker logs club-bo

# Forcer le rebuild
docker restart club-bo

# Si nécessaire, supprimer le cache Next.js
docker exec club-bo rm -rf .next
docker restart club-bo
```

### Problème: Tests échouent

```bash
# Réinstaller les dépendances
cd bo
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Relancer les tests
pnpm test --run
```

---

## 📊 Checklist de Validation Complète

- [ ] Les 3 conteneurs Docker sont actifs
- [ ] Peut créer un utilisateur via l'API
- [ ] L'UUID retourné est au bon format (36 caractères avec tirets)
- [ ] Peut se connecter au BO via navigateur
- [ ] Peut accéder au profil avec l'UUID complet
- [ ] Aucune erreur 403 dans la console
- [ ] L'appel API utilise l'UUID complet (pas tronqué)
- [ ] Tous les tests unitaires passent (11/11)
- [ ] Les tests Cypress passent (si exécutés)

---

## 🎯 Critères de Succès

### ✅ Le bug UUID est corrigé si:

1. **L'URL** du profil contient l'UUID complet:
   ```
   http://localhost:3009/profil/0199ee89-af5f-76df-9bfc-d343d49f1d38
   ```

2. **L'appel API** utilise l'UUID complet:
   ```
   GET http://localhost:8090/api/members/0199ee89-af5f-76df-9bfc-d343d49f1d38
   ```

3. **Aucune erreur 403** dans la console

4. **Le profil s'affiche** correctement avec les bonnes données

5. **Les tests passent** sans erreur

---

## 🚀 Pour Aller Plus Loin

### Ajouter plus de tests

```bash
# Générer un rapport de couverture
cd bo
pnpm test:coverage
```

### Configurer CI/CD

Ajoutez dans `.github/workflows/test.yml`:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: cd bo && pnpm install
      - run: cd bo && pnpm test --run
```

---

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs Docker: `docker logs club-bo`
2. Consultez le CHANGELOG.md pour les changements récents
3. Relisez ce guide étape par étape
4. Vérifiez que tous les fichiers ont été correctement modifiés

---

**Date de dernière mise à jour:** 2025-10-16
**Version:** 1.0.0
