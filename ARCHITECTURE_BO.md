# Architecture Back Office - DamierClub

## 📋 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    BACK OFFICE (BO)                     │
│                    Next.js 15 + Ant Design              │
├─────────────────────────────────────────────────────────┤
│  Articles │ Notes │ Fichiers │ Événements │ Membres    │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API
┌──────────────────────┴──────────────────────────────────┐
│               API Spring Boot (Java 21)                  │
├─────────────────────────────────────────────────────────┤
│  Controllers │ Services │ Repositories │ Security       │
└──────────────────────┬──────────────────────────────────┘
                       │ JPA/Hibernate
┌──────────────────────┴──────────────────────────────────┐
│              PostgreSQL 17.5 (Database)                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🗃️ Modèles de Données

### 1. **Article** (News/Actualités)
```typescript
interface Article {
  id: string;                    // UUID
  title: string;                 // Titre
  slug: string;                  // URL-friendly
  content: string;               // Contenu (Markdown/HTML)
  excerpt?: string;              // Extrait/résumé
  category: ArticleCategory;     // Catégorie
  status: ArticleStatus;         // Brouillon/Publié/Archivé
  author: Member;                // Auteur
  coverImage?: string;           // Image de couverture
  tags?: string[];              // Tags
  publishedAt?: Date;           // Date publication
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;            // Nombre de vues
  featured: boolean;            // À la une
}

enum ArticleCategory {
  NEWS = "Actualités",
  RESULTS = "Résultats",
  EVENTS = "Événements",
  TUTORIAL = "Tutoriels",
  ANNOUNCEMENT = "Annonces"
}

enum ArticleStatus {
  DRAFT = "Brouillon",
  PUBLISHED = "Publié",
  ARCHIVED = "Archivé"
}
```

### 2. **Note** (Notes Internes)
```typescript
interface Note {
  id: string;                   // UUID
  title: string;
  content: string;              // Markdown/HTML
  author: Member;
  club?: Club;                  // Note spécifique à un club
  visibility: NoteVisibility;   // Privée/Club/Public
  pinned: boolean;              // Épinglée
  color?: string;               // Couleur (pour organisation)
  attachments?: Media[];        // Fichiers joints
  createdAt: Date;
  updatedAt: Date;
}

enum NoteVisibility {
  PRIVATE = "Privée (auteur)",
  CLUB = "Visible par le club",
  MEMBERS = "Tous les membres"
}
```

### 3. **Media** (Fichiers/Documents)
```typescript
interface Media {
  id: string;                   // UUID
  filename: string;             // Nom original
  storagePath: string;          // Chemin stockage
  url: string;                  // URL publique
  type: MediaType;              // Type de fichier
  category: MediaCategory;      // Catégorie
  mimeType: string;             // image/jpeg, application/pdf, etc.
  size: number;                 // Taille en bytes
  uploadedBy: Member;
  description?: string;
  tags?: string[];
  folder?: string;              // Organisation par dossier
  createdAt: Date;
  isPublic: boolean;            // Accessible publiquement
}

enum MediaType {
  IMAGE = "Image",
  VIDEO = "Vidéo",
  DOCUMENT = "Document",
  ARCHIVE = "Archive"
}

enum MediaCategory {
  ARTICLE_COVER = "Couverture article",
  EVENT_PHOTO = "Photo événement",
  RESULT = "Résultat",
  NEWSLETTER = "Newsletter",
  OTHER = "Autre"
}
```

### 4. **Event** (Événements)
```typescript
interface Event {
  id: string;                   // UUID
  title: string;
  slug: string;
  description: string;          // Description longue
  startDate: Date;
  endDate?: Date;
  location: string;
  address?: string;
  type: EventType;
  status: EventStatus;
  coverImage?: string;
  gallery?: Media[];            // Galerie photos
  results?: Media[];            // Fichiers résultats
  rules?: string;               // Règlement (Markdown)
  registrationUrl?: string;     // Lien inscription
  maxParticipants?: number;
  club?: Club;                  // Club organisateur
  organizer: Member;
  isPublic: boolean;            // Visible sur le site public
  featured: boolean;            // À la une
  createdAt: Date;
  updatedAt: Date;
}

enum EventType {
  BLITZ = "Blitz",
  TOURNAMENT = "Tournoi",
  TRAINING = "Entraînement",
  MEETING = "Réunion",
  CONFERENCE = "Conférence",
  OTHER = "Autre"
}

enum EventStatus {
  UPCOMING = "À venir",
  ONGOING = "En cours",
  FINISHED = "Terminé",
  CANCELLED = "Annulé"
}
```

---

## 🎨 Structure Front-End (BO)

### Pages du Back Office

```
bo/
├── app/
│   ├── dashboard/              # Tableau de bord
│   │   └── page.tsx
│   │
│   ├── articles/               # Gestion articles
│   │   ├── page.tsx           # Liste
│   │   ├── new/
│   │   │   └── page.tsx       # Créer
│   │   └── [id]/
│   │       ├── page.tsx       # Voir
│   │       └── edit/
│   │           └── page.tsx   # Éditer
│   │
│   ├── notes/                  # Gestion notes
│   │   ├── page.tsx
│   │   ├── new/
│   │   └── [id]/
│   │
│   ├── media/                  # Gestion fichiers
│   │   ├── page.tsx           # Bibliothèque
│   │   ├── upload/
│   │   └── folders/
│   │
│   ├── events/                 # Gestion événements
│   │   ├── page.tsx
│   │   ├── new/
│   │   └── [id]/
│   │
│   ├── members/                # Existant
│   ├── clubs/                  # Existant
│   └── settings/               # Paramètres
│
├── components/
│   ├── Editor/                 # Éditeur Markdown/WYSIWYG
│   │   └── MarkdownEditor.tsx
│   ├── MediaPicker/            # Sélecteur de fichiers
│   │   └── MediaLibrary.tsx
│   ├── ArticleCard/
│   ├── NoteCard/
│   └── EventCard/
│
└── providers/
    ├── articleProvider.ts
    ├── noteProvider.ts
    ├── mediaProvider.ts
    └── eventProvider.ts
```

---

## 🔌 API Backend (Spring Boot)

### Contrôleurs REST

```
api/src/main/java/com/damier/damierclub/
├── controller/
│   ├── ArticleController.java
│   ├── NoteController.java
│   ├── MediaController.java
│   └── EventController.java
│
├── service/
│   ├── ArticleService.java
│   ├── NoteService.java
│   ├── MediaService.java
│   ├── EventService.java
│   └── StorageService.java        # Upload fichiers
│
├── repository/
│   ├── ArticleRepository.java
│   ├── NoteRepository.java
│   ├── MediaRepository.java
│   └── EventRepository.java
│
├── model/
│   ├── Article.java
│   ├── Note.java
│   ├── Media.java
│   └── Event.java
│
└── dto/
    ├── ArticleDTO.java
    ├── NoteDTO.java
    ├── MediaDTO.java
    └── EventDTO.java
```

### Endpoints API

#### Articles
```
GET    /api/articles              # Liste paginée
GET    /api/articles/{id}         # Détail
POST   /api/articles              # Créer
PUT    /api/articles/{id}         # Modifier
DELETE /api/articles/{id}         # Supprimer
PATCH  /api/articles/{id}/publish # Publier
PATCH  /api/articles/{id}/archive # Archiver
GET    /api/articles/slug/{slug}  # Par slug
```

#### Notes
```
GET    /api/notes                 # Liste (filtrée par visibilité)
GET    /api/notes/{id}
POST   /api/notes
PUT    /api/notes/{id}
DELETE /api/notes/{id}
PATCH  /api/notes/{id}/pin        # Épingler
```

#### Media
```
GET    /api/media                 # Liste + filtres
GET    /api/media/{id}
POST   /api/media/upload          # Upload fichier(s)
DELETE /api/media/{id}
GET    /api/media/folders         # Arborescence
GET    /api/media/download/{id}   # Télécharger
```

#### Events
```
GET    /api/events
GET    /api/events/{id}
POST   /api/events
PUT    /api/events/{id}
DELETE /api/events/{id}
POST   /api/events/{id}/gallery   # Ajouter photos
GET    /api/events/upcoming       # À venir
GET    /api/events/featured       # À la une
```

---

## 🔐 Sécurité & Permissions

### Rôles Utilisateurs

```typescript
enum UserRole {
  ADMIN = "Administrateur",      // Tous les droits
  EDITOR = "Éditeur",            // Créer/modifier contenu
  MODERATOR = "Modérateur",      // Modérer contenu
  MEMBER = "Membre"              // Lecture seule
}
```

### Matrice de Permissions

| Action                  | ADMIN | EDITOR | MODERATOR | MEMBER |
|------------------------|-------|--------|-----------|--------|
| Créer article          | ✅    | ✅     | ✅        | ❌     |
| Publier article        | ✅    | ✅     | ❌        | ❌     |
| Supprimer article      | ✅    | ❌     | ❌        | ❌     |
| Créer note privée      | ✅    | ✅     | ✅        | ✅     |
| Voir notes club        | ✅    | ✅     | ✅        | ✅     |
| Upload fichiers        | ✅    | ✅     | ✅        | ❌     |
| Créer événement        | ✅    | ✅     | ✅        | ❌     |
| Gérer membres          | ✅    | ❌     | ✅        | ❌     |

---

## 📦 Stockage Fichiers

### Options

**Option 1: Système de fichiers local** (Simple)
```
/uploads/
  ├── articles/
  ├── events/
  ├── results/
  └── newsletters/
```

**Option 2: AWS S3 / MinIO** (Production)
- Scalable
- CDN
- Backups automatiques

**Recommandation:** Commencer avec système local, migrer vers S3 ensuite

---

## 🚀 Plan d'Implémentation

### Phase 1: Fondations (2-3 jours)
1. ✅ Modèles de données (Java)
2. ✅ Repositories & Services
3. ✅ Contrôleurs REST basiques
4. ✅ Tests unitaires

### Phase 2: Articles (2 jours)
1. ✅ CRUD Articles backend
2. ✅ Page liste articles BO
3. ✅ Formulaire création/édition
4. ✅ Éditeur WYSIWYG
5. ✅ Catégorisation + statuts

### Phase 3: Notes (1 jour)
1. ✅ CRUD Notes backend
2. ✅ Interface notes (style post-it)
3. ✅ Filtres par visibilité

### Phase 4: Media (2 jours)
1. ✅ Upload fichiers (backend)
2. ✅ Bibliothèque média
3. ✅ Gestion dossiers
4. ✅ Prévisualisation (images/PDF)

### Phase 5: Événements (2 jours)
1. ✅ CRUD Événements backend
2. ✅ Formulaire événement
3. ✅ Galerie photos
4. ✅ Upload résultats

### Phase 6: Better Auth (1 jour)
1. ✅ Implémentation Better Auth
2. ✅ Gestion rôles/permissions
3. ✅ Tests Cypress auth

---

## 🧪 Tests

### Tests à créer

```typescript
// Backend (JUnit)
- ArticleControllerTest
- NoteControllerTest
- MediaControllerTest
- EventControllerTest
- StorageServiceTest

// Frontend (Vitest)
- articleProvider.test.ts
- noteProvider.test.ts
- mediaProvider.test.ts
- eventProvider.test.ts

// E2E (Cypress)
- article-crud.cy.ts
- note-crud.cy.ts
- media-upload.cy.ts
- event-crud.cy.ts
```

---

## 📈 Tableau de Bord

### Widgets Dashboard

```
┌─────────────────┬─────────────────┐
│ Articles        │ Événements      │
│ - 12 brouillons │ - 3 à venir     │
│ - 45 publiés    │ - 2 en cours    │
└─────────────────┴─────────────────┘
┌─────────────────┬─────────────────┐
│ Fichiers        │ Membres         │
│ - 234 images    │ - 156 actifs    │
│ - 89 docs       │ - 12 clubs      │
└─────────────────┴─────────────────┘
```

---

## 🎯 Prochaines Étapes

**Voulez-vous que je commence par :**

1. **Articles** (gestion news/actualités) ?
2. **Notes** (notes internes) ?
3. **Media** (bibliothèque fichiers) ?
4. **Événements** (gestion blitz/tournois) ?
5. **Better Auth** (sécurité/rôles) ?

**Choisissez et je commencerai l'implémentation complète !**
