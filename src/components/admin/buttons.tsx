"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Copy, LoaderCircle } from "lucide-react";

export function SubmitButton({
  children,
  pendingLabel = "Salvando…",
  className = "a-btn a-btn-primary",
  title,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} title={title}>
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
      {pending ? pendingLabel : children}
    </button>
  );
}

export function ConfirmSubmit({
  children,
  message,
  className = "a-btn a-btn-danger a-btn-sm",
  title,
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      title={title}
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {pending ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : children}
    </button>
  );
}

export function CopyButton({
  value,
  label = "Copiar",
  className = "a-btn a-btn-outline a-btn-sm",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          window.prompt("Copie o endereço abaixo:", value);
        }
      }}
    >
      {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      {copied ? "Copiado" : label}
    </button>
  );
}
