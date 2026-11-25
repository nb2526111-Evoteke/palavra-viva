import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import {
  FileAudio,
  FileText,
  HardDrive,
  Image as ImageIcon,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { AdminPageHeader, EmptyState, Flash } from "@/components/admin/ui";
import { ConfirmSubmit, CopyButton, SubmitButton } from "@/components/admin/buttons";
import { deleteMediaAction, updateMediaAltAction, uploadMediaAction } from "@/lib/actions/admin-media";
import { getMedia } from "@/lib/queries";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mídia" };

type SearchParams = Promise<{ ok?: string; erro?: string }>;

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(0)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function MediaIcon({ mime }: { mime: string }) {
  if (mime.startsWith("image/")) return <ImageIcon className="size-6" aria-hidden="true" />;
  if (mime.startsWith("audio/")) return <FileAudio className="size-6" aria-hidden="true" />;
  return <FileText className="size-6" aria-hidden="true" />;
}

export default async function AdminMediaPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const media = await getMedia();
  const totalSize = media.reduce((total, item) => total + item.size, 0);

  return (
    <>
      <AdminPageHeader
        eyebrow="Aparência"
        title="Mídia"
        description="Imagens de capa, PDFs e arquivos de áudio. O que você envia aqui fica disponível para os artigos e para a biblioteca."
      />

      <Flash ok={params.ok} erro={params.erro} />

      <div className="a-card a-mb-4">
        <div className="a-card-head">
          <div>
            <h2 className="a-card-title">Enviar arquivos</h2>
            <p className="a-card-desc">
              Imagens, PDF, MP3, M4A, OGG ou MP4 · até 8 MB por arquivo · {media.length} arquivos (
              {formatBytes(totalSize)})
            </p>
          </div>
          <HardDrive className="size-4 text-slate-300" aria-hidden="true" />
        </div>
        <form action={uploadMediaAction} className="a-card-body">
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <label className="a-label" htmlFor="files">Arquivos</label>
              <input
                id="files"
                name="files"
                type="file"
                multiple
                className="a-input file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-slate-600 hover:file:bg-slate-200"
                accept="image/*,application/pdf,audio/*,video/mp4"
                required
              />
              <p className="a-help">Você pode selecionar até 12 arquivos de uma vez.</p>
            </div>
            <div>
              <label className="a-label" htmlFor="alt">Texto alternativo <span>opcional</span></label>
              <input
                id="alt"
                name="alt"
                className="a-input"
                placeholder="Descreva a imagem para acessibilidade"
                maxLength={240}
              />
            </div>
            <SubmitButton pendingLabel="Enviando…">
              <Upload className="size-4" aria-hidden="true" />
              Enviar arquivos
            </SubmitButton>
          </div>
        </form>
      </div>

      {media.length === 0 ? (
        <div className="a-card">
          <EmptyState
            icon={<ImageIcon className="size-5" />}
            title="Nenhum arquivo enviado"
            description="Envie a primeira imagem de capa ou material para começar a biblioteca de mídia."
          />
        </div>
      ) : (
        <div className="a-media-grid">
          {media.map((item) => (
            <article className="a-media-card" key={item.id}>
              <div className="a-media-thumb">
                {item.mime.startsWith("image/") ? (
                  <a href={`/uploads/${item.filename}`} target="_blank" rel="noreferrer" title={item.original_name}>
                    <img src={`/uploads/${item.filename}`} alt={item.alt || item.original_name} loading="lazy" />
                  </a>
                ) : (
                  <div className="a-media-file">
                    <MediaIcon mime={item.mime} />
                    {item.mime.split("/")[1] || "arquivo"}
                  </div>
                )}
              </div>
              <div className="a-media-info">
                <p className="a-media-name" title={item.original_name}>{item.original_name}</p>
                <p className="a-media-meta">
                  {formatBytes(item.size)} · {formatDateTime(item.created_at)}
                </p>
              </div>
              <div className="a-media-actions">
                <CopyButton
                  value={`/uploads/${item.filename}`}
                  className="a-btn a-btn-outline a-btn-sm flex-1"
                />
                <form action={deleteMediaAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmSubmit
                    className="a-btn a-btn-danger a-btn-icon"
                    message={`Excluir "${item.original_name}"? Se estiver em uso, a imagem deixará de aparecer no site.`}
                    title="Excluir arquivo"
                  >
                    <Trash2 className="size-3.5" />
                  </ConfirmSubmit>
                </form>
              </div>
              <form action={updateMediaAltAction} className="flex gap-1 px-2.5 pb-2.5">
                <input type="hidden" name="id" value={item.id} />
                <input
                  name="alt"
                  defaultValue={item.alt}
                  className="a-input a-input-sm min-w-0 flex-1"
                  placeholder="Texto alternativo"
                  maxLength={240}
                  aria-label={`Texto alternativo de ${item.original_name}`}
                />
                <SubmitButton
                  className="a-btn a-btn-ghost a-btn-icon"
                  pendingLabel=""
                  title="Salvar texto alternativo"
                >
                  <Save className="size-3.5" />
                </SubmitButton>
              </form>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
