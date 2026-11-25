import type { MetadataRoute } from "next";
import {
  getBibleBooks,
  getCategories,
  getLibraryItems,
  getReadingPlans,
  listPublishedPosts,
} from "@/lib/queries";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/blog", "/biblia", "/biblioteca", "/sobre", "/contato", "/buscar"].map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/blog" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1 : 0.7,
  }));

  const posts = (await listPublishedPosts({ limit: 1000 })).map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categories = (await getCategories()).map((category) => ({
    url: absoluteUrl(`/blog/categoria/${category.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const books = (await getBibleBooks()).map((book) => ({
    url: absoluteUrl(`/biblia/${book.slug}`),
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const plans = (await getReadingPlans()).map((plan) => ({
    url: absoluteUrl(`/biblioteca/planos/${plan.slug}`),
    lastModified: new Date(plan.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const library = (await getLibraryItems()).map((item) => ({
    url: absoluteUrl(`/biblioteca/${item.slug}`),
    lastModified: new Date(item.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...posts, ...categories, ...books, ...plans, ...library];
}
