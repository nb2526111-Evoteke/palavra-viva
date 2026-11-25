import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  name = "Palavra Viva",
  tagline = "Fé que pensa",
  className,
  inverted = false,
}: {
  name?: string;
  tagline?: string;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)} aria-label={`${name} — início`}>
      <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[14px] bg-accent text-accent-contrast shadow-[0_10px_24px_-14px_var(--accent)] transition-transform duration-300 group-hover:-rotate-3">
        <svg viewBox="0 0 32 32" className="size-7" fill="none" aria-hidden="true">
          <path
            d="M16 10.5c-2.2-1.6-4.8-2.2-7.8-2.2v14.4c3 0 5.6.6 7.8 2.2 2.2-1.6 4.8-2.2 7.8-2.2V8.3c-3 0-5.6.6-7.8 2.2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M16 10.5v14.4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 3.6v4.2M14.2 5.4h3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".65" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-[1.35rem] font-semibold tracking-[-0.03em]",
            inverted ? "text-white" : "text-heading",
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "mt-1 text-[9.5px] font-medium uppercase tracking-[0.24em]",
            inverted ? "text-white/55" : "text-muted",
          )}
        >
          {tagline}
        </span>
      </span>
    </Link>
  );
}
