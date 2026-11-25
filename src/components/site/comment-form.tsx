"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { commentAction } from "@/lib/actions/public";

export function CommentForm({ postId }: { postId: number }) {
  const [state, action, pending] = useActionState(commentAction, null);

  if (state?.ok) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-5 text-sm" role="status">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p className="font-medium text-heading">Obrigado pelo comentário.</p>
          <p className="mt-1 text-muted">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="card p-6">
      <input type="hidden" name="post_id" value={postId} />
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="comment-website">Site</label>
        <input id="comment-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex items-center gap-2">
        <MessageSquare className="size-4 text-accent" aria-hidden="true" />
        <h3 className="font-serif text-xl font-semibold text-heading">Deixe seu comentário</h3>
      </div>
      <p className="mt-1.5 text-xs text-muted">
        Seu e-mail não será publicado. Comentários passam por moderação.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="comment-name" className="label">
            Nome
          </label>
          <input id="comment-name" name="name" required minLength={2} className="field" placeholder="Seu nome" />
        </div>
        <div>
          <label htmlFor="comment-email" className="label">
            E-mail
          </label>
          <input
            id="comment-email"
            name="email"
            type="email"
            required
            className="field"
            placeholder="voce@email.com"
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="comment-content" className="label">
          Comentário
        </label>
        <textarea
          id="comment-content"
          name="content"
          required
          minLength={5}
          rows={4}
          className="field resize-y"
          placeholder="O que este texto despertou em você?"
        />
      </div>

      {state && !state.ok && (
        <p className="mt-3 text-xs text-red-700" role="alert">
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary mt-4 h-11">
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {pending ? "Enviando…" : "Enviar comentário"}
      </button>
    </form>
  );
}
