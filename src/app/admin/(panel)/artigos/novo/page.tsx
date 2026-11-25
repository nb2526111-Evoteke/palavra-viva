import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/queries";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Novo artigo" };

export default async function NewPostPage() {
  await requireAdmin();
  const categories = (await getCategories()).map((category) => ({ id: category.id, name: category.name }));
  return <PostEditor post={null} categories={categories} />;
}
