import { prisma } from "@/lib/prisma";
import { PageHeader, Card, EmptyState, Badge } from "@/components/ui";
import { GenerateIdeasButton } from "@/components/actions";
import type { GeneratedIdea } from "@/lib/openai";
import { isOpenAIConfigured } from "@/lib/config";
import { Lightbulb } from "lucide-react";

export const dynamic = "force-dynamic";

function formatWeek(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function IdeasPage() {
  const batches = await prisma.ideaBatch
    .findMany({
      orderBy: { weekOf: "desc" },
      take: 8,
    })
    .catch(() => []);

  const latest = batches[0];
  const history = batches.slice(1);
  const ideas = (latest?.ideas as unknown as GeneratedIdea[]) ?? [];

  return (
    <>
      <PageHeader
        title="Content ideas"
        subtitle="7 fresh ideas generated every Friday at 12pm IST from what performed best"
        action={<GenerateIdeasButton />}
      />

      {!isOpenAIConfigured() && (
        <Card className="mb-4 border-danger/40">
          <p className="text-sm text-danger">
            OpenAI is not configured. Add <code>OPENAI_API_KEY</code> to enable
            idea generation.
          </p>
        </Card>
      )}

      {!latest ? (
        <EmptyState
          title="No ideas yet"
          description="Ideas are generated automatically every Friday based on your best content from the past week. You can also generate them now."
          action={<GenerateIdeasButton />}
        />
      ) : (
        <>
          <p className="text-sm text-muted mb-4">
            Latest batch · week of {formatWeek(latest.weekOf)}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {ideas.map((idea, i) => (
              <Card key={i} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="brand-gradient h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </span>
                    <h3 className="font-semibold leading-snug">{idea.title}</h3>
                  </div>
                  <Badge>{idea.format}</Badge>
                </div>
                {idea.hook && (
                  <div className="rounded-lg bg-surface-2 p-3">
                    <p className="text-[11px] uppercase tracking-wide text-[var(--muted-2)] mb-1">
                      Hook
                    </p>
                    <p className="text-sm text-foreground/90">
                      &ldquo;{idea.hook}&rdquo;
                    </p>
                  </div>
                )}
                {idea.outline && (
                  <p className="text-sm text-muted">{idea.outline}</p>
                )}
                {idea.rationale && (
                  <p className="flex items-start gap-1.5 text-xs text-[var(--muted-2)]">
                    <Lightbulb size={13} className="mt-0.5 shrink-0" />
                    {idea.rationale}
                  </p>
                )}
              </Card>
            ))}
          </div>

          {history.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-4">Past batches</h2>
              <div className="flex flex-col gap-3">
                {history.map((b) => {
                  const bIdeas =
                    (b.ideas as unknown as GeneratedIdea[]) ?? [];
                  return (
                    <details key={b.id} className="card p-4 group">
                      <summary className="cursor-pointer text-sm font-medium flex items-center justify-between">
                        Week of {formatWeek(b.weekOf)}
                        <span className="text-xs text-muted">
                          {bIdeas.length} ideas
                        </span>
                      </summary>
                      <ul className="mt-3 flex flex-col gap-2 list-disc pl-5">
                        {bIdeas.map((idea, i) => (
                          <li key={i} className="text-sm text-muted">
                            <span className="text-foreground">{idea.title}</span>{" "}
                            — {idea.format}
                          </li>
                        ))}
                      </ul>
                    </details>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
