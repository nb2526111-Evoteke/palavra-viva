import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  Undo2,
} from "lucide-react";
import { AdminPageHeader, EmptyState, Flash, StatusBadge } from "@/components/admin/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import {
  deletePostAction,
  duplicatePostAction,
  quickPostStatusAction,
  toggleFeaturedAction,
} from "@/lib/actions/admin-posts";
import { getAdminPostCount, getAdminPosts } from "@/lib/queries";
import { formatDate, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Artigos" };

type SearchParams = Promise<{ status?: string; q?: string; page?: string; ok?: string; erro?: string }>;

const TABS = [
  { value: "all", label: "Todos" },
  { value: "published", label: "Publicados" },
  { value: "draft", label: "Rascunhos" },
  { value: "scheduled", label: "Agendados" },
];

export default async function AdminPostsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const status = TABS.some((tab) => tab.value === params.status) ? params.status! : "all";
  const query = (params.q ?? "").trim();
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const perPage = 20;

  const posts = await getAdminPosts({
    status,
    search: query || undefined,
    limit: perPage,
    offset: (page - 1) * perPage,
  });
  const total = await getAdminPostCount({ status, search: query || undefined });
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const [all, published, draft, scheduled] = await Promise.all([
    getAdminPostCount(),
    getAdminPostCount({ status: "published" }),
    getAdminPostCount({ status: "draft" }),
    getAdminPostCount({ status: "scheduled" }),
  ]);
  const counts: Record<string, number> = { all, published, draft, scheduled };

  const href = (nextPage: number, nextStatus = status) => {
    const search = new URLSearchParams();
    if (nextStatus !== "all") search.set("status", nextStatus);
    if (query) search.set("q", query);
    if (nextPage > 1) search.set("page", String(nextPage));
    const text = search.toString();
    return `/admin/artigos${text ? `?${text}` : ""}`;
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Artigos"
        description="Escreva, revise, agende e publique. O que está em rascunho não aparece no site."
        actions={
          <>
            <Link href="/admin/artigos/gerar" className="a-btn a-btn-outline">
              <Sparkles className="size-4" aria-hidden="true" />
              Gerar por tema
            </Link>
            <Link href="/admin/artigos/novo" className="a-btn a-btn-primary">
              <Plus className="size-4" aria-hidden="true" />
              Novo artigo
            </Link>
          </>
        }
      />

      <Flash ok={params.ok} erro={params.erro} />

      <div className="a-card">
        <div className="a-card-head">
          <div className="a-tabs -mx-4 -mb-4 border-0 px-4 pb-0">
            {TABS.map((tab) => (
              <Link
                key={tab.value}
                href={href(1, tab.value)}
                className={`a-tab ${status === tab.value ? "is-active" : ""}`}
              >
                {tab.label}
                <span className="a-tab-count">{formatNumber(counts[tab.value] ?? 0)}</span>
              </Link>
            ))}
          </div>
          <form action="/admin/artigos" method="get" className="a-filters">
            {status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
            <div className="a-search">
              <Search aria-hidden="true" />
              <input
                name="q"
                defaultValue={query}
                placeholder="Buscar por título ou endereço…"
                className="a-input a-input-sm w-[230px]"
                aria-label="Buscar artigos"
              />
            </div>
            <button type="submit" className="a-btn a-btn-outline a-btn-sm">
              Buscar
            </button>
            {query ? (
              <Link href={href(1)} className="a-btn a-btn-ghost a-btn-sm">
                Limpar
              </Link>
            ) : null}
          </form>
        </div>

        {posts.length === 0 ? (
          <EmptyState
            icon={<FileText className="size-5" />}
            title={query ? "Nenhum artigo encontrado" : "Sua primeira página começa aqui"}
            description={
              query
                ? "Tente outro termo ou limpe a busca para ver todos os artigos."
                : "Crie um artigo em branco, escreva com calma e publique quando estiver pronto."
            }
            action={
              <Link href="/admin/artigos/novo" className="a-btn a-btn-primary a-btn-sm">
                <Plus className="size-3.5" aria-hidden="true" />
                Novo artigo
              </Link>
            }
          />
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Artigo</th>
                  <th>Situação</th>
                  <th>Categoria</th>
                  <th>Leituras</th>
                  <th>Data</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className="a-table-title">
                        <Link href={`/admin/artigos/${post.id}`}>{post.title}</Link>
                        {post.featured ? <span className="a-badge a-badge-gold ml-2">Destaque</span> : null}
                      </div>
                      <div className="a-table-sub">
                        /blog/{post.slug}
                        {post.comment_count ? ` · ${post.comment_count} comentários` : ""}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={post.status} />
                    </td>
                    <td>
                      {post.category_name ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="size-1.5 rounded-full"
                            style={{ background: post.category_color || "#94a3b8" }}
                          />
                          {post.category_name}
                        </span>
                      ) : (
                        <span className="a-muted">Sem categoria</span>
                      )}
                    </td>
                    <td className="a-table-num">{formatNumber(post.views)}</td>
                    <td className="a-table-num whitespace-nowrap">
                      {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                    </td>
                    <td>
                      <div className="a-table-actions">
                        <Link
                          href={`/admin/artigos/${post.id}`}
                          className="a-btn a-btn-outline a-btn-icon"
                          title="Editar artigo"
                          aria-label="Editar artigo"
                        >
                          <Pencil className="size-3.5" />
                        </Link>
                        {post.status === "published" ? (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="a-btn a-btn-outline a-btn-icon"
                            title="Ver no site"
                            aria-label="Ver no site"
                          >
                            <Eye className="size-3.5" />
                          </Link>
                        ) : null}
                        <form action={quickPostStatusAction}>
                          <input type="hidden" name="id" value={post.id} />
                          <input type="hidden" name="status" value={post.status === "published" ? "draft" : "published"} />
                          <SubmitButton
                            className="a-btn a-btn-outline a-btn-icon"
                            pendingLabel=""
                            title={post.status === "published" ? "Despublicar" : "Publicar"}
                          >
                            {post.status === "published" ? (
                              <Undo2 className="size-3.5" />
                            ) : (
                              <Send className="size-3.5" />
                            )}
                          </SubmitButton>
                        </form>
                        <form action={toggleFeaturedAction}>
                          <input type="hidden" name="id" value={post.id} />
                          <SubmitButton className="a-btn a-btn-outline a-btn-icon" pendingLabel="" title="Alternar destaque">
                            <span className={post.featured ? "text-amber-600" : "text-slate-400"}>★</span>
                          </SubmitButton>
                        </form>
                        <form action={duplicatePostAction}>
                          <input type="hidden" name="id" value={post.id} />
                          <SubmitButton className="a-btn a-btn-outline a-btn-icon" pendingLabel="" title="Duplicar artigo">
                            <Copy className="size-3.5" />
                          </SubmitButton>
                        </form>
                        <form action={deletePostAction}>
                          <input type="hidden" name="id" value={post.id} />
                          <ConfirmSubmit
                            className="a-btn a-btn-danger a-btn-icon"
                            message={`Excluir definitivamente "${post.title}"? Comentários e histórico de leituras também serão removidos.`}
                            title="Excluir artigo"
                          >
                            <Trash2 className="size-3.5" />
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 ? (
          <div className="a-card-head border-t border-b-0">
            <p className="a-help !mt-0">
              {total} {total === 1 ? "artigo" : "artigos"} · página {page} de {totalPages}
            </p>
            <div className="a-actions">
              {page > 1 ? (
                <Link href={href(page - 1)} className="a-btn a-btn-outline a-btn-sm">
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  Anterior
                </Link>
              ) : null}
              {page < totalPages ? (
                <Link href={href(page + 1)} className="a-btn a-btn-outline a-btn-sm">
                  Próxima
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
