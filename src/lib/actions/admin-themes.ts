"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { execute, insert, queryOne } from "@/lib/db";
import { adminSession, backWith, formInt, formText } from "@/lib/admin";
import { logAudit, setSettings } from "@/lib/queries";
import { THEME_PRESETS, type ThemeTokens } from "@/lib/themes";
import type { FormState } from "@/lib/form";
import { isHexColor, uniqueSlug } from "@/lib/utils";

const TOKEN_KEYS: (keyof ThemeTokens)[] = [
  "bg",
  "surface",
  "surface2",
  "ink",
  "muted",
  "line",
  "accent",
  "accentHover",
  "accentSoft",
  "accentContrast",
  "gold",
  "heading",
];

function refreshThemes() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/temas");
}

export async function saveThemeAction(_state: FormState, formData: FormData): Promise<FormState> {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const name = formText(formData, "name", 80);
  const description = formText(formData, "description", 300);
  const mode = formText(formData, "mode", 10) === "dark" ? "dark" : "light";

  if (name.length < 2) {
    return { ok: false, message: "Informe o nome do tema.", fieldErrors: { name: "Nome obrigatório." } };
  }

  const tokens = {} as ThemeTokens;
  for (const key of TOKEN_KEYS) {
    const value = formText(formData, `token_${key}`, 20);
    if (!isHexColor(value)) {
      return { ok: false, message: `A cor "${key}" precisa estar no formato #a4542f.` };
    }
    tokens[key] = value;
  }

  const requested = formText(formData, "slug", 80);
  const slug = await uniqueSlug(requested || name, async (candidate) =>
    Boolean(
      await queryOne<{ id: number }>("SELECT id FROM themes WHERE slug = ? AND id <> ?", [candidate, id || 0]),
    ),
  );

  if (id) {
    const exists = await queryOne<{ id: number; is_default: number }>("SELECT id, is_default FROM themes WHERE id = ?", [id]);
    if (!exists) return { ok: false, message: "Tema não encontrado." };
    await execute("UPDATE themes SET name = ?, slug = ?, description = ?, mode = ?, tokens = ? WHERE id = ?", [
      name,
      slug,
      description,
      mode,
      JSON.stringify(tokens),
      id,
    ]);
    if (exists.is_default) await setSettings({ default_theme: slug });
    await logAudit({ userId: user.id, action: "theme.update", entity: "theme", entityId: id, details: name });
    refreshThemes();
    redirect(`/admin/temas?ok=${encodeURIComponent("Tema atualizado.")}`);
  }

  const newId = await insert(
    "INSERT INTO themes (name, slug, description, mode, tokens, is_default) VALUES (?, ?, ?, ?, ?, 0)",
    [name, slug, description, mode, JSON.stringify(tokens)],
  );
  await logAudit({ userId: user.id, action: "theme.create", entity: "theme", entityId: newId, details: name });
  refreshThemes();
  redirect(`/admin/temas?ok=${encodeURIComponent("Tema criado. Ative-o como padrão quando quiser.")}`);
}

export async function setDefaultThemeAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const theme = await queryOne<{ id: number; name: string; slug: string }>(
    "SELECT id, name, slug FROM themes WHERE id = ?",
    [id],
  );
  if (!theme) backWith("/admin/temas", { erro: "Tema não encontrado." });

  await execute("UPDATE themes SET is_default = CASE WHEN id = ? THEN 1 ELSE 0 END", [id]);
  await setSettings({ default_theme: theme.slug });
  await logAudit({ userId: user.id, action: "theme.default", entity: "theme", entityId: id, details: theme.name });
  refreshThemes();
  backWith("/admin/temas", { ok: `Tema "${theme.name}" agora é o padrão do site.` });
}

export async function deleteThemeAction(formData: FormData) {
  const user = await adminSession();
  const id = formInt(formData, "id");
  const theme = await queryOne<{ id: number; name: string; is_default: number }>(
    "SELECT id, name, is_default FROM themes WHERE id = ?",
    [id],
  );
  if (!theme) backWith("/admin/temas", { erro: "Tema não encontrado." });
  if (theme.is_default) {
    backWith("/admin/temas", { erro: "Não é possível excluir o tema padrão. Ative outro tema primeiro." });
  }
  await execute("DELETE FROM themes WHERE id = ?", [id]);
  await logAudit({ userId: user.id, action: "theme.delete", entity: "theme", entityId: id, details: theme.name });
  refreshThemes();
  backWith("/admin/temas", { ok: "Tema excluído." });
}

export async function restoreThemePresetsAction(_formData: FormData) {
  const user = await adminSession();
  for (const preset of THEME_PRESETS) {
    await execute(
      `INSERT INTO themes (name, slug, description, mode, tokens, is_default)
       VALUES (?, ?, ?, ?, ?, 0)
       ON CONFLICT(slug) DO UPDATE SET name = excluded.name, description = excluded.description,
         mode = excluded.mode, tokens = excluded.tokens`,
      [preset.name, preset.slug, preset.description, preset.mode, JSON.stringify(preset.tokens)],
    );
  }
  await logAudit({ userId: user.id, action: "theme.restore", entity: "theme", details: "Presets restaurados" });
  refreshThemes();
  backWith("/admin/temas", { ok: "Temas originais restaurados." });
}
