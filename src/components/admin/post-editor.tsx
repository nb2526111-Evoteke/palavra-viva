"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CloudUpload,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  LoaderCircle,
  PenLine,
  Save,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { marked } from "marked";
import { savePostAction } from "@/lib/actions/admin-posts";
import { sqlToLocalInput, slugify } from "@/lib/utils";

type EditorCategory = { id: number; name: string };

export type EditorPost = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category_id: number | null;
  status: string;
  featured: number;
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  reading_minutes: number;
  updated_at: string;
  tags: string;
};

function localNow() {
  return sqlToLocalInput(new Date().toISOString());
}

function sanitizePreview(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

export function PostEditor({
  post,
  categories,
}: {
  post: EditorPost | null;
  categories: EditorCategory[];
}) {
  const [state, action, pending] = useActionState(savePostAction, null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [subtitle, setSubtitle] = useState(post?.subtitle ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [categoryId, setCategoryId] = useState(post?.category_id ? String(post.category_id) : "");
  const [status, setStatus] = useState(post?.status ?? "draft");
  const [featured, setFeatured] = useState(Boolean(post?.featured));
  const [publishedAt, setPublishedAt] = useState(
    post?.published_at ? sqlToLocalInput(post.published_at) : localNow(),
  );
  const [tags, setTags] = useState(post?.tags ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dirty, setDirty] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const preview = useMemo(() => {
    try {
      return sanitizePreview(marked.parse(content || "_Nada para visualizar ainda._", { async: false, gfm: true, breaks: true }) as string);
    } catch {
      return "<p>Não foi possível gerar a prévia.</p>";
    }
  }, [content]);

  const words = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 220));

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function markDirty() {
    setDirty(true);
  }

  async function uploadCover(file: File) {
    setUploadError("");
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("alt", title || "Capa do artigo");
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !json.url) throw new Error(json.error || "Falha no envio.");
      setCoverImage(json.url);
      markDirty();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Falha no envio.");
    } finally {
      setUploading(false);
    }
  }

  const wordLabel = `${words.toLocaleString("pt-BR")} ${words === 1 ? "palavra" : "palavras"} · ${minutes} min`;

  return (
    <form
      ref={formRef}
      action={action}
      onChange={markDirty}
      className="pb-10"
      onSubmit={() => setDirty(false)}
    >
      <input type="hidden" name="id" value={post?.id ?? ""} />

      <div className="a-page-head">
        <div className="min-w-0">
          <Link href="/admin/artigos" className="a-btn-link mb-2">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Todos os artigos
          </Link>
          <h1 className="a-page-title truncate">{post ? "Editar artigo" : "Novo artigo"}</h1>
          <p className="a-page-desc">
            {post
              ? `Última atualização: ${post.updated_at}. Salve quando terminar.`
              : "Comece pelo título. O endereço e as informações de SEO podem ser ajustados ao lado."}
          </p>
        </div>
        <div className="a-page-actions">
          {post && post.status === "published" ? (
            <Link href={`/blog/${post.slug}`} target="_blank" className="a-btn a-btn-outline">
              <ExternalLink className="size-4" aria-hidden="true" />
              Ver no site
            </Link>
          ) : null}
          <button type="button" className="a-btn a-btn-outline" onClick={() => setTab("preview")}>
            <Eye className="size-4" aria-hidden="true" />
            Prévia
          </button>
          <button type="submit" className="a-btn a-btn-primary" disabled={pending}>
            {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
            {pending ? "Salvando…" : "Salvar artigo"}
          </button>
        </div>
      </div>

      {state && !state.ok ? (
        <div className="a-alert a-alert-error" role="alert">
          <span>{state.message}</span>
        </div>
      ) : null}

      <div className="a-editor-grid">
        <div className="space-y-5">
          <div className="a-card">
            <div className="p-5">
              <label className="a-label" htmlFor="title">
                Título
              </label>
              <input
                id="title"
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="a-input !border-0 !px-0 !py-1 !text-[1.45rem] !font-semibold !shadow-none focus:!ring-0"
                placeholder="Um título que valha a leitura…"
                maxLength={180}
                required
              />
              {state?.fieldErrors?.title ? <p className="a-error">{state.fieldErrors.title}</p> : null}

              <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[11.5px] text-slate-500">
                <span className="font-medium text-slate-400">/blog/</span>
                <input
                  name="slug"
                  value={slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(event.target.value);
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-[11.5px] text-slate-600 focus:outline-none"
                  placeholder="endereco-do-artigo"
                  maxLength={120}
                />
                <button
                  type="button"
                  className="a-btn-link"
                  onClick={() => {
                    setSlugTouched(false);
                    setSlug(slugify(title));
                  }}
                >
                  <Wand2 className="size-3" aria-hidden="true" />
                  Gerar
                </button>
              </div>

              <div className="mt-4">
                <label className="a-label" htmlFor="subtitle">
                  Subtítulo <span>opcional</span>
                </label>
                <input
                  id="subtitle"
                  name="subtitle"
                  value={subtitle}
                  onChange={(event) => setSubtitle(event.target.value)}
                  className="a-input"
                  placeholder="Uma linha que prepara o leitor para o texto"
                  maxLength={220}
                />
              </div>

              <div className="mt-4">
                <label className="a-label" htmlFor="excerpt">
                  Resumo <span>aparece nos cartões e na busca</span>
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  className="a-textarea min-h-[76px]"
                  placeholder="Se ficar em branco, criamos um resumo a partir do texto."
                  maxLength={400}
                />
              </div>
            </div>
          </div>

          <div className="a-card overflow-hidden">
            <div className="a-editor-toolbar">
              <div className="a-editor-tabs" role="tablist" aria-label="Modo do editor">
                <button
                  type="button"
                  className={`a-editor-tab ${tab === "write" ? "is-active" : ""}`}
                  onClick={() => setTab("write")}
                  role="tab"
                  aria-selected={tab === "write"}
                >
                  <PenLine className="size-3.5" aria-hidden="true" />
                  Escrever
                </button>
                <button
                  type="button"
                  className={`a-editor-tab ${tab === "preview" ? "is-active" : ""}`}
                  onClick={() => setTab("preview")}
                  role="tab"
                  aria-selected={tab === "preview"}
                >
                  <Eye className="size-3.5" aria-hidden="true" />
                  Prévia
                </button>
              </div>
              <span className="a-editor-meta">{wordLabel}</span>
            </div>

            {tab === "write" ? (
              <textarea
                name="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="a-editor-textarea"
                placeholder={"## Um novo começo\n\nEscreva aqui. Você pode usar Markdown:\n\n- **negrito** e *itálico*\n- ## para títulos\n- > para citações\n- [texto](https://exemplo.com) para links"}
                required
              />
            ) : (
              <>
                <textarea name="content" value={content} readOnly className="hidden" />
                <div className="a-preview" dangerouslySetInnerHTML={{ __html: preview }} />
              </>
            )}
          </div>
          {state?.fieldErrors?.content ? <p className="a-error">{state.fieldErrors.content}</p> : null}

          <details className="a-card p-4 text-[12px] text-slate-500">
            <summary className="cursor-pointer font-semibold text-slate-700">Guia rápido de Markdown</summary>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <p><code className="a-mono">## Título</code> cria uma seção</p>
              <p><code className="a-mono">**texto**</code> deixa em negrito</p>
              <p><code className="a-mono">&gt; citação</code> abre uma citação</p>
              <p><code className="a-mono">- item</code> cria uma lista</p>
              <p><code className="a-mono">[texto](url)</code> cria um link</p>
              <p><code className="a-mono">![alt](url)</code> insere uma imagem</p>
            </div>
          </details>
        </div>

        <aside className="a-editor-side">
          <div className="a-card">
            <div className="a-card-head">
              <h2 className="a-card-title">Publicação</h2>
              <span className={`a-badge ${status === "published" ? "a-badge-green" : status === "scheduled" ? "a-badge-amber" : "a-badge-slate"}`}>
                {status === "published" ? "Publicado" : status === "scheduled" ? "Agendado" : "Rascunho"}
              </span>
            </div>
            <div className="a-card-body">
              <div className="a-field">
                <label className="a-label" htmlFor="status">Situação</label>
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    if (event.target.value !== "draft" && !publishedAt) setPublishedAt(localNow());
                  }}
                  className="a-select"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                  <option value="scheduled">Agendado</option>
                </select>
              </div>

              <div className="a-field">
                <label className="a-label" htmlFor="published_at">
                  Data de publicação <span>{status === "scheduled" ? "obrigatória" : "opcional"}</span>
                </label>
                <input
                  id="published_at"
                  name="published_at"
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(event) => setPublishedAt(event.target.value)}
                  className="a-input"
                />
                <p className="a-help">Horário de Brasília (UTC−3).</p>
              </div>

              <label className="a-check mt-4">
                <input
                  type="checkbox"
                  name="featured"
                  value="1"
                  checked={featured}
                  onChange={(event) => setFeatured(event.target.checked)}
                />
                <span>
                  <strong className="block text-[12px] text-slate-700">Destacar na home</strong>
                  <span className="block text-[11px] text-slate-500">Aparece na seleção editorial da página inicial.</span>
                </span>
              </label>

              <button type="submit" className="a-btn a-btn-primary a-w-full a-mt-4" disabled={pending}>
                {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
                {pending ? "Salvando…" : "Salvar artigo"}
              </button>
              <p className="a-help text-center">
                <kbd className="a-mono">Ctrl</kbd> + <kbd className="a-mono">S</kbd> também salva.
              </p>
            </div>
          </div>

          <div className="a-card">
            <div className="a-card-head">
              <h2 className="a-card-title">Imagem de capa</h2>
            </div>
            <div className="a-card-body">
              <input type="hidden" name="cover_image" value={coverImage} />
              <div className="a-cover-preview">
                {coverImage ? (
                  <img src={coverImage} alt="Prévia da capa" />
                ) : (
                  <div className="a-cover-empty">
                    <ImageIcon className="size-5" aria-hidden="true" />
                    Sem imagem de capa
                  </div>
                )}
              </div>
              {coverImage ? (
                <button
                  type="button"
                  className="a-btn a-btn-ghost a-btn-sm a-mt-2"
                  onClick={() => {
                    setCoverImage("");
                    markDirty();
                  }}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Remover capa
                </button>
              ) : null}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadCover(file);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                className="a-btn a-btn-outline a-w-full a-mt-3"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <CloudUpload className="size-4" aria-hidden="true" />}
                {uploading ? "Enviando…" : "Enviar imagem"}
              </button>
              <input
                value={coverImage}
                onChange={(event) => {
                  setCoverImage(event.target.value);
                  markDirty();
                }}
                className="a-input a-mt-2"
                placeholder="ou cole uma URL /uploads/…"
                aria-label="URL da imagem de capa"
              />
              {uploadError ? <p className="a-error">{uploadError}</p> : null}
            </div>
          </div>

          <div className="a-card">
            <div className="a-card-head">
              <h2 className="a-card-title">Organização</h2>
            </div>
            <div className="a-card-body">
              <div className="a-field">
                <label className="a-label" htmlFor="category_id">Categoria</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="a-select"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="tags">Etiquetas <span>separadas por vírgula</span></label>
                <input
                  id="tags"
                  name="tags"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  className="a-input"
                  placeholder="oração, esperança, salmos"
                />
                <p className="a-help">Até 15 etiquetas. Elas conectam leituras parecidas.</p>
              </div>
            </div>
          </div>

          <div className="a-card">
            <div className="a-card-head">
              <h2 className="a-card-title">SEO e compartilhamento</h2>
              <Sparkles className="size-4 text-slate-300" aria-hidden="true" />
            </div>
            <div className="a-card-body">
              <div className="a-field">
                <label className="a-label" htmlFor="seo_title">Título de busca</label>
                <input
                  id="seo_title"
                  name="seo_title"
                  value={seoTitle}
                  onChange={(event) => setSeoTitle(event.target.value)}
                  className="a-input"
                  placeholder="Se vazio, usa o título do artigo"
                  maxLength={190}
                />
                <p className="a-help">{seoTitle.length}/190</p>
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="seo_description">Descrição de busca</label>
                <textarea
                  id="seo_description"
                  name="seo_description"
                  value={seoDescription}
                  onChange={(event) => setSeoDescription(event.target.value)}
                  className="a-textarea min-h-[80px]"
                  placeholder="Se vazio, usa o resumo do artigo"
                  maxLength={320}
                />
                <p className="a-help">{seoDescription.length}/320</p>
              </div>
            </div>
          </div>

          {post ? (
            <div className="a-card p-4">
              <p className="flex items-center gap-2 text-[11px] text-slate-500">
                <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
                {wordLabel} · {post.reading_minutes} min no site
              </p>
            </div>
          ) : null}
        </aside>
      </div>
    </form>
  );
}
