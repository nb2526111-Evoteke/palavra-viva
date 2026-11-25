"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { contactAction } from "@/lib/actions/public";

export function ContactForm() {
  const [state, action, pending] = useActionState(contactAction, null);

  if (state?.ok) {
    return (
      <div className="card flex items-start gap-3 p-6" role="status">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p className="font-medium text-heading">Mensagem enviada.</p>
          <p className="mt-1 text-sm text-muted">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="card p-6 md:p-8">
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-company">Empresa</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="label">
            Nome
          </label>
          <input id="contact-name" name="name" required className="field" placeholder="Seu nome" />
        </div>
        <div>
          <label htmlFor="contact-email" className="label">
            E-mail
          </label>
          <input id="contact-email" name="email" type="email" required className="field" placeholder="voce@email.com" />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="contact-subject" className="label">
          Assunto
        </label>
        <input id="contact-subject" name="subject" className="field" placeholder="Sobre o que você quer falar?" />
      </div>
      <div className="mt-4">
        <label htmlFor="contact-message" className="label">
          Mensagem
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          rows={6}
          className="field resize-y"
          placeholder="Escreva com calma. Respondemos assim que possível."
        />
      </div>
      {state && !state.ok && (
        <p className="mt-3 text-xs text-red-700" role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary mt-5 h-11">
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
        {pending ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}
