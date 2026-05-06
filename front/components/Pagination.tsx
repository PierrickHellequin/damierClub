import Link from "next/link";
import { cn } from "@/lib/cn";

export function Pagination({
  basePath,
  page,
  totalPages,
  searchParams,
}: {
  basePath: string;
  page: number;
  totalPages: number;
  searchParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function buildHref(targetPage: number) {
    const sp = new URLSearchParams();
    Object.entries(searchParams ?? {}).forEach(([k, v]) => {
      if (v && k !== "page") sp.set(k, v);
    });
    if (targetPage > 0) sp.set("page", String(targetPage));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const prev = page > 0 ? buildHref(page - 1) : null;
  const next = page < totalPages - 1 ? buildHref(page + 1) : null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-between border-t border-rule pt-6 font-meta text-sm uppercase tracking-[0.2em]"
    >
      <PageLink href={prev} disabled={!prev}>
        ← Page précédente
      </PageLink>
      <span className="text-ink-soft">
        Page {page + 1} / {totalPages}
      </span>
      <PageLink href={next} disabled={!next} align="right">
        Page suivante →
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  align = "left",
  children,
}: {
  href: string | null;
  disabled?: boolean;
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  if (disabled || !href) {
    return (
      <span
        aria-disabled
        className={cn(
          "text-ink-mute cursor-not-allowed",
          align === "right" && "text-right",
        )}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href as never}
      className={cn(
        "text-ink hover:text-accent-red transition-colors",
        align === "right" && "text-right",
      )}
    >
      {children}
    </Link>
  );
}
