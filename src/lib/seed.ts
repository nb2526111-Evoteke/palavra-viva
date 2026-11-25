import type { DatabaseSync } from "node:sqlite";
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

export function seedDatabase(db: DatabaseSync) {
  const seeded = db.prepare("SELECT value FROM settings WHERE key = 'seeded'").get() as
    | { value: string }
    | undefined;
  if (seeded?.value === "1") return;

  const existingUsers = db.prepare("SELECT COUNT(*) AS total FROM users").get() as { total: number };
  if (existingUsers.total > 0) {
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('seeded', '1')").run();
    return;
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@palavraviva.com.br").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "troque-esta-senha-agora";
  const adminName = process.env.ADMIN_NAME?.trim() || "Administrador";

  db.exec("BEGIN IMMEDIATE");
  try {
    const recheck = db.prepare("SELECT value FROM settings WHERE key = 'seeded'").get() as
      | { value: string }
      | undefined;
    if (recheck?.value === "1") {
      db.exec("COMMIT");
      return;
    }

    const insertSetting = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    for (const [key, value] of Object.entries(SITE_SETTINGS)) {
      insertSetting.run(key, value);
    }

    db.prepare(
      `INSERT INTO users (name, email, password_hash, role, bio)
       VALUES (?, ?, ?, 'admin', ?)`,
    ).run(
      adminName,
      adminEmail,
      hashPassword(adminPassword),
      "Leitor da Bíblia, editor do Palavra Viva. Escreve sobre fé, cultura e as pequenas decisões que formam uma vida.",
    );

    const insertTheme = db.prepare(
      `INSERT INTO themes (name, slug, description, mode, tokens, is_default)
       VALUES (?, ?, ?, ?, ?, ?)`,
    );
    THEME_PRESETS.forEach((preset) => {
      insertTheme.run(
        preset.name,
        preset.slug,
        preset.description,
        preset.mode,
        JSON.stringify(preset.tokens),
        preset.slug === SITE_SETTINGS.default_theme ? 1 : 0,
      );
    });

    const insertCategory = db.prepare(
      "INSERT INTO categories (name, slug, description, color, icon) VALUES (?, ?, ?, ?, ?)",
    );
    const categoryIds = new Map<string, number>();
    for (const category of DEMO_CATEGORIES) {
      const result = insertCategory.run(
        category.name,
        category.slug,
        category.description,
        category.color,
        category.icon,
      );
      categoryIds.set(category.slug, Number(result.lastInsertRowid));
    }

    const insertTag = db.prepare("INSERT OR IGNORE INTO tags (name, slug) VALUES (?, ?)");
    const getTag = db.prepare("SELECT id FROM tags WHERE slug = ?");
    const insertPost = db.prepare(
      `INSERT INTO posts
        (slug, title, subtitle, excerpt, content, category_id, author_id, status, featured,
         views, reading_minutes, seo_title, seo_description, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const insertPostTag = db.prepare("INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)");
    const postIds = new Map<string, number>();

    DEMO_POSTS.forEach((post) => {
      const status = post.status || "published";
      const createdAt = post.published_at ? post.published_at : daysAgo(2);
      const result = insertPost.run(
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
      );
      const postId = Number(result.lastInsertRowid);
      postIds.set(post.slug, postId);
      for (const tag of post.tags) {
        insertTag.run(tag, slugify(tag));
        const tagRow = getTag.get(slugify(tag)) as { id: number };
        insertPostTag.run(postId, tagRow.id);
      }
    });

    const insertComment = db.prepare(
      `INSERT INTO comments (post_id, name, email, content, status, ip, created_at)
       VALUES (?, ?, ?, ?, ?, '', ?)`,
    );
    for (const comment of DEMO_COMMENTS) {
      const postId = postIds.get(comment.post);
      if (!postId) continue;
      insertComment.run(
        postId,
        comment.name,
        comment.email,
        comment.content,
        comment.status,
        daysAgo(comment.daysAgo, 14),
      );
    }

    const insertLibrary = db.prepare(
      `INSERT INTO library_items
        (slug, title, subtitle, author, type, description, pages, featured, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    DEMO_LIBRARY.forEach((item, index) => {
      insertLibrary.run(
        item.slug,
        item.title,
        item.subtitle,
        item.author,
        item.type,
        item.description,
        item.pages,
        item.featured ? 1 : 0,
        daysAgo(20 + index * 9),
      );
    });

    const insertPlan = db.prepare(
      `INSERT INTO reading_plans (slug, title, description, days_count, featured)
       VALUES (?, ?, ?, ?, ?)`,
    );
    const insertPlanDay = db.prepare(
      `INSERT INTO reading_plan_days (plan_id, day, title, passage, reflection)
       VALUES (?, ?, ?, ?, ?)`,
    );
    for (const plan of DEMO_PLANS) {
      const result = insertPlan.run(plan.slug, plan.title, plan.description, plan.days.length, plan.featured ? 1 : 0);
      const planId = Number(result.lastInsertRowid);
      plan.days.forEach((day, index) => {
        insertPlanDay.run(planId, index + 1, day.title, day.passage, day.reflection);
      });
    }

    const insertVerse = db.prepare("INSERT INTO daily_verses (reference, text) VALUES (?, ?)");
    DEMO_DAILY_VERSES.forEach((verse) => insertVerse.run(verse.reference, verse.text));

    const insertSubscriber = db.prepare(
      "INSERT OR IGNORE INTO newsletter_subscribers (email, name, source, created_at) VALUES (?, ?, ?, ?)",
    );
    DEMO_SUBSCRIBERS.forEach((subscriber, index) => {
      insertSubscriber.run(subscriber.email, subscriber.name, subscriber.source, daysAgo(30 - index * 4));
    });

    const insertView = db.prepare(
      "INSERT OR REPLACE INTO post_views (post_id, day, count) VALUES (?, ?, ?)",
    );
    let postIndex = 0;
    for (const post of DEMO_POSTS) {
      if ((post.status || "published") !== "published") continue;
      const postId = postIds.get(post.slug);
      if (!postId) continue;
      postIndex += 1;
      for (let offset = 29; offset >= 0; offset -= 1) {
        const base = 12 + ((postIndex * 13 + offset * 7) % 38);
        const weekendBoost = [0, 6].includes(new Date(Date.now() - offset * 86400000).getUTCDay()) ? 9 : 0;
        insertView.run(postId, dayKey(offset), base + weekendBoost);
      }
    }

    db.prepare(
      "INSERT INTO audit_logs (user_id, action, entity, details) VALUES (1, 'system.seed', 'site', 'Instalação inicial concluída')",
    ).run();
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('seeded', '1')").run();

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
