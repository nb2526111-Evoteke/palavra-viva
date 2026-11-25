import { requireAdmin } from "@/lib/auth";
import { countComments, getSettings } from "@/lib/queries";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const settings = await getSettings();
  const pendingComments = await countComments("pending");

  return (
    <AdminShell
      user={{ name: user.name, email: user.email, avatar: user.avatar }}
      pendingComments={pendingComments}
      siteName={settings.site_name || "Palavra Viva"}
    >
      {children}
    </AdminShell>
  );
}
