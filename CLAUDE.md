# DamierClub - Documentation

## Stack technique
- **Backend** : Spring Boot 3 (Java 21) + PostgreSQL 17.5
- **Back Office** : Next.js 15 + React 19 + Ant Design 5 + TypeScript
- **Architecture** : Docker Compose

## Services

| Service | Port | URL | Credentials |
|---------|------|-----|-------------|
| API | 8090 | http://localhost:8090 | - |
| Back Office | 3000 | http://localhost:3000 | pkhv@hotmail.fr / 123456 |
| PostgreSQL | 5433 | localhost:5433 | damier / damier123 / damierdb |

**Authentification** : Header `X-User-Email` (pas de HMAC)

## Commandes principales

```bash
# Démarrage
make up-all          # Tout en Docker (recommandé)
make up              # API + DB seulement
make dev-bo          # BO en local

# Développement
make status          # État des services
make logs            # Logs de tous les services
make logs-api        # Logs API
make logs-bo-follow  # Logs BO en temps réel

# Build et nettoyage
make rebuild         # Rebuild sans cache
make clean           # Nettoyer caches
make clean-all       # Tout nettoyer (volumes inclus)

# Base de données
make db-shell        # Shell PostgreSQL
make db-reset        # Reset DB (DANGER)

# Tests
make test-bo         # Tests unitaires
make test-cypress    # Tests E2E
```

## Fonctionnalités

### 1. Membres
- CRUD complet, UUID v7
- Rôles : ADMIN, EDITOR, MODERATOR, USER
- Relation avec Club

### 2. Clubs
- CRUD complet
- Gestion des membres

### 3. Articles
**Features** :
- Catégories : NEWS, RESULTS, EVENTS, TUTORIAL, ANNOUNCEMENT
- Statuts : DRAFT, PUBLISHED, ARCHIVED
- Éditeur WYSIWYG (Editor.js, 19 plugins)
- Slug automatique, tags, image de couverture, compteur de vues
- Workflow : publish/unpublish/archive

**Fichiers backend** : [api/src/main/java/com/damier/damierclub/](api/src/main/java/com/damier/damierclub/)
- [model/Article.java](api/src/main/java/com/damier/damierclub/model/Article.java)
- [repository/ArticleRepository.java](api/src/main/java/com/damier/damierclub/repository/ArticleRepository.java)
- [service/ArticleService.java](api/src/main/java/com/damier/damierclub/service/ArticleService.java)
- [controller/ArticleController.java](api/src/main/java/com/damier/damierclub/controller/ArticleController.java)

**Fichiers frontend** : [bo/](bo/)
- [types/article.ts](bo/types/article.ts), [providers/articleProvider.ts](bo/providers/articleProvider.ts)
- [hooks/useArticles.ts](bo/hooks/useArticles.ts), [hooks/useArticle.ts](bo/hooks/useArticle.ts)
- [components/Editor/EditorComponent.tsx](bo/components/Editor/EditorComponent.tsx)
- [app/articles/](bo/app/articles/) (liste, new, edit, view)

### 4. Notes
**Features** :
- Style post-it avec 10 couleurs pastel
- Visibilité : PRIVATE, CLUB, MEMBERS
- Épinglage, recherche, filtres, statistiques

**Fichiers backend** : [api/src/main/java/com/damier/damierclub/](api/src/main/java/com/damier/damierclub/)
- [model/Note.java](api/src/main/java/com/damier/damierclub/model/Note.java)
- [repository/NoteRepository.java](api/src/main/java/com/damier/damierclub/repository/NoteRepository.java)
- [service/NoteService.java](api/src/main/java/com/damier/damierclub/service/NoteService.java)
- [controller/NoteController.java](api/src/main/java/com/damier/damierclub/controller/NoteController.java)

**Fichiers frontend** : [bo/](bo/)
- [types/note.ts](bo/types/note.ts), [providers/noteProvider.ts](bo/providers/noteProvider.ts)
- [hooks/useNotes.ts](bo/hooks/useNotes.ts), [hooks/useNote.ts](bo/hooks/useNote.ts)
- [components/NoteCard/NoteCard.tsx](bo/components/NoteCard/NoteCard.tsx)
- [app/notes/](bo/app/notes/) (list, new, view)

## API Endpoints

### Articles
```bash
# Liste paginée avec filtres
GET /api/articles?page=0&size=10&category=NEWS&status=PUBLISHED

# CRUD
GET    /api/articles/{id}
GET    /api/articles/slug/{slug}
POST   /api/articles
PUT    /api/articles/{id}
DELETE /api/articles/{id}

# Actions
PATCH /api/articles/{id}/publish
PATCH /api/articles/{id}/unpublish
PATCH /api/articles/{id}/archive
GET   /api/articles/stats
```

### Notes
```bash
# Liste paginée avec filtres
GET /api/notes?page=0&size=20&visibility=PRIVATE&pinned=true&search=keyword

# CRUD
GET    /api/notes/{id}
POST   /api/notes
PUT    /api/notes/{id}
DELETE /api/notes/{id}

# Actions
PATCH /api/notes/{id}/pin
PATCH /api/notes/{id}/unpin
GET   /api/notes/recent?limit=5
GET   /api/notes/pinned
GET   /api/notes/stats
```

## Problèmes résolus

### 1. Conteneur BO Docker
**Problème** : `Cannot find module 'next/dist/bin/next'`
**Solution** :
- Créé [bo/.dockerignore](bo/.dockerignore)
- Modifié [bo/Dockerfile.dev](bo/Dockerfile.dev) (multi-stage build)
- Modifié [docker-compose.yml](docker-compose.yml) (bind mounts sélectifs)
- Volumes nommés pour `node_modules` et `.next`

**Résultat** : ✅ BO fonctionne en Docker

### 2. Cypress incompatible
**Problème** : `bad option: --smoke-test`
**Cause** : Incompatibilité Windows 11 build 26200 (Insider)
**Statut** : Tests créés mais non exécutables

### 3. Erreur import apiProvider
**Problème** : `'./apiProvider' does not contain a default export`
**Solution** : Utiliser named import `import { apiProvider } from './apiProvider'`
**Statut** : ✅ Corrigé

### 4. UUID comparison dans ArticleRepository
**Problème** : Erreur comparaison UUID
**Solution** :
```java
@Query("SELECT a FROM Article a WHERE a.author.id = :authorId")
Page<Article> findByAuthorId(@Param("authorId") String authorId, Pageable pageable);
```

## Architecture technique

### Backend
- JPA/Hibernate avec UUID v7
- Sécurité : Header `X-User-Email` + `@PreAuthorize`
- Relations @ManyToOne, @OneToMany
- Queries JPQL avec @Query

### Frontend
- Next.js 15 App Router
- Better Auth (session localStorage)
- API Provider générique : [bo/providers/apiProvider.ts](bo/providers/apiProvider.ts)
- React hooks personnalisés
- Editor.js pour WYSIWYG

## TODO

### Urgent
- [x] BO Docker ✅
- [ ] Tester création articles/notes dans navigateur
- [ ] Upload d'images

### Court terme
- [ ] Validation formulaires
- [ ] Gestion erreurs API
- [ ] Loading states
- [ ] Pagination BO

### Moyen/Long terme
- [ ] Media Library, Events
- [ ] Recherche full-text PostgreSQL
- [ ] Permissions granulaires, audit log
- [ ] Frontend public
- [ ] Cache Redis, CDN
- [ ] CI/CD, déploiement production

---

**Dernière mise à jour** : 2025-10-17
**Version** : 1.0.0
