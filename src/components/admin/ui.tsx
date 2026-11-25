import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="a-page-head">
      <div>
        {eyebrow ? <p className="a-eyebrow">{eyebrow}</p> : null}
        <h1 className="a-page-title">{title}</h1>
        {description ? <p className="a-page-desc">{description}</p> : null}
      </div>
      {actions ? <div className="a-page-actions">{actions}</div> : null}
    </div>
  );
}

export function Flash({ ok, erro, info }: { ok?: string; erro?: string; info?: string }) {
  if (!ok && !erro && !info) return null;
  if (erro) {
    return (
      <div className="a-alert a-alert-error" role="alert">
        <AlertCircle aria-hidden="true" />
        <span>{erro}</span>
      </div>
    );
  }
  if (info) {
    return (
      <div className="a-alert a-alert-info" role="status">
        <Info aria-hidden="true" />
        <span>{info}</span>
      </div>
    );
  }
  return (
    <div className="a-alert a-alert-ok" role="status">
      <CheckCircle2 aria-hidden="true" />
      <span>{ok}</span>
    </div>
  );
}

const STATUS_MAP: Record<string, { label: string; tone: string }> = {
  published: { label: "Publicado", tone: "a-badge-green" },
  draft: { label: "Rascunho", tone: "a-badge-slate" },
  scheduled: { label: "Agendado", tone: "a-badge-amber" },
  pending: { label: "Pendente", tone: "a-badge-amber" },
  approved: { label: "Aprovado", tone: "a-badge-green" },
  spam: { label: "Spam", tone: "a-badge-red" },
  new: { label: "Nova", tone: "a-badge-blue" },
  read: { label: "Lida", tone: "a-badge-slate" },
  archived: { label: "Arquivada", tone: "a-badge-slate" },
  active: { label: "Ativo", tone: "a-badge-green" },
  unsubscribed: { label: "Descadastrado", tone: "a-badge-red" },
};

export function StatusBadge({ status }: { status: string }) {
  const entry = STATUS_MAP[status] ?? { label: status, tone: "a-badge-slate" };
  return <span className={`a-badge ${entry.tone}`}>{entry.label}</span>;
}

export function TypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    ebook: "Ebook",
    estudo: "Estudo",
    devocional: "Devocional",
    podcast: "Podcast",
  };
  return <span className="a-badge a-badge-purple">{labels[type] ?? type}</span>;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="a-empty">
      <div className="a-empty-icon">{icon}</div>
      <p className="a-empty-title">{title}</p>
      {description ? <p className="a-empty-text">{description}</p> : null}
      {action ? <div className="a-mt-3">{action}</div> : null}
    </div>
  );
}

export function AdminCard({
  title,
  description,
  action,
  children,
  className = "",
  bodyClassName = "a-card-body",
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`a-card ${className}`}>
      {title || action ? (
        <div className="a-card-head">
          <div>
            {title ? <h2 className="a-card-title">{title}</h2> : null}
            {description ? <p className="a-card-desc">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
