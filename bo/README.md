# DamierClub - Back Office

Application de gestion du club de dames construite avec Next.js 15 et Ant Design.

## Installation

```bash
pnpm install
```

## Développement

```bash
# Démarrer le serveur de développement
pnpm dev

# L'application sera disponible sur http://localhost:3000 (ou 3009 dans Docker)
```

## Tests

Ce projet utilise Vitest pour les tests unitaires et Cypress pour les tests E2E.

### Tests Unitaires (Vitest)

```bash
# Exécuter tous les tests unitaires
pnpm test

# Exécuter les tests en mode watch
pnpm test -- --watch

# Exécuter les tests avec interface UI
pnpm test:ui

# Générer un rapport de couverture
pnpm test:coverage
```

### Tests E2E (Cypress)

```bash
# Ouvrir l'interface Cypress (mode interactif)
pnpm cypress

# Exécuter les tests en mode headless
pnpm cypress:headless

# Exécuter les tests E2E complets (démarre le serveur + tests)
pnpm test:e2e
```

## Structure des Tests

```
bo/
├── tests/                      # Tests unitaires
│   ├── setup.ts               # Configuration Vitest
│   ├── types/                 # Tests des types TypeScript
│   │   └── member.test.ts    # Validation des types Member/Club
│   └── providers/             # Tests des providers
│       └── memberProvider.test.ts
│
├── cypress/                    # Tests E2E
│   ├── e2e/                   # Scénarios de test
│   │   ├── auth.cy.ts        # Tests d'authentification
│   │   └── member-profile.cy.ts  # Tests du profil membre
│   └── support/               # Commandes personnalisées
│       ├── commands.ts
│       └── e2e.ts
│
├── vitest.config.ts           # Configuration Vitest
└── cypress.config.ts          # Configuration Cypress
```

## Points de Test Critiques

### Types et UUID
Les tests vérifient que :
- Les IDs des membres sont des **strings (UUID)** et non des numbers
- Les UUID sont au format valide (v7)
- Le parsing des URLs préserve l'UUID complet sans truncation

### Providers
Les tests vérifient que :
- Les méthodes `getMember`, `updateMember`, `deleteMember` acceptent des UUID strings
- Les appels API utilisent l'UUID complet dans l'URL
- Les réponses contiennent des UUID valides

### E2E Profil Membre
Les tests vérifient que :
- L'accès au profil utilise l'UUID complet (`/profil/{uuid}`)
- L'API est appelée avec l'UUID complet (pas tronqué en nombre)
- Les opérations de modification préservent l'UUID
- Les erreurs 404/400 sont retournées pour les IDs invalides

## Build

```bash
# Construire pour la production
pnpm build

# Démarrer en production
pnpm start
```

## Type Checking

```bash
pnpm typecheck
```

## Configuration Docker

Voir [docker-compose.yml](../docker-compose.yml) à la racine du projet pour la configuration complète.

## Variables d'Environnement

- `NEXT_PUBLIC_API_BASE` - URL de l'API backend (default: http://localhost:8090)
- `PORT` - Port du serveur Next.js (default: 3000)

## Technologies

- **Next.js 15** - Framework React
- **React 19** - Bibliothèque UI
- **Ant Design 5** - Composants UI
- **TypeScript 5** - Typage statique
- **Vitest** - Tests unitaires
- **Cypress** - Tests E2E
- **dayjs** - Manipulation de dates
