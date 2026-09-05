import { prisma } from "./src/lib/prisma";

async function main() {
  const count = await prisma.media.count();
  console.log("DB reachable. media count:", count);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("DB NOT reachable:", e.message);
    process.exit(1);
  });