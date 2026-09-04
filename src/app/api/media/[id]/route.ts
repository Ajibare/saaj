import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const item = await prisma.media.findUnique({
      where: { id },
      select: { data: true, mimeType: true, filename: true },
    });
    if (!item?.data) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(new Uint8Array(item.data), {
      headers: {
        "Content-Type": item.mimeType,
        "Content-Disposition": `inline; filename="${item.filename.replace(/"/g, "")}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("GET /api/media/[id] failed:", error);
    return new Response("Internal server error", { status: 500 });
  }
}