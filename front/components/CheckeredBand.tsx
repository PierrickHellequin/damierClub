import { cn } from "@/lib/cn";

export function CheckeredBand({
  className,
  height = 14,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <div
      role="presentation"
      className={cn("checkered-band w-full", className)}
      style={{ height }}
    />
  );
}
