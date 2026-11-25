import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Check, Clock3, ExternalLink, MessageSquare, ShieldAlert, Trash2 } from "lucide-react";
import { AdminPageHeader, EmptyState, Flash, StatusBadge } from "@/components/admin/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import { deleteCommentAction, setCommentStatusAction } from "@/lib/actions/admin-comments";
import { countComments, listComments } from "@/lib/queries";
import { formatDateTime, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Comentários" };

type SearchParams = Promise<{ status?: string; ok?: string; erro?: string }>;

const TABS = [
  { value: "pending", label: "Pendentes" },
  { value: "approved", label: "Aprovados" },
  { value: "spam", label: "Spam" },
  { value: "all", label: "Todos" },
];

export default async function AdminCommentsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const status = TABS.some((tab) => tab.value === params.status) ? params.status! : "pending";
  const comments = await listComments(status);
  const [pending, approved, spam] = await Promise.all([
    countComments("pending"),
    countComments("approved"),
    countComments("spam"),
  ]);
  const counts: Record<string, number> = { pending, approved, spam, all: pending + approved + spam };

  return (
    <>
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Comentários"
        description="Leia com atenção, aprove o que edifica e descarte o que não contribui. A conversa faz parte da hospitalidade."
      />

      <Flash ok={params.ok} erro={params.erro} />

      <div className="a-card">
        <div className="a-tabs">
          {TABS.map((tab) => (
            <Link
              key={tab.value}
              href={tab.value === "pending" ? "/admin/comentarios" : `/admin/comentarios?status=${tab.value}`}
              className={`a-tab ${status === tab.value ? "is-active" : ""}`}
            >
              {tab.label}
              <span className="a-tab-count">{counts[tab.value] ?? 0}</span>
            </Link>
          ))}
        </div>

        {comments.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="size-5" />}
            title={status === "pending" ? "Nenhum comentário aguardando" : "Nada por aqui"}
            description={
              status === "pending"
                ? "Quando alguém comentar, o comentário aparecerá aqui para moderação antes de ir ao ar."
                : "Não há comentários nesta situação no momento."
            }
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {comments.map((comment) => (
              <article key={comment.id} className="p-5">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold text-slate-900">{comment.name}</span>
                      <StatusBadge status={comment.status} />
                      <span className="text-[10.5px] text-slate-400">{formatDateTime(comment.created_at)}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {comment.email || "sem e-mail"}
                      {comment.ip ? ` · IP ${comment.ip}` : ""}
                    </p>
                  </div>
                  <Link
                    href={`/blog/${comment.post_slug}`}
                    target="_blank"
                    className="a-btn a-btn-ghost a-btn-sm"
                  >
                    {comment.post_title}
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3 text-[12px] leading-relaxed text-slate-600">
                  {comment.content}
                </div>

                <div className="a-actions mt-3">
                  {comment.status !== "approved" ? (
                    <form action={setCommentStatusAction}>
                      <input type="hidden" name="id" value={comment.id} />
                      <input type="hidden" name="status" value="approved" />
                      <SubmitButton className="a-btn a-btn-outline a-btn-sm" pendingLabel="Aprovando…">
                        <Check className="size-3.5" aria-hidden="true" />
                        Aprovar
                      </SubmitButton>
                    </form>
                  ) : null}
                  {comment.status !== "pending" ? (
                    <form action={setCommentStatusAction}>
                      <input type="hidden" name="id" value={comment.id} />
                      <input type="hidden" name="status" value="pending" />
                      <SubmitButton className="a-btn a-btn-ghost a-btn-sm" pendingLabel="Movendo…">
                        <Clock3 className="size-3.5" aria-hidden="true" />
                        Voltar para moderação
                      </SubmitButton>
                    </form>
                  ) : null}
                  {comment.status !== "spam" ? (
                    <form action={setCommentStatusAction}>
                      <input type="hidden" name="id" value={comment.id} />
                      <input type="hidden" name="status" value="spam" />
                      <SubmitButton className="a-btn a-btn-ghost a-btn-sm" pendingLabel="Marcando…">
                        <ShieldAlert className="size-3.5" aria-hidden="true" />
                        Marcar spam
                      </SubmitButton>
                    </form>
                  ) : null}
                  <form action={deleteCommentAction} className="ml-auto">
                    <input type="hidden" name="id" value={comment.id} />
                    <ConfirmSubmit message="Excluir este comentário definitivamente?">
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Excluir
                    </ConfirmSubmit>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}

        {comments.length > 0 ? (
          <div className="a-card-head border-t border-b-0">
            <p className="a-help !mt-0">
              Mostrando {comments.length} {comments.length === 1 ? "comentário" : "comentários"} · atualizado{" "}
              {timeAgo(new Date().toISOString())}
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}
