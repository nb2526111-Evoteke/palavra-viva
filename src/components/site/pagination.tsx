import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  basePath,
  params = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function href(target: number) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    if (target > 1) search.set("page", String(target));
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const pages: number[] = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, Math.max(page + 2, 5));
  for (let index = start; index <= end; index += 1) pages.push(index);

  return (
    <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Paginação">
      <Link
        href={href(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent",
          page === 1 && "pointer-events-none opacity-35",
        )}
        aria-label="Página anterior"
      >
        <ChevronLeft className="size-4" />
      </Link>
      {start > 1 && (
        <>
          <Link href={href(1)} className="inline-flex size-9 items-center justify-center rounded-full text-xs text-muted hover:text-accent">
            1
          </Link>
          {start > 2 && <span className="px-1 text-xs text-muted">…</span>}
        </>
      )}
      {pages.map((item) => (
        <Link
          key={item}
          href={href(item)}
          aria-current={item === page ? "page" : undefined}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-full text-xs font-medium transition-colors",
            item === page
              ? "bg-accent text-accent-contrast"
              : "border border-transparent text-muted hover:border-line hover:text-accent",
          )}
        >
          {item}
        </Link>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-xs text-muted">…</span>}
          <Link
            href={href(totalPages)}
            className="inline-flex size-9 items-center justify-center rounded-full text-xs text-muted hover:text-accent"
          >
            {totalPages}
          </Link>
        </>
      )}
      <Link
        href={href(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent",
          page === totalPages && "pointer-events-none opacity-35",
        )}
        aria-label="Próxima página"
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
