import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ScrollText, Search, Trash2 } from "lucide-react";
import { AdminPageHeader, EmptyState, Flash } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import { clearAuditAction } from "@/lib/actions/admin-misc";
import { getAuditLogs } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Auditoria" };

type SearchParams = Promise<{ q?: string; ok?: string; erro?: string }>;

export default async function AdminAuditPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const query = (params.q ?? "").trim().toLowerCase();
  const logs = (await getAuditLogs(250)).filter((log) => {
    if (!query) return true;
    return [log.user_name, log.action, log.entity, log.entity_id, log.details, log.ip]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <>
      <AdminPageHeader
        eyebrow="Sistema"
        title="Auditoria"
        description="Um registro discreto do que acontece no painel: entradas, publicações, alterações e exclusões."
        actions={
          <Link href="/admin/auditoria" className="a-btn a-btn-outline">
            <ScrollText className="size-4" aria-hidden="true" />
            Ver tudo
          </Link>
        }
      />

      <Flash ok={params.ok} erro={params.erro} />

      <div className="a-card">
        <div className="a-card-head">
          <form action="/admin/auditoria" method="get" className="a-filters">
            <div className="a-search">
              <Search aria-hidden="true" />
              <input
                name="q"
                defaultValue={params.q ?? ""}
                className="a-input a-input-sm w-[260px]"
                placeholder="Buscar por ação, usuário ou detalhe…"
                aria-label="Buscar registros"
              />
            </div>
            <button type="submit" className="a-btn a-btn-outline a-btn-sm">Buscar</button>
            {query ? (
              <Link href="/admin/auditoria" className="a-btn a-btn-ghost a-btn-sm">Limpar</Link>
            ) : null}
          </form>

          <form action={clearAuditAction} className="a-filters">
            <input
              name="days"
              type="number"
              min={1}
              defaultValue={90}
              className="a-input a-input-sm w-[72px]"
              aria-label="Dias a manter"
              title="Manter os últimos X dias"
            />
            <SubmitButton className="a-btn a-btn-ghost a-btn-sm" pendingLabel="Limpando…">
              <Trash2 className="size-3.5" aria-hidden="true" />
              Limpar antigos
            </SubmitButton>
          </form>
        </div>

        {logs.length === 0 ? (
          <EmptyState
            icon={<ScrollText className="size-5" />}
            title={query ? "Nenhum registro encontrado" : "Nada registrado ainda"}
            description={
              query
                ? "Tente outro termo de busca."
                : "As ações do painel começarão a aparecer aqui conforme você usa o site."
            }
          />
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Quem</th>
                  <th>Ação</th>
                  <th>Detalhe</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="a-table-num whitespace-nowrap">{formatDateTime(log.created_at)}</td>
                    <td className="whitespace-nowrap font-medium text-slate-800">{log.user_name || "Sistema"}</td>
                    <td>
                      <span className="a-badge a-badge-slate a-mono !text-[10px]">{log.action}</span>
                    </td>
                    <td className="max-w-[480px]">
                      <span className="text-[11.5px] text-slate-600">{log.details || "—"}</span>
                      {log.entity ? (
                        <span className="a-muted ml-1 text-[10px]">
                          ({log.entity}{log.entity_id ? ` #${log.entity_id}` : ""})
                        </span>
                      ) : null}
                    </td>
                    <td className="a-mono text-[10.5px] text-slate-400">{log.ip || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="a-card-head border-t border-b-0">
          <p className="a-help !mt-0">
            {logs.length} {logs.length === 1 ? "registro exibido" : "registros exibidos"} · limite de 250 por consulta
          </p>
        </div>
      </div>
    </>
  );
}
