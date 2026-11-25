import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Download, Mail, MailPlus, UserMinus, UserPlus, Trash2 } from "lucide-react";
import { AdminPageHeader, EmptyState, Flash, StatusBadge } from "@/components/admin/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import {
  addSubscriberAction,
  deleteSubscriberAction,
  toggleSubscriberAction,
} from "@/lib/actions/admin-misc";
import { getSubscribers } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Newsletter" };

type SearchParams = Promise<{ ok?: string; erro?: string }>;

export default async function AdminNewsletterPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const subscribers = await getSubscribers();
  const active = subscribers.filter((subscriber) => subscriber.status === "active").length;
  const manual = subscribers.filter((subscriber) => subscriber.source === "manual").length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Audiência"
        title="Newsletter"
        description="As pessoas que escolheram receber as próximas leituras por e-mail. Exporte a lista quando for enviar uma carta."
        actions={
          <Link href="/admin/newsletter/export" className="a-btn a-btn-outline">
            <Download className="size-4" aria-hidden="true" />
            Exportar CSV
          </Link>
        }
      />

      <Flash ok={params.ok} erro={params.erro} />

      <div className="a-stats a-mb-4">
        <div className="a-stat">
          <div className="a-stat-top">
            <span className="a-stat-label">Inscritos ativos</span>
            <span className="a-stat-icon"><Mail className="size-4" aria-hidden="true" /></span>
          </div>
          <div className="a-stat-value">{active}</div>
          <div className="a-stat-foot">Recebem a newsletter</div>
        </div>
        <div className="a-stat">
          <div className="a-stat-top">
            <span className="a-stat-label">Total na lista</span>
            <span className="a-stat-icon"><UserPlus className="size-4" aria-hidden="true" /></span>
          </div>
          <div className="a-stat-value">{subscribers.length}</div>
          <div className="a-stat-foot">{subscribers.length - active} descadastrados</div>
        </div>
        <div className="a-stat">
          <div className="a-stat-top">
            <span className="a-stat-label">Adicionados manualmente</span>
            <span className="a-stat-icon"><MailPlus className="size-4" aria-hidden="true" /></span>
          </div>
          <div className="a-stat-value">{manual}</div>
          <div className="a-stat-foot">Fora do formulário do site</div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="a-card">
          <div className="a-card-head">
            <div>
              <h2 className="a-card-title">Lista de inscritos</h2>
              <p className="a-card-desc">Ordenada pela inscrição mais recente.</p>
            </div>
          </div>

          {subscribers.length === 0 ? (
            <EmptyState
              icon={<Mail className="size-5" />}
              title="Ninguém inscrito ainda"
              description="Quando alguém se inscrever pelo site, o e-mail aparecerá aqui. Você também pode adicionar manualmente."
            />
          ) : (
            <div className="a-table-wrap">
              <table className="a-table">
                <thead>
                  <tr>
                    <th>E-mail</th>
                    <th>Nome</th>
                    <th>Situação</th>
                    <th>Origem</th>
                    <th>Inscrição</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td>
                        <a className="a-table-title" href={`mailto:${subscriber.email}`}>{subscriber.email}</a>
                      </td>
                      <td>{subscriber.name || <span className="a-muted">—</span>}</td>
                      <td><StatusBadge status={subscriber.status} /></td>
                      <td className="a-muted">{subscriber.source}</td>
                      <td className="a-table-num whitespace-nowrap">{formatDate(subscriber.created_at)}</td>
                      <td>
                        <div className="a-table-actions">
                          <form action={toggleSubscriberAction}>
                            <input type="hidden" name="id" value={subscriber.id} />
                            <SubmitButton className="a-btn a-btn-outline a-btn-sm" pendingLabel="…">
                              {subscriber.status === "active" ? (
                                <>
                                  <UserMinus className="size-3.5" aria-hidden="true" />
                                  Descadastrar
                                </>
                              ) : (
                                <>
                                  <UserPlus className="size-3.5" aria-hidden="true" />
                                  Reativar
                                </>
                              )}
                            </SubmitButton>
                          </form>
                          <form action={deleteSubscriberAction}>
                            <input type="hidden" name="id" value={subscriber.id} />
                            <ConfirmSubmit
                              className="a-btn a-btn-danger a-btn-icon"
                              message={`Excluir ${subscriber.email} da lista definitivamente?`}
                              title="Excluir inscrito"
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
        </div>

        <div className="a-card h-fit lg:sticky lg:top-[84px]">
          <div className="a-card-head">
            <div>
              <h2 className="a-card-title">Adicionar manualmente</h2>
              <p className="a-card-desc">Para quem pediu por e-mail ou pessoalmente.</p>
            </div>
          </div>
          <form action={addSubscriberAction} className="a-card-body">
            <div className="a-field">
              <label className="a-label" htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                className="a-input"
                placeholder="pessoa@email.com"
                required
              />
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="name">Nome <span>opcional</span></label>
              <input id="name" name="name" className="a-input" placeholder="Nome da pessoa" maxLength={100} />
            </div>
            <SubmitButton className="a-btn a-btn-primary a-w-full a-mt-4">
              <UserPlus className="size-4" aria-hidden="true" />
              Adicionar à lista
            </SubmitButton>
            <p className="a-help">
              Ao adicionar, a pessoa passa a receber as próximas edições. Use com cuidado e sempre com consentimento.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
