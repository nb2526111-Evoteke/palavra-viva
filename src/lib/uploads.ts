import "server-only";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { insert } from "./db";
import { deleteUploadFile, getUploadFile, mimeFromFilename, putUploadFile, uploadFileExists } from "./storage";
import { slugify } from "./utils";

const MAX_BYTES = 4 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "application/pdf": "pdf",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
  "video/mp4": "mp4",
  "text/plain": "txt",
};

export type UploadResult = {
  id: number;
  filename: string;
  url: string;
  mime: string;
  size: number;
  originalName: string;
};

export function uploadsDir() {
  return path.join(process.cwd(), "data", "uploads");
}

export function isAllowedMime(mime: string) {
  return Boolean(MIME_EXTENSIONS[mime]);
}

export async function saveUpload(file: File, alt = ""): Promise<UploadResult> {
  if (!file || file.size === 0) throw new Error("Nenhum arquivo recebido.");
  if (file.size > MAX_BYTES) throw new Error("O arquivo excede o limite de 4 MB.");
  const mime = file.type || "application/octet-stream";
  const extension = MIME_EXTENSIONS[mime];
  if (!extension) throw new Error("Formato não permitido. Use imagens, PDF, áudio ou vídeo MP4.");

  const originalName = (file.name || "arquivo").slice(0, 180);
  const base = slugify(originalName.replace(/\.[^.]+$/, "")) || "arquivo";
  const filename = `${Date.now()}-${randomBytes(4).toString("hex")}-${base}.${extension}`;
  const buffer = new Uint8Array(await file.arrayBuffer());
  await putUploadFile(filename, buffer, mime);

  const id = await insert(
    "INSERT INTO media (filename, original_name, mime, size, alt) VALUES (?, ?, ?, ?, ?)",
    [filename, originalName, mime, file.size, alt.slice(0, 240)],
  );

  return { id, filename, url: `/uploads/${filename}`, mime, size: file.size, originalName };
}

export async function removeUpload(filename: string) {
  const safe = path.basename(filename);
  if (!safe || safe !== filename) return;
  await deleteUploadFile(safe);
}

export async function readUpload(filename: string) {
  const safe = path.basename(filename);
  if (!safe || safe !== filename) return null;
  const data = await getUploadFile(safe);
  if (!data) return null;
  return { data, contentType: mimeFromFilename(safe) };
}

export async function fileExists(filename: string) {
  const safe = path.basename(filename);
  if (!safe || safe !== filename) return false;
  return uploadFileExists(safe);
}
