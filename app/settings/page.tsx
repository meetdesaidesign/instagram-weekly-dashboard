import { getSettings, DEFAULT_CAPTION_TEMPLATE } from "@/lib/settings";
import { isInstagramConfigured, isOpenAIConfigured, config } from "@/lib/config";
import {
  PageHeader,
  Card,
  Badge,
  Banner,
  ConfigRow,
  SectionTitle,
  buttonClasses,
} from "@/components/ui";
import { CaptionTemplateForm, DisconnectButton } from "@/components/settings-form";
import { ThemeToggle } from "@/components/theme";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    connected?: string;
    disconnected?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const settings = await getSettings();
  const connected = Boolean(settings.accessToken && settings.igUserId);
  const igConfigured = isInstagramConfigured();
  const aiConfigured = isOpenAIConfigured();

  const expiry = settings.tokenExpiresAt
    ? settings.tokenExpiresAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Connect Instagram and define your caption structure"
      />

      {params.connected && (
        <Banner tone="success">Instagram connected successfully.</Banner>
      )}
      {params.disconnected && (
        <Banner tone="muted">Instagram disconnected.</Banner>
      )}
      {params.error && (
        <Banner tone="danger">
          {decodeURIComponent(params.error).replace(/_/g, " ")}
        </Banner>
      )}

      {/* Connection */}
      <Card className="mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              Instagram connection
              {connected ? (
                <Badge className="border-transparent bg-accent text-on-accent">
                  Connected
                </Badge>
              ) : (
                <Badge className="border-border-strong text-muted">
                  Not connected
                </Badge>
              )}
            </h3>
            {connected ? (
              <p className="mt-1 text-[13px] text-muted">
                @{settings.igUsername ?? "account"}
                {expiry && ` · token valid until ${expiry}`}
              </p>
            ) : (
              <p className="mt-1 max-w-lg text-[13px] text-muted">
                Connect your Instagram Business or Creator account to sync
                analytics. You&apos;ll be redirected to Instagram to authorize.
              </p>
            )}
          </div>
          <div>
            {connected ? (
              <DisconnectButton />
            ) : (
              <a
                href="/api/instagram/connect"
                className={buttonClasses({ variant: "primary" })}
                aria-disabled={!igConfigured}
              >
                Connect Instagram
              </a>
            )}
          </div>
        </div>

        {!igConfigured && (
          <div className="mt-4 flex items-start gap-2 rounded-ctl bg-surface-2 p-3 text-xs text-muted">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-warning" />
            <span>
              Set <code>INSTAGRAM_APP_ID</code> and{" "}
              <code>INSTAGRAM_APP_SECRET</code> from your Meta Developer app,
              then add <code>{config.appUrl}/api/instagram/callback</code> as an
              allowed OAuth redirect URI.
            </span>
          </div>
        )}
      </Card>

      {/* Config status */}
      <Card className="mb-4">
        <SectionTitle>Environment</SectionTitle>
        <div className="flex flex-col gap-2">
          <ConfigRow ok={igConfigured} label="Instagram app credentials" />
          <ConfigRow ok={aiConfigured} label="OpenAI API key" />
        </div>
        <p className="mt-3 text-[11px] text-muted-2">
          Schedules run in {config.timezone}: daily sync at 12pm, ideas every
          Friday at 12pm.
        </p>
      </Card>

      {/* Appearance */}
      <Card className="mb-4">
        <SectionTitle>Appearance</SectionTitle>
        <div className="flex items-center justify-between gap-4">
          <p className="text-[13px] text-muted">
            Color theme for the dashboard. System follows your device setting.
          </p>
          <ThemeToggle />
        </div>
      </Card>

      {/* Caption structure */}
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
