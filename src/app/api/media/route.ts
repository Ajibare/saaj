import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB for images/documents
const MAX_VIDEO_SIZE = 120 * 1024 * 1024; // 120 MB for videos

const ALLOWED: Record<string, string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/webp": ["webp"],
  "image/svg+xml": ["svg"],
  "application/pdf": ["pdf"],
  "application/msword": ["doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"],
  "application/vnd.ms-excel": ["xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"],
  "application/zip": ["zip"],
  "application/x-zip-compressed": ["zip"],
  "video/mp4": ["mp4"],
  "video/webm": ["webm"],
  "video/quicktime": ["mov"],
  "video/x-m4v": ["m4v"],
};

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

function extensionFor(mimeType: string): string | undefined {
  return ALLOWED[mimeType]?.[0];
}

function sanitizeName(name: string): string {
  return path.basename(name).replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 100) || "file";
}

async function persist(file: File, alt?: string) {
  const isVideo = VIDEO_TYPES.has(file.type);
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_SIZE;
  if (file.size > maxSize) {
    return {
      ok: false as const,
      message: isVideo
        ? "Video is too large. Maximum size is 120 MB."
        : "File is too large. Maximum size is 10 MB.",
      status: 413,
    };
  }

  const ext = extensionFor(file.type);
  if (!ext) {
    return { ok: false as const, message: "File type is not allowed.", status: 415 };
  }

  const uniqueName = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  try {
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, uniqueName), buffer);

    const url = `/uploads/${uniqueName}`;
    const record = await prisma.media.create({
      data: {
        filename: sanitizeName(file.name),
        url,
        mimeType: file.type,
        size: file.size,
        alt: alt?.trim() || null,
      },
      select: { id: true, url: true, filename: true, mimeType: true, alt: true },
    });

    return {
      ok: true as const,
      url,
      name: record.filename,
      size: file.size,
      mimeType: file.type,
      item: record,
    };
  } catch (error) {
    console.error("Upload failed:", error);
    return { ok: false as const, message: "Could not save the file. Please try again.", status: 500 };
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number.parseInt(url.searchParams.get("limit") ?? "100", 10);

  try {
    const items = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      take: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 100,
      select: { id: true, url: true, alt: true, filename: true, mimeType: true },
    });
    return Response.json({ ok: true, items });
  } catch (error) {
    console.error("GET /api/media failed:", error);
    return Response.json({ ok: false, message: "Could not load media." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ ok: false, message: "Invalid upload request." }, { status: 400 });
  }

  const file = formData.get("file");
  const alt = (formData.get("alt") as string) || undefined;

  if (!(file instanceof File)) {
    return Response.json({ ok: false, message: "No file provided." }, { status: 400 });
  }

  const result = await persist(file, alt);
  if (!result.ok) {
    return Response.json({ ok: false, message: result.message }, { status: result.status });
  }
  return Response.json(result);
}
