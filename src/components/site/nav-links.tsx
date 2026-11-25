"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/blog", label: "Artigos" },
  { href: "/biblia", label: "Bíblia" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/sobre", label: "Sobre" },
];

export function NavLinks({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className={cn(mobile ? "flex flex-col gap-1" : "flex items-center gap-7")}>
      {LINKS.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "relative inline-flex items-center text-[13.5px] font-medium transition-colors",
                mobile
                  ? "w-full rounded-xl px-4 py-3 text-base hover:bg-surface2"
                  : "py-2 hover:text-accent",
                active ? "text-accent" : mobile ? "text-ink" : "text-muted",
              )}
            >
              {link.label}
              {!mobile && active && (
                <span className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full bg-accent" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
