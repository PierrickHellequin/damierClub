# Proposition — Site + back-office Damier Club de Wattrelos (palier 1 du produit clubs)

> Suite de `etude-plateforme-clubs.md`. Ceci est la proposition concrète pour le 1er club,
> conçue dès le départ pour être clonable (palier 2) sans être multi-tenant (palier 3).
> Projet **séparé** d'EnjoyYourMeal : repo dédié, déploiement dédié.

## 1. Principe directeur

**Le site doit vivre sans développeur.** Tout ce qui change dans la vie du club (une actu,
un résultat, une édition de tournoi, une photo) se saisit dans un back-office pensé pour un
bénévole non technique — formulaires courts, gros boutons, prévisualisation, publier/dépublier.
Le développeur n'intervient que pour le code, jamais pour le contenu.

Utilisateur cible du back-office : le webmaster bénévole actuel (à rallier — c'est lui qui
connaît 20 ans de contenu) + le président. Pas de formation nécessaire : si une saisie
demande une explication, le formulaire est raté.

## 2. Stack technique

| Choix | Décision | Pourquoi |
|---|---|---|
| Framework | **Next.js App Router + Server Actions** | Stack déjà maîtrisée (EnjoyYourMeal) → vitesse |
| Base | **SQLite + Prisma** | Un fichier par club = clonage trivial au palier 2, backup = copie de fichier |
| Auth back-office | Credentials simples (email + mdp) via middleware | 2-3 comptes, pas besoin d'OAuth |
| Hébergement | VPS (Hostinger déjà en place) + domaine dédié (~10 €/an) | Coût quasi nul, indépendant de free.fr |
| Thème | Tokens en base (couleurs, logo, nom du club) | Règle « zéro club en dur dans le code » |
| Images | Upload local + resize (sharp), pas de service externe | Souveraineté, coût nul |
| Paiement inscriptions | **Lien HelloAsso** (pas d'intégration paiement maison) | Gratuit, connu des assos, zéro conformité à porter |

## 3. Modèle de données (le cœur — tout le reste en découle)

```
Club        (nom, logo, couleurs, adresse, horaires, contacts, réseaux)
User        (email, rôle: superadmin | admin | contributeur)
News        (titre, corps, photos[], statut brouillon/publié, date)
Event       (titre, date, lieu, type: séance | compétition | tournoi_club)
Competition (nom, niveau: club/départemental/régional/national/international)
Season      (ex: 2025-2026)
Result      (competition, season, joueur, équipe?, position, points, lien Event?)
Tournament  (nom: Masters | Blitz | Coupés en deux, description, règlement)
Edition     (tournament, année, date, lieu, statut inscriptions, lien HelloAsso)
Registration(edition, nom, prénom, club d'origine, email, payé?)
Palmares    (edition, série?: Or/Argent/Bronze, position, joueur)
Page        (slug, titre, corps)          — présentation, école, règles, contact
Media       (fichier, type: photo | pdf, album?, légende)
Problem     (position damier (PDN/FEN dames), solution, auteur, difficulté)  — phase 3
```

Chaque table = un écran d'admin. Pas d'objet sans écran, pas d'écran sans objet.

## 4. Site public (structure issue de l'inventaire du site actuel)

1. **Accueil** — dernières actus + prochain événement + dernier résultat marquant
2. **Le club** — présentation, horaires, adresse (plan), contacts, « nous rejoindre »
3. **Résultats** — par saison puis par compétition ; page joueur simple (ses résultats)
4. **Tournois** — un espace par tournoi (Masters / Blitz / Coupés en deux) :
   édition en cours (infos + **bouton s'inscrire**), palmarès historique
5. **École & entraînement** — cours (PDF), règles, notation Manoury, problèmes
6. **Galerie** — albums photos (souvenirs migrés inclus)
7. Multilingue : **non en V1**. Prévu en champ optionnel sur les pages tournois (les Masters
   attirent des étrangers) — phase 3.

Mobile-first (les licenciés consultent sur téléphone), HTTPS, léger et rapide (pages serveur,
quasi statiques — un site de club n'a pas besoin de JS lourd).

## 5. Back-office (« nourrir le site »)

Un seul espace `/admin`, navigation par gros blocs :

- **✍️ Actus** — formulaire 3 champs (titre, texte, photos), brouillon → prévisualiser → publier.
- **📅 Agenda** — ajouter un événement en 4 champs ; les séances récurrentes se dupliquent en un clic.
- **🏆 Résultats** — choisir compétition + saison → tableau de saisie ligne par ligne
  (position, joueur, points) **+ mode « coller depuis un tableur »** (le webmaster a
  probablement tout dans des fichiers) → import en masse.
- **🎪 Tournois** — créer l'édition de l'année (date, lieu, règlement PDF, lien HelloAsso) ;
  bouton ouvrir/fermer les inscriptions ; liste des inscrits en direct, export CSV ;
  après le tournoi : saisie du palmarès (série, position, joueur).
- **📄 Pages** — éditer présentation/école/contact (éditeur texte simple + photos).
- **🖼️ Médias** — upload photos par album, upload PDFs de cours.
- **⚙️ Réglages** (admin seulement) — infos club, couleurs/logo, comptes utilisateurs.

Règles UX non négociables : jamais plus de 6 champs par formulaire ; chaque écran a un bouton
« Voir sur le site » ; toute suppression = confirmation + corbeille (réversible) ; messages
d'erreur en français clair. Rôle **contributeur** = peut saisir actus/résultats mais pas
toucher aux réglages ni supprimer.

## 6. Migration des 20 ans d'archives

- Script de scraping des pages PHP actuelles (résultats, palmarès, souvenirs) → import en base.
  Semi-automatique : script + repasse manuelle sur les cas tordus (encodage, tableaux irréguliers).
- Les PDFs (cours, phases de tournois) sont repris tels quels dans Médias.
- Opérée par nous, pas par le club. C'est l'argument de vente n°1 : « vous ne perdez rien ».
- Le site free.fr reste en ligne pendant la transition, puis pointe vers le nouveau domaine.

## 7. Phasage et effort

| Phase | Contenu | Effort estimé |
|---|---|---|
| **1 — Socle** | Site public (accueil, club, pages) + admin (actus, agenda, pages, médias, réglages) + auth + déploiement domaine propre | 2-3 week-ends |
| **2 — Compétition** | Résultats (saisie + import tableur) + tournois (éditions, palmarès, inscriptions + HelloAsso) + migration archives | 2-3 week-ends |
| **3 — Différenciateurs** | Problèmes interactifs (damier 10×10 cliquable), galerie enrichie, pages EN tournois | selon traction |

Fin de phase 2 = site vendable à un autre club (palier 2 de l'étude : clonage par instance).

## 8. Modèle économique pour ce 1er club

Recommandation : **Wattrelos ne paie pas le développement**. Contrepartie contractualisée
simplement (un mail suffit) : le club sert de **référence** (droit de citer, captures,
mise en relation avec la fédération et les autres clubs), et paie uniquement
l'hébergement+domaine à prix coûtant (~3-5 €/mois) ou rien la 1re année.
Le produit se vendra aux clubs suivants (setup + abonnement, cf. étude §6) — pas au cobaye.

## 9. Décisions à trancher (par Pierrick)

1. **Nom + domaine** du site (ex : damier-wattrelos.fr) — et plus tard le nom du produit.
2. **Repo dédié** à créer (recommandé, conforme au refus du monorepo) — nom à choisir.
3. **Aller voir le club maintenant ou après maquettes ?** Recommandation : faire 2 maquettes
   d'abord (accueil public + écran admin résultats) et les montrer au club — trancher sur du
   visible, et arriver avec quelque chose qui claque plutôt qu'une promesse.
