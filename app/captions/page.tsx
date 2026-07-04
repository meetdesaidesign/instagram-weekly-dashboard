import { prisma } from "@/lib/prisma";
import { PageHeader, Card } from "@/components/ui";
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
          <h2 className="text-lg font-semibold mb-4">Recent captions</h2>
          <div className="flex flex-col gap-3">
            {recent.map((run) => (
              <details key={run.id} className="card p-4">
                <summary className="cursor-pointer text-sm font-medium flex items-center justify-between gap-3">
                  <span className="truncate">{run.topic}</span>
                  <span className="text-xs text-muted shrink-0">
                    {run.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </summary>
                <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed">
                  {run.output}
                </pre>
              </details>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
