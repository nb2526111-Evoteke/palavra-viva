import fs from "node:fs";
import path from "node:path";
import { getDb } from "../src/lib/db";
import { renderMarkdown } from "../src/lib/markdown";

type PostRow = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published_at: string | null;
  reading_minutes: number;
  category_name: string | null;
  category_slug: string | null;
  author_name: string | null;
};

type TagRow = { name: string; slug: string };

const portalDir = process.env.PORTAL_DIR || path.resolve(process.cwd(), "..", "portal-palavra-viva");
const blogDir = path.join(portalDir, "blog");
const imageDir = path.join(portalDir, "assets", "images", "temas");

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripMarkdown(value: string) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDate(value: string | null) {
  if (!value) return null;
  const normalized = value.includes("T")
    ? value.endsWith("Z")
      ? value
      : `${value}Z`
    : `${value.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: string | null) {
  const date = parseDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

function imageFor(post: PostRow, prefix: string) {
  const fallback = post.category_slug ? `/images/temas/${post.category_slug}.jpg` : "";
  const raw = post.cover_image || fallback || "/images/temas/estudos-biblicos.jpg";
  const candidate = raw.startsWith("/images/") ? raw : "/images/temas/estudos-biblicos.jpg";
  const file = path.join(portalDir, "assets", candidate.replace(/^\//, ""));
  const safe = fs.existsSync(file) ? candidate : "/images/temas/estudos-biblicos.jpg";
  return `${prefix}assets/${safe.replace(/^\//, "")}`;
}

function tagsFor(postId: number) {
  return getDb()
    .prepare(
      `SELECT t.name, t.slug FROM tags t
        JOIN post_tags pt ON pt.tag_id = t.id
       WHERE pt.post_id = ? ORDER BY t.name`,
    )
    .all(postId) as TagRow[];
}

function rewriteLinks(html: string, knownSlugs: Set<string>) {
  return html
    .replace(/href="\/blog\/([^"#?]+)[^"]*"/g, (_match, slug: string) =>
      `href="${knownSlugs.has(slug) ? `${slug}.html` : "index.html"}"`,
    )
    .replace(/href="\/(biblia|biblioteca)[^"]*"/g, 'href="https://github.com/nb2526111-Evoteke/palavra-viva"')
    .replace(/href="\/"/g, 'href="../index.html"')
    .replace(/src="\/images\//g, 'src="../assets/images/')
    .replace(/href="\/images\//g, 'href="../assets/images/');
}

function header(prefix: string, current: "blog" | "article" = "blog") {
  return `
    <header class="site-header">
      <div class="shell nav">
        <a class="brand" href="${prefix}index.html">
          <span class="brand-mark">PV</span>
          <span>
            <span class="brand-name">Palavra Viva</span>
            <span class="brand-sub">Blog · Rinaldo</span>
          </span>
        </a>
        <button class="menu-toggle" type="button" data-menu-toggle aria-label="Abrir menu" aria-expanded="false">
          <span></span>
        </button>
        <ul class="nav-links" data-nav>
          <li><a href="${prefix}index.html">Início</a></li>
          <li><a href="${prefix}portfolio.html">Portfólio</a></li>
          <li><a href="index.html" ${current === "blog" ? 'aria-current="page"' : ""}>Blog</a></li>
          <li><a href="${prefix}projetos.html">Projetos</a></li>
          <li><a href="${prefix}index.html#contato">Contato</a></li>
        </ul>
        <a class="nav-cta" href="https://github.com/nb2526111-Evoteke/palavra-viva" target="_blank" rel="noopener">GitHub</a>
      </div>
    </header>`;
}

function footer(prefix: string) {
  return `
    <footer class="site-footer">
      <div class="shell">
        <div class="footer-grid">
          <a class="brand" href="${prefix}index.html">
            <span class="brand-mark">PV</span>
            <span>
              <span class="brand-name">Palavra Viva</span>
              <span class="brand-sub">Blog · Rinaldo</span>
            </span>
          </a>
          <div class="footer-links">
            <a href="${prefix}index.html">Início</a>
            <a href="${prefix}portfolio.html">Portfólio</a>
            <a href="${prefix}projetos.html">Projetos</a>
            <a href="https://github.com/nb2526111-Evoteke/palavra-viva" target="_blank" rel="noopener">Repositório</a>
          </div>
        </div>
        <p class="footer-note">
          © <span data-year>2026</span> Palavra Viva. Bíblia Livre (BLIVRE), CC BY 4.0 BR.
          Prévia estática do blog; o app completo está no GitHub Codespaces.
        </p>
      </div>
    </footer>
    <script src="${prefix}assets/app.js"></script>`;
}

function postCard(post: PostRow, prefix: string, index: number) {
  return `
    <article class="post-card reveal" data-category="${escapeHtml(post.category_slug || "outros")}">
      <div class="post-media">
        <img src="${imageFor(post, prefix)}" alt="${escapeHtml(post.title)}" loading="${index < 3 ? "eager" : "lazy"}" />
      </div>
      <div class="post-body">
        <div class="post-meta">
          <span class="cat">${escapeHtml(post.category_name || "Blog")}</span>
          <span>·</span>
          <span>${escapeHtml(formatDate(post.published_at))}</span>
        </div>
        <h3><a href="${post.slug}.html">${escapeHtml(post.title)}</a></h3>
        <p>${escapeHtml(post.excerpt || stripMarkdown(post.content).slice(0, 150))}</p>
      </div>
    </article>`;
}

function articlePage(post: PostRow, knownSlugs: Set<string>) {
  const tags = tagsFor(post.id);
  const content = rewriteLinks(renderMarkdown(post.content), knownSlugs);
  const cover = imageFor(post, "../");
  const url = `https://nb2526111-evoteke.github.io/blog/${post.slug}.html`;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    author: { "@type": "Person", name: post.author_name || "Rinaldo" },
    publisher: { "@type": "Organization", name: "Palavra Viva" },
    mainEntityOfPage: url,
  }).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(post.title)} — Palavra Viva</title>
    <meta name="description" content="${escapeHtml(post.excerpt)}" />
    <meta name="theme-color" content="#f7f1e7" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(post.title)}" />
    <meta property="og:description" content="${escapeHtml(post.excerpt)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="https://nb2526111-evoteke.github.io/${cover.replace(/^\.\.\//, "")}" />
    <link rel="icon" href="../assets/favicon-pv.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../assets/style.css" />
    <script type="application/ld+json">${jsonLd}</script>
  </head>
  <body>
    ${header("../")}
    <main>
      <article class="article shell">
        <a class="back-link" href="index.html">← Voltar ao blog</a>
        <header class="article-header">
          <div class="post-meta" style="justify-content: center">
            <span class="cat">${escapeHtml(post.category_name || "Blog")}</span>
            <span>·</span>
            <span>${escapeHtml(formatDate(post.published_at))}</span>
            <span>·</span>
            <span>${post.reading_minutes} min de leitura</span>
          </div>
          <h1>${escapeHtml(post.title)}</h1>
          ${post.subtitle ? `<p class="subtitle">${escapeHtml(post.subtitle)}</p>` : ""}
          <div class="article-meta">
            <span>Por ${escapeHtml(post.author_name || "Rinaldo")}</span>
          </div>
        </header>
        <div class="article-cover">
          <img src="${cover}" alt="${escapeHtml(post.title)}" />
        </div>
        <div class="article-body">
          <div class="prose">${content}</div>
          <footer class="article-footer">
            ${tags.length > 0 ? `<div class="tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag.name)}</span>`).join("")}</div>` : ""}
            <div class="article-cta">
              <strong>Este é um artigo da prévia estática do Palavra Viva.</strong>
              Para ler a Bíblia completa, usar a biblioteca e acessar o painel administrativo,
              abra o app completo no GitHub Codespaces:
              <a href="https://codespaces.new/nb2526111-Evoteke/palavra-viva" target="_blank" rel="noopener">abrir o Palavra Viva</a>.
            </div>
          </footer>
        </div>
      </article>
    </main>
    ${footer("../")}
  </body>
</html>`;
}

function blogIndex(posts: PostRow[]) {
  const featured = posts[0];
  const rest = posts.slice(1);
  const categories = Array.from(
    new Map(posts.map((post) => [post.category_slug || "outros", post.category_name || "Blog"])).entries(),
  );

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Blog — Palavra Viva</title>
    <meta name="description" content="Leituras bíblicas, devocionais e estudos do Palavra Viva. Uma prévia pública do blog." />
    <meta name="theme-color" content="#f7f1e7" />
    <link rel="canonical" href="https://nb2526111-evoteke.github.io/blog/" />
    <link rel="icon" href="../assets/favicon-pv.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../assets/style.css" />
  </head>
  <body>
    ${header("../", "blog")}
    <section class="blog-hero">
      <div class="shell">
        <p class="eyebrow">Palavra Viva · Blog</p>
        <h1>Leituras para a vida real.</h1>
        <p>
          Devocionais, estudos bíblicos e reflexões que aproximam as Escrituras do cotidiano.
          Esta é uma prévia pública; o app completo tem Bíblia interativa, biblioteca, planos e
          painel administrativo.
        </p>
        <div class="blog-note">
          <span><strong>Versão completa:</strong> Bíblia, biblioteca, planos e painel.</span>
          <a class="btn-text" href="https://codespaces.new/nb2526111-Evoteke/palavra-viva" target="_blank" rel="noopener">Abrir no Codespaces</a>
        </div>
        <div class="filters">
          <button class="filter is-active" type="button" data-filter="todos">Todos</button>
          ${categories
            .map(
              ([slug, name]) =>
                `<button class="filter" type="button" data-filter="${escapeHtml(slug)}">${escapeHtml(name)}</button>`,
            )
            .join("")}
        </div>
      </div>
    </section>

    <main class="section" style="padding-top: 34px">
      <div class="shell">
        ${
          featured
            ? `<article class="featured reveal">
                <div class="featured-media">
                  <img src="${imageFor(featured, "../")}" alt="${escapeHtml(featured.title)}" />
                </div>
                <div class="featured-body">
                  <div class="post-meta">
                    <span class="cat">${escapeHtml(featured.category_name || "Blog")}</span>
                    <span>·</span>
                    <span>${escapeHtml(formatDate(featured.published_at))}</span>
                  </div>
                  <h2>${escapeHtml(featured.title)}</h2>
                  <p>${escapeHtml(featured.excerpt || stripMarkdown(featured.content).slice(0, 190))}</p>
                  <a class="btn-text" href="${featured.slug}.html">Ler o artigo</a>
                </div>
              </article>`
            : ""
        }
        <div class="posts" id="artigos">
          ${rest.map((post) => postCard(post, "../", 1)).join("")}
        </div>
      </div>
    </main>
    ${footer("../")}
  </body>
</html>`;
}

function homeCards(posts: PostRow[]) {
  return posts
    .slice(0, 3)
    .map(
      (post) => `
            <article class="post-card">
              <div class="post-media">
                <img src="${imageFor(post, "")}" alt="${escapeHtml(post.title)}" loading="lazy" />
              </div>
              <div class="post-body">
                <div class="post-meta"><span class="cat">${escapeHtml(post.category_name || "Blog")}</span></div>
                <h3><a href="blog/${post.slug}.html">${escapeHtml(post.title)}</a></h3>
                <p>${escapeHtml(post.excerpt || stripMarkdown(post.content).slice(0, 130))}</p>
              </div>
            </article>`,
    )
    .join("");
}

function sitemap(posts: PostRow[]) {
  const base = "https://nb2526111-evoteke.github.io";
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    `${base}/`,
    `${base}/portfolio.html`,
    `${base}/projetos.html`,
    `${base}/blog/`,
    ...posts.map((post) => `${base}/blog/${post.slug}.html`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
}

function main() {
  fs.mkdirSync(blogDir, { recursive: true });
  fs.mkdirSync(imageDir, { recursive: true });

  const sourceImages = path.join(process.cwd(), "public", "images", "temas");
  if (fs.existsSync(sourceImages)) {
    for (const file of fs.readdirSync(sourceImages)) {
      fs.copyFileSync(path.join(sourceImages, file), path.join(imageDir, file));
    }
  }

  const db = getDb();
  const posts = db
    .prepare(
      `SELECT p.id, p.slug, p.title, p.subtitle, p.excerpt, p.content, p.cover_image,
              p.published_at, p.reading_minutes,
              c.name AS category_name, c.slug AS category_slug,
              u.name AS author_name
         FROM posts p
         LEFT JOIN categories c ON c.id = p.category_id
         LEFT JOIN users u ON u.id = p.author_id
        WHERE p.status = 'published'
          AND p.published_at IS NOT NULL
          AND datetime(p.published_at) <= datetime('now')
        ORDER BY datetime(p.published_at) DESC`,
    )
    .all() as PostRow[];

  const knownSlugs = new Set(posts.map((post) => post.slug));

  for (const post of posts) {
    fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), articlePage(post, knownSlugs), "utf8");
  }

  fs.writeFileSync(path.join(blogDir, "index.html"), blogIndex(posts), "utf8");

  const homePath = path.join(portalDir, "index.html");
  const home = fs.readFileSync(homePath, "utf8");
  const updatedHome = home.replace(
    /<!-- LATEST_POSTS_START -->[\s\S]*?<!-- LATEST_POSTS_END -->/,
    `<!-- LATEST_POSTS_START -->${homeCards(posts)}<!-- LATEST_POSTS_END -->`,
  );
  fs.writeFileSync(homePath, updatedHome, "utf8");

  fs.writeFileSync(path.join(portalDir, "sitemap.xml"), sitemap(posts), "utf8");
  fs.writeFileSync(
    path.join(portalDir, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: https://nb2526111-evoteke.github.io/sitemap.xml\n`,
    "utf8",
  );
  fs.writeFileSync(path.join(portalDir, ".nojekyll"), "", "utf8");

  console.log(`Portal atualizado em ${portalDir}`);
  console.log(`${posts.length} artigos publicados exportados.`);
}

main();
