import { prisma } from "@/lib/prisma";
import { refreshLongLivedToken } from "@/lib/instagram";

export const DEFAULT_CAPTION_TEMPLATE = `You are writing an Instagram caption for a Gujarati reels page (topics: careers, jobs, students, and workers guidance). Follow this EXACT structure and order. Put ONE blank line between each of the 4 parts.

PART 1 - Gujarati (code-mixed):
- 4 to 6 short lines in natural, conversational Gujarati (Gujarati script).
- Keep common technical/industry words in English exactly as Gujarati speakers say them (e.g. diploma, salary, job, skills, career, apps, growth). Do NOT translate those into pure Gujarati.
- Explain the value / key points of the reel based on the given topic.
- End Part 1 with a Gujarati call-to-action to save the reel, e.g. "આ reel save કરો — [short reason] કામ આવશે."

PART 2 - English:
- 3 to 4 concise lines conveying the same core message in simple English.
- End with a short CTA like "Save this reel for ...".

PART 3 - SEO keywords:
- Exactly one line with 5 comma-separated, lowercase SEO keyword phrases relevant to the topic. No hashtags in this line.

PART 4 - Hashtags:
- Exactly 5 hashtags on one line, space-separated, written in CamelCase.
- ALWAYS include #GujaratiReels.
- The other 4 must be highly relevant to the reel topic and optimized for Instagram discovery/SEO.

Rules:
- Output ONLY the caption (all 4 parts, in order). No headings, labels, part numbers, explanations, or code fences.
- Use ONLY Gujarati script and English words. Never use words from any other language.
- Keep the helpful, direct, value-first tone of the examples. Minimal or no emojis.`;

export const DEFAULT_CAPTION_EXAMPLES = `Example 1:
Civil diploma ફક્ત building બનાવવાની field નથી.
Roads, bridges, metro, infrastructure, construction management — opportunities ઘણી છે.
પણ ફક્ત diploma પર અટકશો તો growth limited થઈ શકે છે.
Skills + site experience + આગળ BE/BTech કરશો તો career વધુ strong બનશે.
Civil પસંદ કરતા પહેલા interest અને long-term goal બંને વિચારો.
આ reel save કરો — admission પહેલા કામ આવશે.

A Civil Diploma opens doors to construction, infrastructure, and site engineering.
But for better growth, keep upgrading your skills and consider a BE/BTech in the future.
Choose the field based on your interest, not just trends.
Save this reel before making your decision.

civil diploma gujarat, civil engineering career, diploma admission, construction jobs india, career guidance

#CareerAdvice #CivilEngineering #Diploma #StudentsIndia #GujaratiReels

Example 2:
ઘણા લોકો job નથી મળતી એવું કહે છે…
પણ reality એ છે કે તેઓ proper platforms use જ નથી કરતા.
આ reel માં 3 apps discuss કર્યા છે જ્યાંથી ઘરે બેઠા job apply કરી શકો છો:
• Apna Job
• WorkIndia
• Naukri.com
Fresher હોય કે experienced — daily apply કરવું પડે.
એક application થી job નથી મળતી.
આ reel save કરો — job search માં કામ આવશે.

Finding jobs online is easier when you use the right platforms.
This reel covers 3 useful job apps: Apna, WorkIndia, and Naukri.com.
Consistent applications matter more than people think.
Save this reel for your job search.

job apps india, apna job app, workindia jobs, naukri.com jobs, online job search india

#CareerAdvice #JobSearch #Freshers #GujaratiReels #JobsIndia

Example 3:
Contract worker હો એટલે salary late આવે — આ normal નથી.
Rule મુજબ contract workers ને salary દર મહિને 7 તારીખ પહેલા મળવી જોઈએ.
ઘણા workers ને આ ખબર નથી એટલે months સુધી wait કરે છે.
Salary delay થાય તો written proof રાખો અને contractor/company ને raise કરો.
તમારો પગાર "favor" નથી — તમારો હક છે.
આ reel save કરો — awareness માટે કામ આવશે.

Contract workers are also supposed to receive salary on time.
As per rules, wages should be paid before the 7th of every month.
Many workers still wait because they don't know their rights.
Save this reel for awareness.

contract worker salary rule, salary before 7th india, labour law india, employee rights india, contract labour rules

#EmployeeRights #LabourLaw #CareerAdvice #GujaratiReels #Workplace`;

function fallbackSettings() {
  const now = new Date();
  return {
    id: 1,
    igUserId: null as string | null,
    igUsername: null as string | null,
    accessToken: null as string | null,
    tokenExpiresAt: null as Date | null,
    captionTemplate: DEFAULT_CAPTION_TEMPLATE,
    captionExamples: DEFAULT_CAPTION_EXAMPLES,
    updatedAt: now,
    createdAt: now,
  };
}

export async function getSettings() {
  try {
    const existing = await prisma.setting.findUnique({ where: { id: 1 } });
    if (existing) return existing;
    return await prisma.setting.create({
      data: {
        id: 1,
        captionTemplate: DEFAULT_CAPTION_TEMPLATE,
        captionExamples: DEFAULT_CAPTION_EXAMPLES,
      },
    });
  } catch {
    // Database not reachable yet (e.g. local preview without DATABASE_URL).
    return fallbackSettings();
  }
}

export async function updateSettings(data: {
  captionTemplate?: string;
  captionExamples?: string;
}) {
  return prisma.setting.upsert({
    where: { id: 1 },
    create: { id: 1, captionTemplate: DEFAULT_CAPTION_TEMPLATE, ...data },
    update: data,
  });
}

export async function isConnected(): Promise<boolean> {
  try {
    const s = await prisma.setting.findUnique({ where: { id: 1 } });
    return Boolean(s?.accessToken && s?.igUserId);
  } catch {
    return false;
  }
}

/**
 * Returns a valid access token, refreshing it first if it expires within
 * `refreshWithinDays`. Throws if the account is not connected.
 */
export async function getValidToken(
  refreshWithinDays = 10,
): Promise<{ token: string; userId: string }> {
  const s = await getSettings();
  if (!s.accessToken || !s.igUserId) {
    throw new Error("Instagram account is not connected.");
  }
  const now = Date.now();
  const expiresAt = s.tokenExpiresAt?.getTime() ?? 0;
  const msLeft = expiresAt - now;
  const shouldRefresh = msLeft < refreshWithinDays * 24 * 60 * 60 * 1000;

  if (shouldRefresh) {
    try {
      const refreshed = await refreshLongLivedToken(s.accessToken);
      const newExpiry = new Date(now + refreshed.expiresInSeconds * 1000);
      await prisma.setting.update({
        where: { id: 1 },
        data: { accessToken: refreshed.accessToken, tokenExpiresAt: newExpiry },
      });
      return { token: refreshed.accessToken, userId: s.igUserId };
    } catch {
      // Refresh can fail if the token is < 24h old; fall back to current token.
      return { token: s.accessToken, userId: s.igUserId };
    }
  }
  return { token: s.accessToken, userId: s.igUserId };
}
