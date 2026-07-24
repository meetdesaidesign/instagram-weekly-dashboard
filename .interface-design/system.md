# Interface Design System

## Direction and feel

A weekly pulse report for an Instagram creator. Open it, read one sentence,
know the week. Typography carries the hero — not a card grid. Surfaces stay
neutral; color is scarce and only used where it carries meaning.

- **Paper canvas.** Soft warm-grey page; content floats without a boxed panel shell.
- **One-page scroll.** Slim top nav replaces the old sidebar. Week is the home.
- **Color where required.** Warm orange accent for brand/actions; green/red for
  deltas; small chip accents (heart / eye / follow) inside the hero sentence.
- Depth strategy: **borders only** for cards below the fold. Hero has no cards.

## Tokens

Light (default):

| Token         | Value                          | Role                              |
|---------------|--------------------------------|-----------------------------------|
| background    | `#f4f3f1`                      | paper canvas                      |
| surface       | `#ffffff`                      | cards + active nav chips          |
| surface-2     | `#f4f4f4`                      | insets, inputs, hover fills       |
| surface-3     | `#ebebeb`                      | deeper insets                     |
| border        | `rgba(0,0,0,0.10)`             | hairlines                         |
| border-strong | `rgba(0,0,0,0.22)`             | emphasis / hover borders          |
| foreground    | `#111111`                      | primary text / hero ink           |
| muted         | `#555555`                      | secondary text                    |
| muted-2       | `#999999`                      | tertiary/metadata text            |
| accent        | `#ea580c`                      | orange — primary actions, brand   |
| accent-soft   | `rgba(234,88,12,0.10)`         | soft accent fills                 |
| on-accent     | `#ffffff`                      | text on accent                    |
| success       | `#16a34a`                      | positive deltas                   |
| danger        | `#dc2626`                      | negative deltas; likes chip       |
| warning       | `#d97706`                      | warnings                          |
| chart-1..4    | orange / blue / amber / teal   | series                            |

Dark (`.dark`): same structure as before (`#0a0a0a` canvas, `#141414` surface,
accent `#fb923c`).

Theme switching: `next-themes`, `attribute="class"`, light default, manual override.

## Color usage (restraint)

Use chromatic color only for:

1. **Accent** — primary buttons, logo mark, active nav icon, week strip, focus ring.
2. **Success / danger** — deltas, banners, toast icons; likes chip uses danger.
3. **Charts** — series via `--chart-1..4`; views chip uses chart-2.

Do **not** tint page backgrounds, hero text, or card shells with brand color.

## Typography

- UI text: **Satoshi**. Numerals in hero + meta: **Fragment Mono** / tabular-nums.
- **Hero sentence:** Satoshi bold, `clamp(2.25rem, 7vw, 4.25rem)`, leading 1.08,
  tracking -0.035em. Metric figures inherit weight; supporting clause uses muted.
- Inline **MetricChip**: ~1.15em tall mini surface beside each figure (studio-site
  signature adapted to Instagram metrics).
- Page titles (secondary routes): sans 22px/600, tracking -0.02em.
- Section titles: sans 14px/600.
- Body: sans 13–15px muted. Captions/meta: mono 11px uppercase tracked.
- Text hierarchy = 4 levels: foreground / muted / muted-2 / disabled.

## Spacing, radius, density

- Base unit 4px. Hero: generous vertical air (pt 8 / pb 14–20). Below-fold cards
  keep workbench density (16px pad, 24–32px section gaps).
- Radius: **6px** controls, **8px** cards, **20px** unused panel radius retained.
- Shell: sticky top nav on paper canvas; content `max-w-5xl` centered. No side
  panel, no mobile bottom nav.

## Signature

1. **Typography hero** — one display sentence weaving followers gained, likes,
   and reel views with inline MetricChips.
2. **Week strip** — 7-segment Sat→Sat progress (filled = days elapsed).
3. Mono uppercase week label + orange brand mark in the top bar.

## Week model

- Window: Saturday → Saturday (IST). `lib/dates.ts` → `saturdayWeekContaining`.
- In-progress weeks clamp data end to today.
- Hero metrics: followers gained (account snaps), likes (all posts published in
  range), reel views (sum of views on `productType === "REELS"`).

## Component patterns

- `TopNav` — sticky, blurred paper bar; active link = surface chip + elevated shadow.
- `WeekNav` — prev/next Saturday steps via `?week=YYYY-MM-DD`.
- `Button primary` — 34px h · accent bg · on-accent text.
- `Button secondary` — surface-2 bg · border.
- `Card` — surface · 1px border · 8px radius · 16px pad (below fold only).

## Motion

- <300ms, transform/opacity only, ease-out `cubic-bezier(0.23,1,0.32,1)`.
- Hero uses subtle `rise-in` stagger; respect `prefers-reduced-motion`.
