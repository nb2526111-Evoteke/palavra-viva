import type { Metadata } from "next";
import { KeyRound, ShieldCheck, UserRound } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { PasswordForm, ProfileForm } from "@/components/admin/profile-form";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Meu perfil" };

export default async function AdminProfilePage() {
  const user = await requireAdmin();

  return (
    <>
      <AdminPageHeader
        eyebrow="Sistema"
        title="Meu perfil"
        description="Sua identidade no site e a segurança do acesso administrativo."
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <UserRound className="size-4 text-slate-400" aria-hidden="true" />
            <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500">Perfil público</h2>
          </div>
          <ProfileForm
            user={{
              name: user.name,
              email: user.email,
              bio: user.bio,
              avatar: user.avatar,
              created_at: user.created_at,
              last_login_at: user.last_login_at,
            }}
          />
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-slate-400" aria-hidden="true" />
            <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500">Segurança</h2>
          </div>
          <PasswordForm />

          <div className="a-card p-5">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold text-slate-800">
              <ShieldCheck className="size-4 text-emerald-600" aria-hidden="true" />
              Sessão protegida
            </p>
            <dl className="mt-3 space-y-2 text-[11.5px] text-slate-500">
              <div className="flex items-center justify-between gap-4">
                <dt>Conta criada em</dt>
                <dd className="font-medium text-slate-700">{formatDateTime(user.created_at)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Último acesso</dt>
                <dd className="font-medium text-slate-700">{formatDateTime(user.last_login_at) || "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Nível de acesso</dt>
                <dd className="font-medium text-slate-700">Administrador</dd>
              </div>
            </dl>
            <p className="a-help a-mt-3">
              Ao alterar a senha, as outras sessões abertas neste usuário são encerradas. A sessão atual continua ativa.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
