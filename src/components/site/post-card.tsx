import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { CoverArt } from "./cover-art";
import { cn, formatDate } from "@/lib/utils";
import { categoryImage } from "@/lib/visuals";
import type { Post } from "@/lib/types";

function Cover({ post, className }: { post: Post; className?: string }) {
  const image = post.cover_image || categoryImage(post.category_slug);
  if (image) {
    return (
      <img
        src={image}
        alt=""
        loading="lazy"
        className={cn("h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]", className)}
      />
    );
  }
  return (
    <div className={cn("h-full w-full transition-transform duration-700 group-hover:scale-[1.02]", className)}>
      <CoverArt seed={post.slug} label={post.category_name} />
    </div>
  );
}

export function PostCard({
  post,
  variant = "default",
  className,
}: {
  post: Post;
  variant?: "default" | "wide" | "compact";
  className?: string;
}) {
  const href = `/blog/${post.slug}`;

  if (variant === "compact") {
    return (
      <article className={cn("group flex items-start gap-4", className)}>
        <Link
          href={href}
          className="relative aspect-square w-[76px] shrink-0 overflow-hidden rounded-xl border border-line"
          aria-label={post.title}
        >
          <Cover post={post} />
        </Link>
        <div className="min-w-0 pt-0.5">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em]" style={{ color: post.category_color || "var(--accent)" }}>
            {post.category_name}
          </p>
          <h3 className="mt-1 font-serif text-[15px] font-semibold leading-snug text-heading">
            <Link href={href} className="transition-colors hover:text-accent">
              {post.title}
            </Link>
          </h3>
          <p className="mt-1.5 text-[10.5px] text-muted">
            {formatDate(post.published_at)} · {post.reading_minutes} min
          </p>
        </div>
      </article>
    );
  }

  if (variant === "wide") {
    return (
      <article className={cn("card card-hover group grid overflow-hidden md:grid-cols-[1.05fr_1fr]", className)}>
        <Link href={href} className="relative min-h-[230px] overflow-hidden md:min-h-[320px]" aria-label={post.title}>
          <Cover post={post} />
        </Link>
        <div className="flex flex-col justify-center p-7 md:p-9">
          <div className="flex flex-wrap items-center gap-2.5 text-[10.5px] text-muted">
            <span
              className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.14em]"
              style={{ color: post.category_color || "var(--accent)" }}
            >
              <span className="size-1.5 rounded-full" style={{ background: post.category_color || "var(--accent)" }} />
              {post.category_name}
            </span>
            <span className="size-1 rounded-full bg-line" />
            <span>{formatDate(post.published_at)}</span>
          </div>
          <h3 className="mt-3 font-serif text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-[1.15] text-heading">
            <Link href={href} className="transition-colors hover:text-accent">
              {post.title}
            </Link>
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
          <div className="mt-6 flex items-center justify-between text-[11px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {post.reading_minutes} min de leitura
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-accent">
              Ler artigo <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("card card-hover group flex h-full flex-col overflow-hidden", className)}>
      <Link href={href} className="relative aspect-[16/10] overflow-hidden" aria-label={post.title}>
        <Cover post={post} />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-muted">
          <span
            className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.14em]"
            style={{ color: post.category_color || "var(--accent)" }}
          >
            <span className="size-1.5 rounded-full" style={{ background: post.category_color || "var(--accent)" }} />
            {post.category_name}
          </span>
          <span className="size-1 rounded-full bg-line" />
          <span>{formatDate(post.published_at)}</span>
        </div>
        <h3 className="mt-3 font-serif text-[1.3rem] font-semibold leading-[1.22] text-heading">
          <Link href={href} className="transition-colors hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-3 text-[13.5px] leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-5 text-[10.5px] text-muted">
          <span>{post.reading_minutes} min de leitura</span>
          <span className="inline-flex items-center gap-1 font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
            Ler <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
