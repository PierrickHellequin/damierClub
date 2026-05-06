export function StatBlock({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="text-center">
      <p className="font-display text-5xl text-accent-red sm:text-6xl">
        {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
      </p>
      <p className="mt-2 text-[0.7rem] font-meta uppercase tracking-[0.3em] text-ink-soft">
        {label}
      </p>
    </div>
  );
}
