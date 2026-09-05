import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 10 * 1024 * 1024;
const MAX_MONGO_SIZE = 14 * 1024 * 1024;

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

function sanitizeName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 100);
  return base || "file";
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ ok: false, message: "Invalid upload request." }, { status: 400 });
  }
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ ok: false, message: "No file provided." }, { status: 400 });
  }

  const isVideo = VIDEO_TYPES.has(file.type);
  if (!isVideo && file.size > MAX_SIZE) {
    return Response.json(
      { ok: false, message: "File is too large. Maximum size is 10 MB." },
      { status: 413 }
    );
  }
  if (file.size > MAX_MONGO_SIZE) {
    return Response.json(
      { ok: false, message: "Files above 14 MB can't be stored here. Please use a smaller file." },
      { status: 413 }
    );
  }

  const ext = ALLOWED[file.type]?.[0];
  if (!ext) {
    return Response.json(
      { ok: false, message: "File type is not allowed." },
      { status: 415 }
    );
  }

  try {
    const id = randomBytes(12).toString("hex");
    const buffer = Buffer.from(await file.arrayBuffer());
    const item = await prisma.fileUpload.create({
      data: {
        id,
        filename: sanitizeName(file.name),
        mimeType: file.type,
        size: file.size,
        data: buffer,
      },
    });

    return Response.json({
      ok: true,
      url: `/api/uploads/${item.id}`,
      name: item.filename,
      size: item.size,
      mimeType: item.mimeType,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return Response.json(
      { ok: false, message: "Could not save the file. Please try again." },
      { status: 500 }
    );
  }
}