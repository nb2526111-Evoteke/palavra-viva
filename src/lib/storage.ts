import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

export const MIME_BY_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".mp4": "video/mp4",
  ".txt": "text/plain",
};

function uploadsDir() {
  return path.join(process.cwd(), "data", "uploads");
}

export function mimeFromFilename(filename: string) {
  return MIME_BY_EXTENSION[path.extname(filename).toLowerCase()] || "application/octet-stream";
}

export async function putUploadFile(filename: string, data: Uint8Array) {
  const dir = uploadsDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), data);
}

export async function getUploadFile(filename: string): Promise<Uint8Array | null> {
  try {
    const data = await fs.readFile(path.join(uploadsDir(), filename));
    return new Uint8Array(data);
  } catch {
    return null;
  }
}

export async function deleteUploadFile(filename: string) {
  try {
    await fs.unlink(path.join(uploadsDir(), filename));
  } catch {
    // O arquivo pode já ter sido removido; o registro no banco ainda é apagado.
  }
}

export async function uploadFileExists(filename: string) {
  try {
    await fs.access(path.join(uploadsDir(), filename));
    return true;
  } catch {
    return false;
  }
}
