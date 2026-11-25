import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ExternalLink, Sparkles, Wand2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { AdminPageHeader, Flash } from "@/components/admin/ui";
import { SubmitButton, ConfirmSubmit } from "@/components/admin/buttons";
import { GeneratedThemeView } from "@/components/bible/generated-theme-view";
import { VerseRef } from "@/components/bible/verse-ref";
import {
  publishDailyMessageAction,
  saveEditedThemeAction,
  saveGeneratedThemeAction,
  unpublishDailyMessageAction,
} from "@/lib/actions/admin-generator";
import { getDailyMessage, getGeneratedThemeById, getGeneratedThemes } from "@/lib/queries";
import { findThemeReferences, resolveVerseReference } from "@/lib/bible-reference";
import { buildThemeForInput } from "@/lib/reference-theme";
import {
  AUDIENCE_OPTIONS,
  CUSTOM_NARRATIVE,
  CUSTOM_THEME,
  EMPHASIS_OPTIONS,
  GENERATOR_NARRATIVES,
  GENERATOR_THEMES,
  getGeneratorNarrative,
  getGeneratorTheme,
} from "@/lib/theme-generator";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gerador de temas" };

type SearchParams = Promise<{
  tema?: string;
  narrativa?: string;
  enfase?: string;
  publico?: string;
  titulo?: string;
  ok?: string;
  erro?: string;
  salvo?: string;
  geradoId?: string;
}>;

export default async function AdminGeneratorPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;

  const theme =
    params.tema === "" ? CUSTOM_THEME : getGeneratorTheme(params.tema ?? "") ?? GENERATOR_THEMES[0];
  const narrative =
    params.narrativa === ""
      ? CUSTOM_NARRATIVE
      : getGeneratorNarrative(params.narrativa ?? "") ?? getGeneratorNarrative("davi")!;
  const emphasis = EMPHASIS_OPTIONS.some((option) => option.value === params.enfase)
    ? params.enfase!
    : "ambos";
  const audience = params.publico === undefined ? AUDIENCE_OPTIONS[0] : params.publico;
  const customTitle = (params.titulo ?? "").slice(0, 180);
  const built = await buildThemeForInput({
    themeSlug: theme.slug,
    narrativeSlug: narrative.slug,
    emphasis,
    audience,
    customTitle,
  });
  const savedTheme = params.geradoId ? await getGeneratedThemeById(Number(params.geradoId)) : null;
  const generated = savedTheme?.parsed ?? built;
  const activeAudience = generated.audience === "Estudo personalizado" ? "" : generated.audience;
  const activeTitle = savedTheme?.parsed ? generated.title : customTitle;
  const referenceMode = findThemeReferences(activeTitle);
  const savedThemes = await getGeneratedThemes();
  const dailyMessage = await getDailyMessage();
  const dailyVerse = dailyMessage ? await resolveVerseReference(dailyMessage.reference) : null;
  const savedSlug = params.salvo;

  const groups = Array.from(new Set(GENERATOR_NARRATIVES.map((item) => item.group)));

  return (
    <>
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Gerador de temas"
        description="Crie estudos com contexto histórico, narrativas bíblicas, reis, o ensino de Deus e a voz de Jesus. Salve na biblioteca e publique a mensagem do dia."
        actions={
          <Link href="/admin/biblioteca" className="a-btn a-btn-outline">
            <BookOpen className="size-4" aria-hidden="true" />
            Ver biblioteca
          </Link>
        }
      />

      <Flash ok={params.ok} erro={params.erro} />

      {savedSlug ? (
        <div className="a-alert a-alert-ok a-mb-4 flex flex-wrap items-center justify-between gap-3">
          <span>Tema salvo na biblioteca.</span>
          <Link href={`/biblioteca/${savedSlug}`} target="_blank" className="a-btn a-btn-outline a-btn-sm">
            <ExternalLink className="size-3.5" aria-hidden="true" />
            Abrir estudo público
          </Link>
        </div>
      ) : null}

      <div className="a-card a-mb-5">
        <div className="a-card-head">
          <div>
            <h2 className="a-card-title">Montar o tema</h2>
            <p className="a-card-desc">
              Escolha o tema central, a narrativa histórica e a ênfase. O esboço e as referências são gerados na hora.
            </p>
          </div>
          <Wand2 className="size-5 text-[var(--a-primary)]" aria-hidden="true" />
        </div>
        <form method="get" action="/admin/gerador" className="a-card-body">
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            <div className="a-field">
              <label className="a-label" htmlFor="tema">
                Tema central
              </label>
              <select id="tema" name="tema" defaultValue={generated.themeSlug} className="a-select">
                <option value="">Nenhum / personalizado</option>
                {GENERATOR_THEMES.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="a-field">
              <label className="a-label" htmlFor="narrativa">
                Narrativa histórica
              </label>
              <select id="narrativa" name="narrativa" defaultValue={generated.narrativeSlug} className="a-select">
                <option value="">Nenhuma / personalizada</option>
                {groups.map((group) => (
                  <optgroup key={group} label={group}>
                    {GENERATOR_NARRATIVES.filter((item) => item.group === group).map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="a-field">
              <label className="a-label" htmlFor="enfase">
                Ênfase
              </label>
              <select id="enfase" name="enfase" defaultValue={generated.emphasis} className="a-select">
                {EMPHASIS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="a-field">
              <label className="a-label" htmlFor="publico">
                Para quem?
              </label>
              <select id="publico" name="publico" defaultValue={activeAudience} className="a-select">
                <option value="">Nenhum / personalizado</option>
                {AUDIENCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-2 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="a-field">
              <label className="a-label" htmlFor="titulo">
                Tema ou título do estudo <span>opcional</span>
              </label>
              <input
                id="titulo"
                name="titulo"
                defaultValue={activeTitle}
                className="a-input"
                placeholder="Ex.: A promessa de um lugar — João 14:1-3"
                maxLength={180}
              />
            </div>
            <SubmitButton pendingLabel="Gerando…">
              <Sparkles className="size-4" aria-hidden="true" />
              Gerar tema
            </SubmitButton>
          </div>
          <p className="a-help mt-2">
            Escreva o tema e, se quiser, a passagem bíblica — por exemplo:{" "}
            <strong>A promessa de um lugar — João 14:1-3</strong>. Quando houver uma referência no texto, todas as
            referências e seções do estudo serão alinhadas a essa passagem.
          </p>
          {referenceMode.length > 0 ? (
            <p className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-800">
              Referência detectada: {referenceMode.join(" · ")}. O estudo está sendo gerado a partir dela.
            </p>
          ) : null}
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#14110d] p-6 text-white shadow-[var(--shadow-lift)] md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              <Sparkles className="size-3" aria-hidden="true" />
              Prévia do estudo
              <span className="rounded-full border border-white/15 px-2 py-0.5 text-white/60">
                {generated.narrativeName}
              </span>
              <span className="rounded-full border border-white/15 px-2 py-0.5 text-white/60">
                {generated.emphasisLabel}
              </span>
              {referenceMode.length > 0 ? (
                <span className="rounded-full border border-emerald-300/40 bg-emerald-400/10 px-2 py-0.5 text-emerald-200">
                  Referências alinhadas à passagem
                </span>
              ) : null}
            </div>
            <h1 className="mt-3 font-serif text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-tight text-white">
              {generated.title}
            </h1>
            <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-white/55">{generated.subtitle}</p>
            <p className="mt-3 text-[10.5px] uppercase tracking-[0.14em] text-white/35">
              {generated.period} · {generated.audience}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {savedTheme?.parsed ? (
              <a href="#editor-manual" className="a-btn a-btn-primary">
                <BookOpen className="size-4" aria-hidden="true" />
                Editar tema salvo
              </a>
            ) : (
              <form action={saveGeneratedThemeAction}>
                <input type="hidden" name="tema" value={generated.themeSlug} />
                <input type="hidden" name="narrativa" value={generated.narrativeSlug} />
                <input type="hidden" name="enfase" value={generated.emphasis} />
                <input type="hidden" name="publico" value={activeAudience} />
                <input type="hidden" name="titulo" value={activeTitle} />
                <SubmitButton className="a-btn a-btn-primary" pendingLabel="Salvando…">
                  <BookOpen className="size-4" aria-hidden="true" />
                  Salvar na biblioteca
                </SubmitButton>
              </form>
            )}
            <a href="#editor-manual" className="a-btn a-btn-on-dark">
              Editar manualmente
            </a>
            <form action={publishDailyMessageAction}>
              <input type="hidden" name="tema" value={generated.themeSlug} />
              <input type="hidden" name="narrativa" value={generated.narrativeSlug} />
              <input type="hidden" name="enfase" value={generated.emphasis} />
              <input type="hidden" name="publico" value={activeAudience} />
              <input type="hidden" name="titulo" value={activeTitle} />
              <input type="hidden" name="geradoId" value={savedTheme?.id ?? params.geradoId ?? ""} />
              <SubmitButton
                className="a-btn a-btn-on-dark"
                pendingLabel="Publicando…"
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Publicar mensagem do dia
              </SubmitButton>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <GeneratedThemeView content={generated} dailyLabel="Mensagem do dia gerada" />
      </div>

      <section id="editor-manual" className="a-card a-mt-6 scroll-mt-24">
        <div className="a-card-head">
          <div>
            <h2 className="a-card-title">Editar manualmente</h2>
            <p className="a-card-desc">
              Ajuste cada parte do estudo com as suas palavras. Ao salvar, o tema vai para a biblioteca ou atualiza o
              tema salvo.
            </p>
          </div>
          <Wand2 className="size-5 text-[var(--a-primary)]" aria-hidden="true" />
        </div>
        <form action={saveEditedThemeAction} className="a-card-body">
          {savedTheme ? <input type="hidden" name="geradoId" value={savedTheme.id} /> : null}
          <input type="hidden" name="tema" value={generated.themeSlug} />
          <input type="hidden" name="narrativa" value={generated.narrativeSlug} />
          <input type="hidden" name="enfase" value={generated.emphasis} />
          <input type="hidden" name="publico" value={activeAudience} />
          <input type="hidden" name="titulo" value={activeTitle} />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="a-field">
              <label className="a-label" htmlFor="titulo_editado">Título do estudo</label>
              <input
                id="titulo_editado"
                name="titulo_editado"
                defaultValue={generated.title}
                className="a-input"
                required
                maxLength={180}
              />
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="subtitulo_editado">Subtítulo</label>
              <input
                id="subtitulo_editado"
                name="subtitulo_editado"
                defaultValue={generated.subtitle}
                className="a-input"
                maxLength={400}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="a-field">
              <label className="a-label" htmlFor="contexto_editado">
                Contexto histórico <span>separe parágrafos com uma linha em branco</span>
              </label>
              <textarea
                id="contexto_editado"
                name="contexto_editado"
                defaultValue={generated.historicalContext.join("\n\n")}
                className="a-textarea min-h-[150px]"
              />
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="narrativa_editada">
                Narrativa bíblica <span>separe parágrafos com uma linha em branco</span>
              </label>
              <textarea
                id="narrativa_editada"
                name="narrativa_editada"
                defaultValue={generated.narrative.join("\n\n")}
                className="a-textarea min-h-[150px]"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="a-field">
              <label className="a-label" htmlFor="deus_editado">
                O que Deus ensinou <span>separe parágrafos com uma linha em branco</span>
              </label>
              <textarea
                id="deus_editado"
                name="deus_editado"
                defaultValue={generated.god.paragraphs.join("\n\n")}
                className="a-textarea min-h-[150px]"
              />
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="jesus_editado">
                O que Jesus revelou <span>separe parágrafos com uma linha em branco</span>
              </label>
              <textarea
                id="jesus_editado"
                name="jesus_editado"
                defaultValue={generated.jesus.paragraphs.join("\n\n")}
                className="a-textarea min-h-[150px]"
              />
            </div>
          </div>

          <div className="a-mt-5">
            <h3 className="a-card-title">Esboço</h3>
            <p className="a-card-desc">Edite os títulos e os textos dos movimentos. As referências continuam as mesmas.</p>
            <input type="hidden" name="ponto_count" value={generated.outline.length} />
            <div className="mt-4 space-y-4">
              {generated.outline.map((point, index) => (
                <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="a-field !mt-0">
                      <label className="a-label" htmlFor={`ponto_${index}_titulo`}>
                        Ponto {index + 1} · título
                      </label>
                      <input
                        id={`ponto_${index}_titulo`}
                        name={`ponto_${index}_titulo`}
                        defaultValue={point.title}
                        className="a-input"
                        maxLength={220}
                      />
                    </div>
                    <div className="a-field !mt-0">
                      <label className="a-label" htmlFor={`ponto_${index}_texto`}>
                        Ponto {index + 1} · desenvolvimento
                      </label>
                      <textarea
                        id={`ponto_${index}_texto`}
                        name={`ponto_${index}_texto`}
                        defaultValue={point.body}
                        className="a-textarea min-h-[96px]"
                        maxLength={6000}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="a-field">
              <label className="a-label" htmlFor="aplicacoes_editadas">
                Aplicações <span>uma por linha</span>
              </label>
              <textarea
                id="aplicacoes_editadas"
                name="aplicacoes_editadas"
                defaultValue={generated.applications.join("\n")}
                className="a-textarea min-h-[130px]"
              />
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="oracao_editada">Oração</label>
              <textarea
                id="oracao_editada"
                name="oracao_editada"
                defaultValue={generated.prayer}
                className="a-textarea min-h-[130px]"
              />
            </div>
          </div>

          <div className="a-mt-5">
            <h3 className="a-card-title">Mensagem do dia</h3>
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              <div className="a-field">
                <label className="a-label" htmlFor="mensagem_titulo">Título da mensagem</label>
                <input
                  id="mensagem_titulo"
                  name="mensagem_titulo"
                  defaultValue={generated.dailyMessage.title}
                  className="a-input"
                  maxLength={220}
                />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="mensagem_referencia">Referência bíblica</label>
                <input
                  id="mensagem_referencia"
                  name="mensagem_referencia"
                  defaultValue={generated.dailyMessage.reference}
                  className="a-input"
                  maxLength={120}
                  placeholder="Ex.: Salmos 119:105"
                />
              </div>
              <div className="a-field lg:col-span-2">
                <label className="a-label" htmlFor="mensagem_corpo">
                  Reflexão <span>separe parágrafos com uma linha em branco</span>
                </label>
                <textarea
                  id="mensagem_corpo"
                  name="mensagem_corpo"
                  defaultValue={generated.dailyMessage.body.join("\n\n")}
                  className="a-textarea min-h-[130px]"
                />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="mensagem_pratica">Prática de hoje</label>
                <textarea
                  id="mensagem_pratica"
                  name="mensagem_pratica"
                  defaultValue={generated.dailyMessage.practice}
                  className="a-textarea min-h-[96px]"
                />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="mensagem_oracao">Oração da mensagem</label>
                <textarea
                  id="mensagem_oracao"
                  name="mensagem_oracao"
                  defaultValue={generated.dailyMessage.prayer}
                  className="a-textarea min-h-[96px]"
                />
              </div>
            </div>
          </div>

          <div className="a-actions a-mt-5">
            <SubmitButton pendingLabel="Salvando…">
              <BookOpen className="size-4" aria-hidden="true" />
              {savedTheme?.parsed ? "Atualizar tema salvo" : "Salvar alterações na biblioteca"}
            </SubmitButton>
            <p className="a-help !mt-0">
              As referências bíblicas são preservadas e continuam clicáveis no site.
            </p>
          </div>
        </form>
      </section>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="a-card h-fit">
          <div className="a-card-head">
            <div>
              <h2 className="a-card-title">Temas gerados</h2>
              <p className="a-card-desc">Os últimos estudos salvos na biblioteca.</p>
            </div>
            <span className="a-badge a-badge-slate">{savedThemes.length}</span>
          </div>
          {savedThemes.length === 0 ? (
            <div className="a-card-body">
              <p className="a-empty-text">Nenhum tema salvo ainda. Gere uma prévia e clique em “Salvar na biblioteca”.</p>
            </div>
          ) : (
            <div className="a-card-body-tight divide-y divide-slate-100">
              {savedThemes.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/gerador?tema=${encodeURIComponent(item.theme_slug)}&narrativa=${encodeURIComponent(
                        item.narrative_slug,
                      )}&enfase=${encodeURIComponent(item.emphasis)}&publico=${encodeURIComponent(item.audience)}&geradoId=${item.id}`}
                      className="block truncate text-[12.5px] font-semibold text-slate-800 hover:text-[var(--a-primary)]"
                    >
                      {item.library_title}
                    </Link>
                    <p className="mt-0.5 text-[10.5px] text-slate-500">
                      {item.narrative_slug.replace(/-/g, " ")} · {item.emphasis} · {formatDate(item.created_at)}
                    </p>
                  </div>
                  <Link
                    href={`/biblioteca/${item.library_slug}`}
                    target="_blank"
                    className="a-btn a-btn-outline a-btn-sm"
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    Ver
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="a-card h-fit">
          <div className="a-card-head">
            <div>
              <h2 className="a-card-title">Mensagem do dia</h2>
              <p className="a-card-desc">É o que aparece na página inicial do site.</p>
            </div>
            <Sparkles className="size-4 text-[var(--a-primary)]" aria-hidden="true" />
          </div>
          {dailyMessage ? (
            <div className="a-card-body">
              <p className="a-eyebrow">{formatDate(dailyMessage.day, "long")}</p>
              <h3 className="mt-1.5 font-serif text-xl font-semibold text-slate-900">{dailyMessage.title}</h3>
              <div className="mt-2">
                <VerseRef
                  reference={dailyMessage.reference}
                  text={dailyVerse?.text}
                  href={dailyVerse?.href}
                  items={dailyVerse?.items}
                />
              </div>
              <p className="mt-3 line-clamp-3 text-[12px] leading-relaxed text-slate-500">
                {dailyMessage.body.split(/\n\n+/)[0]}
              </p>
              <div className="a-actions mt-4">
                <form action={unpublishDailyMessageAction}>
                  <ConfirmSubmit
                    className="a-btn a-btn-danger a-btn-sm"
                    message="Remover a mensagem do dia da página inicial?"
                  >
                    Remover da home
                  </ConfirmSubmit>
                </form>
                {dailyMessage.library_slug ? (
                  <Link href={`/biblioteca/${dailyMessage.library_slug}`} target="_blank" className="a-btn a-btn-ghost a-btn-sm">
                    Ver estudo <ExternalLink className="size-3" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="a-card-body">
              <p className="a-empty-text">
                Nenhuma mensagem publicada. Use o botão “Publicar mensagem do dia” acima para criar a mensagem de hoje.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
