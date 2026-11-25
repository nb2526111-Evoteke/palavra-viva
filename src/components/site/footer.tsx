import Link from "next/link";
import { ArrowUpRight, Camera, Mail, Play } from "lucide-react";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import type { Category } from "@/lib/types";

export function SiteFooter({
  settings,
  categories,
}: {
  settings: Record<string, string>;
  categories: Category[];
}) {
  const siteName = settings.site_name || "Palavra Viva";
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#12100d] text-white/70">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_0%,rgba(176,132,63,0.14),transparent_70%)]" />
      <div className="shell relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <Logo name={siteName} tagline={settings.tagline || "Fé que pensa"} inverted />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">{settings.description}</p>
            <div className="mt-6 flex items-center gap-2">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-9 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  aria-label="Instagram"
                >
                  <Camera className="size-4" />
                </a>
              )}
              {settings.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-9 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  aria-label="YouTube"
                >
                  <Play className="size-4" />
                </a>
              )}
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="grid size-9 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  aria-label="E-mail"
                >
                  <Mail className="size-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Explorar</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/", label: "Início" },
                { href: "/blog", label: "Artigos" },
                { href: "/biblia", label: "Bíblia" },
                { href: "/biblioteca", label: "Biblioteca" },
                { href: "/sobre", label: "Sobre" },
                { href: "/contato", label: "Contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/55 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Temas</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/blog/categoria/${category.slug}`}
                    className="inline-flex items-center gap-2 text-white/55 transition-colors hover:text-white"
                  >
                    <span className="size-1.5 rounded-full" style={{ background: category.color }} />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">Newsletter</p>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Uma leitura por semana para começar o dia com as Escrituras.
            </p>
            <div className="mt-4">
              <NewsletterForm source="footer" variant="dark" buttonLabel="Assinar" />
            </div>
            <Link
              href="/admin"
              className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-white/35 transition-colors hover:text-[var(--gold)]"
            >
              Área do autor <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteName}. Todos os direitos reservados.
          </p>
          <p>{settings.footer_note}</p>
        </div>
        {settings.bible_attribution && (
          <p className="mt-3 max-w-3xl text-[10px] leading-relaxed text-white/25">{settings.bible_attribution}</p>
        )}
      </div>
    </footer>
  );
}
