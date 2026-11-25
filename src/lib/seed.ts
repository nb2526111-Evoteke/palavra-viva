import type { Client, InValue } from "@libsql/client";
import { hashPassword } from "./password";
import { THEME_PRESETS } from "./themes";
import {
  DEMO_CATEGORIES,
  DEMO_COMMENTS,
  DEMO_DAILY_VERSES,
  DEMO_LIBRARY,
  DEMO_PLANS,
  DEMO_POSTS,
  DEMO_SUBSCRIBERS,
} from "./demo-content";
import { readingTime, slugify } from "./utils";

const SITE_SETTINGS: Record<string, string> = {
  site_name: "Palavra Viva",
  tagline: "Fé que pensa. Esperança que age.",
  description:
    "Um blog bíblico para ler as Escrituras com profundidade, cultivar a fé no cotidiano e encontrar recursos para a jornada.",
  contact_email: "contato@palavraviva.com.br",
  instagram: "https://instagram.com/palavraviva",
  youtube: "https://youtube.com/@palavraviva",
  footer_note: "Feito com reverência, café e boas perguntas.",
  hero_eyebrow: "Bíblia · Fé · Vida",
  hero_title: "A Palavra que transforma o ordinário em propósito.",
  hero_subtitle:
    "Leituras bíblicas, devocionais e estudos que aproximam as Escrituras da vida real — sem atalhos, sem clichês.",
  about_title: "Uma mesa posta para quem quer ler a Bíblia com profundidade.",
  about_text:
    "O Palavra Viva nasceu de uma convicção simples: a Bíblia não foi escrita para ficar distante da vida. Ela fala de trabalho, família, medo, amizade, dinheiro, luto e esperança — e merece ser lida com atenção, honestidade e reverência.\n\nAqui você encontra devocionais para o dia a dia, estudos que abrem o contexto do texto, reflexões sobre a vida cristã e recursos para a sua jornada. Não temos todas as respostas. Temos uma mesa, uma Escritura aberta e espaço para perguntas honestas.\n\nQue este seja um lugar de descanso e de coragem: descanso para quem está cansado, coragem para quem precisa recomeçar.",
  default_theme: "alvorada",
  posts_per_page: "9",
  comments_enabled: "1",
  newsletter_enabled: "1",
  bible_attribution:
    "Texto bíblico: Bíblia Livre (BLIVRE), Copyright © 2018 Diego Santos, Mario Sérgio e Marco Teles — Creative Commons Atribuição 4.0 Brasil (CC BY 4.0 BR).",
};

function daysAgo(days: number, hour = 9) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function dayKey(offset: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - offset);
  return date.toISOString().slice(0, 10);
}

export async function seedDatabase(client: Client) {
  const seeded = await client.execute({
    sql: "SELECT value FROM settings WHERE key = 'seeded'",
    args: [],
  });
  if (seeded.rows[0]?.value === "1") return;

  const existingUsers = await client.execute("SELECT COUNT(*) AS total FROM users");
  if (Number(existingUsers.rows[0]?.total ?? 0) > 0) {
    await client.execute("INSERT OR REPLACE INTO settings (key, value) VALUES ('seeded', '1')");
    return;
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@palavraviva.com.br").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "troque-esta-senha-agora";
  const adminName = process.env.ADMIN_NAME?.trim() || "Administrador";

  const tx = await client.transaction("write");
  try {
    const recheck = await tx.execute({
      sql: "SELECT value FROM settings WHERE key = 'seeded'",
      args: [],
    });
    if (recheck.rows[0]?.value === "1") {
      await tx.commit();
      return;
    }

    const run = (sql: string, args: InValue[] = []) => tx.execute({ sql, args });

    for (const [key, value] of Object.entries(SITE_SETTINGS)) {
      await run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
    }

    await run(
      `INSERT INTO users (name, email, password_hash, role, bio)
       VALUES (?, ?, ?, 'admin', ?)`,
      [
        adminName,
        adminEmail,
        hashPassword(adminPassword),
        "Leitor da Bíblia, editor do Palavra Viva. Escreve sobre fé, cultura e as pequenas decisões que formam uma vida.",
      ],
    );

    for (const preset of THEME_PRESETS) {
      await run(
        `INSERT INTO themes (name, slug, description, mode, tokens, is_default)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          preset.name,
          preset.slug,
          preset.description,
          preset.mode,
          JSON.stringify(preset.tokens),
          preset.slug === SITE_SETTINGS.default_theme ? 1 : 0,
        ],
      );
    }

    const categoryIds = new Map<string, number>();
    for (const category of DEMO_CATEGORIES) {
      const result = await run(
        "INSERT INTO categories (name, slug, description, color, icon) VALUES (?, ?, ?, ?, ?)",
        [category.name, category.slug, category.description, category.color, category.icon],
      );
      categoryIds.set(category.slug, Number(result.lastInsertRowid));
    }

    const postIds = new Map<string, number>();
    for (const post of DEMO_POSTS) {
      const status = post.status || "published";
      const createdAt = post.published_at ? post.published_at : daysAgo(2);
      const result = await run(
        `INSERT INTO posts
          (slug, title, subtitle, excerpt, content, category_id, author_id, status, featured,
           views, reading_minutes, seo_title, seo_description, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post.slug,
          post.title,
          post.subtitle,
          post.excerpt,
          post.content,
          categoryIds.get(post.category) ?? null,
          status,
          post.featured ? 1 : 0,
          post.views,
          readingTime(post.content),
          post.title,
          post.excerpt,
          post.published_at,
          createdAt,
          post.published_at ?? daysAgo(1),
        ],
      );
      const postId = Number(result.lastInsertRowid);
      postIds.set(post.slug, postId);

      for (const tag of post.tags) {
        const slug = slugify(tag);
        await run("INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)", [tag, slug]);
        const tagRow = await run("SELECT id FROM tags WHERE slug = ?", [slug]);
        if (tagRow.rows[0]?.id != null) {
          await run("INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)", [
            postId,
            Number(tagRow.rows[0].id),
          ]);
        }
      }
    }

    for (const comment of DEMO_COMMENTS) {
      const postId = postIds.get(comment.post);
      if (!postId) continue;
      await run(
        `INSERT INTO comments (post_id, name, email, content, status, ip, created_at)
         VALUES (?, ?, ?, ?, ?, '', ?)`,
        [postId, comment.name, comment.email, comment.content, comment.status, daysAgo(comment.daysAgo, 14)],
      );
    }

    for (let index = 0; index < DEMO_LIBRARY.length; index += 1) {
      const item = DEMO_LIBRARY[index];
      await run(
        `INSERT INTO library_items
          (slug, title, subtitle, author, type, description, pages, featured, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.slug,
          item.title,
          item.subtitle,
          item.author,
          item.type,
          item.description,
          item.pages,
          item.featured ? 1 : 0,
          daysAgo(20 + index * 9),
        ],
      );
    }

    for (const plan of DEMO_PLANS) {
      const result = await run(
        `INSERT INTO reading_plans (slug, title, description, days_count, featured)
         VALUES (?, ?, ?, ?, ?)`,
        [plan.slug, plan.title, plan.description, plan.days.length, plan.featured ? 1 : 0],
      );
      const planId = Number(result.lastInsertRowid);
      for (let index = 0; index < plan.days.length; index += 1) {
        const day = plan.days[index];
        await run(
          `INSERT INTO reading_plan_days (plan_id, day, title, passage, reflection)
           VALUES (?, ?, ?, ?, ?)`,
          [planId, index + 1, day.title, day.passage, day.reflection],
        );
      }
    }

    for (const verse of DEMO_DAILY_VERSES) {
      await run("INSERT INTO daily_verses (reference, text) VALUES (?, ?)", [verse.reference, verse.text]);
    }

    for (let index = 0; index < DEMO_SUBSCRIBERS.length; index += 1) {
      const subscriber = DEMO_SUBSCRIBERS[index];
      await run(
        "INSERT OR IGNORE INTO newsletter_subscribers (email, name, source, created_at) VALUES (?, ?, ?, ?)",
        [subscriber.email, subscriber.name, subscriber.source, daysAgo(30 - index * 4)],
      );
    }

    let postIndex = 0;
    for (const post of DEMO_POSTS) {
      if ((post.status || "published") !== "published") continue;
      const postId = postIds.get(post.slug);
      if (!postId) continue;
      postIndex += 1;
      for (let offset = 29; offset >= 0; offset -= 1) {
        const base = 12 + ((postIndex * 13 + offset * 7) % 38);
        const weekendBoost = [0, 6].includes(new Date(Date.now() - offset * 86400000).getUTCDay()) ? 9 : 0;
        await run("INSERT OR REPLACE INTO post_views (post_id, day, count) VALUES (?, ?, ?)", [
          postId,
          dayKey(offset),
          base + weekendBoost,
        ]);
      }
    }

    await run(
      "INSERT INTO audit_logs (user_id, action, entity, details) VALUES (1, 'system.seed', 'site', 'Instalação inicial concluída')",
    );
    await run("INSERT OR REPLACE INTO settings (key, value) VALUES ('seeded', '1')");

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    throw error;
  } finally {
    tx.close();
  }
}
