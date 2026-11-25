"use client";

import { useActionState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { subscribeAction } from "@/lib/actions/public";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  source = "site",
  variant = "light",
  className,
  buttonLabel = "Assinar",
}: {
  source?: string;
  variant?: "light" | "dark";
  className?: string;
  buttonLabel?: string;
}) {
  const [state, action, pending] = useActionState(subscribeAction, null);

  if (state?.ok) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
          variant === "dark"
            ? "border-white/15 bg-white/5 text-white/80"
            : "border-line bg-accent-soft/60 text-ink",
          className,
        )}
        role="status"
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className={cn("w-full", className)}>
      <input type="hidden" name="source" value={source} />
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={`company-${source}`}>Não preencha</label>
        <input id={`company-${source}`} type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div
        className={cn(
          "flex flex-col gap-2 sm:flex-row",
          variant === "dark" ? "sm:items-center" : "sm:items-center",
        )}
      >
        <label className="sr-only" htmlFor={`newsletter-email-${source}`}>
          Seu e-mail
        </label>
        <input
          id={`newsletter-email-${source}`}
          name="email"
          type="email"
          required
          placeholder="seu@email.com"
          autoComplete="email"
          className={cn(
            "field h-11 flex-1",
            variant === "dark" &&
              "border-white/15 bg-white/[0.06] text-white placeholder:text-white/40 focus:border-[var(--gold)]",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "btn h-11 shrink-0",
            variant === "dark"
              ? "bg-[var(--gold)] text-[#1a1308] hover:brightness-110"
              : "btn-primary",
          )}
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {buttonLabel}
          {!pending && <ArrowRight className="size-4" aria-hidden="true" />}
        </button>
      </div>
      {state && !state.ok && (
        <p
          className={cn(
            "mt-2 text-xs",
            variant === "dark" ? "text-[#f0b4a4]" : "text-red-700",
          )}
          role="alert"
        >
          {state.message}
        </p>
      )}
      <p
        className={cn(
          "mt-2 text-[11px] leading-relaxed",
          variant === "dark" ? "text-white/40" : "text-muted",
        )}
      >
        Sem spam. Cancele quando quiser.
      </p>
    </form>
  );
}
