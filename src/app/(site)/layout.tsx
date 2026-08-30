import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const general = settings.general!;
  const socials = settings.socials!;

  let services: { slug: string; title: string }[] = [];
  try {
    services = await prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true },
    });
  } catch {
    services = [];
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader general={general} />
      <main className="flex-1">{children}</main>
      <SiteFooter general={general} socials={socials} services={services} />
    </div>
  );
}