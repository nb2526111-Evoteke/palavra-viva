"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="a-login-form">
      {state && !state.ok && (
        <div className="a-alert a-alert-error" role="alert">
          <LockKeyhole aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      )}

      <div className="a-field">
        <label className="a-label" htmlFor="email">
          E-mail
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            placeholder="voce@email.com"
            className="a-input pl-9"
            defaultValue=""
          />
        </div>
      </div>

      <div className="a-field">
        <label className="a-label" htmlFor="password">
          Senha
        </label>
        <div className="relative">
          <LockKeyhole
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Sua senha"
            className="a-input pl-9 pr-10"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <button type="submit" className="a-btn a-btn-primary a-w-full a-mt-4" disabled={pending}>
        {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
        {pending ? "Entrando…" : "Entrar no painel"}
      </button>

      <p className="a-help a-mt-3 text-center">
        Acesso restrito ao administrador do site. Não há cadastro público.
      </p>
    </form>
  );
}
