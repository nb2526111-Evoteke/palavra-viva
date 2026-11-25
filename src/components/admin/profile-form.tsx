"use client";

import { useActionState, useRef, useState } from "react";
import { CheckCircle2, CloudUpload, LoaderCircle, LockKeyhole, Save, ShieldCheck } from "lucide-react";
import { changePasswordAction, updateProfileAction } from "@/lib/actions/admin-settings";
import { initials } from "@/lib/utils";

type ProfileUser = {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  created_at: string;
  last_login_at: string | null;
};

export function ProfileForm({ user }: { user: ProfileUser }) {
  const [state, action, pending] = useActionState(updateProfileAction, null);
  const [avatar, setAvatar] = useState(user.avatar);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setUploadError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !json.url) throw new Error(json.error || "Falha no envio.");
      setAvatar(json.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Falha no envio.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="a-card">
      <div className="a-card-head">
        <div>
          <h2 className="a-card-title">Dados do perfil</h2>
          <p className="a-card-desc">O nome e a biografia aparecem nos artigos e na página Sobre.</p>
        </div>
      </div>
      <div className="a-card-body">
        {state?.ok ? (
          <div className="a-alert a-alert-ok" role="status">
            <CheckCircle2 aria-hidden="true" />
            <span>{state.message}</span>
          </div>
        ) : null}
        {state && !state.ok ? (
          <div className="a-alert a-alert-error" role="alert">
            <span>{state.message}</span>
          </div>
        ) : null}

        <div className="flex items-center gap-4">
          <span className="a-avatar !size-16 !text-lg">
            {avatar ? <img src={avatar} alt="" /> : initials(user.name)}
          </span>
          <div>
            <input type="hidden" name="avatar" value={avatar} />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              className="a-btn a-btn-outline a-btn-sm"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <CloudUpload className="size-3.5" aria-hidden="true" />}
              {uploading ? "Enviando…" : "Trocar foto"}
            </button>
            {avatar ? (
              <button
                type="button"
                className="a-btn a-btn-ghost a-btn-sm ml-1"
                onClick={() => setAvatar("")}
              >
                Remover
              </button>
            ) : null}
            <p className="a-help">JPG, PNG ou WebP · até 8 MB.</p>
            {uploadError ? <p className="a-error">{uploadError}</p> : null}
          </div>
        </div>

        <div className="a-grid-2 a-mt-4">
          <div className="a-field !mt-0">
            <label className="a-label" htmlFor="name">Nome</label>
            <input id="name" name="name" defaultValue={user.name} className="a-input" required maxLength={120} />
            {state?.fieldErrors?.name ? <p className="a-error">{state.fieldErrors.name}</p> : null}
          </div>
          <div className="a-field !mt-0">
            <label className="a-label" htmlFor="email">E-mail de acesso</label>
            <input id="email" name="email" type="email" defaultValue={user.email} className="a-input" required maxLength={160} />
            {state?.fieldErrors?.email ? <p className="a-error">{state.fieldErrors.email}</p> : null}
          </div>
        </div>

        <div className="a-field">
          <label className="a-label" htmlFor="bio">Biografia</label>
          <textarea id="bio" name="bio" defaultValue={user.bio} className="a-textarea min-h-[100px]" maxLength={800} />
          <p className="a-help">Uma ou duas frases sobre você. Aparece ao final dos artigos.</p>
        </div>

        <div className="a-actions a-mt-4">
          <button type="submit" className="a-btn a-btn-primary" disabled={pending}>
            {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
            {pending ? "Salvando…" : "Salvar perfil"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, null);

  return (
    <form action={action} className="a-card">
      <div className="a-card-head">
        <div>
          <h2 className="a-card-title">Senha de acesso</h2>
          <p className="a-card-desc">Troque a senha periodicamente e não compartilhe o acesso.</p>
        </div>
        <ShieldCheck className="size-4 text-slate-300" aria-hidden="true" />
      </div>
      <div className="a-card-body">
        {state?.ok ? (
          <div className="a-alert a-alert-ok" role="status">
            <CheckCircle2 aria-hidden="true" />
            <span>{state.message}</span>
          </div>
        ) : null}
        {state && !state.ok ? (
          <div className="a-alert a-alert-error" role="alert">
            <span>{state.message}</span>
          </div>
        ) : null}

        <div className="a-field !mt-0">
          <label className="a-label" htmlFor="current_password">Senha atual</label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="current_password"
              name="current_password"
              type="password"
              autoComplete="current-password"
              className="a-input pl-9"
              required
            />
          </div>
          {state?.fieldErrors?.current_password ? <p className="a-error">{state.fieldErrors.current_password}</p> : null}
        </div>

        <div className="a-field">
          <label className="a-label" htmlFor="new_password">Nova senha</label>
          <input
            id="new_password"
            name="new_password"
            type="password"
            autoComplete="new-password"
            className="a-input"
            required
            minLength={10}
          />
          <p className="a-help">Mínimo de 10 caracteres. Use uma frase longa e fácil de lembrar.</p>
          {state?.fieldErrors?.new_password ? <p className="a-error">{state.fieldErrors.new_password}</p> : null}
        </div>

        <div className="a-field">
          <label className="a-label" htmlFor="confirm_password">Confirmar nova senha</label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            className="a-input"
            required
            minLength={10}
          />
          {state?.fieldErrors?.confirm_password ? <p className="a-error">{state.fieldErrors.confirm_password}</p> : null}
        </div>

        <button type="submit" className="a-btn a-btn-dark a-w-full a-mt-4" disabled={pending}>
          {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <LockKeyhole className="size-4" aria-hidden="true" />}
          {pending ? "Alterando…" : "Alterar senha"}
        </button>
      </div>
    </form>
  );
}
