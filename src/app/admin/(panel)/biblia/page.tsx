import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  BookOpen,
  CalendarDays,
  Database,
  ExternalLink,
  Layers,
  Pencil,
  Terminal,
  Trash2,
} from "lucide-react";
import { AdminPageHeader, AdminCard, Flash } from "@/components/admin/ui";
import { ConfirmSubmit, CopyButton, SubmitButton } from "@/components/admin/buttons";
import { deleteDailyVerseAction, saveDailyVerseAction } from "@/lib/actions/admin-misc";
import {
  getBibleBookStats,
  getBibleStats,
  getChapterCount,
  getDailyVerseById,
  getDailyVerses,
  getSettings,
} from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bíblia" };

type SearchParams = Promise<{ editar?: string; ok?: string; erro?: string }>;

export default async function AdminBiblePage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const stats = await getBibleStats();
  const chapters = await getChapterCount();
  const books = await getBibleBookStats();
  const verses = await getDailyVerses();
  const editing = params.editar ? await getDailyVerseById(Number(params.editar)) : null;
  const settings = await getSettings();
  const imported = stats.verses > 0;

  return (
    <>
      <AdminPageHeader
        eyebrow="Conteúdo"
        title="Bíblia"
        description="O acervo completo das Escrituras, os versículos do dia e a atribuição do texto bíblico."
        actions={
          <>
            <Link href="/biblia" target="_blank" className="a-btn a-btn-outline">
              <ExternalLink className="size-4" aria-hidden="true" />
              Abrir no site
            </Link>
            <Link href="/admin/biblia#versiculos-do-dia" className="a-btn a-btn-primary">
              <CalendarDays className="size-4" aria-hidden="true" />
              Versículos do dia
            </Link>
          </>
        }
      />

      <Flash ok={params.ok} erro={params.erro} />

      {!imported ? (
        <div className="a-card a-mb-4 overflow-hidden border-amber-200">
          <div className="border-b border-amber-100 bg-amber-50 px-5 py-4">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-amber-900">
              <Terminal className="size-4" aria-hidden="true" />
              A Bíblia completa ainda precisa ser importada
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-amber-800">
              O banco do site já está pronto. Falta apenas copiar os {formatNumber(31_102)} versículos da Bíblia Livre
              para o SQLite do projeto. Isso é feito uma vez, pelo terminal.
            </p>
          </div>
          <div className="a-card-body">
            <ol className="space-y-4 text-[12.5px] leading-relaxed text-slate-600">
              <li className="flex gap-3">
                <span className="grid size-6 flex-none place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">1</span>
                <div>
                  <p className="font-semibold text-slate-800">Abra o terminal na pasta do projeto</p>
                  <code className="a-mono mt-1 block rounded-md bg-slate-900 px-3 py-2 text-[11px] text-slate-100">
                    cd C:\Users\Nasciment_23\Desktop\blog-biblico
                  </code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="grid size-6 flex-none place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">2</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">Rode a importação</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <code className="a-mono rounded-md bg-slate-900 px-3 py-2 text-[11px] text-slate-100">
                      npm run bible:import
                    </code>
                    <CopyButton value="npm run bible:import" className="a-btn a-btn-outline a-btn-sm" />
                  </div>
                  <p className="a-help">
                    O arquivo de origem é <span className="a-mono">data/source/almeida-livre.sqlite</span> e já está no projeto.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="grid size-6 flex-none place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">3</span>
                <div>
                  <p className="font-semibold text-slate-800">Atualize esta página</p>
                  <p className="a-help">Os 66 livros, 1.189 capítulos e os versículos aparecerão aqui automaticamente.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      ) : null}

      <div className="a-stats">
        <div className="a-stat">
          <div className="a-stat-top">
            <span className="a-stat-label">Livros</span>
            <span className="a-stat-icon"><BookOpen className="size-4" aria-hidden="true" /></span>
          </div>
          <div className="a-stat-value">{formatNumber(stats.books)}</div>
          <div className="a-stat-foot">Antigo e Novo Testamento</div>
        </div>
        <div className="a-stat">
          <div className="a-stat-top">
            <span className="a-stat-label">Capítulos</span>
            <span className="a-stat-icon"><Layers className="size-4" aria-hidden="true" /></span>
          </div>
          <div className="a-stat-value">{formatNumber(chapters)}</div>
          <div className="a-stat-foot">Divisões tradicionais do texto</div>
        </div>
        <div className="a-stat">
          <div className="a-stat-top">
            <span className="a-stat-label">Versículos</span>
            <span className="a-stat-icon"><Database className="size-4" aria-hidden="true" /></span>
          </div>
          <div className="a-stat-value">{formatNumber(stats.verses)}</div>
          <div className="a-stat-foot">{imported ? "Texto bíblico completo" : "Aguardando importação"}</div>
        </div>
        <div className="a-stat">
          <div className="a-stat-top">
            <span className="a-stat-label">Versículos do dia</span>
            <span className="a-stat-icon"><CalendarDays className="size-4" aria-hidden="true" /></span>
          </div>
          <div className="a-stat-value">{formatNumber(verses.length)}</div>
          <div className="a-stat-foot">Rotação automática diária</div>
        </div>
      </div>

      <div className="a-section grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <AdminCard
          title="Livros e versículos"
          description="Contagem por livro para conferir a integridade da importação."
          bodyClassName="a-card-body-tight"
        >
          {books.length === 0 ? (
            <p className="a-empty-text p-6">A importação ainda não foi feita. Rode o comando acima.</p>
          ) : (
            <div className="max-h-[430px] overflow-auto">
              <table className="a-table">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th>Livro</th>
                    <th>Testamento</th>
                    <th>Capítulos</th>
                    <th>Versículos</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>
                        <Link href={`/biblia/${book.slug}`} target="_blank" className="a-table-title hover:text-[var(--a-primary)]">
                          {book.name}
                        </Link>
                      </td>
                      <td>
                        <span className="a-badge a-badge-slate">{book.testament === "AT" ? "Antigo" : "Novo"}</span>
                      </td>
                      <td className="a-table-num">{book.chapters}</td>
                      <td className="a-table-num">{formatNumber(book.verses)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>

        <div className="space-y-5">
          <AdminCard
            title="Versículos do dia"
            description="Eles se alternam automaticamente, um por dia."
            action={<Link href="#versiculos-do-dia" className="a-btn a-btn-outline a-btn-sm">Gerenciar</Link>}
            bodyClassName="a-card-body-tight"
          >
            {verses.length === 0 ? (
              <p className="a-empty-text p-5">Nenhum versículo cadastrado.</p>
            ) : (
              <div className="max-h-[260px] divide-y divide-slate-100 overflow-auto">
                {verses.slice(0, 8).map((verse) => (
                  <div key={verse.id} className="px-5 py-3">
                    <p className="text-[11.5px] leading-relaxed text-slate-600">“{verse.text}”</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      {verse.reference}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>

          <AdminCard title="Atribuição e licença" description="Exigida pela licença Creative Commons do texto.">
            <p className="text-[12px] leading-relaxed text-slate-600">
              {settings.bible_attribution || "Atribuição não configurada."}
            </p>
            <Link href="/admin/configuracoes" className="a-btn-link a-mt-3">
              Editar atribuição
            </Link>
          </AdminCard>

          {imported ? (
            <AdminCard title="Reimportar a Bíblia" description="Use se atualizar o arquivo de origem.">
              <p className="text-[11.5px] leading-relaxed text-slate-500">
                A importação substitui os versículos existentes sem apagar os demais dados do site.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <code className="a-mono rounded-md bg-slate-900 px-3 py-2 text-[11px] text-slate-100">npm run bible:import</code>
                <CopyButton value="npm run bible:import" className="a-btn a-btn-outline a-btn-sm" />
              </div>
            </AdminCard>
          ) : null}
        </div>
      </div>

      <div className="a-card a-mt-4" id="versiculos-do-dia">
        <div className="a-card-head">
          <div>
            <h2 className="a-card-title">Gerenciar versículos do dia</h2>
            <p className="a-card-desc">O site usa um versículo diferente a cada dia, em rotação.</p>
          </div>
          {editing ? (
            <Link href="/admin/biblia#versiculos-do-dia" className="a-btn a-btn-ghost a-btn-sm">Cancelar edição</Link>
          ) : null}
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="a-table-wrap border-b border-slate-100 lg:border-b-0 lg:border-r">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Referência</th>
                  <th>Texto</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {verses.map((verse) => (
                  <tr key={verse.id}>
                    <td className="whitespace-nowrap font-semibold text-slate-800">{verse.reference}</td>
                    <td className="max-w-[420px] text-[11.5px] leading-relaxed text-slate-500">{verse.text}</td>
                    <td>
                      <div className="a-table-actions">
                        <Link
                          href={`/admin/biblia?editar=${verse.id}#versiculos-do-dia`}
                          className="a-btn a-btn-outline a-btn-icon"
                          title="Editar versículo"
                          aria-label="Editar versículo"
                        >
                          <Pencil className="size-3.5" />
                        </Link>
                        <form action={deleteDailyVerseAction}>
                          <input type="hidden" name="id" value={verse.id} />
                          <ConfirmSubmit
                            className="a-btn a-btn-danger a-btn-icon"
                            message={`Remover o versículo "${verse.reference}" da rotação?`}
                            title="Excluir versículo"
                          >
                            <Trash2 className="size-3.5" />
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {verses.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-slate-500">Nenhum versículo cadastrado ainda.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <form action={saveDailyVerseAction} className="a-card-body">
            <h3 className="a-card-title">{editing ? "Editar versículo" : "Adicionar versículo"}</h3>
            <p className="a-card-desc">Use a referência completa, como “Salmos 119:105”.</p>
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
            <div className="a-field">
              <label className="a-label" htmlFor="reference">Referência</label>
              <input
                id="reference"
                name="reference"
                defaultValue={editing?.reference ?? ""}
                className="a-input"
                placeholder="Salmos 119:105"
                required
                maxLength={120}
              />
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="text">Texto</label>
              <textarea
                id="text"
                name="text"
                defaultValue={editing?.text ?? ""}
                className="a-textarea min-h-[110px]"
                placeholder="Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho."
                required
                maxLength={1000}
              />
            </div>
            <div className="a-actions a-mt-4">
              <SubmitButton>{editing ? "Salvar versículo" : "Adicionar à rotação"}</SubmitButton>
              {editing ? (
                <Link href="/admin/biblia" className="a-btn a-btn-ghost">Cancelar</Link>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
