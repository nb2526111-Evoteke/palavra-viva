import { getCurrentUser } from "@/lib/auth";
import { getSubscribers } from "@/lib/queries";
import { csvEscape } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return new Response("Não autorizado.", { status: 401 });
  }

  const subscribers = await getSubscribers();
  const header = ["E-mail", "Nome", "Situação", "Origem", "Inscrição"];
  const lines = [
    header.map(csvEscape).join(","),
    ...subscribers.map((subscriber) =>
      [
        subscriber.email,
        subscriber.name,
        subscriber.status,
        subscriber.source,
        subscriber.created_at,
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];

  const body = `\uFEFF${lines.join("\r\n")}`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-palavra-viva-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
