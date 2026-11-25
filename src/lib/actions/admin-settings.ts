"use server";

import { revalidatePath } from "next/cache";
import { execute, queryOne } from "@/lib/db";
import { revokeOtherSessions } from "@/lib/auth";
import { adminSession, formText } from "@/lib/admin";
import { logAudit, setSettings } from "@/lib/queries";
import { hashPassword, verifyPassword } from "@/lib/password";
import { isEmail, type FormState } from "@/lib/form";

export async function saveSettingsAction(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await adminSession();
  const siteName = formText(formData, "site_name", 90);
  const contactEmail = formText(formData, "contact_email", 160);
  const postsPerPage = Math.min(24, Math.max(3, Number.parseInt(formText(formData, "posts_per_page", 4), 10) || 9));

  if (siteName.length < 2) {
    return { ok: false, message: "Informe o nome do site.", fieldErrors: { site_name: "Nome obrigatório." } };
  }
  if (contactEmail && !isEmail(contactEmail)) {
    return { ok: false, message: "O e-mail de contato é inválido.", fieldErrors: { contact_email: "E-mail inválido." } };
  }

  await setSettings({
    site_name: siteName,
    tagline: formText(formData, "tagline", 160),
    description: formText(formData, "description", 400),
    contact_email: contactEmail,
    instagram: formText(formData, "instagram", 240),
    youtube: formText(formData, "youtube", 240),
    footer_note: formText(formData, "footer_note", 240),
    hero_eyebrow: formText(formData, "hero_eyebrow", 120),
    hero_title: formText(formData, "hero_title", 220),
    hero_subtitle: formText(formData, "hero_subtitle", 500),
    about_title: formText(formData, "about_title", 220),
    about_text: formText(formData, "about_text", 6000),
    posts_per_page: String(postsPerPage),
    comments_enabled: formData.get("comments_enabled") === "1" ? "1" : "0",
    newsletter_enabled: formData.get("newsletter_enabled") === "1" ? "1" : "0",
    bible_attribution: formText(formData, "bible_attribution", 800),
  });

  await logAudit({ userId: user.id, action: "settings.update", entity: "settings", details: "Configurações do site" });
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/configuracoes");
  return { ok: true, message: "Configurações salvas. O site já reflete as alterações." };
}

export async function updateProfileAction(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await adminSession();
  const name = formText(formData, "name", 120);
  const email = formText(formData, "email", 160).toLowerCase();
  const bio = formText(formData, "bio", 800);
  const avatar = formText(formData, "avatar", 500);

  if (name.length < 2) {
    return { ok: false, message: "Informe seu nome.", fieldErrors: { name: "Nome obrigatório." } };
  }
  if (!isEmail(email)) {
    return { ok: false, message: "Informe um e-mail válido.", fieldErrors: { email: "E-mail inválido." } };
  }
  const duplicate = await queryOne<{ id: number }>("SELECT id FROM users WHERE email = ? COLLATE NOCASE AND id <> ?", [
    email,
    user.id,
  ]);
  if (duplicate) {
    return { ok: false, message: "Este e-mail já está em uso.", fieldErrors: { email: "E-mail já cadastrado." } };
  }

  await execute("UPDATE users SET name = ?, email = ?, bio = ?, avatar = ? WHERE id = ?", [
    name,
    email,
    bio,
    avatar.startsWith("/") || /^https?:\/\//i.test(avatar) ? avatar : "",
    user.id,
  ]);
  await logAudit({ userId: user.id, action: "profile.update", entity: "user", entityId: user.id, details: name });
  revalidatePath("/admin");
  revalidatePath("/admin/perfil");
  revalidatePath("/sobre");
  return { ok: true, message: "Perfil atualizado." };
}

export async function changePasswordAction(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await adminSession();
  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  const confirmation = String(formData.get("confirm_password") ?? "");

  if (!current || !next || !confirmation) {
    return { ok: false, message: "Preencha todos os campos de senha." };
  }
  if (next.length < 10) {
    return { ok: false, message: "A nova senha precisa ter pelo menos 10 caracteres.", fieldErrors: { new_password: "Mínimo de 10 caracteres." } };
  }
  if (next !== confirmation) {
    return { ok: false, message: "A confirmação não confere com a nova senha.", fieldErrors: { confirm_password: "As senhas não conferem." } };
  }
  if (next === current) {
    return { ok: false, message: "Escolha uma senha diferente da atual." };
  }

  const stored = await queryOne<{ password_hash: string }>("SELECT password_hash FROM users WHERE id = ?", [user.id]);
  if (!stored || !verifyPassword(current, stored.password_hash)) {
    return { ok: false, message: "A senha atual está incorreta.", fieldErrors: { current_password: "Senha incorreta." } };
  }

  await execute("UPDATE users SET password_hash = ? WHERE id = ?", [hashPassword(next), user.id]);
  await revokeOtherSessions(user.id);
  await logAudit({ userId: user.id, action: "profile.password", entity: "user", entityId: user.id, details: "Senha alterada" });
  return { ok: true, message: "Senha alterada com sucesso." };
}
