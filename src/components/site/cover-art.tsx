import type { CSSProperties, ReactNode } from "react";
import { coverPalette, cn } from "@/lib/utils";

export function CoverArt({
  seed,
  label,
  title,
  showTitle = false,
  className,
  children,
}: {
  seed: string;
  label?: string | null;
  title?: string;
  showTitle?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const [a, b, c] = coverPalette(seed);

  return (
    <div
      className={cn("cover-art grain h-full w-full", className)}
      style={{ "--cover-a": a, "--cover-b": b, "--cover-c": c } as CSSProperties}
    >
      <svg
        viewBox="0 0 400 300"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="322" cy="44" r="150" stroke="white" />
        <circle cx="322" cy="44" r="108" stroke="white" />
        <circle cx="322" cy="44" r="66" stroke="white" />
        <path d="M28 300V190c0-69 56-125 125-125s125 56 125 125v110" stroke="white" />
        <path d="M58 300V196c0-52 42-94 95-94s95 42 95 94v104" stroke="white" />
        <path d="M0 262h400M0 288h400" stroke="white" />
      </svg>
      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          <span className="size-1 rounded-full bg-white/80" />
          {label || "Palavra Viva"}
        </span>
        {showTitle && title ? (
          <span className="max-w-[92%] font-serif text-[clamp(1.35rem,3.4vw,2.1rem)] font-medium leading-[1.12] text-white drop-shadow-sm">
            {title}
          </span>
        ) : (
          <svg viewBox="0 0 48 48" className="size-10 text-white/45" fill="none" aria-hidden="true">
            <path d="M24 14c-3.2-2.4-7-3.2-11.4-3.2v21.4c4.4 0 8.2.8 11.4 3.2 3.2-2.4 7-3.2 11.4-3.2V10.8c-4.4 0-8.2.8-11.4 3.2Z" stroke="currentColor" strokeWidth="1.3" />
            <path d="M24 14v21.4M24 5v6M21.8 7.2h4.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {children}
    </div>
  );
}
