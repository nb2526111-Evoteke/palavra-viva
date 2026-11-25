import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/queries";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  const settings = await getSettings();
  const siteName = settings.site_name || "Palavra Viva";

  return (
    <div className="a-login">
      <aside className="a-login-aside">
        <div className="a-login-brand">
          <span className="a-sidebar-mark size-11">
            <BookOpen className="size-5" aria-hidden="true" />
          </span>
          <div>
            <div className="a-sidebar-name text-[17px]">{siteName}</div>
            <div className="a-sidebar-sub">Painel editorial</div>
          </div>
        </div>

        <div className="a-login-quote">
          <p>“Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.”</p>
          <span>Salmos 119:105</span>
        </div>

        <div className="a-login-foot">
          <p className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[var(--a-gold)]" aria-hidden="true" />
            Sessão protegida · Acesso exclusivo do administrador
          </p>
        </div>
      </aside>

      <main className="a-login-main">
        <div className="a-login-card">
          <p className="a-eyebrow">Área restrita</p>
          <h1 className="a-login-title a-mt-2">Bem-vindo de volta.</h1>
          <p className="a-login-sub">
            Entre com as credenciais do administrador para escrever, publicar e cuidar do {siteName}.
          </p>

          <LoginForm />

          <Link href="/" className="a-login-back">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Voltar para o site
          </Link>
        </div>
      </main>
    </div>
  );
}
