import { getCategories, getDailyVerse, getSettings } from "@/lib/queries";
import { getActiveTheme, getThemeOptions } from "@/lib/theme-server";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const categories = await getCategories();
  const dailyVerse = await getDailyVerse();
  const themes = await getThemeOptions();
  const theme = await getActiveTheme();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} themes={themes} currentTheme={theme.slug} dailyVerse={dailyVerse} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} categories={categories} />
    </div>
  );
}
