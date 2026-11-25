import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { SearchDialog } from "./search-dialog";
import { ThemeSwitcher, type ThemeOption } from "./theme-switcher";
import { MobileMenu } from "./mobile-menu";

export function SiteHeader({
  settings,
  themes,
  currentTheme,
  dailyVerse,
}: {
  settings: Record<string, string>;
  themes: ThemeOption[];
  currentTheme: string;
  dailyVerse: { reference: string; text: string };
}) {
  const siteName = settings.site_name || "Palavra Viva";
  const tagline = settings.tagline || "Fé que pensa";

  return (
    <>
      <div className="hidden border-b border-line/60 bg-surface/50 md:block">
        <div className="shell flex h-9 items-center justify-between gap-6 text-[11px] text-muted">
          <p className="truncate">
            “{dailyVerse.text}”{" "}
            <span className="font-medium text-accent">— {dailyVerse.reference}</span>
          </p>
          <div className="flex shrink-0 items-center gap-5">
            <Link href="/contato" className="transition-colors hover:text-accent">
              Contato
            </Link>
            <Link href="/admin" className="inline-flex items-center gap-1.5 transition-colors hover:text-accent">
              <LockKeyhole className="size-3" aria-hidden="true" />
              Área do autor
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-xl">
        <div className="shell flex h-[74px] items-center justify-between gap-4">
          <Logo name={siteName} tagline={tagline} />

          <nav className="hidden lg:block" aria-label="Navegação principal">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <SearchDialog />
            <ThemeSwitcher themes={themes} current={currentTheme} compact />
            <Link href="/#newsletter" className="btn btn-primary ml-1 hidden h-10 md:inline-flex">
              Assinar
            </Link>
            <div className="lg:hidden">
              <MobileMenu siteName={siteName} tagline={tagline} themes={themes} currentTheme={currentTheme} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
