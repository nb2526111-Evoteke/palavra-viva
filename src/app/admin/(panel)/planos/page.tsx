import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ArrowLeft, CalendarDays, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader, EmptyState, Flash } from "@/components/admin/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import { PlanDaysEditor } from "@/components/admin/plan-days-editor";
import { deletePlanAction, savePlanAction } from "@/lib/actions/admin-library";
import { getReadingPlanById, getReadingPlanDays, getReadingPlans } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Planos de leitura" };

type SearchParams = Promise<{ editar?: string; ok?: string; erro?: string }>;

export default async function AdminPlansPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const plans = await getReadingPlans();
  const editing = params.editar ? await getReadingPlanById(Number(params.editar)) : null;
  const editingDays = editing ? await getReadingPlanDays(editing.id) : [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Planos de leitura"
        description="Caminhos curtos e profundos para transformar a leitura bíblica em prática diária."
        actions={
          editing ? (
            <Link href="/admin/planos" className="a-btn a-btn-outline">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Cancelar edição
            </Link>
          ) : (
            <a href="#formulario-plano" className="a-btn a-btn-primary">
              <Plus className="size-4" aria-hidden="true" />
              Novo plano
            </a>
          )
        }
      />

      <Flash ok={params.ok} erro={params.erro} />

      <div className="a-card">
        <div className="a-card-head">
          <div>
            <h2 className="a-card-title">Planos cadastrados</h2>
            <p className="a-card-desc">{plans.length} planos disponíveis na biblioteca</p>
          </div>
        </div>

        {plans.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="size-5" />}
            title="Nenhum plano ainda"
            description="Crie um plano de 7, 21 ou 30 dias com leituras e reflexões diárias."
          />
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Plano</th>
                  <th>Dias</th>
                  <th>Destaque</th>
                  <th>Criado em</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <div className="a-table-title">{plan.title}</div>
                      <div className="a-table-sub max-w-[460px]">{plan.description}</div>
                    </td>
                    <td><span className="a-badge a-badge-blue">{plan.days_count} dias</span></td>
                    <td>{plan.featured ? <span className="a-badge a-badge-gold">Em destaque</span> : <span className="a-muted">—</span>}</td>
                    <td className="a-table-num whitespace-nowrap">{formatDate(plan.created_at)}</td>
                    <td>
                      <div className="a-table-actions">
                        <Link
                          href={`/admin/planos?editar=${plan.id}#formulario-plano`}
                          className="a-btn a-btn-outline a-btn-icon"
                          title="Editar plano"
                          aria-label="Editar plano"
                        >
                          <Pencil className="size-3.5" />
                        </Link>
                        <Link
                          href={`/biblioteca/planos/${plan.slug}`}
                          target="_blank"
                          className="a-btn a-btn-outline a-btn-icon"
                          title="Ver no site"
                          aria-label="Ver no site"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>
                        <form action={deletePlanAction}>
                          <input type="hidden" name="id" value={plan.id} />
                          <ConfirmSubmit
                            className="a-btn a-btn-danger a-btn-icon"
                            message={`Excluir o plano "${plan.title}" e todos os seus dias?`}
                            title="Excluir plano"
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

      <div className="a-card a-mt-4" id="formulario-plano">
        <div className="a-card-head">
          <div>
            <h2 className="a-card-title">{editing ? `Editar: ${editing.title}` : "Criar novo plano"}</h2>
            <p className="a-card-desc">
              {editing
                ? "Ajuste os dias, as passagens e as reflexões. Os dias são renumerados automaticamente."
                : "Defina o título e monte a jornada dia a dia."}
            </p>
          </div>
        </div>

        <form action={savePlanAction} className="a-card-body">
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

          <div className="a-grid-2">
            <div className="a-field !mt-0">
              <label className="a-label" htmlFor="title">Título do plano</label>
              <input
                id="title"
                name="title"
                defaultValue={editing?.title ?? ""}
                className="a-input"
                placeholder="7 dias de oração"
                required
                maxLength={180}
              />
            </div>
            <div className="a-field !mt-0">
              <label className="a-label" htmlFor="slug">Endereço <span>opcional</span></label>
              <input
                id="slug"
                name="slug"
                defaultValue={editing?.slug ?? ""}
                className="a-input a-mono"
                placeholder="7-dias-de-oracao"
                maxLength={120}
              />
            </div>
          </div>

          <div className="a-field">
            <label className="a-label" htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              defaultValue={editing?.description ?? ""}
              className="a-textarea min-h-[84px]"
              placeholder="Uma semana para aprender a orar com as Escrituras, no seu ritmo."
              maxLength={3000}
            />
          </div>

          <div className="a-grid-2">
            <div className="a-field">
              <label className="a-label" htmlFor="cover_image">Imagem de capa <span>URL opcional</span></label>
              <input
                id="cover_image"
                name="cover_image"
                defaultValue={editing?.cover_image ?? ""}
                className="a-input"
                placeholder="/uploads/… ou https://…"
                maxLength={600}
              />
            </div>
            <div className="a-field flex items-end pb-1">
              <label className="a-check">
                <input type="checkbox" name="featured" value="1" defaultChecked={Boolean(editing?.featured)} />
                <span>Destacar na página de planos e na home</span>
              </label>
            </div>
          </div>

          <div className="a-mt-4 border-t border-slate-100 pt-5">
            <PlanDaysEditor
              key={editing?.id ?? "new"}
              initialDays={editingDays.map((day) => ({
                title: day.title,
                passage: day.passage,
                reflection: day.reflection,
              }))}
            />
          </div>

          <div className="a-actions a-mt-4 border-t border-slate-100 pt-4">
            <SubmitButton>{editing ? "Salvar plano" : "Criar plano"}</SubmitButton>
            {editing ? (
              <Link href="/admin/planos" className="a-btn a-btn-ghost">Cancelar</Link>
            ) : null}
          </div>
        </form>
      </div>
    </>
  );
}
