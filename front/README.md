# Front public (vitrine)

Dossier réservé pour le futur site public du club.

## Cible

- Site **lecture seule** : actualités, présentation des clubs, palmarès
- Consomme uniquement l'API publique de damier-api : `/api/public/**`
- Pas d'authentification, pas de cookie BO

## Endpoints disponibles

Voir le tag `Public - *` dans Swagger : http://localhost:8090/swagger-ui.html

```
GET /api/public/articles                     # Liste paginée (PUBLISHED uniquement)
GET /api/public/articles/featured            # Articles en vedette
GET /api/public/articles/recent?limit=5      # Derniers publiés
GET /api/public/articles/categories          # Enum des catégories
GET /api/public/articles/{slug}              # Détail (incrémente viewCount)
GET /api/public/clubs                        # Liste des clubs
GET /api/public/clubs/{id}                   # Détail club
GET /api/public/stats                        # Compteurs globaux
```

## Stack suggérée

- Next.js 16 App Router (SSG/ISR pour le SEO)
- Tailwind + shadcn/ui (cohérence avec le BO si on partage des composants à terme)
- Pas d'antd (le BO en garde le monopole)

## Variables d'environnement

```
NEXT_PUBLIC_API_BASE=http://localhost:8090
```

## Dev

Le service `front` est défini (commenté) dans `docker-compose.yml` à la racine.
Une fois le code scaffoldé ici, décommenter le bloc et lancer :

```
make up-all
```

Le front sera servi sur http://localhost:3001.
