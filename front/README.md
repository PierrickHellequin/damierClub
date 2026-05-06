# Front public — Le Damier

Site vitrine du Damier Club, en lecture seule, qui consomme l'API publique
exposée par `damier-api` (`/api/public/**`).

## Stack

- Next.js 16 (App Router, Turbopack, typed routes)
- React 19, TypeScript strict
- Tailwind CSS 3 — palette journal d'époque + clins d'œil au damier
- `sanitize-html` côté serveur pour le contenu d'article (HTML ou Editor.js)
- Polices Google : Playfair Display (titres), Source Serif 4 (corps), IBM Plex Mono (méta)

Pas d'antd (réservé au BO), pas d'authentification, pas de cookie : ce front
ne fait que lire l'API publique.

## Routes

| Route                       | Source                            |
|-----------------------------|-----------------------------------|
| `/`                         | home (lead, à suivre, vedettes, stats, clubs) |
| `/actualites`               | liste paginée + filtre par catégorie + recherche |
| `/actualites/[slug]`        | article complet (sanitizé) + à-lire-aussi |
| `/clubs`                    | annuaire paginé |
| `/clubs/[id]`               | détail club + bureau |
| `/a-propos`                 | page éditoriale statique |
| `/robots.txt`, `/sitemap.xml` | SEO (auto-générés) |

## Variables d'environnement

| Var                    | Défaut                  | Rôle |
|------------------------|-------------------------|------|
| `API_BASE_INTERNAL`    | `NEXT_PUBLIC_API_BASE`  | URL de l'API utilisée côté serveur (Docker : `http://api:8080`) |
| `NEXT_PUBLIC_API_BASE` | `http://localhost:8090` | URL exposée côté navigateur (utilisée si `API_BASE_INTERNAL` non défini) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3001` | URL canonique du site (sitemap, métadonnées) |

## Dev local (sans Docker)

```bash
cd front
pnpm install
pnpm dev          # http://localhost:3000
```

## Dev avec Docker

Le service `front` est défini dans le `docker-compose.yml` à la racine
(port 3001 -> 3000 conteneur).

```bash
make up-all
# http://localhost:3001
```

## Vérifications

```bash
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint flat config
pnpm build        # build de production avec Turbopack
```

> Note : `next/font` télécharge les polices depuis Google Fonts au build.
> Si l'environnement n'a pas accès à Internet, exporter
> `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1` ou pré-charger les polices.

## Sécurité du contenu

Le contenu d'article est :
1. produit par des rédacteurs authentifiés dans le BO,
2. servi par l'API publique uniquement si statut `PUBLISHED`,
3. **re-sanitizé** côté serveur avant rendu (`lib/sanitize.ts`) : whitelist
   stricte de balises et d'attributs, liens externes forcés en
   `rel="noopener noreferrer"` `target="_blank"`.

Si le contenu est du JSON Editor.js, il est rendu via un convertisseur
maison (paragraphes, titres, listes, citations, images, code) ; tout
bloc inconnu est ignoré (jamais de dump JSON brut).

## Design

Inspiration : presse imprimée du XIXᵉ siècle.
- Fond crème (`#f4ede0`), encre profonde (`#1a1714`), accent rouge journal
  (`#8c1f1f`), accent vert (`#2d4a3e`), or (`#a07a2c`)
- Bandes de damier (`checkered-band`) en séparateurs
- Ornements `◆` et `✦` entre les sections
- Drop-cap décoratif sur le premier paragraphe des articles
- Polices serif pour le texte, monospace pour les méta (date, rubriques)
