import Link from "next/link";
import { Container } from "./Container";
import { CheckeredBand } from "./CheckeredBand";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-paper">
      <CheckeredBand />
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-3">
          <div>
            <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
              Le journal
            </p>
            <p className="mt-3 font-display text-2xl">Damier Club</p>
            <p className="mt-2 text-sm text-ink-soft">
              Site fédérateur des clubs de jeu de dames — actualités, résultats,
              événements.
            </p>
          </div>
          <div>
            <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
              Rubriques
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li><Link className="hover:text-accent-red" href="/actualites">Toutes les actualités</Link></li>
              <li><Link className="hover:text-accent-red" href="/clubs">Annuaire des clubs</Link></li>
              <li><Link className="hover:text-accent-red" href="/a-propos">À propos du site</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
              Légal
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              © {new Date().getFullYear()} Damier Club. Édité par les clubs
              affiliés. Tous droits réservés.
            </p>
          </div>
        </div>
      </Container>
      <CheckeredBand />
    </footer>
  );
}
