import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { del, get, head, put } from "@vercel/blob";

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

function cloudEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

function uploadsDir() {
  return path.join(process.cwd(), "data", "uploads");
}

export function mimeFromFilename(filename: string) {
  return MIME_BY_EXTENSION[path.extname(filename).toLowerCase()] || "application/octet-stream";
}

export async function putUploadFile(filename: string, data: Uint8Array, contentType: string) {
  if (cloudEnabled()) {
    await put(path.basename(filename), Buffer.from(data), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
    });
    return;
  }

  const dir = uploadsDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), data);
}

export async function getUploadFile(filename: string): Promise<Uint8Array | null> {
  if (cloudEnabled()) {
    const result = await get(path.basename(filename), { access: "public" });
    if (!result) return null;
    const arrayBuffer = await new Response(result.stream).arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  try {
    const data = await fs.readFile(path.join(uploadsDir(), filename));
    return new Uint8Array(data);
  } catch {
    return null;
  }
}

export async function deleteUploadFile(filename: string) {
  if (cloudEnabled()) {
    await del(path.basename(filename));
    return;
  }

  try {
    await fs.unlink(path.join(uploadsDir(), filename));
  } catch {
    // The file may already be gone; the database record is still removed.
  }
}

export async function uploadFileExists(filename: string) {
  if (cloudEnabled()) {
    try {
      await head(path.basename(filename));
      return true;
    } catch {
      return false;
    }
  }

  try {
    await fs.access(path.join(uploadsDir(), filename));
    return true;
  } catch {
    return false;
  }
}
