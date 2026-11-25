import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Clock, Mail, MessageSquareHeart } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe do Palavra Viva. Sugestões, pedidos de oração e parcerias.",
  alternates: { canonical: "/contato" },
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Vamos conversar."
        description="Uma dúvida, uma sugestão, um pedido de oração ou uma correção: sua mensagem é bem-vinda. Lemos tudo com atenção."
      />

      <section className="shell max-w-5xl py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="card p-5">
              <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              <h2 className="mt-3 font-serif text-lg font-semibold text-heading">E-mail</h2>
              <a href={`mailto:${settings.contact_email}`} className="mt-1 block text-sm text-accent hover:underline">
                {settings.contact_email}
              </a>
            </div>
            <div className="card p-5">
              <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
                <Clock className="size-4" aria-hidden="true" />
              </span>
              <h2 className="mt-3 font-serif text-lg font-semibold text-heading">Tempo de resposta</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Respondemos em até 48 horas úteis. Pedidos de oração são tratados com confidencialidade.
              </p>
            </div>
            <div className="card p-5">
              <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
                <MessageSquareHeart className="size-4" aria-hidden="true" />
              </span>
              <h2 className="mt-3 font-serif text-lg font-semibold text-heading">Pedido de oração</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Escolha o assunto “Oração” no formulário. Você não precisa escrever seu nome completo.
              </p>
            </div>
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent/40"
              >
                <span className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
                    <Camera className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-heading">Instagram</span>
                </span>
                <span className="text-[11px] text-accent">Seguir</span>
              </a>
            )}
          </div>

          <div>
            <ContactForm />
            <p className="mt-4 text-[11px] leading-relaxed text-muted">
              Ao enviar, você concorda que guardemos seu e-mail apenas para responder à mensagem. Não enviamos spam.
            </p>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-line bg-accent-soft/50 p-7 text-center">
          <p className="font-serif text-xl leading-snug text-heading">
            “Não estejais ansiosos por coisa alguma, mas em tudo, pela oração e súplica, com ação de graças, sejam os
            vossos pedidos conhecidos diante de Deus.”
          </p>
          <p className="mt-3 text-[11px] font-medium text-accent">Filipenses 4:6</p>
          <Link href="/biblia/filipenses/4" className="mt-4 inline-block text-[11px] text-muted underline underline-offset-4 hover:text-accent">
            Ler o capítulo completo
          </Link>
        </div>
      </section>
    </>
  );
}
