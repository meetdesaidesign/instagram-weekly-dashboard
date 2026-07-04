import { config, getRedirectUri } from "@/lib/config";

/**
 * Instagram API with Instagram Login (Business/Creator accounts).
 * Host: graph.instagram.com  |  Docs: https://developers.facebook.com/docs/instagram-platform
 */

const GRAPH = config.instagram.graphHost;
const VERSION = config.instagram.graphVersion;

export interface TokenResult {
  accessToken: string;
  userId: string;
  expiresInSeconds: number;
}

export interface IgProfile {
  id: string;
  username: string;
  followersCount: number;
  mediaCount: number;
}

export interface AccountInsights {
  reach: number;
  views: number;
  profileViews: number;
}

export interface IgMedia {
  igMediaId: string;
  caption: string | null;
  mediaType: string | null;
  productType: string | null;
  permalink: string | null;
  thumbnailUrl: string | null;
  mediaUrl: string | null;
  timestamp: string | null;
  likeCount: number;
  commentsCount: number;
}

export interface MediaInsights {
  reach: number;
  views: number;
  shares: number;
  saved: number;
  totalInteractions: number;
}

class InstagramError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "InstagramError";
    this.status = status;
  }
}

async function igFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const msg =
      (json as { error?: { message?: string } })?.error?.message ??
      `Instagram API error (${res.status})`;
    throw new InstagramError(msg, res.status);
  }
  return json as T;
}

// ---------------------------------------------------------------------------
// OAuth (Business Login for Instagram)
// ---------------------------------------------------------------------------

export function getAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: config.instagram.appId,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: config.instagram.scopes,
    state,
  });
  return `${config.instagram.authHost}/oauth/authorize?${params.toString()}`;
}

/** Exchange the OAuth `code` for a short-lived access token + user id. */
export async function exchangeCodeForToken(code: string): Promise<TokenResult> {
  const body = new URLSearchParams({
    client_id: config.instagram.appId,
    client_secret: config.instagram.appSecret,
    grant_type: "authorization_code",
    redirect_uri: getRedirectUri(),
    code,
  });
  const res = await fetch(`${config.instagram.apiHost}/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const json = (await res.json()) as {
    access_token?: string;
    user_id?: string | number;
    error_message?: string;
    error_type?: string;
  };
  if (!res.ok || !json.access_token) {
    throw new InstagramError(
      json.error_message ?? "Failed to exchange code for token",
      res.status,
    );
  }
  return {
    accessToken: json.access_token,
    userId: String(json.user_id ?? ""),
    // Short-lived tokens last ~1 hour; we immediately upgrade to long-lived.
    expiresInSeconds: 3600,
  };
}

/** Upgrade a short-lived token to a long-lived (~60 day) token. */
export async function getLongLivedToken(
  shortToken: string,
): Promise<{ accessToken: string; expiresInSeconds: number }> {
  const params = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: config.instagram.appSecret,
    access_token: shortToken,
  });
  const json = await igFetch<{ access_token: string; expires_in: number }>(
    `${GRAPH}/access_token?${params.toString()}`,
  );
  return { accessToken: json.access_token, expiresInSeconds: json.expires_in };
}

/** Refresh a long-lived token (must be at least 24h old, valid < 60 days). */
export async function refreshLongLivedToken(
  token: string,
): Promise<{ accessToken: string; expiresInSeconds: number }> {
  const params = new URLSearchParams({
    grant_type: "ig_refresh_token",
    access_token: token,
  });
  const json = await igFetch<{ access_token: string; expires_in: number }>(
    `${GRAPH}/refresh_access_token?${params.toString()}`,
  );
  return { accessToken: json.access_token, expiresInSeconds: json.expires_in };
}

// ---------------------------------------------------------------------------
// Data fetchers
// ---------------------------------------------------------------------------

export async function getProfile(token: string): Promise<IgProfile> {
  const params = new URLSearchParams({
    fields: "user_id,username,followers_count,media_count",
    access_token: token,
  });
  const json = await igFetch<{
    user_id?: string;
    id?: string;
    username: string;
    followers_count?: number;
    media_count?: number;
  }>(`${GRAPH}/${VERSION}/me?${params.toString()}`);
  return {
    id: String(json.user_id ?? json.id ?? ""),
    username: json.username,
    followersCount: json.followers_count ?? 0,
    mediaCount: json.media_count ?? 0,
  };
}

type InsightItem = {
  name: string;
  total_value?: { value?: number };
  values?: { value?: number }[];
};

function readInsight(items: InsightItem[], name: string): number {
  const item = items.find((i) => i.name === name);
  if (!item) return 0;
  if (typeof item.total_value?.value === "number") return item.total_value.value;
  if (item.values && item.values.length) {
    return item.values.reduce((sum, v) => sum + (v.value ?? 0), 0);
  }
  return 0;
}

export async function getAccountInsights(
  userId: string,
  token: string,
): Promise<AccountInsights> {
  const params = new URLSearchParams({
    metric: "reach,views,profile_views",
    period: "day",
    metric_type: "total_value",
    access_token: token,
  });
  try {
    const json = await igFetch<{ data: InsightItem[] }>(
      `${GRAPH}/${VERSION}/${userId}/insights?${params.toString()}`,
    );
    const items = json.data ?? [];
    return {
      reach: readInsight(items, "reach"),
      views: readInsight(items, "views"),
      profileViews: readInsight(items, "profile_views"),
    };
  } catch {
    // Accounts with < 100 followers (or new accounts) may return errors here.
    return { reach: 0, views: 0, profileViews: 0 };
  }
}

export async function getMedia(
  userId: string,
  token: string,
  limit = 50,
): Promise<IgMedia[]> {
  const params = new URLSearchParams({
    fields:
      "id,caption,media_type,media_product_type,permalink,thumbnail_url,media_url,timestamp,like_count,comments_count",
    limit: String(limit),
    access_token: token,
  });
  const results: IgMedia[] = [];
  let url = `${GRAPH}/${VERSION}/${userId}/media?${params.toString()}`;
  let guard = 0;
  while (url && guard < 20) {
    const json = await igFetch<{
      data: Array<{
        id: string;
        caption?: string;
        media_type?: string;
        media_product_type?: string;
        permalink?: string;
        thumbnail_url?: string;
        media_url?: string;
        timestamp?: string;
        like_count?: number;
        comments_count?: number;
      }>;
      paging?: { next?: string };
    }>(url);
    for (const m of json.data ?? []) {
      results.push({
        igMediaId: m.id,
        caption: m.caption ?? null,
        mediaType: m.media_type ?? null,
        productType: m.media_product_type ?? null,
        permalink: m.permalink ?? null,
        thumbnailUrl: m.thumbnail_url ?? null,
        mediaUrl: m.media_url ?? null,
        timestamp: m.timestamp ?? null,
        likeCount: m.like_count ?? 0,
        commentsCount: m.comments_count ?? 0,
      });
    }
    url = json.paging?.next ?? "";
    guard++;
    // Only paginate through the most recent ~200 items to bound API usage.
    if (results.length >= 200) break;
  }
  return results;
}

export async function getMediaInsights(
  media: Pick<IgMedia, "igMediaId" | "productType">,
  token: string,
): Promise<MediaInsights> {
  const isStory = media.productType === "STORY";
  const metrics = isStory
    ? ["reach", "views"]
    : ["reach", "views", "shares", "saved", "total_interactions"];
  const params = new URLSearchParams({
    metric: metrics.join(","),
    access_token: token,
  });
  try {
    const json = await igFetch<{ data: InsightItem[] }>(
      `${GRAPH}/${VERSION}/${media.igMediaId}/insights?${params.toString()}`,
    );
    const items = json.data ?? [];
    return {
      reach: readInsight(items, "reach"),
      views: readInsight(items, "views"),
      shares: readInsight(items, "shares"),
      saved: readInsight(items, "saved"),
      totalInteractions: readInsight(items, "total_interactions"),
    };
  } catch {
    return { reach: 0, views: 0, shares: 0, saved: 0, totalInteractions: 0 };
  }
}

export { InstagramError };
