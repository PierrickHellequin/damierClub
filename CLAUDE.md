# DamierClub - Documentation

## Stack technique
- **Backend** : Spring Boot 3 (Java 21) + PostgreSQL 17.5
- **Back Office** : Next.js 15 + React 19 + shadcn/ui + TypeScript
- **Architecture** : Docker Compose

## Services

| Service | Port | URL | Credentials |
|---------|------|-----|-------------|
| API | 8090 | http://localhost:8090 | - |
| Back Office | 3000 | http://localhost:3000 | pkhv@hotmail.fr / 123456 |
| PostgreSQL | 5433 | localhost:5433 | clubuser / clubpass / clubdames |

**Authentification** : Header `X-User-Email`

## Commandes principales

```bash
# Démarrage
make up-all          # Tout en Docker (recommandé)
make status          # État des services
make logs-bo-follow  # Logs BO en temps réel

# Base de données
make db-shell        # Shell PostgreSQL
make db-reset        # Reset DB + reimport Wattrelos (DANGER)
```

## Fonctionnalités

### 1. Membres
- CRUD complet, UUID v7
- Rôles système : SUPER_ADMIN, ROLE_USER
- Rôles club : PRESIDENT, SECRETAIRE, TRESORIER, MEMBRE
- Champs FFJD : `ffjdId`, `ranking`, `currentPoints`, `firstName`, `lastName`

### 2. Clubs
- CRUD complet avec statistiques
- Bureau du club : président, vice-président, secrétaire, trésorier
- Import FFJD automatisé (voir section Scripts)
- Page détail avec graphiques et palmarès

### 3. Articles
- Catégories : NEWS, RESULTS, EVENTS, TUTORIAL, ANNOUNCEMENT
- Statuts : DRAFT, PUBLISHED, ARCHIVED
- Éditeur WYSIWYG (Editor.js)
- Slug automatique, tags, image de couverture

### 4. Notes
- Style post-it avec 10 couleurs
- Visibilité : PRIVATE, CLUB, MEMBERS
- Épinglage, recherche, filtres

## Scripts d'import FFJD

### Structure
```
scripts/
├── ffjd/
│   ├── import_club.py    # Import d'UN club
│   └── import_member.py  # Import d'UN membre avec détails
└── import_wattrelos_final.py  # Orchestrateur complet
```

### Usage
```bash
# Import complet du club Wattrelos
cd scripts
python import_wattrelos_final.py

# Import dans la base
cat import_wattrelos_*.sql | docker exec -i club-db psql -U clubuser -d clubdames
```

### Données importées
- `first_name`, `last_name` (parsing "NOM Prénom")
- `current_points` (ELO)
- `ffjd_id` (ID joueur FFJD)
- `ranking` (classement)
- `active` / `inactive`
- Email généré : `nom.prnom@nom-du-club.fr`

**Durée** : ~10 min pour 187 membres

## API Endpoints essentiels

### Clubs
```bash
GET    /api/clubs                    # Liste paginée
GET    /api/clubs/{id}               # Détail club
GET    /api/clubs/{id}/members       # Membres du club
GET    /api/clubs/{id}/stats         # Statistiques
POST   /api/clubs                    # Créer club
PUT    /api/clubs/{id}               # Modifier club
DELETE /api/clubs/{id}               # Supprimer club
```

### Membres
```bash
GET    /api/members                  # Liste paginée
GET    /api/members/{id}             # Détail membre
POST   /api/internal/register        # Créer membre
PUT    /api/members/{id}             # Modifier membre
DELETE /api/members/{id}             # Supprimer membre
```

## Configuration importante

### Frontend - docker-compose.yml
```yaml
environment:
  - NEXT_PUBLIC_API_BASE=http://localhost:8090  # ⚠️ IMPORTANT pour navigateur
```

### Types TypeScript
**Member** : utilise `firstName`, `lastName`, `currentPoints`, `birthDate`, `active` (camelCase)
**Club** : utilise `vicePresident`, `tresorier`, `secretaire` (camelCase)

## Problèmes courants

### 1. BO Docker
- ✅ Volumes nommés pour `node_modules` et `.next`
- ✅ Bind mount sélectif pour hot reload

### 2. Affichage membres "undefined undefined"
- Cause : Utilisation de `firstname`/`lastname` au lieu de `firstName`/`lastName`
- Solution : Toujours respecter le camelCase des types TypeScript

### 3. Import FFJD
- Scraping du site http://www.ffjd.fr/CP/
- Extraction via BeautifulSoup : `div.div_infos` (club), `div.div_liste_joueurs` (membres)
- UUID v7 déterministe basé sur `ffjd_id`

## Architecture

### Backend
- JPA/Hibernate avec UUID v7
- Sécurité : `@PreAuthorize` + Header `X-User-Email`
- Relations : `@ManyToOne(club)`, `@OneToMany(members)`

### Frontend
- Next.js 15 App Router
- Better Auth (localStorage)
- shadcn/ui + Tailwind CSS
- Hooks personnalisés : `useClub`, `useClubs`, `useClubStats`
- Providers : `apiProvider`, `clubProvider`, `articleProvider`, `noteProvider`

---

**Dernière mise à jour** : 2025-11-25
**Version** : 1.1.0
