import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Archive, Inbox, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { AdminPageHeader, EmptyState, Flash, StatusBadge } from "@/components/admin/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import { deleteMessageAction, setMessageStatusAction } from "@/lib/actions/admin-misc";
import { getContactMessages } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mensagens" };

type SearchParams = Promise<{ status?: string; ok?: string; erro?: string }>;

const TABS = [
  { value: "new", label: "Novas" },
  { value: "read", label: "Lidas" },
  { value: "archived", label: "Arquivadas" },
  { value: "all", label: "Todas" },
];

export default async function AdminMessagesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const status = TABS.some((tab) => tab.value === params.status) ? params.status! : "new";
  const all = await getContactMessages();
  const messages = status === "all" ? all : all.filter((message) => message.status === status);
  const counts: Record<string, number> = {
    new: all.filter((message) => message.status === "new").length,
    read: all.filter((message) => message.status === "read").length,
    archived: all.filter((message) => message.status === "archived").length,
    all: all.length,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Audiência"
        title="Mensagens"
        description="Mensagens enviadas pelo formulário de contato. Responda com atenção e guarde o que for importante."
      />

      <Flash ok={params.ok} erro={params.erro} />

      <div className="a-card">
        <div className="a-tabs">
          {TABS.map((tab) => (
            <Link
              key={tab.value}
              href={tab.value === "new" ? "/admin/mensagens" : `/admin/mensagens?status=${tab.value}`}
              className={`a-tab ${status === tab.value ? "is-active" : ""}`}
            >
              {tab.label}
              <span className="a-tab-count">{counts[tab.value] ?? 0}</span>
            </Link>
          ))}
        </div>

        {messages.length === 0 ? (
          <EmptyState
            icon={<Inbox className="size-5" />}
            title="Caixa vazia"
            description={
              status === "new"
                ? "Nenhuma mensagem nova. Quando alguém escrever pelo site, ela aparecerá aqui."
                : "Não há mensagens nesta situação."
            }
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((message) => (
              <article key={message.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[13px] font-semibold text-slate-900">
                        {message.subject || "Sem assunto"}
                      </h2>
                      <StatusBadge status={message.status} />
                    </div>
                    <p className="mt-1 text-[11.5px] text-slate-500">
                      <span className="font-medium text-slate-700">{message.name}</span> ·{" "}
                      <a href={`mailto:${message.email}`} className="hover:text-[var(--a-primary)] hover:underline">
                        {message.email}
                      </a>{" "}
                      · {formatDateTime(message.created_at)}
                    </p>
                  </div>
                  <div className="a-actions">
                    <Link href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || "Sua mensagem"}`)}`} className="a-btn a-btn-outline a-btn-sm">
                      <Reply className="size-3.5" aria-hidden="true" />
                      Responder
                    </Link>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/70 px-4 py-3 text-[12px] leading-relaxed whitespace-pre-line text-slate-600">
                  {message.message}
                </div>

                <div className="a-actions mt-3">
                  {message.status !== "read" ? (
                    <form action={setMessageStatusAction}>
                      <input type="hidden" name="id" value={message.id} />
                      <input type="hidden" name="status" value="read" />
                      <SubmitButton className="a-btn a-btn-ghost a-btn-sm" pendingLabel="Marcando…">
                        <MailOpen className="size-3.5" aria-hidden="true" />
                        Marcar como lida
                      </SubmitButton>
                    </form>
                  ) : null}
                  {message.status !== "new" ? (
                    <form action={setMessageStatusAction}>
                      <input type="hidden" name="id" value={message.id} />
                      <input type="hidden" name="status" value="new" />
                      <SubmitButton className="a-btn a-btn-ghost a-btn-sm" pendingLabel="Marcando…">
                        <Mail className="size-3.5" aria-hidden="true" />
                        Marcar como nova
                      </SubmitButton>
                    </form>
                  ) : null}
                  {message.status !== "archived" ? (
                    <form action={setMessageStatusAction}>
                      <input type="hidden" name="id" value={message.id} />
                      <input type="hidden" name="status" value="archived" />
                      <SubmitButton className="a-btn a-btn-ghost a-btn-sm" pendingLabel="Arquivando…">
                        <Archive className="size-3.5" aria-hidden="true" />
                        Arquivar
                      </SubmitButton>
                    </form>
                  ) : null}
                  <form action={deleteMessageAction} className="ml-auto">
                    <input type="hidden" name="id" value={message.id} />
                    <ConfirmSubmit message="Excluir esta mensagem definitivamente?">
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Excluir
                    </ConfirmSubmit>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
