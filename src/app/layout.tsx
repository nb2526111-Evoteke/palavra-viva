import type { Metadata } from "next";
import "./globals.css";
import { getActiveTheme } from "@/lib/theme-server";
import { getSettings } from "@/lib/queries";
import { themeStyle } from "@/lib/themes";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.site_name || "Palavra Viva";
  const description = settings.description || "Blog bíblico com Bíblia completa, biblioteca e devocionais.";
  const base = new URL(process.env.SITE_URL || "http://localhost:3000");

  return {
    metadataBase: base,
    title: {
      default: `${siteName} — ${settings.tagline || "Fé que pensa. Esperança que age."}`,
      template: `%s · ${siteName}`,
    },
    description,
    applicationName: siteName,
    authors: [{ name: siteName }],
    keywords: ["bíblia", "blog cristão", "devocional", "estudo bíblico", "fé", "teologia", "leitura bíblica"],
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName,
      title: siteName,
      description,
      url: base.toString(),
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getActiveTheme();

  return (
    <html
      lang="pt-BR"
      data-theme={theme.slug}
      style={themeStyle(theme.tokens, theme.mode)}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content={theme.tokens.bg} />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
