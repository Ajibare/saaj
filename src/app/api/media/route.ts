import { prisma } from "@/lib/prisma";
import { storeFile } from "@/lib/media-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number.parseInt(url.searchParams.get("limit") ?? "100", 10);

  try {
    const items = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      take: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 100,
      select: {
        id: true,
        url: true,
        alt: true,
        filename: true,
        mimeType: true,
        size: true,
        createdAt: true,
      },
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

  const files = Array.from(formData.getAll("file")).filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return Response.json({ ok: false, message: "No files provided." }, { status: 400 });
  }

  const results = await Promise.all(files.map((file) => storeFile(file)));
  const items = results.filter((r): r is Extract<typeof r, { ok: true }> => r.ok).map((r) => r.item);
  const failed = results.length - items.length;

  if (items.length === 0) {
    const first = results[0];
    if (!first.ok) {
      return Response.json({ ok: false, message: first.message }, { status: first.status });
    }
  }

  return Response.json({
    ok: true,
    items,
    message: failed > 0 ? `${failed} file(s) could not be uploaded.` : undefined,
  });
}