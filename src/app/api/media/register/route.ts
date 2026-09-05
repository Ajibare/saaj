import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";
import { MAX_FILE_SIZE } from "@/lib/media-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().int().positive().max(MAX_FILE_SIZE),
  filename: z.string().min(1).max(255),
  alt: z.string().max(500).optional().nullable(),
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid upload metadata." }, { status: 400 });
  }

  const body = parsed.data;
  if (!body.url.includes("res.cloudinary.com")) {
    return NextResponse.json({ ok: false, message: "Only Cloudinary URLs can be registered." }, { status: 400 });
  }

  try {
    const item = await prisma.media.create({
      data: {
        filename: body.filename,
        url: body.url,
        mimeType: body.mimeType,
        size: body.size,
        alt: body.alt?.trim() || null,
        publicId: body.publicId,
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
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error("POST /api/media/register failed:", error);
    return NextResponse.json({ ok: false, message: "Could not save the media record." }, { status: 500 });
  }
}