import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ArrowLeft, ExternalLink, LibraryBig, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader, EmptyState, Flash, TypeBadge } from "@/components/admin/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import { deleteLibraryItemAction, saveLibraryItemAction } from "@/lib/actions/admin-library";
import { getLibraryItemById, getLibraryItems } from "@/lib/queries";
import { formatDate, sqlToLocalInput } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Biblioteca" };

type SearchParams = Promise<{ editar?: string; ok?: string; erro?: string }>;

const TYPES = [
  { value: "ebook", label: "Ebook" },
  { value: "estudo", label: "Estudo bíblico" },
  { value: "devocional", label: "Devocional" },
  { value: "podcast", label: "Podcast" },
];

export default async function AdminLibraryPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const items = await getLibraryItems();
  const editing = params.editar ? await getLibraryItemById(Number(params.editar)) : null;

  return (
    <>
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Biblioteca"
        description="Ebooks, estudos, devocionais e podcasts. Materiais gratuitos que estendem a leitura do blog."
        actions={
          editing ? (
            <Link href="/admin/biblioteca" className="a-btn a-btn-outline">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Cancelar edição
            </Link>
          ) : (
            <a href="#formulario-material" className="a-btn a-btn-primary">
              <Plus className="size-4" aria-hidden="true" />
              Novo material
            </a>
          )
        }
      />

      <Flash ok={params.ok} erro={params.erro} />

      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="a-card h-fit">
          <div className="a-card-head">
            <div>
              <h2 className="a-card-title">Acervo</h2>
              <p className="a-card-desc">{items.length} materiais cadastrados</p>
            </div>
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon={<LibraryBig className="size-5" />}
              title="A biblioteca está vazia"
              description="Adicione um ebook, um estudo ou um plano para começar."
            />
          ) : (
            <div className="a-table-wrap">
              <table className="a-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Tipo</th>
                    <th>Publicado</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="a-table-title">{item.title}</div>
                        <div className="a-table-sub">
                          {item.author || "Sem autor"}
                          {item.pages ? ` · ${item.pages} páginas` : ""}
                          {item.featured ? " · ★ destaque" : ""}
                        </div>
                      </td>
                      <td>
                        <TypeBadge type={item.type} />
                      </td>
                      <td className="a-table-num whitespace-nowrap">
                        {item.published_at ? formatDate(item.published_at) : "—"}
                      </td>
                      <td>
                        <div className="a-table-actions">
                          <Link
                            href={`/admin/biblioteca?editar=${item.id}#formulario-material`}
                            className="a-btn a-btn-outline a-btn-icon"
                            title="Editar"
                            aria-label="Editar material"
                          >
                            <Pencil className="size-3.5" />
                          </Link>
                          <Link
                            href={`/biblioteca/${item.slug}`}
                            target="_blank"
                            className="a-btn a-btn-outline a-btn-icon"
                            title="Ver no site"
                            aria-label="Ver no site"
                          >
                            <ExternalLink className="size-3.5" />
                          </Link>
                          <form action={deleteLibraryItemAction}>
                            <input type="hidden" name="id" value={item.id} />
                            <ConfirmSubmit
                              className="a-btn a-btn-danger a-btn-icon"
                              message={`Excluir "${item.title}" da biblioteca?`}
                              title="Excluir material"
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

        <div className="a-card h-fit lg:sticky lg:top-[84px]" id="formulario-material">
          <div className="a-card-head">
            <div>
              <h2 className="a-card-title">{editing ? "Editar material" : "Novo material"}</h2>
              <p className="a-card-desc">{editing ? `Atualizando “${editing.title}”.` : "Preencha os dados principais."}</p>
            </div>
          </div>
          <form action={saveLibraryItemAction} className="a-card-body">
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

            <div className="a-field">
              <label className="a-label" htmlFor="title">Título</label>
              <input
                id="title"
                name="title"
                defaultValue={editing?.title ?? ""}
                className="a-input"
                placeholder="Sete dias de oração"
                required
                maxLength={180}
              />
            </div>

            <div className="a-field">
              <label className="a-label" htmlFor="subtitle">Subtítulo <span>opcional</span></label>
              <input
                id="subtitle"
                name="subtitle"
                defaultValue={editing?.subtitle ?? ""}
                className="a-input"
                placeholder="Um guia curto para começar"
                maxLength={220}
              />
            </div>

            <div className="a-grid-2">
              <div className="a-field">
                <label className="a-label" htmlFor="author">Autor</label>
                <input
                  id="author"
                  name="author"
                  defaultValue={editing?.author ?? ""}
                  className="a-input"
                  placeholder="Equipe Palavra Viva"
                  maxLength={120}
                />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="type">Tipo</label>
                <select id="type" name="type" defaultValue={editing?.type ?? "ebook"} className="a-select">
                  {TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="a-field">
              <label className="a-label" htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                defaultValue={editing?.description ?? ""}
                className="a-textarea min-h-[96px]"
                placeholder="O que o leitor vai encontrar neste material?"
                maxLength={3000}
              />
            </div>

            <div className="a-field">
              <label className="a-label" htmlFor="slug">Endereço <span>opcional</span></label>
              <input
                id="slug"
                name="slug"
                defaultValue={editing?.slug ?? ""}
                className="a-input a-mono"
                placeholder="sete-dias-de-oracao"
                maxLength={120}
              />
            </div>

            <div className="a-field">
              <label className="a-label" htmlFor="cover_image">Imagem de capa <span>URL</span></label>
              <input
                id="cover_image"
                name="cover_image"
                defaultValue={editing?.cover_image ?? ""}
                className="a-input"
                placeholder="/uploads/… ou https://…"
                maxLength={600}
              />
            </div>

            <div className="a-grid-2">
              <div className="a-field">
                <label className="a-label" htmlFor="file_url">Arquivo (PDF) <span>URL</span></label>
                <input
                  id="file_url"
                  name="file_url"
                  defaultValue={editing?.file_url ?? ""}
                  className="a-input"
                  placeholder="/uploads/arquivo.pdf"
                  maxLength={600}
                />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="external_url">Link externo</label>
                <input
                  id="external_url"
                  name="external_url"
                  defaultValue={editing?.external_url ?? ""}
                  className="a-input"
                  placeholder="https://…"
                  maxLength={600}
                />
              </div>
            </div>

            <div className="a-grid-2">
              <div className="a-field">
                <label className="a-label" htmlFor="pages">Páginas</label>
                <input
                  id="pages"
                  name="pages"
                  type="number"
                  min={0}
                  defaultValue={editing?.pages ?? 0}
                  className="a-input"
                />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="published_at">Publicação</label>
                <input
                  id="published_at"
                  name="published_at"
                  type="datetime-local"
                  defaultValue={sqlToLocalInput(editing?.published_at ?? new Date().toISOString())}
                  className="a-input"
                />
              </div>
            </div>

            <label className="a-check mt-4">
              <input type="checkbox" name="featured" value="1" defaultChecked={Boolean(editing?.featured)} />
              <span>Destacar na biblioteca e na home</span>
            </label>

            <div className="a-actions a-mt-4">
              <SubmitButton>{editing ? "Salvar alterações" : "Adicionar material"}</SubmitButton>
              {editing ? (
                <Link href="/admin/biblioteca" className="a-btn a-btn-ghost">Cancelar</Link>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
