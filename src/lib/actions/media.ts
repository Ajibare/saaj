"use server";

import { unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { actionError, actionSuccess, type ActionResult } from "@/lib/validators";

const idSchema = z.string().min(1);

export async function deleteMedia(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return actionError("Invalid media id.");
  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return actionError("Media item not found.");

    // Only remove files stored in the local /public/uploads directory; never
    // attempt to delete remote URLs or bundled placeholder images.
    if (media.url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", media.url.replace(/^\//, ""));
      await unlink(filePath).catch(() => {
        // ignore missing file on disk
      });
    }

    await prisma.media.delete({ where: { id } });
    revalidatePath("/admin/media");
    return actionSuccess("Media deleted.");
  } catch {
    return actionError("Could not delete the media item.");
  }
}
