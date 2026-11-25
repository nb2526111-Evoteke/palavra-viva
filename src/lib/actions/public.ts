"use server";

import { revalidatePath } from "next/cache";
import { execute, insert, queryOne } from "@/lib/db";
import { getClientIp } from "@/lib/auth";
import { getSetting } from "@/lib/queries";
import { isEmail, type FormState } from "@/lib/form";

const hits = new Map<string, number[]>();

function limited(key: string, max = 4, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= max) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
}

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function subscribeAction(_state: FormState, formData: FormData): Promise<FormState> {
  const email = field(formData, "email").toLowerCase();
  const name = field(formData, "name").slice(0, 80);
  const source = field(formData, "source") || "site";

  if (field(formData, "company")) {
    return { ok: true, message: "Inscrição recebida." };
  }
  if (!isEmail(email)) {
    return { ok: false, message: "Informe um e-mail válido.", fieldErrors: { email: "E-mail inválido." } };
  }
  if ((await getSetting("newsletter_enabled", "1")) !== "1") {
    return { ok: false, message: "A newsletter está temporariamente indisponível." };
  }

  const ip = await getClientIp();
  if (limited(`newsletter:${ip}`, 5)) {
    return { ok: false, message: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };
  }

  await execute(
    `INSERT INTO newsletter_subscribers (email, name, source, status)
     VALUES (?, ?, ?, 'active')
     ON CONFLICT(email) DO UPDATE SET status = 'active', name = CASE WHEN excluded.name <> '' THEN excluded.name ELSE newsletter_subscribers.name END`,
    [email, name, source],
  );

  return { ok: true, message: "Pronto! Você vai receber as próximas leituras no seu e-mail." };
}

export async function commentAction(_state: FormState, formData: FormData): Promise<FormState> {
  const postId = Number(formData.get("post_id"));
  const name = field(formData, "name").slice(0, 80);
  const email = field(formData, "email").toLowerCase();
  const content = field(formData, "content").slice(0, 2500);

  if (field(formData, "website")) {
    return { ok: true, message: "Comentário enviado para moderação." };
  }
  if (!Number.isFinite(postId) || postId <= 0) {
    return { ok: false, message: "Não foi possível identificar o artigo." };
  }
  if (name.length < 2) {
    return { ok: false, message: "Informe seu nome.", fieldErrors: { name: "Nome muito curto." } };
  }
  if (!isEmail(email)) {
    return { ok: false, message: "Informe um e-mail válido.", fieldErrors: { email: "E-mail inválido." } };
  }
  if (content.length < 5) {
    return { ok: false, message: "Escreva um comentário um pouco maior." };
  }
  if ((await getSetting("comments_enabled", "1")) !== "1") {
    return { ok: false, message: "Os comentários estão desativados no momento." };
  }

  const post = await queryOne<{ id: number; slug: string; status: string }>(
    "SELECT id, slug, status FROM posts WHERE id = ?",
    [postId],
  );
  if (!post || post.status !== "published") {
    return { ok: false, message: "Artigo não encontrado." };
  }

  const ip = await getClientIp();
  if (limited(`comment:${ip}`, 4)) {
    return { ok: false, message: "Muitos comentários em pouco tempo. Aguarde alguns minutos." };
  }

  await insert("INSERT INTO comments (post_id, name, email, content, status, ip) VALUES (?, ?, ?, ?, 'pending', ?)", [
    postId,
    name,
    email,
    content,
    ip,
  ]);

  revalidatePath(`/blog/${post.slug}`);
  return {
    ok: true,
    message: "Comentário enviado! Ele aparecerá depois da moderação.",
  };
}

export async function contactAction(_state: FormState, formData: FormData): Promise<FormState> {
  const name = field(formData, "name").slice(0, 80);
  const email = field(formData, "email").toLowerCase();
  const subject = field(formData, "subject").slice(0, 120);
  const message = field(formData, "message").slice(0, 3000);

  if (field(formData, "company")) {
    return { ok: true, message: "Mensagem recebida." };
  }
  if (name.length < 2) return { ok: false, message: "Informe seu nome." };
  if (!isEmail(email)) return { ok: false, message: "Informe um e-mail válido." };
  if (message.length < 10) return { ok: false, message: "Escreva uma mensagem um pouco maior." };

  const ip = await getClientIp();
  if (limited(`contact:${ip}`, 3)) {
    return { ok: false, message: "Muitas mensagens em pouco tempo. Aguarde alguns minutos." };
  }

  await insert("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)", [
    name,
    email,
    subject,
    message,
  ]);

  return { ok: true, message: "Mensagem enviada. Responderemos no e-mail informado." };
}
