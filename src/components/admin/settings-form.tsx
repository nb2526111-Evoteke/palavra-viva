"use client";

import { useActionState } from "react";
import { BookOpen, CheckCircle2, Globe2, LoaderCircle, Mail, Save, Sparkles } from "lucide-react";
import { saveSettingsAction } from "@/lib/actions/admin-settings";

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, action, pending] = useActionState(saveSettingsAction, null);
  const value = (key: string, fallback = "") => settings[key] ?? fallback;

  return (
    <form action={action}>
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

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <section className="a-card">
            <div className="a-card-head">
              <div>
                <h2 className="a-card-title">Identidade do site</h2>
                <p className="a-card-desc">Como o site se apresenta no topo, no rodapé e nos buscadores.</p>
              </div>
              <Globe2 className="size-4 text-slate-300" aria-hidden="true" />
            </div>
            <div className="a-card-body">
              <div className="a-grid-2">
                <div className="a-field !mt-0">
                  <label className="a-label" htmlFor="site_name">Nome do site</label>
                  <input
                    id="site_name"
                    name="site_name"
                    defaultValue={value("site_name", "Palavra Viva")}
                    className="a-input"
                    required
                    maxLength={90}
                  />
                  {state?.fieldErrors?.site_name ? <p className="a-error">{state.fieldErrors.site_name}</p> : null}
                </div>
                <div className="a-field !mt-0">
                  <label className="a-label" htmlFor="tagline">Assinatura</label>
                  <input
                    id="tagline"
                    name="tagline"
                    defaultValue={value("tagline")}
                    className="a-input"
                    placeholder="Fé que pensa. Esperança que age."
                    maxLength={160}
                  />
                </div>
              </div>

              <div className="a-field">
                <label className="a-label" htmlFor="description">Descrição para buscadores</label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={value("description")}
                  className="a-textarea min-h-[80px]"
                  maxLength={400}
                />
                <p className="a-help">Usada no SEO quando a página não tem descrição própria.</p>
              </div>
            </div>
          </section>

          <section className="a-card">
            <div className="a-card-head">
              <div>
                <h2 className="a-card-title">Página inicial</h2>
                <p className="a-card-desc">O primeiro parágrafo que o visitante encontra.</p>
              </div>
              <Sparkles className="size-4 text-slate-300" aria-hidden="true" />
            </div>
            <div className="a-card-body">
              <div className="a-field">
                <label className="a-label" htmlFor="hero_eyebrow">Sobretítulo</label>
                <input
                  id="hero_eyebrow"
                  name="hero_eyebrow"
                  defaultValue={value("hero_eyebrow")}
                  className="a-input"
                  placeholder="Bíblia · Fé · Vida"
                  maxLength={120}
                />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="hero_title">Título principal</label>
                <textarea
                  id="hero_title"
                  name="hero_title"
                  defaultValue={value("hero_title")}
                  className="a-textarea min-h-[74px]"
                  maxLength={220}
                />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="hero_subtitle">Subtítulo</label>
                <textarea
                  id="hero_subtitle"
                  name="hero_subtitle"
                  defaultValue={value("hero_subtitle")}
                  className="a-textarea min-h-[92px]"
                  maxLength={500}
                />
              </div>
            </div>
          </section>

          <section className="a-card">
            <div className="a-card-head">
              <div>
                <h2 className="a-card-title">Página “Sobre”</h2>
                <p className="a-card-desc">A história e a convicção por trás do projeto.</p>
              </div>
            </div>
            <div className="a-card-body">
              <div className="a-field">
                <label className="a-label" htmlFor="about_title">Título</label>
                <input
                  id="about_title"
                  name="about_title"
                  defaultValue={value("about_title")}
                  className="a-input"
                  maxLength={220}
                />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="about_text">Texto</label>
                <textarea
                  id="about_text"
                  name="about_text"
                  defaultValue={value("about_text")}
                  className="a-textarea min-h-[180px]"
                  maxLength={6000}
                />
                <p className="a-help">Separe parágrafos com uma linha em branco.</p>
              </div>
            </div>
          </section>

          <section className="a-card">
            <div className="a-card-head">
              <div>
                <h2 className="a-card-title">Contato e redes</h2>
                <p className="a-card-desc">Canais exibidos no rodapé e na página de contato.</p>
              </div>
              <Mail className="size-4 text-slate-300" aria-hidden="true" />
            </div>
            <div className="a-card-body">
              <div className="a-field">
                <label className="a-label" htmlFor="contact_email">E-mail de contato</label>
                <input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  defaultValue={value("contact_email")}
                  className="a-input"
                  maxLength={160}
                />
                {state?.fieldErrors?.contact_email ? <p className="a-error">{state.fieldErrors.contact_email}</p> : null}
              </div>
              <div className="a-grid-2">
                <div className="a-field">
                  <label className="a-label" htmlFor="instagram">Instagram</label>
                  <input
                    id="instagram"
                    name="instagram"
                    defaultValue={value("instagram")}
                    className="a-input"
                    placeholder="https://instagram.com/…"
                    maxLength={240}
                  />
                </div>
                <div className="a-field">
                  <label className="a-label" htmlFor="youtube">YouTube</label>
                  <input
                    id="youtube"
                    name="youtube"
                    defaultValue={value("youtube")}
                    className="a-input"
                    placeholder="https://youtube.com/@…"
                    maxLength={240}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="a-card">
            <div className="a-card-head">
              <h2 className="a-card-title">Leitura e participação</h2>
            </div>
            <div className="a-card-body">
              <div className="a-field !mt-0">
                <label className="a-label" htmlFor="posts_per_page">Artigos por página</label>
                <input
                  id="posts_per_page"
                  name="posts_per_page"
                  type="number"
                  min={3}
                  max={24}
                  defaultValue={value("posts_per_page", "9")}
                  className="a-input"
                />
                <p className="a-help">Entre 3 e 24. Afeta o blog e os temas.</p>
              </div>

              <div className="a-mt-4 border-t border-slate-100 pt-1">
                <label className="a-switch-row cursor-pointer">
                  <span>
                    <span className="a-switch-title">Comentários</span>
                    <span className="a-switch-desc block">Permitir comentários nos artigos (com moderação).</span>
                  </span>
                  <input
                    type="checkbox"
                    name="comments_enabled"
                    value="1"
                    defaultChecked={value("comments_enabled", "1") === "1"}
                    className="size-4 accent-[var(--a-primary)]"
                  />
                </label>
                <label className="a-switch-row cursor-pointer">
                  <span>
                    <span className="a-switch-title">Newsletter</span>
                    <span className="a-switch-desc block">Exibir o formulário de inscrição no site.</span>
                  </span>
                  <input
                    type="checkbox"
                    name="newsletter_enabled"
                    value="1"
                    defaultChecked={value("newsletter_enabled", "1") === "1"}
                    className="size-4 accent-[var(--a-primary)]"
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="a-card">
            <div className="a-card-head">
              <h2 className="a-card-title">Rodapé</h2>
            </div>
            <div className="a-card-body">
              <div className="a-field !mt-0">
                <label className="a-label" htmlFor="footer_note">Frase do rodapé</label>
                <input
                  id="footer_note"
                  name="footer_note"
                  defaultValue={value("footer_note")}
                  className="a-input"
                  maxLength={240}
                />
              </div>
            </div>
          </section>

          <section className="a-card">
            <div className="a-card-head">
              <div>
                <h2 className="a-card-title">Bíblia</h2>
                <p className="a-card-desc">Atribuição obrigatória pela licença do texto.</p>
              </div>
              <BookOpen className="size-4 text-slate-300" aria-hidden="true" />
            </div>
            <div className="a-card-body">
              <div className="a-field !mt-0">
                <label className="a-label" htmlFor="bible_attribution">Atribuição</label>
                <textarea
                  id="bible_attribution"
                  name="bible_attribution"
                  defaultValue={value("bible_attribution")}
                  className="a-textarea min-h-[130px]"
                  maxLength={800}
                />
                <p className="a-help">Exibida no rodapé e na página da Bíblia.</p>
              </div>
            </div>
          </section>

          <button type="submit" className="a-btn a-btn-primary a-w-full" disabled={pending}>
            {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
            {pending ? "Salvando…" : "Salvar configurações"}
          </button>
          <p className="a-help text-center">As alterações entram no ar imediatamente.</p>
        </div>
      </div>
    </form>
  );
}
