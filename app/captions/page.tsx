import { prisma } from "@/lib/prisma";
import { PageHeader, Card, Disclosure, SectionTitle } from "@/components/ui";
import { CaptionForm } from "@/components/caption-form";
import { isOpenAIConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function CaptionsPage() {
  const recent = await prisma.captionRun
    .findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    })
    .catch(() => []);

  return (
    <>
      <PageHeader
        title="Caption writer"
        subtitle="Turn a reel topic into a caption that follows your structure"
      />

      {!isOpenAIConfigured() && (
        <Card className="mb-4 border-danger/40">
          <p className="text-sm text-danger">
            OpenAI is not configured. Add <code>OPENAI_API_KEY</code> to enable
            caption writing.
          </p>
        </Card>
      )}

      <CaptionForm />

      {recent.length > 0 && (
        <div className="mt-10">
          <SectionTitle meta={`last ${recent.length}`} className="mb-4">
            Recent captions
          </SectionTitle>
          <div className="flex flex-col gap-2">
            {recent.map((run) => (
              <Disclosure
                key={run.id}
                title={run.topic}
                meta={run.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              >
                <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-foreground">
                  {run.output}
                </pre>
              </Disclosure>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
