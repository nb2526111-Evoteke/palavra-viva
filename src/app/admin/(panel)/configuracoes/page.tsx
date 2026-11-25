import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Configurações" };

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <>
      <AdminPageHeader
        eyebrow="Sistema"
        title="Configurações"
        description="A voz, os canais e as regras editoriais do site. Tudo o que muda aqui aparece imediatamente para o visitante."
      />
      <SettingsForm settings={settings} />
    </>
  );
}
