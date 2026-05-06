import { cn } from "@/lib/cn";
import type { ArticleCategory } from "@/types/api";

const LABELS: Record<ArticleCategory, string> = {
  NEWS: "Actualité",
  RESULTS: "Résultats",
  EVENTS: "Événement",
  TUTORIAL: "Tutoriel",
  ANNOUNCEMENT: "Annonce",
};

const TONES: Record<ArticleCategory, string> = {
  NEWS: "border-accent-red text-accent-red",
  RESULTS: "border-accent-green text-accent-green",
  EVENTS: "border-accent-gold text-accent-gold",
  TUTORIAL: "border-ink text-ink",
  ANNOUNCEMENT: "border-accent-red text-accent-red",
};

export function CategoryBadge({
  category,
  className,
}: {
  category: ArticleCategory;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-0.5 text-[0.7rem] font-meta uppercase tracking-[0.18em]",
        TONES[category],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {LABELS[category]}
    </span>
  );
}

export function categoryLabel(category: ArticleCategory) {
  return LABELS[category];
}
