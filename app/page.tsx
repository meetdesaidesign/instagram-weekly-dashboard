import { PageHeader, Card } from "@/components/ui";
import { CaptionForm } from "@/components/caption-form";
import { isOpenAIConfigured } from "@/lib/config";

export const dynamic = "force-dynamic";

export default function HomePage() {
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
    </>
  );
}
