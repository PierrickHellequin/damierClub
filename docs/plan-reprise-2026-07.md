# Plan de reprise — DamierClub (juillet 2026)

> Contexte : étude de marché « un Planity pour les clubs » menée en juillet 2026
> (voir `docs/etude-plateforme-clubs.md`). Verdict : pas de marché SaaS grand public,
> mais une vraie piste « site + back-office pour le Damier Club de Wattrelos, clonable
> ensuite club par club, avec un upside fédération ». Ce document réconcilie cette
> étude avec l'existant du repo.

## 1. État des lieux du repo (dernier push : mai 2026)

### Ce qui existe et qui est bon
- **API Spring Boot 3 / Java 21 + PostgreSQL** — 8 contrôleurs : Auth, Club, Member,
  Article, Note, Tournament, Statistics, InternalAuth.
- **Modèle de domaine déjà riche** : Club, Member, Membership, ClubRole, SystemRole,
  Article (DRAFT/PUBLISHED/ARCHIVED, WYSIWYG Editor.js), Note, **Tournament,
  TournamentType, TournamentCategory, TournamentParticipation, Game, GameResult,
  PointsHistory**. Le multi-club est déjà modélisé → le « palier 2/3 » de l'étude
  (vendre à d'autres clubs) est anticipé dans le schéma, sans sur-coût.
- **Back-office Next.js 15 + shadcn** : écrans membres, clubs, articles, notes,
  login/register, profil.
- **Scripts d'import FFJD** (`scripts/ffjd/`) : import automatisé du club de Wattrelos
  et de ses membres avec ELO/points — c'est déjà le différenciateur « sync fédération »
  identifié dans l'étude (ce que fait KERES pour les échecs).
- **Lucidité sécurité** : `SECURITE_REALITE.md` documente honnêtement la faille actuelle
  (auth par header `X-User-Email`, mot de passe visible) et la vraie solution
  (JWT httpOnly + BCrypt).

### Décision d'architecture : on garde cette stack
L'étude proposait un monolithe Next.js + SQLite plus léger. La réécriture n'est **pas
justifiée** : le domaine est bien modélisé, le travail est fait, et l'API séparée
servira si plusieurs fronts apparaissent (site public, app mobile, autre club).
Deux vigilances assumées en contrepartie :
1. **Empreinte VPS** : Spring + PostgreSQL + Next ≈ 1 Go+ de RAM par instance —
   à surveiller au moment du clonage par club (mutualiser Postgres, une base par club).
2. **La sécurité auth est un prérequis absolu à toute mise en ligne** (voir chantier 1).

## 2. Ce qui manque pour livrer Wattrelos

| Manque | Détail | Existant à réutiliser |
|---|---|---|
| **Site public** | Rien côté visiteur aujourd'hui (BO seulement). C'est LE livrable attendu par le club | L'API expose déjà articles/membres/tournois |
| **Auth sécurisée** | JWT httpOnly + BCrypt, plan déjà écrit | `SECURITE_REALITE.md` |
| **Écrans BO tournois/résultats** | Le modèle existe (Tournament, Game, Palmarès via Participation), aucun écran | TournamentController |
| **Agenda** | Pas de modèle Event (la catégorie EVENTS d'Article ne porte ni date ni lieu structurés) | — |
| **Pages fixes & galerie** | Présentation, école/cours (PDF), souvenirs | Article peut couvrir une partie ; prévoir Media |
| **Migration archives free.fr** | ~20 ans de résultats/palmarès + PDFs de cours | Étendre les scripts Python existants |
| **Inscriptions tournois en ligne** | Formulaire public + liste dans le BO + lien HelloAsso pour paiement | TournamentParticipation |
| **Déploiement** | VPS + domaine propre + HTTPS | docker-compose existant |

## 3. Chantiers, dans l'ordre

1. **Sécurité auth** (bloquant) — JWT httpOnly + BCrypt côté Spring, suppression du
   header `X-User-Email`, rôles vérifiés serveur. Rien ne se met en ligne avant.
2. **Site public — socle** — pages publiques dans l'app Next existante (recommandé :
   une seule app, routes publiques + `/admin` protégé — pas de 3e service) :
   accueil (actus), le club (présentation, horaires, contact), rendu des articles.
   → **fin de ce chantier = première mise en ligne possible** (v1 vitrine, domaine propre).
3. **Compétition** — écrans BO tournois/résultats/palmarès + saisie « coller depuis un
   tableur » + affichage public (par saison/compétition, page joueur simple) + modèle Event/agenda.
4. **Migration des archives** — scraping du site free.fr (résultats, palmarès Masters/
   Blitz/Coupés en deux, souvenirs, PDFs) → import en base. Argument de vente n°1 :
   « on ne perd rien des 20 ans ».
5. **Inscriptions & médias** — inscriptions tournois en ligne (+ lien HelloAsso),
   galerie photos, upload PDFs de cours.
6. **Différenciateur jeux de l'esprit** (après mise en ligne) — problèmes/diagrammes
   interactifs 10×10 (notation Manoury/PDN), replay de parties. Ce que Sportsregions
   (concurrent gratuit par défaut) ne fera jamais.

## 4. Règles produit du back-office (« nourrir le site sans développeur »)

- Utilisateur cible : bénévole non technique (webmaster actuel du club, président).
- Jamais plus de ~6 champs par formulaire ; brouillon → prévisualiser → publier ;
  bouton « Voir sur le site » partout ; suppression = confirmation + réversibilité.
- Rôle contributeur (saisie actus/résultats) distinct d'admin (réglages, comptes).
- Si une saisie nécessite une explication, le formulaire est raté.

## 5. Décisions — recommandations actées (juillet 2026)

Recommandations fermes, à invalider explicitement si désaccord — sinon c'est le plan.

1. **Domaine : `damier-wattrelos.fr`** (~10 €/an). Court, lisible, dit le jeu et la ville.
   Pas de `.com` (club local), pas de nom de produit dans le domaine du club. L'acheter
   tôt, avant d'aller voir le club — arriver avec « votre site : damier-wattrelos.fr »
   est un argument en soi.
2. **Site public = routes publiques dans l'app Next existante** (`bo/`), `/admin` protégé
   par middleware. Pas de 3e service : moins de RAM sur le VPS, un seul déploiement front,
   et les composants (cartes article, listes résultats) se partagent naturellement entre
   public et admin. On renommera `bo/` en `web/` à ce moment-là pour refléter son rôle.
3. **Maquettes AVANT d'aller voir le club : oui, et seulement 2.** Accueil public
   (identité du club, dernière actu, prochain événement, un résultat marquant) + écran
   admin « saisir un résultat ». C'est le couple qui prouve les deux promesses : « votre
   site claque » et « n'importe quel bénévole le nourrit ». Pas de 3e maquette — le reste
   se décide sur produit réel.
4. **Wattrelos = gratuit, contractualisé simplement.** Développement offert ; à partir de
   l'an 2, hébergement+domaine à prix coûtant (~5 €/mois). Contrepartie par écrit (un
   mail suffit) : droit de citer le club en référence (captures, chiffres), témoignage,
   et mise en relation active avec la ligue Hauts-de-France et la FFJD. On ne fait pas
   payer le cobaye ; on vend aux suivants (setup 300-800 € + 10-25 €/mois).
5. **Nom du produit : plus tard.** « DamierClub » reste le nom de code. Le naming se
   décide quand un 2e club paie — pas avant, c'est du temps perdu sinon.
6. **Paiement inscriptions : lien HelloAsso, jamais de paiement maison.** Zéro conformité
   à porter, outil déjà connu des trésoriers d'asso.
7. **Hébergement : le VPS Hostinger existant**, conteneurs Docker dédiés + Postgres
   mutualisé (une base par club au moment du clonage). Pas de cloud managé : coût et
   souveraineté.
8. **Ce qu'on ne fait pas** (rappel de l'étude, pour ne pas re-dériver) : pas de
   marketplace « trouve ton club », pas de multi-tenant avant 5 clubs payants, pas de
   fonctionnalité que Sportsregions offre déjà gratuitement sans y ajouter l'angle
   « jeux de l'esprit ».

### Prochaine action concrète
Chantier 1 (sécurité JWT+BCrypt) en parallèle des 2 maquettes. Puis rendez-vous club
avec maquettes + domaine acheté.
