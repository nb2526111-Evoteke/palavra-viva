import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Ver todos",
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-5",
        align === "center" && "flex-col items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="display mt-3 text-[clamp(1.9rem,3.5vw,2.75rem)]">{title}</h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-muted md:text-[15px]">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="link-underline inline-flex items-center gap-1.5 pb-1 text-xs font-semibold text-accent"
        >
          {linkLabel}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
