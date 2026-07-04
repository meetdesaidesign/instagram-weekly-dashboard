import "dotenv/config";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_CAPTION_TEMPLATE,
  DEFAULT_CAPTION_EXAMPLES,
} from "@/lib/settings";

async function main() {
  const updated = await prisma.setting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      captionTemplate: DEFAULT_CAPTION_TEMPLATE,
      captionExamples: DEFAULT_CAPTION_EXAMPLES,
    },
    update: {
      captionTemplate: DEFAULT_CAPTION_TEMPLATE,
      captionExamples: DEFAULT_CAPTION_EXAMPLES,
    },
  });
  console.log(
    `Seeded caption template + examples (setting id=${updated.id}, template ${DEFAULT_CAPTION_TEMPLATE.length} chars, examples ${DEFAULT_CAPTION_EXAMPLES.length} chars).`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
