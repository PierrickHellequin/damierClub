"use client";

import { cn } from "@/lib/cn";

interface ControlsProps {
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
  flipped: boolean;
  onToggleFlip: () => void;
  thinking?: boolean;
}

export function Controls({
  canUndo,
  onUndo,
  onReset,
  flipped,
  onToggleFlip,
  thinking,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap gap-2 font-meta text-[0.7rem] uppercase tracking-[0.2em]">
      <Button onClick={onUndo} disabled={!canUndo || thinking}>
        ← Annuler
      </Button>
      <Button onClick={onReset} disabled={thinking}>
        Recommencer
      </Button>
      <Button onClick={onToggleFlip}>
        {flipped ? "Vue blancs" : "Vue noirs"}
      </Button>
    </div>
  );
}

function Button({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "border px-4 py-2 transition-colors",
        disabled
          ? "border-rule text-ink-mute cursor-not-allowed"
          : "border-ink hover:bg-ink hover:text-paper",
      )}
    >
      {children}
    </button>
  );
}
