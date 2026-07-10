import { prisma } from "@/lib/prisma";
import {
  PageHeader,
  Card,
  EmptyState,
  Badge,
  Disclosure,
  SectionTitle,
} from "@/components/ui";
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
          <SectionTitle meta={`${ideas.length} ideas`} className="mb-4">
            Latest batch · week of {formatWeek(latest.weekOf)}
          </SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            {ideas.map((idea, i) => (
              <Card
                key={i}
                className="rise-in flex flex-col gap-3"
                style={{ "--stagger-i": Math.min(i, 8) } as React.CSSProperties}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-ctl bg-accent-soft font-mono text-[11px] font-semibold text-accent">
                      {i + 1}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug text-foreground">
                      {idea.title}
                    </h3>
                  </div>
                  <Badge>{idea.format}</Badge>
                </div>
                {idea.hook && (
                  <div className="rounded-ctl bg-surface-2 p-3">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-2">
                      Hook
                    </p>
                    <p className="text-[13px] text-foreground">
                      &ldquo;{idea.hook}&rdquo;
                    </p>
                  </div>
                )}
                {idea.outline && (
                  <p className="text-[13px] leading-relaxed text-muted">
                    {idea.outline}
                  </p>
                )}
                {idea.rationale && (
                  <p className="flex items-start gap-1.5 text-xs text-muted-2">
                    <Lightbulb size={13} className="mt-0.5 shrink-0" />
                    {idea.rationale}
                  </p>
                )}
              </Card>
            ))}
          </div>

          {history.length > 0 && (
            <div className="mt-10">
              <SectionTitle meta={`${history.length} weeks`} className="mb-4">
                Past batches
              </SectionTitle>
              <div className="flex flex-col gap-2">
                {history.map((b) => {
                  const bIdeas =
                    (b.ideas as unknown as GeneratedIdea[]) ?? [];
                  return (
                    <Disclosure
                      key={b.id}
                      title={`Week of ${formatWeek(b.weekOf)}`}
                      meta={`${bIdeas.length} ideas`}
                    >
                      <ul className="flex flex-col gap-2">
                        {bIdeas.map((idea, i) => (
                          <li
                            key={i}
                            className="flex items-baseline gap-2 text-[13px]"
                          >
                            <span className="font-mono text-[10px] tabular-nums text-muted-2">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-foreground">
                              {idea.title}
                            </span>
                            <span className="text-muted-2">·</span>
                            <span className="text-muted">{idea.format}</span>
                          </li>
                        ))}
                      </ul>
                    </Disclosure>
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
