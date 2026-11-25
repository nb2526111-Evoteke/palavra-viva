import { execute, insert, queryAll, queryOne } from "./db";
import { BIBLE_BOOKS } from "./bible-books";
import { escapeLike } from "./utils";
import type {
  AuditLog,
  BibleBook,
  BibleVerse,
  Category,
  Comment,
  ContactMessage,
  DailyMessage,
  GeneratedThemeRow,
  LibraryItem,
  MediaItem,
  Post,
  ReadingPlan,
  ReadingPlanDay,
  Subscriber,
  ThemeRow,
} from "./types";
import type { GeneratedThemeContent } from "./theme-generator";

const POST_SELECT = `
  SELECT p.*,
         c.name AS category_name,
         c.slug AS category_slug,
         c.color AS category_color,
         u.name AS author_name,
         (SELECT COUNT(*) FROM comments cm WHERE cm.post_id = p.id AND cm.status = 'approved') AS comment_count
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN users u ON u.id = p.author_id
`;

export async function publishDuePosts() {
  await execute(
    `UPDATE posts
        SET status = 'published', updated_at = datetime('now')
      WHERE status = 'scheduled'
        AND published_at IS NOT NULL
        AND datetime(published_at) <= datetime('now')`,
  );
}

/* ------------------------------------------------------------------ settings */

export async function getSettings() {
  const rows = await queryAll<{ key: string; value: string }>("SELECT key, value FROM settings");
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export async function getSetting(key: string, fallback = "") {
  const row = await queryOne<{ value: string }>("SELECT value FROM settings WHERE key = ?", [key]);
  return row?.value ?? fallback;
}

export async function setSettings(entries: Record<string, string>) {
  for (const [key, value] of Object.entries(entries)) {
    await execute("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", [
      key,
      value,
    ]);
  }
}

/* -------------------------------------------------------------------- themes */

export async function getThemes() {
  return await queryAll<ThemeRow>("SELECT * FROM themes ORDER BY is_default DESC, name ASC");
}

export async function getThemeBySlug(slug: string) {
  return await queryOne<ThemeRow>("SELECT * FROM themes WHERE slug = ?", [slug]);
}

export async function getDefaultTheme() {
  return (
    await queryOne<ThemeRow>("SELECT * FROM themes WHERE is_default = 1 LIMIT 1") ??
    await queryOne<ThemeRow>("SELECT * FROM themes ORDER BY id LIMIT 1")
  );
}

/* ---------------------------------------------------------------- categories */

export async function getSiteAuthor() {
  return await queryOne<{
    id: number;
    name: string;
    email: string;
    bio: string;
    avatar: string;
    role: string;
    created_at: string;
    last_login_at: string | null;
  }>(
    "SELECT id, name, email, bio, avatar, role, created_at, last_login_at FROM users ORDER BY id ASC LIMIT 1",
  );
}

export async function getCategories() {
  return await queryAll<Category>(
    `SELECT c.*,
            (SELECT COUNT(*) FROM posts p
              WHERE p.category_id = c.id
                AND p.status = 'published'
                AND datetime(p.published_at) <= datetime('now')) AS post_count
       FROM categories c
      ORDER BY c.name ASC`,
  );
}

export async function getCategoryBySlug(slug: string) {
  return await queryOne<Category>("SELECT * FROM categories WHERE slug = ?", [slug]);
}

export async function getCategoryById(id: number) {
  return await queryOne<Category>("SELECT * FROM categories WHERE id = ?", [id]);
}

/* --------------------------------------------------------------------- posts */

type PostQuery = {
  category?: string;
  search?: string;
  tag?: string;
  limit?: number;
  offset?: number;
  excludeId?: number;
  featured?: boolean;
};

function buildPostWhere(filters: PostQuery) {
  const clauses: string[] = ["p.status = 'published'", "datetime(p.published_at) <= datetime('now')"];
  const params: (string | number)[] = [];
  if (filters.category) {
    clauses.push("c.slug = ?");
    params.push(filters.category);
  }
  if (filters.tag) {
    clauses.push(
      "EXISTS (SELECT 1 FROM post_tags pt JOIN tags t ON t.id = pt.tag_id WHERE pt.post_id = p.id AND t.slug = ?)",
    );
    params.push(filters.tag);
  }
  if (filters.featured) {
    clauses.push("p.featured = 1");
  }
  if (filters.search) {
    const term = `%${escapeLike(filters.search)}%`;
    clauses.push(
      "(p.title LIKE ? ESCAPE '\\' OR p.excerpt LIKE ? ESCAPE '\\' OR p.content LIKE ? ESCAPE '\\')",
    );
    params.push(term, term, term);
  }
  if (filters.excludeId) {
    clauses.push("p.id <> ?");
    params.push(filters.excludeId);
  }
  return { where: clauses.join(" AND "), params };
}

export async function listPublishedPosts(filters: PostQuery = {}) {
  await publishDuePosts();
  const { where, params } = buildPostWhere(filters);
  const limit = filters.limit ?? 9;
  const offset = filters.offset ?? 0;
  return await queryAll<Post>(
    `${POST_SELECT} WHERE ${where} ORDER BY datetime(p.published_at) DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
}

export async function countPublishedPosts(filters: PostQuery = {}) {
  const { where, params } = buildPostWhere(filters);
  const row = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total
       FROM posts p
       LEFT JOIN categories c ON c.id = p.category_id
      WHERE ${where}`,
    params,
  );
  return row?.total ?? 0;
}

export async function getPostBySlug(slug: string) {
  await publishDuePosts();
  return await queryOne<Post>(
    `${POST_SELECT} WHERE p.slug = ? AND p.status = 'published' AND datetime(p.published_at) <= datetime('now')`,
    [slug],
  );
}

export async function getPostById(id: number) {
  return await queryOne<Post>(`${POST_SELECT} WHERE p.id = ?`, [id]);
}

export async function getFeaturedPosts(limit = 3, excludeId?: number) {
  return listPublishedPosts({ featured: true, limit, excludeId });
}

export async function getRelatedPosts(postId: number, categoryId: number | null, limit = 3) {
  if (categoryId) {
    const related = await queryAll<Post>(
      `${POST_SELECT}
        WHERE p.status = 'published' AND datetime(p.published_at) <= datetime('now')
          AND p.id <> ? AND p.category_id = ?
        ORDER BY p.views DESC LIMIT ?`,
      [postId, categoryId, limit],
    );
    if (related.length >= limit) return related;
    const extra = await queryAll<Post>(
      `${POST_SELECT}
        WHERE p.status = 'published' AND datetime(p.published_at) <= datetime('now')
          AND p.id <> ? AND p.category_id IS NOT ? 
          AND p.id NOT IN (${related.map(() => "?").join(",") || "0"})
        ORDER BY p.views DESC LIMIT ?`,
      [postId, categoryId, ...related.map((post) => post.id), limit - related.length],
    );
    return [...related, ...extra];
  }
  return await queryAll<Post>(
    `${POST_SELECT}
      WHERE p.status = 'published' AND datetime(p.published_at) <= datetime('now') AND p.id <> ?
      ORDER BY p.views DESC LIMIT ?`,
    [postId, limit],
  );
}

export async function getAdjacentPosts(publishedAt: string | null) {
  if (!publishedAt) return { previous: null, next: null };
  const previous = await queryOne<Post>(
    `${POST_SELECT}
      WHERE p.status = 'published' AND datetime(p.published_at) < datetime(?)
      ORDER BY datetime(p.published_at) DESC LIMIT 1`,
    [publishedAt],
  );
  const next = await queryOne<Post>(
    `${POST_SELECT}
      WHERE p.status = 'published' AND datetime(p.published_at) > datetime(?)
      ORDER BY datetime(p.published_at) ASC LIMIT 1`,
    [publishedAt],
  );
  return { previous, next };
}

export async function getPopularPosts(limit = 4) {
  return await queryAll<Post>(
    `${POST_SELECT}
      WHERE p.status = 'published' AND datetime(p.published_at) <= datetime('now')
      ORDER BY p.views DESC LIMIT ?`,
    [limit],
  );
}

export async function incrementPostViews(postId: number) {
  await execute("UPDATE posts SET views = views + 1 WHERE id = ?", [postId]);
  await execute(
    `INSERT INTO post_views (post_id, day, count) VALUES (?, date('now'), 1)
     ON CONFLICT(post_id, day) DO UPDATE SET count = count + 1`,
    [postId],
  );
}

export async function getPostTags(postId: number) {
  return await queryAll<{ id: number; name: string; slug: string }>(
    `SELECT t.id, t.name, t.slug FROM tags t
       JOIN post_tags pt ON pt.tag_id = t.id
      WHERE pt.post_id = ? ORDER BY t.name`,
    [postId],
  );
}

export async function getAllTags() {
  return await queryAll<{ id: number; name: string; slug: string; total: number }>(
    `SELECT t.id, t.name, t.slug, COUNT(pt.post_id) AS total
       FROM tags t LEFT JOIN post_tags pt ON pt.tag_id = t.id
      GROUP BY t.id ORDER BY t.name`,
  );
}

/* ------------------------------------------------------------------ comments */

export async function getApprovedComments(postId: number) {
  return await queryAll<Comment>(
    "SELECT * FROM comments WHERE post_id = ? AND status = 'approved' ORDER BY created_at ASC",
    [postId],
  );
}

export async function listComments(status?: string) {
  const params: string[] = [];
  let where = "";
  if (status && status !== "all") {
    where = "WHERE cm.status = ?";
    params.push(status);
  }
  return await queryAll<Comment>(
    `SELECT cm.*, p.title AS post_title, p.slug AS post_slug
       FROM comments cm JOIN posts p ON p.id = cm.post_id
       ${where}
      ORDER BY cm.created_at DESC LIMIT 200`,
    params,
  );
}

export async function countComments(status: string) {
  const row = await queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM comments WHERE status = ?", [status]);
  return row?.total ?? 0;
}

/* ------------------------------------------------------------------- library */

export async function getLibraryItems(type?: string) {
  if (type && type !== "all") {
    return await queryAll<LibraryItem>(
      "SELECT * FROM library_items WHERE type = ? ORDER BY featured DESC, datetime(published_at) DESC",
      [type],
    );
  }
  return await queryAll<LibraryItem>("SELECT * FROM library_items ORDER BY featured DESC, datetime(published_at) DESC");
}

export async function getLibraryItem(slug: string) {
  return await queryOne<LibraryItem>("SELECT * FROM library_items WHERE slug = ?", [slug]);
}

export async function getLibraryItemById(id: number) {
  return await queryOne<LibraryItem>("SELECT * FROM library_items WHERE id = ?", [id]);
}

export async function getReadingPlans() {
  return await queryAll<ReadingPlan>("SELECT * FROM reading_plans ORDER BY featured DESC, id ASC");
}

export async function getReadingPlan(slug: string) {
  return await queryOne<ReadingPlan>("SELECT * FROM reading_plans WHERE slug = ?", [slug]);
}

export async function getReadingPlanById(id: number) {
  return await queryOne<ReadingPlan>("SELECT * FROM reading_plans WHERE id = ?", [id]);
}

export async function getReadingPlanDays(planId: number) {
  return await queryAll<ReadingPlanDay>("SELECT * FROM reading_plan_days WHERE plan_id = ? ORDER BY day ASC", [planId]);
}

/* --------------------------------------------------------- generated themes */

export async function getGeneratedThemeByLibraryItem(itemId: number) {
  const row = await queryOne<{ content: string }>(
    "SELECT content FROM generated_themes WHERE library_item_id = ? ORDER BY id DESC LIMIT 1",
    [itemId],
  );
  if (!row) return null;
  try {
    return JSON.parse(row.content) as GeneratedThemeContent;
  } catch {
    return null;
  }
}

export async function getGeneratedThemeById(id: number) {
  const row = await queryOne<GeneratedThemeRow>(
    `SELECT gt.*, li.slug AS library_slug, li.title AS library_title
       FROM generated_themes gt
       JOIN library_items li ON li.id = gt.library_item_id
      WHERE gt.id = ? LIMIT 1`,
    [id],
  );
  if (!row) return null;
  let parsed: GeneratedThemeContent | null = null;
  try {
    parsed = JSON.parse(row.content) as GeneratedThemeContent;
  } catch {
    parsed = null;
  }
  return { ...row, parsed };
}

export async function getGeneratedThemes() {
  return await queryAll<GeneratedThemeRow>(
    `SELECT gt.*, li.slug AS library_slug, li.title AS library_title
       FROM generated_themes gt
       JOIN library_items li ON li.id = gt.library_item_id
      ORDER BY datetime(gt.created_at) DESC, gt.id DESC
      LIMIT 30`,
  );
}

export async function getDailyMessage() {
  return await queryOne<DailyMessage>(
    `SELECT dm.*, li.slug AS library_slug, li.title AS library_title
       FROM daily_messages dm
       LEFT JOIN generated_themes gt ON gt.id = dm.theme_id
       LEFT JOIN library_items li ON li.id = gt.library_item_id
      ORDER BY dm.day DESC, dm.id DESC
      LIMIT 1`,
  );
}

/* --------------------------------------------------------------------- bible */

export async function getBibleBooks() {
  const rows = await queryAll<BibleBook>("SELECT * FROM bible_books ORDER BY position ASC");
  return rows.length > 0 ? rows : BIBLE_BOOKS;
}

export async function getBibleBookBySlug(slug: string) {
  return (
    await queryOne<BibleBook>("SELECT * FROM bible_books WHERE slug = ?", [slug]) ??
    BIBLE_BOOKS.find((book) => book.slug === slug) ??
    null
  );
}

export async function getChapterVerses(bookId: number, chapter: number) {
  return await queryAll<BibleVerse>(
    "SELECT * FROM bible_verses WHERE book_id = ? AND chapter = ? ORDER BY verse ASC",
    [bookId, chapter],
  );
}

export async function searchBibleVerses(term: string, limit = 40) {
  const normalized = term
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return await queryAll<BibleVerse>(
    `SELECT v.*, b.name AS book_name, b.slug AS book_slug, b.abbrev
       FROM bible_verses v JOIN bible_books b ON b.id = v.book_id
      WHERE v.search_text LIKE ? ESCAPE '\\'
      ORDER BY b.position, v.chapter, v.verse
      LIMIT ?`,
    [`%${escapeLike(normalized)}%`, limit],
  );
}

export async function getBibleStats() {
  return await queryOne<{ verses: number; books: number }>(
    `SELECT (SELECT COUNT(*) FROM bible_verses) AS verses,
            (SELECT COUNT(*) FROM bible_books) AS books`,
  ) ?? { verses: 0, books: 0 };
}

export async function getBibleBookStats() {
  return await queryAll<{ id: number; name: string; slug: string; testament: string; chapters: number; verses: number }>(
    `SELECT b.id, b.name, b.slug, b.testament, b.chapters,
            COUNT(v.id) AS verses
       FROM bible_books b
       LEFT JOIN bible_verses v ON v.book_id = b.id
      GROUP BY b.id
      ORDER BY b.position`,
  );
}

export async function getChapterCount() {
  const row = await queryOne<{ total: number }>("SELECT COUNT(DISTINCT book_id || '-' || chapter) AS total FROM bible_verses");
  return row?.total ?? 0;
}

export async function getDailyVerse() {
  const verses = await queryAll<{ id: number; reference: string; text: string }>(
    "SELECT id, reference, text FROM daily_verses ORDER BY id",
  );
  if (verses.length === 0) {
    return {
      id: 0,
      reference: "Salmos 119:105",
      text: "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.",
    };
  }
  const day = Math.floor(Date.now() / 86_400_000);
  return verses[day % verses.length];
}

export async function getDailyVerses() {
  return await queryAll<{ id: number; reference: string; text: string }>(
    "SELECT id, reference, text FROM daily_verses ORDER BY id",
  );
}

export async function getDailyVerseById(id: number) {
  return await queryOne<{ id: number; reference: string; text: string }>(
    "SELECT id, reference, text FROM daily_verses WHERE id = ?",
    [id],
  );
}

/* ------------------------------------------------------------------ newsletter */

export async function getSubscribers() {
  return await queryAll<Subscriber>("SELECT * FROM newsletter_subscribers ORDER BY created_at DESC");
}

export async function countSubscribers() {
  const row = await queryOne<{ total: number }>(
    "SELECT COUNT(*) AS total FROM newsletter_subscribers WHERE status = 'active'",
  );
  return row?.total ?? 0;
}

/* ----------------------------------------------------------------------- media */

export async function getMedia() {
  return await queryAll<MediaItem>("SELECT * FROM media ORDER BY created_at DESC LIMIT 200");
}

/* --------------------------------------------------------------------- audit */

export async function getAuditLogs(limit = 60) {
  return await queryAll<AuditLog>(
    `SELECT a.*, u.name AS user_name FROM audit_logs a
       LEFT JOIN users u ON u.id = a.user_id
      ORDER BY a.created_at DESC LIMIT ?`,
    [limit],
  );
}

export async function logAudit(entry: {
  userId?: number | null;
  action: string;
  entity?: string;
  entityId?: string | number;
  details?: string;
  ip?: string;
}) {
  await insert(
    "INSERT INTO audit_logs (user_id, action, entity, entity_id, details, ip) VALUES (?, ?, ?, ?, ?, ?)",
    [
      entry.userId ?? null,
      entry.action,
      entry.entity ?? "",
      entry.entityId ? String(entry.entityId) : "",
      entry.details ?? "",
      entry.ip ?? "",
    ],
  );
}

/* ------------------------------------------------------------------ contacts */

export async function getContactMessages() {
  return await queryAll<ContactMessage>("SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 200");
}

/* ------------------------------------------------------------------- search */

export async function searchSite(term: string, limit = 10) {
  const normalized = term.trim();
  if (normalized.length < 2) return { posts: [] as Post[], verses: [] as BibleVerse[] };
  return {
    posts: await listPublishedPosts({ search: normalized, limit }),
    verses: await searchBibleVerses(normalized, limit),
  };
}

/* ----------------------------------------------------------------- dashboard */

export async function getDashboardStats() {
  const stats = await queryOne<{
    published: number;
    drafts: number;
    scheduled: number;
    total_posts: number;
    total_views: number;
    pending_comments: number;
    approved_comments: number;
    subscribers: number;
    library_items: number;
    verses: number;
    media: number;
    messages: number;
    plans: number;
  }>(
    `SELECT
      (SELECT COUNT(*) FROM posts WHERE status = 'published') AS published,
      (SELECT COUNT(*) FROM posts WHERE status = 'draft') AS drafts,
      (SELECT COUNT(*) FROM posts WHERE status = 'scheduled') AS scheduled,
      (SELECT COUNT(*) FROM posts) AS total_posts,
      (SELECT COALESCE(SUM(views), 0) FROM posts) AS total_views,
      (SELECT COUNT(*) FROM comments WHERE status = 'pending') AS pending_comments,
      (SELECT COUNT(*) FROM comments WHERE status = 'approved') AS approved_comments,
      (SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active') AS subscribers,
      (SELECT COUNT(*) FROM library_items) AS library_items,
      (SELECT COUNT(*) FROM bible_verses) AS verses,
      (SELECT COUNT(*) FROM media) AS media,
      (SELECT COUNT(*) FROM contact_messages WHERE status = 'new') AS messages,
      (SELECT COUNT(*) FROM reading_plans) AS plans`,
  );
  return (
    stats ?? {
      published: 0,
      drafts: 0,
      scheduled: 0,
      total_posts: 0,
      total_views: 0,
      pending_comments: 0,
      approved_comments: 0,
      subscribers: 0,
      library_items: 0,
      verses: 0,
      media: 0,
      messages: 0,
      plans: 0,
    }
  );
}

export async function getViewsSeries(days = 14) {
  const rows = await queryAll<{ day: string; total: number }>(
    `SELECT day, SUM(count) AS total FROM post_views
      WHERE day >= date('now', ?) GROUP BY day ORDER BY day ASC`,
    [`-${days - 1} days`],
  );
  const map = new Map(rows.map((row) => [row.day, row.total]));
  const series: { day: string; total: number }[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - offset);
    const key = date.toISOString().slice(0, 10);
    series.push({ day: key, total: map.get(key) ?? 0 });
  }
  return series;
}

export async function getTopPosts(limit = 5) {
  return await queryAll<{ id: number; title: string; slug: string; views: number }>(
    "SELECT id, title, slug, views FROM posts WHERE status = 'published' ORDER BY views DESC LIMIT ?",
    [limit],
  );
}

export async function getAdminPosts(filters: { status?: string; search?: string; limit?: number; offset?: number } = {}) {
  const clauses: string[] = [];
  const params: (string | number)[] = [];
  if (filters.status && filters.status !== "all") {
    clauses.push("p.status = ?");
    params.push(filters.status);
  }
  if (filters.search) {
    clauses.push("(p.title LIKE ? ESCAPE '\\' OR p.slug LIKE ? ESCAPE '\\')");
    const term = `%${escapeLike(filters.search)}%`;
    params.push(term, term);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const limit = filters.limit ?? 50;
  const offset = filters.offset ?? 0;
  return await queryAll<Post>(
    `${POST_SELECT} ${where} ORDER BY COALESCE(p.published_at, p.created_at) DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );
}

export async function getAdminPostCount(filters: { status?: string; search?: string } = {}) {
  const clauses: string[] = [];
  const params: (string | number)[] = [];
  if (filters.status && filters.status !== "all") {
    clauses.push("status = ?");
    params.push(filters.status);
  }
  if (filters.search) {
    clauses.push("(title LIKE ? ESCAPE '\\' OR slug LIKE ? ESCAPE '\\')");
    const term = `%${escapeLike(filters.search)}%`;
    params.push(term, term);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const row = await queryOne<{ total: number }>(`SELECT COUNT(*) AS total FROM posts ${where}`, params);
  return row?.total ?? 0;
}
