import { cn } from "@/lib/cn";

export function OrnamentRule({
  symbol = "✦",
  className,
}: {
  symbol?: string;
  className?: string;
}) {
  return (
    <div className={cn("ornament-rule", className)} role="presentation">
      <span className="ornament select-none">{symbol}</span>
    </div>
  );
}
