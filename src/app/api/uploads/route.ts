import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

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
};

function extensionFor(mimeType: string): string | undefined {
  return ALLOWED[mimeType]?.[0];
}

function sanitizeName(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 100);
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

  if (file.size > MAX_SIZE) {
    return Response.json(
      { ok: false, message: "File is too large. Maximum size is 10 MB." },
      { status: 413 }
    );
  }

  const ext = extensionFor(file.type);
  if (!ext) {
    return Response.json(
      { ok: false, message: "File type is not allowed." },
      { status: 415 }
    );
  }

  const uniqueName = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  try {
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, uniqueName), buffer);

    return Response.json({
      ok: true,
      url: `/uploads/${uniqueName}`,
      name: sanitizeName(file.name),
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return Response.json(
      { ok: false, message: "Could not save the file. Please try again." },
      { status: 500 }
    );
  }
}