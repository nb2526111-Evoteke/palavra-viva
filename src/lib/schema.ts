export const SCHEMA_SQL = /* sql */ `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin',
  bio           TEXT NOT NULL DEFAULT '',
  avatar        TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  ip         TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

CREATE TABLE IF NOT EXISTS categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  color       TEXT NOT NULL DEFAULT '#a4552f',
  icon        TEXT NOT NULL DEFAULT 'book-open',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS posts (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  subtitle        TEXT NOT NULL DEFAULT '',
  excerpt         TEXT NOT NULL DEFAULT '',
  content         TEXT NOT NULL DEFAULT '',
  cover_image     TEXT NOT NULL DEFAULT '',
  category_id     INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  author_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status          TEXT NOT NULL DEFAULT 'draft',
  featured        INTEGER NOT NULL DEFAULT 0,
  views           INTEGER NOT NULL DEFAULT 0,
  reading_minutes INTEGER NOT NULL DEFAULT 1,
  seo_title       TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  published_at    TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);

CREATE TABLE IF NOT EXISTS tags (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL DEFAULT '',
  content    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending',
  ip         TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, status);

CREATE TABLE IF NOT EXISTS library_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  subtitle     TEXT NOT NULL DEFAULT '',
  author       TEXT NOT NULL DEFAULT '',
  type         TEXT NOT NULL DEFAULT 'ebook',
  description  TEXT NOT NULL DEFAULT '',
  cover_image  TEXT NOT NULL DEFAULT '',
  file_url     TEXT NOT NULL DEFAULT '',
  external_url TEXT NOT NULL DEFAULT '',
  pages        INTEGER NOT NULL DEFAULT 0,
  featured     INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reading_plans (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  days_count  INTEGER NOT NULL DEFAULT 7,
  cover_image TEXT NOT NULL DEFAULT '',
  featured    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reading_plan_days (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_id    INTEGER NOT NULL REFERENCES reading_plans(id) ON DELETE CASCADE,
  day        INTEGER NOT NULL,
  title      TEXT NOT NULL,
  passage    TEXT NOT NULL DEFAULT '',
  reflection TEXT NOT NULL DEFAULT '',
  UNIQUE (plan_id, day)
);

CREATE TABLE IF NOT EXISTS bible_books (
  id        INTEGER PRIMARY KEY,
  name      TEXT NOT NULL,
  slug      TEXT NOT NULL UNIQUE,
  abbrev    TEXT NOT NULL,
  testament TEXT NOT NULL,
  position  INTEGER NOT NULL,
  chapters  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS bible_verses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id     INTEGER NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
  chapter     INTEGER NOT NULL,
  verse       INTEGER NOT NULL,
  text        TEXT NOT NULL,
  search_text TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_verse_ref ON bible_verses(book_id, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_verse_text ON bible_verses(text);

CREATE TABLE IF NOT EXISTS daily_verses (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  reference  TEXT NOT NULL,
  text       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS generated_themes (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  library_item_id INTEGER NOT NULL REFERENCES library_items(id) ON DELETE CASCADE,
  theme_slug      TEXT NOT NULL,
  narrative_slug  TEXT NOT NULL,
  emphasis        TEXT NOT NULL DEFAULT 'ambos',
  audience        TEXT NOT NULL DEFAULT '',
  content         TEXT NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_generated_themes_item ON generated_themes(library_item_id);

CREATE TABLE IF NOT EXISTS daily_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  day        TEXT NOT NULL UNIQUE,
  title      TEXT NOT NULL,
  reference  TEXT NOT NULL,
  verse_text TEXT NOT NULL,
  body       TEXT NOT NULL,
  practice   TEXT NOT NULL DEFAULT '',
  prayer     TEXT NOT NULL DEFAULT '',
  theme_id   INTEGER REFERENCES generated_themes(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_daily_messages_day ON daily_messages(day DESC);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name       TEXT NOT NULL DEFAULT '',
  status     TEXT NOT NULL DEFAULT 'active',
  source     TEXT NOT NULL DEFAULT 'site',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  filename      TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  mime          TEXT NOT NULL,
  size          INTEGER NOT NULL,
  alt           TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS themes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  mode        TEXT NOT NULL DEFAULT 'light',
  tokens      TEXT NOT NULL,
  is_default  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS post_views (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  day     TEXT NOT NULL,
  count   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (post_id, day)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  entity     TEXT NOT NULL DEFAULT '',
  entity_id  TEXT NOT NULL DEFAULT '',
  details    TEXT NOT NULL DEFAULT '',
  ip         TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
`;
