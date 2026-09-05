import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

const MAX_MONGO_FILE_SIZE = 14 * 1024 * 1024;

export const ALLOWED_FILE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
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

export function isAllowedFileType(mimeType: string): boolean {
  return ALLOWED_FILE_TYPES.has(mimeType);
}

export function isVideoType(mimeType: string): boolean {
  return VIDEO_TYPES.has(mimeType);
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 100) || "file";
}

export async function storeFile(file: File, alt?: string): Promise<StoreResult> {
  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      message: "File is too large. Maximum size is 50 MB per file.",
      status: 413,
    };
  }
  if (file.size > MAX_MONGO_FILE_SIZE) {
    return {
      ok: false,
      message:
        "Files above 14 MB can't be stored in the database. Use an external file host (e.g. Cloudinary) for large files and videos.",
      status: 413,
    };
  }
  if (!isAllowedFileType(file.type)) {
    return {
      ok: false,
      message: "File type is not allowed. Use PNG, JPG, JPEG, WebP, GIF, AVIF, SVG or MP4/WEBM/MOV.",
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