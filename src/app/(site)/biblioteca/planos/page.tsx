import { redirect } from "next/navigation";

export default function PlansIndexPage() {
  redirect("/biblioteca?tipo=planos");
}
