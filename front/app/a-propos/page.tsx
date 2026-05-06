import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { OrnamentRule } from "@/components/Ornament";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Le projet Damier Club : un journal numérique commun à tous les clubs affiliés.",
};

export default function AProposPage() {
  return (
    <Container size="narrow" className="py-12">
      <header className="border-b-2 border-ink pb-6">
        <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-accent-red">
          Notre journal
        </p>
        <h1 className="mt-1 font-display text-5xl">À propos</h1>
      </header>

      <div className="prose-paper drop-cap mt-10">
        <p>
          Damier Club est le journal numérique des clubs affiliés à la
          Fédération française du jeu de dames. Nos rédactions sont les
          présidents, secrétaires et passionnés qui font vivre les clubs
          partout en France. Ce site rassemble en un seul endroit l'actualité
          de tous, tirée chaque semaine sur la presse virtuelle.
        </p>

        <h2>Une vitrine commune</h2>
        <p>
          Chaque club dispose d'un espace de rédaction privé pour publier ses
          actualités, ses résultats de tournois et ses annonces. Une fois
          publiés, les articles paraissent ici même, dans l'édition collective.
          La page d'un club regroupe ses informations pratiques, son bureau et
          le compte de ses joueurs licenciés.
        </p>

        <h2>Pour qui ?</h2>
        <p>
          Pour les joueurs qui cherchent un club près de chez eux. Pour les
          familles qui veulent comprendre les règles et l'histoire du jeu.
          Pour les passionnés qui aiment lire les comptes-rendus de la dernière
          ronde du week-end. Et pour la presse, qui trouvera ici les
          contacts de chaque club affilié.
        </p>
      </div>

      <OrnamentRule symbol="◆ ◆ ◆" />

      <section>
        <h2 className="font-display text-2xl">Mentions techniques</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-soft">
          <li>
            Les rédactions de chaque club passent par le back-office privé.
            Seuls les articles publiés apparaissent sur ce site.
          </li>
          <li>
            Les données nominatives (membres, e-mails) ne sont jamais exposées
            ici. L'API publique ne diffuse que les noms d'auteur des articles.
          </li>
          <li>
            Le code de ce journal numérique est ouvert et accessible aux clubs
            affiliés.
          </li>
        </ul>
      </section>
    </Container>
  );
}
