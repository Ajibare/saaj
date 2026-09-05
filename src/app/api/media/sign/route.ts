import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { signUploadParams } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const params = signUploadParams();
    return NextResponse.json({ ok: true, ...params });
  } catch (error) {
    console.error("GET /api/media/sign failed:", error);
    return NextResponse.json(
      { ok: false, message: "Cloudinary is not configured on the server." },
      { status: 500 }
    );
  }
}