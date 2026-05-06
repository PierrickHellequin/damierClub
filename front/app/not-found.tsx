import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container size="narrow" className="py-24 text-center">
      <p className="font-meta text-[0.7rem] uppercase tracking-[0.3em] text-accent-red">
        Erreur 404
      </p>
      <h1 className="mt-2 font-display text-7xl">Article égaré</h1>
      <p className="mt-6 text-lg text-ink-soft">
        Cette page semble être tombée derrière le damier. Elle n'existe pas
        (ou plus).
      </p>
      <Link
        href="/"
        className="mt-10 inline-block border border-ink px-6 py-3 font-meta text-[0.75rem] uppercase tracking-[0.2em] hover:bg-ink hover:text-paper"
      >
        Retour à la une
      </Link>
    </Container>
  );
}
