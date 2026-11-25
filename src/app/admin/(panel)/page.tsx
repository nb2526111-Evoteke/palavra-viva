import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  Eye,
  FileText,
  Mail,
  MessageSquare,
  PenLine,
  Plus,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { AdminPageHeader, AdminCard, Flash, StatusBadge } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import {
  countComments,
  getAdminPosts,
  getAuditLogs,
  getDashboardStats,
  getTopPosts,
  getViewsSeries,
  listComments,
} from "@/lib/queries";
import { setCommentStatusAction } from "@/lib/actions/admin-comments";
import { formatDate, formatNumber, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard" };

type SearchParams = Promise<{ ok?: string; erro?: string }>;

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hour12: false, timeZone: "America/Sao_Paulo" }).format(
      new Date(),
    ),
  );
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function AdminDashboardPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const stats = await getDashboardStats();
  const series = await getViewsSeries(14);
  const periodViews = series.reduce((total, day) => total + day.total, 0);
  const maxViews = Math.max(...series.map((day) => day.total), 1);
  const topPosts = await getTopPosts(5);
  const pending = (await listComments("pending")).slice(0, 4);
  const recentPosts = await getAdminPosts({ status: "all", limit: 5 });
  const audit = await getAuditLogs(6);
  const pendingTotal = await countComments("pending");
  const drafts = stats.drafts + stats.scheduled;

  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  return (
    <>
      <AdminPageHeader
        eyebrow={dateLabel}
        title={`${greeting()}, editor.`}
        description="Uma visão rápida do que está acontecendo no site. Publique com calma, cuide dos detalhes e mantenha a mesa arrumada."
        actions={
          <>
            <Link href="/admin/artigos/novo" className="a-btn a-btn-primary">
              <Plus className="size-4" aria-hidden="true" />
              Novo artigo
            </Link>
            <Link href="/" target="_blank" className="a-btn a-btn-outline">
              <Eye className="size-4" aria-hidden="true" />
              Ver site
            </Link>
          </>
        }
      />

      <Flash ok={params.ok} erro={params.erro} />

      {stats.verses === 0 ? (
        <div className="a-alert a-alert-warn">
          <BookOpen aria-hidden="true" />
          <span>
            A Bíblia ainda não foi importada. Rode <code className="a-mono">npm run bible:import</code> no terminal e
            depois abra <Link href="/admin/biblia" className="font-semibold underline">Bíblia</Link> para conferir.
          </span>
        </div>
      ) : null}

      <div className="a-stats">
        <div className="a-stat">
          <div className="a-stat-top">
            <span className="a-stat-label">Artigos publicados</span>
            <span className="a-stat-icon">
              <FileText className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="a-stat-value">{formatNumber(stats.published)}</div>
          <div className="a-stat-foot">
            {drafts > 0 ? `${drafts} em rascunho ou agendado` : "Tudo publicado por aqui"}
          </div>
        </div>

        <div className="a-stat">
          <div className="a-stat-top">
            <span className="a-stat-label">Leituras acumuladas</span>
            <span className="a-stat-icon">
              <TrendingUp className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="a-stat-value">{formatNumber(stats.total_views)}</div>
          <div className="a-stat-foot">
            <strong>+{formatNumber(periodViews)}</strong> nos últimos 14 dias
          </div>
        </div>

        <div className="a-stat">
          <div className="a-stat-top">
            <span className="a-stat-label">Comentários pendentes</span>
            <span className="a-stat-icon">
              <MessageSquare className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="a-stat-value">{formatNumber(pendingTotal)}</div>
          <div className="a-stat-foot">
            {pendingTotal > 0 ? (
              <Link href="/admin/comentarios" className="font-semibold text-[var(--a-primary)] hover:underline">
                Revisar agora
              </Link>
            ) : (
              "Nenhum comentário aguardando"
            )}
          </div>
        </div>

        <div className="a-stat">
          <div className="a-stat-top">
            <span className="a-stat-label">Inscritos na newsletter</span>
            <span className="a-stat-icon">
              <Mail className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="a-stat-value">{formatNumber(stats.subscribers)}</div>
          <div className="a-stat-foot">
            {formatNumber(stats.messages)} {stats.messages === 1 ? "mensagem nova" : "mensagens novas"} de contato
          </div>
        </div>
      </div>

      <div className="a-section grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <AdminCard
          title="Leituras nos últimos 14 dias"
          description={`${formatNumber(periodViews)} acessos registrados no período.`}
          action={
            <Link href="/admin/artigos" className="a-btn a-btn-ghost a-btn-sm">
              Ver artigos
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
        >
          <div className="flex h-[210px] items-end gap-1.5 sm:gap-2.5">
            {series.map((day) => {
              const height = Math.max(4, Math.round((day.total / maxViews) * 100));
              return (
                <div key={day.day} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-[9px] font-semibold tabular-nums text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                    {formatNumber(day.total)}
                  </span>
                  <div
                    className="w-full rounded-t-[4px] bg-[#c98a68] transition-colors group-hover:bg-[var(--a-primary)]"
                    style={{ height: `${height}%` }}
                    title={`${day.day}: ${formatNumber(day.total)} leituras`}
                  />
                  <span className="hidden text-[9px] tabular-nums text-slate-400 sm:block">
                    {new Date(`${day.day}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>
        </AdminCard>

        <AdminCard
          title="Artigos mais lidos"
          description="O que a audiência tem procurado."
          bodyClassName="a-card-body-tight"
        >
          {topPosts.length === 0 ? (
            <p className="a-empty-text p-5">Publique o primeiro artigo para começar a medir.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="w-5 flex-none font-mono text-[11px] font-semibold text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/artigos/${post.id}`}
                      className="block truncate text-[12.5px] font-semibold text-slate-800 hover:text-[var(--a-primary)]"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-0.5 text-[10.5px] text-slate-500">{formatNumber(post.views)} leituras</p>
                  </div>
                  <Link href={`/blog/${post.slug}`} target="_blank" className="text-slate-300 hover:text-slate-600" aria-label="Abrir no site">
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      <div className="a-section grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <AdminCard
          title="Comentários aguardando moderação"
          description="Uma conversa cuidada também é hospitalidade."
          action={
            <Link href="/admin/comentarios" className="a-btn a-btn-ghost a-btn-sm">
              Ver todos
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          }
          bodyClassName="a-card-body-tight"
        >
          {pending.length === 0 ? (
            <p className="a-empty-text p-6">Nenhum comentário pendente. Tudo em ordem.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {pending.map((comment) => (
                <div key={comment.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[12px] font-semibold text-slate-800">{comment.name}</span>
                    <span className="text-[10.5px] text-slate-400">{timeAgo(comment.created_at)}</span>
                    <span className="a-badge a-badge-slate ml-auto">{comment.post_title}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-slate-500">{comment.content}</p>
                  <div className="a-actions mt-2.5">
                    <form action={setCommentStatusAction}>
                      <input type="hidden" name="id" value={comment.id} />
                      <input type="hidden" name="status" value="approved" />
                      <SubmitButton className="a-btn a-btn-outline a-btn-sm" pendingLabel="Aprovando…">
                        Aprovar
                      </SubmitButton>
                    </form>
                    <form action={setCommentStatusAction}>
                      <input type="hidden" name="id" value={comment.id} />
                      <input type="hidden" name="status" value="spam" />
                      <SubmitButton className="a-btn a-btn-ghost a-btn-sm" pendingLabel="Marcando…">
                        Spam
                      </SubmitButton>
                    </form>
                    <Link href={`/blog/${comment.post_slug}`} target="_blank" className="a-btn-link ml-1">
                      Ver no site
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <div className="space-y-5">
          <AdminCard
            title="Últimos artigos"
            action={
              <Link href="/admin/artigos/novo" className="a-btn a-btn-outline a-btn-sm">
                <PenLine className="size-3.5" aria-hidden="true" />
                Escrever
              </Link>
            }
            bodyClassName="a-card-body-tight"
          >
            <div className="divide-y divide-slate-100">
              {recentPosts.length === 0 ? (
                <p className="a-empty-text p-5">Nenhum artigo ainda.</p>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/artigos/${post.id}`}
                        className="block truncate text-[12px] font-semibold text-slate-800 hover:text-[var(--a-primary)]"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                        {post.published_at ? formatDate(post.published_at) : "Sem data"}
                        <span>·</span>
                        {post.category_name || "Sem categoria"}
                      </p>
                    </div>
                    <StatusBadge status={post.status} />
                  </div>
                ))
              )}
            </div>
          </AdminCard>

          <AdminCard title="Atividade recente" bodyClassName="a-card-body-tight">
            <div className="divide-y divide-slate-100">
              {audit.length === 0 ? (
                <p className="a-empty-text p-5">Nenhuma atividade registrada.</p>
              ) : (
                audit.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 px-5 py-3">
                    <span className="mt-1 size-1.5 flex-none rounded-full bg-[var(--a-gold)]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] leading-snug text-slate-600">
                        <span className="font-semibold text-slate-800">{entry.user_name || "Sistema"}</span>{" "}
                        {entry.action.replace(/\./g, " · ")}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-400">
                        {entry.details || entry.entity} · {timeAgo(entry.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="a-section grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/admin/artigos/novo" className="a-card flex items-center gap-3 p-4 transition hover:border-[var(--a-primary)]">
          <span className="a-stat-icon">
            <PenLine className="size-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[12.5px] font-semibold text-slate-800">Escrever um artigo</span>
            <span className="block text-[10.5px] text-slate-500">Abra o editor em branco</span>
          </span>
        </Link>
        <Link href="/admin/gerador" className="a-card flex items-center gap-3 p-4 transition hover:border-[var(--a-primary)]">
          <span className="a-stat-icon">
            <Wand2 className="size-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[12.5px] font-semibold text-slate-800">Gerar um tema</span>
            <span className="block text-[10.5px] text-slate-500">Contexto, reis, esboço e referências</span>
          </span>
        </Link>
        <Link href="/admin/temas" className="a-card flex items-center gap-3 p-4 transition hover:border-[var(--a-primary)]">
          <span className="a-stat-icon">
            <CalendarClock className="size-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[12.5px] font-semibold text-slate-800">Ajustar a aparência</span>
            <span className="block text-[10.5px] text-slate-500">Temas, cores e atmosfera</span>
          </span>
        </Link>
        <Link href="/admin/biblia" className="a-card flex items-center gap-3 p-4 transition hover:border-[var(--a-primary)]">
          <span className="a-stat-icon">
            <BookOpen className="size-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[12.5px] font-semibold text-slate-800">Cuidar da Bíblia</span>
            <span className="block text-[10.5px] text-slate-500">
              {formatNumber(stats.verses)} versículos no acervo
            </span>
          </span>
        </Link>
      </div>
    </>
  );
}
