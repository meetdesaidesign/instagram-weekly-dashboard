import { getSettings, DEFAULT_CAPTION_TEMPLATE } from "@/lib/settings";
import { isInstagramConfigured, isOpenAIConfigured, config } from "@/lib/config";
import { PageHeader, Card, Badge } from "@/components/ui";
import { CaptionTemplateForm, DisconnectButton } from "@/components/settings-form";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

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
            <h3 className="font-semibold flex items-center gap-2">
              Instagram connection
              {connected ? (
                <Badge className="text-success border-success/40">
                  Connected
                </Badge>
              ) : (
                <Badge className="text-danger border-danger/40">
                  Not connected
                </Badge>
              )}
            </h3>
            {connected ? (
              <p className="text-sm text-muted mt-1">
                @{settings.igUsername ?? "account"}
                {expiry && ` · token valid until ${expiry}`}
              </p>
            ) : (
              <p className="text-sm text-muted mt-1 max-w-lg">
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
                className="btn brand-gradient btn-primary"
                aria-disabled={!igConfigured}
              >
                Connect Instagram
              </a>
            )}
          </div>
        </div>

        {!igConfigured && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-surface-2 p-3 text-xs text-muted">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[var(--brand-2)]" />
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
        <h3 className="font-semibold mb-3">Environment</h3>
        <div className="flex flex-col gap-2 text-sm">
          <ConfigRow ok={igConfigured} label="Instagram app credentials" />
          <ConfigRow ok={aiConfigured} label="OpenAI API key" />
        </div>
        <p className="text-xs text-[var(--muted-2)] mt-3">
          Schedules run in {config.timezone}: daily sync at 12pm, ideas every
          Friday at 12pm.
        </p>
      </Card>

      {/* Caption structure */}
      <Card>
        <h3 className="font-semibold mb-3">Caption structure</h3>
        <CaptionTemplateForm
          initialTemplate={settings.captionTemplate || DEFAULT_CAPTION_TEMPLATE}
          initialExamples={settings.captionExamples || ""}
        />
      </Card>
    </>
  );
}

function ConfigRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 size={16} className="text-success" />
      ) : (
        <XCircle size={16} className="text-danger" />
      )}
      <span className={ok ? "text-foreground" : "text-muted"}>{label}</span>
      <span className="text-xs text-[var(--muted-2)]">
        {ok ? "configured" : "missing"}
      </span>
    </div>
  );
}

function Banner({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "success" | "danger" | "muted";
}) {
  const color =
    tone === "success"
      ? "text-success border-success/40"
      : tone === "danger"
        ? "text-danger border-danger/40"
        : "text-muted";
  return (
    <div className={`card p-3 mb-4 text-sm ${color}`}>{children}</div>
  );
}
