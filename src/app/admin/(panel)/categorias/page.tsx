import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ArrowLeft, FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader, EmptyState, Flash } from "@/components/admin/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import { deleteCategoryAction, saveCategoryAction } from "@/lib/actions/admin-taxonomy";
import { getCategories, getCategoryById } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Categorias" };

type SearchParams = Promise<{ editar?: string; ok?: string; erro?: string }>;

export default async function AdminCategoriesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const categories = await getCategories();
  const editing = params.editar ? await getCategoryById(Number(params.editar)) : null;

  return (
    <>
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Categorias"
        description="Os temas que organizam o blog. Uma boa categoria ajuda o leitor a continuar lendo."
        actions={
          editing ? (
            <Link href="/admin/categorias" className="a-btn a-btn-outline">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Cancelar edição
            </Link>
          ) : (
            <a href="#formulario-categoria" className="a-btn a-btn-primary">
              <Plus className="size-4" aria-hidden="true" />
              Nova categoria
            </a>
          )
        }
      />

      <Flash ok={params.ok} erro={params.erro} />

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="a-card">
          <div className="a-card-head">
            <div>
              <h2 className="a-card-title">Todas as categorias</h2>
              <p className="a-card-desc">{categories.length} cadastradas</p>
            </div>
          </div>

          {categories.length === 0 ? (
            <EmptyState
              icon={<FolderTree className="size-5" />}
              title="Nenhuma categoria ainda"
              description="Crie a primeira categoria ao lado para organizar os artigos do blog."
            />
          ) : (
            <div className="a-table-wrap">
              <table className="a-table">
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Endereço</th>
                    <th>Artigos</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <div className="flex items-start gap-2.5">
                          <span
                            className="mt-1 size-2.5 flex-none rounded-full"
                            style={{ background: category.color }}
                          />
                          <div>
                            <div className="a-table-title">{category.name}</div>
                            {category.description ? (
                              <div className="a-table-sub max-w-[300px]">{category.description}</div>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="a-mono text-[11px] text-slate-500">/blog/categoria/{category.slug}</td>
                      <td>
                        <span className="a-badge a-badge-slate">{category.post_count ?? 0}</span>
                      </td>
                      <td>
                        <div className="a-table-actions">
                          <Link
                            href={`/admin/categorias?editar=${category.id}#formulario-categoria`}
                            className="a-btn a-btn-outline a-btn-sm"
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                            Editar
                          </Link>
                          <form action={deleteCategoryAction}>
                            <input type="hidden" name="id" value={category.id} />
                            <ConfirmSubmit
                              message={`Excluir a categoria "${category.name}"? Os artigos continuam publicados, mas ficam sem categoria.`}
                            >
                              <Trash2 className="size-3.5" aria-hidden="true" />
                              Excluir
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

        <div className="a-card h-fit lg:sticky lg:top-[84px]" id="formulario-categoria">
          <div className="a-card-head">
            <div>
              <h2 className="a-card-title">{editing ? "Editar categoria" : "Nova categoria"}</h2>
              <p className="a-card-desc">{editing ? `Atualizando “${editing.name}”.` : "Preencha e salve."}</p>
            </div>
          </div>
          <form action={saveCategoryAction} className="a-card-body">
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

            <div className="a-field">
              <label className="a-label" htmlFor="name">Nome</label>
              <input
                id="name"
                name="name"
                defaultValue={editing?.name ?? ""}
                className="a-input"
                placeholder="Oração e silêncio"
                required
                maxLength={80}
              />
            </div>

            <div className="a-field">
              <label className="a-label" htmlFor="slug">Endereço <span>opcional</span></label>
              <input
                id="slug"
                name="slug"
                defaultValue={editing?.slug ?? ""}
                className="a-input a-mono"
                placeholder="oracao-e-silencio"
                maxLength={100}
              />
              <p className="a-help">Gerado a partir do nome se ficar em branco.</p>
            </div>

            <div className="a-field">
              <label className="a-label" htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                defaultValue={editing?.description ?? ""}
                className="a-textarea min-h-[86px]"
                placeholder="Uma frase sobre o que o leitor encontra nesta categoria."
                maxLength={400}
              />
            </div>

            <div className="a-grid-2">
              <div className="a-field">
                <label className="a-label" htmlFor="color">Cor</label>
                <div className="flex items-center gap-2">
                  <input
                    id="color"
                    name="color"
                    type="color"
                    defaultValue={editing?.color ?? "#a4542f"}
                    className="h-[38px] w-[52px] cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  />
                  <span className="a-help !mt-0">Tom de destaque</span>
                </div>
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="icon">Ícone <span>opcional</span></label>
                <input
                  id="icon"
                  name="icon"
                  defaultValue={editing?.icon ?? "book-open"}
                  className="a-input"
                  placeholder="book-open"
                  maxLength={40}
                />
              </div>
            </div>

            <div className="a-actions a-mt-4">
              <SubmitButton>{editing ? "Salvar alterações" : "Criar categoria"}</SubmitButton>
              {editing ? (
                <Link href="/admin/categorias" className="a-btn a-btn-ghost">
                  Cancelar
                </Link>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
