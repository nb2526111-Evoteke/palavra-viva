import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ArrowLeft, Check, Palette, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { AdminPageHeader, Flash } from "@/components/admin/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import { ThemeForm, type ThemeDraft } from "@/components/admin/theme-form";
import {
  deleteThemeAction,
  restoreThemePresetsAction,
  setDefaultThemeAction,
} from "@/lib/actions/admin-themes";
import { getThemes } from "@/lib/queries";
import { parseTokens, THEME_PRESETS } from "@/lib/themes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Temas" };

type SearchParams = Promise<{ editar?: string; ok?: string; erro?: string }>;

export default async function AdminThemesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const themes = await getThemes();
  const editingTheme = params.editar ? themes.find((theme) => theme.id === Number(params.editar)) : null;

  const editing: ThemeDraft | null = editingTheme
    ? {
        id: editingTheme.id,
        name: editingTheme.name,
        slug: editingTheme.slug,
        description: editingTheme.description,
        mode: editingTheme.mode === "dark" ? "dark" : "light",
        tokens: parseTokens(editingTheme.tokens),
      }
    : null;

  const newTheme: ThemeDraft = {
    id: 0,
    name: "",
    slug: "",
    description: "",
    mode: "light",
    tokens: THEME_PRESETS[0].tokens,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Aparência"
        title="Temas"
        description="Cada tema é uma atmosfera de leitura. O visitante pode escolher entre os temas ativos; o padrão é o que recebe quem chega pela primeira vez."
        actions={
          <>
            <form action={restoreThemePresetsAction}>
              <SubmitButton className="a-btn a-btn-outline" pendingLabel="Restaurando…">
                <RotateCcw className="size-4" aria-hidden="true" />
                Restaurar presets
              </SubmitButton>
            </form>
            <Link href={editing ? "/admin/temas#formulario-tema" : "#formulario-tema"} className="a-btn a-btn-primary">
              <Plus className="size-4" aria-hidden="true" />
              Novo tema
            </Link>
          </>
        }
      />

      <Flash ok={params.ok} erro={params.erro} />

      <div className="a-theme-grid">
        {themes.map((theme) => {
          const tokens = parseTokens(theme.tokens);
          return (
            <article className="a-theme-card" key={theme.id}>
              <div className="a-theme-preview" style={{ background: tokens.bg, color: tokens.ink }}>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="a-theme-preview-label"
                    style={{ background: tokens.surface2, color: tokens.accent }}
                  >
                    <Palette className="size-2.5" aria-hidden="true" />
                    {theme.mode === "dark" ? "Escuro" : "Claro"}
                  </span>
                  {theme.is_default ? (
                    <span className="a-badge a-badge-gold">
                      <Check className="size-3" aria-hidden="true" />
                      Padrão
                    </span>
                  ) : null}
                </div>
                <div>
                  <p
                    className="text-[1.15rem] font-semibold leading-tight"
                    style={{ fontFamily: "Fraunces, Georgia, serif", color: tokens.heading }}
                  >
                    {theme.name}
                  </p>
                  <div className="a-theme-swatches mt-2">
                    {[tokens.accent, tokens.gold, tokens.ink, tokens.surface, tokens.line, tokens.surface2].map(
                      (color, index) => (
                        <span key={`${color}-${index}`} className="a-theme-swatch" style={{ background: color }} />
                      ),
                    )}
                  </div>
                </div>
              </div>
              <div className="a-theme-info">
                <div className="a-theme-name">
                  {theme.name}
                  {theme.is_default ? <span className="a-badge a-badge-green">Ativo no site</span> : null}
                </div>
                <p className="a-theme-desc">{theme.description || "Sem descrição."}</p>
                <div className="a-theme-actions">
                  <Link
                    href={`/admin/temas?editar=${theme.id}#formulario-tema`}
                    className="a-btn a-btn-outline a-btn-sm"
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                    Editar
                  </Link>
                  {!theme.is_default ? (
                    <>
                      <form action={setDefaultThemeAction}>
                        <input type="hidden" name="id" value={theme.id} />
                        <SubmitButton className="a-btn a-btn-ghost a-btn-sm" pendingLabel="Ativando…">
                          <Check className="size-3.5" aria-hidden="true" />
                          Tornar padrão
                        </SubmitButton>
                      </form>
                      <form action={deleteThemeAction} className="ml-auto">
                        <input type="hidden" name="id" value={theme.id} />
                        <ConfirmSubmit
                          className="a-btn a-btn-danger a-btn-icon"
                          message={`Excluir o tema "${theme.name}"? Ele deixará de aparecer no seletor de temas.`}
                          title="Excluir tema"
                        >
                          <Trash2 className="size-3.5" />
                        </ConfirmSubmit>
                      </form>
                    </>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="a-mt-4" id="formulario-tema">
        <div className="a-flex-between a-mb-4">
          <div>
            <p className="a-eyebrow">Editor de tema</p>
            <h2 className="a-page-title !text-[1.25rem]">
              {editing ? `Ajustar “${editing.name}”` : "Criar uma nova atmosfera"}
            </h2>
          </div>
          {editing ? (
            <Link href="/admin/temas" className="a-btn a-btn-ghost">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Cancelar edição
            </Link>
          ) : null}
        </div>
        <ThemeForm key={editing?.id ?? "new"} initial={editing ?? newTheme} />
      </div>
    </>
  );
}
