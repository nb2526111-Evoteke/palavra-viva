import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { logAudit } from "@/lib/queries";
import { saveUpload } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Envio inválido." }, { status: 400 });
  }

  const files = [...formData.getAll("files"), ...formData.getAll("file")].filter(
    (value): value is File => value instanceof File && value.size > 0,
  );

  if (files.length === 0) {
    return NextResponse.json({ error: "Nenhum arquivo recebido." }, { status: 400 });
  }
  if (files.length > 6) {
    return NextResponse.json({ error: "Envie no máximo 6 arquivos por vez." }, { status: 400 });
  }
  const totalBytes = files.reduce((total, file) => total + file.size, 0);
  if (totalBytes > 4.5 * 1024 * 1024) {
    return NextResponse.json({ error: "Envie no máximo 4,5 MB por vez." }, { status: 413 });
  }

  const alt = String(formData.get("alt") ?? "").slice(0, 240);
  const uploaded = [];
  for (const file of files) {
    try {
      uploaded.push(await saveUpload(file, alt));
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Falha no envio." },
        { status: 400 },
      );
    }
  }

  logAudit({
    userId: user.id,
    action: "media.upload",
    entity: "media",
    details: `${uploaded.length} arquivo(s) via editor`,
  });

  return NextResponse.json({ files: uploaded, url: uploaded[0]?.url ?? "" });
}
