import { redirect } from "next/navigation";

export default async function AnalyticsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.start) qs.set("start", params.start);
  if (params.end) qs.set("end", params.end);
  const q = qs.toString();
  redirect(q ? `/?${q}` : "/");
}
