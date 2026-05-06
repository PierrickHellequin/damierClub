"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container size="narrow" className="py-24 text-center">
      <p className="font-meta text-[0.7rem] uppercase tracking-[0.3em] text-accent-red">
        Édition interrompue
      </p>
      <h1 className="mt-2 font-display text-6xl">La presse a calé</h1>
      <p className="mt-6 text-lg text-ink-soft">
        Une erreur s'est produite pendant que nous tirions la page. Réessaie
        dans un instant.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="border border-ink px-6 py-3 font-meta text-[0.75rem] uppercase tracking-[0.2em] hover:bg-ink hover:text-paper"
        >
          Relancer la presse
        </button>
        <Link
          href="/"
          className="border border-ink/30 px-6 py-3 font-meta text-[0.75rem] uppercase tracking-[0.2em] hover:border-ink"
        >
          Retour à la une
        </Link>
      </div>
    </Container>
  );
}
