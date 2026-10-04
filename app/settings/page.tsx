import { getSettings, DEFAULT_CAPTION_TEMPLATE } from "@/lib/settings";
import { isOpenAIConfigured } from "@/lib/config";
import { PageHeader, Card, ConfigRow, SectionTitle } from "@/components/ui";
import { CaptionTemplateForm } from "@/components/settings-form";
import { ThemeToggle } from "@/components/theme";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  const aiConfigured = isOpenAIConfigured();

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Define the structure and voice used when writing captions"
      />

      <Card className="mb-4">
        <SectionTitle>Environment</SectionTitle>
        <ConfigRow ok={aiConfigured} label="OpenAI API key" />
      </Card>

      <Card className="mb-4">
        <SectionTitle>Appearance</SectionTitle>
        <div className="flex items-center justify-between gap-4">
          <p className="text-[13px] text-muted">
            Color theme. System follows your device setting.
          </p>
          <ThemeToggle />
        </div>
      </Card>

      <Card>
        <SectionTitle>Caption structure</SectionTitle>
        <CaptionTemplateForm
          initialTemplate={settings.captionTemplate || DEFAULT_CAPTION_TEMPLATE}
          initialExamples={settings.captionExamples || ""}
        />
      </Card>
    </>
  );
}
