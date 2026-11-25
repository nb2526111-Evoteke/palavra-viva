export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  created_at: string;
  post_count?: number;
};

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  role: string;
  created_at: string;
  last_login_at: string | null;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category_id: number | null;
  author_id: number | null;
  status: "draft" | "published" | "scheduled";
  featured: number;
  views: number;
  reading_minutes: number;
  seo_title: string;
  seo_description: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category_name?: string | null;
  category_slug?: string | null;
  category_color?: string | null;
  author_name?: string | null;
  comment_count?: number;
};

export type Comment = {
  id: number;
  post_id: number;
  name: string;
  email: string;
  content: string;
  status: "pending" | "approved" | "spam";
  ip: string;
  created_at: string;
  post_title?: string;
  post_slug?: string;
};

export type LibraryItem = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  type: "ebook" | "devocional" | "estudo" | "podcast";
  description: string;
  cover_image: string;
  file_url: string;
  external_url: string;
  pages: number;
  featured: number;
  published_at: string | null;
  created_at: string;
};

export type ReadingPlan = {
  id: number;
  slug: string;
  title: string;
  description: string;
  days_count: number;
  cover_image: string;
  featured: number;
  created_at: string;
};

export type GeneratedThemeRow = {
  id: number;
  library_item_id: number;
  theme_slug: string;
  narrative_slug: string;
  emphasis: string;
  audience: string;
  content: string;
  created_at: string;
  library_slug?: string;
  library_title?: string;
};

export type DailyMessage = {
  id: number;
  day: string;
  title: string;
  reference: string;
  verse_text: string;
  body: string;
  practice: string;
  prayer: string;
  theme_id: number | null;
  created_at: string;
  library_slug?: string | null;
  library_title?: string | null;
};

export type ReadingPlanDay = {
  id: number;
  plan_id: number;
  day: number;
  title: string;
  passage: string;
  reflection: string;
};

export type BibleBook = {
  id: number;
  name: string;
  slug: string;
  abbrev: string;
  testament: "AT" | "NT";
  position: number;
  chapters: number;
};

export type BibleVerse = {
  id: number;
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
  book_name?: string;
  book_slug?: string;
  abbrev?: string;
};

export type ThemeRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  mode: "light" | "dark";
  tokens: string;
  is_default: number;
  created_at: string;
};

export type MediaItem = {
  id: number;
  filename: string;
  original_name: string;
  mime: string;
  size: number;
  alt: string;
  created_at: string;
};

export type Subscriber = {
  id: number;
  email: string;
  name: string;
  status: string;
  source: string;
  created_at: string;
};

export type AuditLog = {
  id: number;
  user_id: number | null;
  action: string;
  entity: string;
  entity_id: string;
  details: string;
  ip: string;
  created_at: string;
  user_name?: string | null;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};
