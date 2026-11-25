import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Sparkles, Wand2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { AdminPageHeader, Flash } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import { createGeneratedArticleAction } from "@/lib/actions/admin-article-generator";
import { generatedThemeToArticle } from "@/lib/article-generator";
import { getCategories } from "@/lib/queries";
import { findThemeReferences } from "@/lib/bible-reference";
import { buildThemeForInput } from "@/lib/reference-theme";
import { renderMarkdown } from "@/lib/markdown";
import { EMPHASIS_OPTIONS, GENERATOR_THEMES } from "@/lib/theme-generator";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gerar artigo por tema" };

type SearchParams = Promise<{
  tema?: string;
  passagem?: string;
  categoria?: string;
  tema_base?: string;
  enfase?: string;
  publico?: string;
  ok?: string;
  erro?: string;
}>;

export default async function GenerateArticlePage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const categories = await getCategories();
  const themeText = (params.tema ?? "").trim().slice(0, 180);
  const passage = (params.passagem ?? "").trim().slice(0, 120);
  const titleText = passage && !themeText.toLowerCase().includes(passage.toLowerCase())
    ? `${themeText} — ${passage}`
    : themeText;
  const category = categories.find((item) => String(item.id) === params.categoria) ?? categories[0] ?? null;
  const themeBase = GENERATOR_THEMES.some((theme) => theme.slug === params.tema_base)
    ? params.tema_base!
    : "";
  const emphasis = EMPHASIS_OPTIONS.some((option) => option.value === params.enfase)
    ? params.enfase!
    : "ambos";
  const audience = (params.publico ?? "").trim() || "Leitores do blog";
  const referenceMode = findThemeReferences(titleText);

  let preview: { generated: Awaited<ReturnType<typeof buildThemeForInput>>; article: ReturnType<typeof generatedThemeToArticle> } | null =
    null;
  if (titleText.length >= 3) {
    const base = GENERATOR_THEMES.find((theme) => theme.slug === themeBase) ?? GENERATOR_THEMES[0];
    const generated = await buildThemeForInput({
      themeSlug: base.slug,
      narrativeSlug: base.recommendedNarratives[0] ?? "davi",
      emphasis,
      audience,
      customTitle: titleText,
    });
    const article = generatedThemeToArticle(generated, category?.name);
    if (themeText) {
      article.title = themeText.slice(0, 180);
      article.seoTitle = themeText.slice(0, 180);
    }
    preview = { generated, article };
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Gerar artigo por tema"
        description="Transforme um tema ou uma passagem bíblica em um artigo completo, com contexto, esboço e referências. O resultado entra como rascunho para você revisar."
        actions={
          <Link href="/admin/artigos" className="a-btn a-btn-outline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar aos artigos
          </Link>
        }
      />

      <Flash ok={params.ok} erro={params.erro} />

      <div className="a-card a-mb-5">
        <div className="a-card-head">
          <div>
            <h2 className="a-card-title">Tema do artigo</h2>
            <p className="a-card-desc">
              Escreva o tema e, se quiser, a passagem. Quando houver uma referência, todas as seções e referências
              seguem essa passagem.
            </p>
          </div>
          <Wand2 className="size-5 text-[var(--a-primary)]" aria-hidden="true" />
        </div>
        <form method="get" action="/admin/artigos/gerar" className="a-card-body">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="a-field">
              <label className="a-label" htmlFor="tema">
                Tema do artigo
              </label>
              <input
                id="tema"
                name="tema"
                defaultValue={themeText}
                className="a-input"
                placeholder="Ex.: A promessa de um lugar"
                maxLength={180}
                required
              />
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="passagem">
                Passagem bíblica <span>opcional</span>
              </label>
              <input
                id="passagem"
                name="passagem"
                defaultValue={passage}
                className="a-input"
                placeholder="Ex.: João 14:1,3"
                maxLength={120}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="a-field">
              <label className="a-label" htmlFor="categoria">Categoria</label>
              <select id="categoria" name="categoria" defaultValue={category?.id ?? ""} className="a-select">
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="tema_base">
                Tema base <span>quando não houver passagem</span>
              </label>
              <select id="tema_base" name="tema_base" defaultValue={themeBase || "auto"} className="a-select">
                <option value="auto">Automático pelo tema</option>
                {GENERATOR_THEMES.map((theme) => (
                  <option key={theme.slug} value={theme.slug}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="enfase">Ênfase</label>
              <select id="enfase" name="enfase" defaultValue={emphasis} className="a-select">
                {EMPHASIS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="a-field">
              <label className="a-label" htmlFor="publico">Para quem?</label>
              <input
                id="publico"
                name="publico"
                defaultValue={audience}
                className="a-input"
                placeholder="Ex.: Leitores do blog, pequeno grupo, jovens"
                maxLength={120}
              />
            </div>
            <button type="submit" className="a-btn a-btn-primary">
              <Sparkles className="size-4" aria-hidden="true" />
              Gerar prévia
            </button>
          </div>
          <p className="a-help mt-2">
            Exemplo: tema <strong>A promessa de um lugar</strong> + passagem <strong>João 14:1,3</strong>. O artigo será
            gerado em torno de João 14:1-3.
          </p>
          {referenceMode.length > 0 ? (
            <p className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-800">
              Referência detectada: {referenceMode.join(" · ")}. O artigo seguirá esta passagem.
            </p>
          ) : null}
        </form>
      </div>

      {preview ? (
        <div className="a-card">
          <div className="a-card-head">
            <div>
              <p className="a-eyebrow">Prévia do artigo</p>
              <h2 className="a-card-title mt-1">{preview.article.title}</h2>
              <p className="a-card-desc mt-1">{preview.article.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="a-badge a-badge-slate">{category?.name ?? "Sem categoria"}</span>
                <span className="a-badge a-badge-gold">{preview.article.readingMinutes} min de leitura</span>
                <span className="a-badge a-badge-slate">{preview.article.tags.length} tags</span>
              </div>
            </div>
            <form action={createGeneratedArticleAction}>
              <input type="hidden" name="tema" value={themeText} />
              <input type="hidden" name="passagem" value={passage} />
              <input type="hidden" name="categoria" value={category?.id ?? ""} />
              <input type="hidden" name="tema_base" value={themeBase || "auto"} />
              <input type="hidden" name="enfase" value={emphasis} />
              <input type="hidden" name="publico" value={audience} />
              <SubmitButton pendingLabel="Criando rascunho…">
                <BookOpen className="size-4" aria-hidden="true" />
                Salvar como rascunho
              </SubmitButton>
            </form>
          </div>
          <div className="a-card-body">
            <div className="a-preview">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(preview.article.content) }} />
            </div>
          </div>
          <div className="a-card-head border-t border-slate-100">
            <p className="a-help !mt-0">
              O artigo será salvo como rascunho com {formatNumber(preview.article.content.length)} caracteres. Depois,
              revise no editor e publique.
            </p>
            <Link href="/admin/artigos" className="a-btn a-btn-ghost a-btn-sm">
              Cancelar
            </Link>
          </div>
        </div>
      ) : (
        <div className="a-card">
          <div className="a-card-body py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--a-surface-2)] text-[var(--a-primary)]">
              <Wand2 className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-slate-900">Comece com um tema</h2>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-slate-500">
              Preencha o tema e clique em <strong>Gerar prévia</strong>. Você poderá revisar tudo antes de criar o
              rascunho.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
