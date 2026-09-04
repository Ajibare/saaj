import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt: string | null;
  createdAt: Date;
};

export type StoreResult =
  | { ok: true; item: MediaItem }
  | { ok: false; message: string; status: number };

export function isAllowedImageType(mimeType: string): boolean {
  return ALLOWED_IMAGE_TYPES.has(mimeType);
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 100) || "file";
}

export async function storeImage(file: File, alt?: string): Promise<StoreResult> {
  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      message: "File is too large. Maximum size is 4 MB per file.",
      status: 413,
    };
  }
  if (!isAllowedImageType(file.type)) {
    return {
      ok: false,
      message: "File type is not allowed. Use PNG, JPG, JPEG, WebP, GIF, AVIF or SVG.",
      status: 415,
    };
  }

  try {
    const id = randomBytes(12).toString("hex");
    const buffer = Buffer.from(await file.arrayBuffer());
    const item = await prisma.media.create({
      data: {
        id,
        filename: sanitizeName(file.name),
        url: `/api/media/${id}`,
        mimeType: file.type,
        size: file.size,
        alt: alt?.trim() || null,
        data: buffer,
      },
      select: {
        id: true,
        url: true,
        filename: true,
        mimeType: true,
        size: true,
        alt: true,
        createdAt: true,
      },
    });
    return { ok: true, item };
  } catch (error) {
    console.error("Media upload failed:", error);
    return { ok: false, message: "Could not save the file. Please try again.", status: 500 };
  }
}