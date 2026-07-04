export const config = {
  instagram: {
    appId: process.env.INSTAGRAM_APP_ID ?? "",
    appSecret: process.env.INSTAGRAM_APP_SECRET ?? "",
    graphVersion: process.env.INSTAGRAM_GRAPH_VERSION ?? "v25.0",
    // Instagram API with Instagram Login uses graph.instagram.com
    graphHost: "https://graph.instagram.com",
    authHost: "https://www.instagram.com",
    apiHost: "https://api.instagram.com",
    scopes: [
      "instagram_business_basic",
      "instagram_business_manage_insights",
    ].join(","),
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  },
  appUrl: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
  cronSecret: process.env.CRON_SECRET ?? "",
  // The account timezone used for daily "date" buckets and schedule labels.
  timezone: "Asia/Kolkata",
} as const;

export function getRedirectUri(): string {
  return `${config.appUrl}/api/instagram/callback`;
}

export function isInstagramConfigured(): boolean {
  return Boolean(config.instagram.appId && config.instagram.appSecret);
}

export function isOpenAIConfigured(): boolean {
  return Boolean(config.openai.apiKey);
}
