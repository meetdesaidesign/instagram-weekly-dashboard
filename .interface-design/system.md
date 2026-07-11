# Interface Design System

## Direction and feel

A precise instrument panel for Instagram growth. The user is a creator checking
their account's vitals: focused, data-forward. Surfaces stay neutral; color is
scarce and only used where it carries meaning (action, status, series).

- **Neutral canvas.** Grey/white surfaces and text hierarchy do the structural work.
- **Color where required.** Warm orange accent for primary actions and brand marks;
  green/red for deltas and status; a small chart palette for series.
- Depth strategy: **borders only** for cards and panels. Active nav uses a soft
  elevated shadow on a white (`surface`) chip so the current page reads clearly.

## Tokens

Light (default):

| Token         | Value                          | Role                              |
|---------------|--------------------------------|-----------------------------------|
| background    | `#f2f2f2`                      | canvas / sidebar                  |
| surface       | `#ffffff`                      | main panel + cards                |
| surface-2     | `#f4f4f4`                      | insets, inputs, hover fills       |
| surface-3     | `#ebebeb`                      | deeper insets / active nav        |
| border        | `rgba(0,0,0,0.10)`             | hairlines                         |
| border-strong | `rgba(0,0,0,0.22)`             | emphasis / hover borders          |
| foreground    | `#111111`                      | primary text                      |
| muted         | `#555555`                      | secondary text                    |
| muted-2       | `#999999`                      | tertiary/metadata text            |
| accent        | `#ea580c`                      | orange — primary actions, brand   |
| accent-soft   | `rgba(234,88,12,0.10)`         | soft accent fills                 |
| on-accent     | `#ffffff`                      | text on accent                    |
| success       | `#16a34a`                      | positive deltas, success state    |
| danger        | `#dc2626`                      | negative deltas, errors           |
| warning       | `#d97706`                      | warnings                          |
| chart-1..4    | orange / blue / amber / teal   | series                            |

Dark (`.dark`):

| Token         | Value                          |
|---------------|--------------------------------|
| background    | `#0a0a0a`                      |
| surface       | `#141414`                      |
| surface-2     | `#1c1c1c`                      |
| surface-3     | `#242424`                      |
| border        | `rgba(255,255,255,0.11)`       |
| border-strong | `rgba(255,255,255,0.24)`       |
| foreground    | `#f0f0f0`                      |
| muted         | `#a3a3a3`                      |
| muted-2       | `#6b6b6b`                      |
| accent        | `#fb923c`                      |
| accent-soft   | `rgba(251,146,60,0.14)`        |
| on-accent     | `#0a0a0a`                      |
| success       | `#4ade80`                      |
| danger        | `#f87171`                      |
| warning       | `#fbbf24`                      |
| chart-1..4    | orange / blue / amber / teal   |

Theme switching: `next-themes`, `attribute="class"`, system default, manual override.

## Color usage (restraint)

Use chromatic color only for:

1. **Accent** — primary buttons, logo mark, active nav icon, week strip, focus ring, selected chips.
2. **Success / danger** — deltas, banners, config status, toast icons.
3. **Charts** — series strokes/fills via `--chart-1..4`.

Do **not** tint page backgrounds, cards, body text, or borders with brand color.

- **Deltas**: positive = `text-success`, negative = `text-danger`; always also show
  arrow icon and `+`/`−` sign (hue is not the only cue).
- **Banners**: soft tinted fill + matching icon color.
- **Status badges**: filled accent chip = active/connected; outline + muted = inactive.
- **Multi-series charts**: color primary; `strokeDasharray` secondary
  (solid, `5 3`, `2 2`, `7 3 2 3` — see `chartDashes`).
- **Toasts**: success/danger/warning icons use semantic tokens.

## Typography

- UI text: **Satoshi**. Numerals, stat labels, deltas, timestamps, code-ish metadata: **Fragment Mono**.
- Hero stat values: mono 28px/500, `tabular-nums`, letter-spacing -0.02em.
- Secondary stat values: mono 20px/500.
- Stat labels: mono 10px/500 uppercase, tracking 0.07em, muted.
- Page titles: sans 22px/600, tracking -0.02em.
- Section titles: sans 14px/600.
- Body: sans 13px, muted. Captions/meta: 11px muted-2.
- Text hierarchy = 4 levels: foreground / muted / muted-2 / disabled (muted-2 at 60%).

## Spacing, radius, density

- Base unit 4px. Card padding **16px** (tight, workbench density). Section gaps 24–32px.
- Radius scale: **6px** controls, **8px** cards, 12px modals, **20px** main content panel. No pills except week-strip segments.
- Shell: sidebar sits on the canvas; main content is a bordered `surface` panel with `rounded-panel` and a gutter from the nav (no divider line).
- Grid gaps: 12px between stat cards, 16px between chart cards.

## Signature

**Week strip** — a 7-segment horizontal strip (2px tall segments, 4px gaps, filled = days
elapsed this week, accent color). Appears on: dashboard hero card, sync status,
loading skeletons. Unique to this product's "week" mental model.

Other signatures: mono uppercase labels, hairline dividers, orange brand mark.

## Component patterns

- `Button primary` — 34px h · accent bg · on-accent text.
- `Button secondary` — same metrics · surface-2 bg · border.
- `Card` — surface bg · 1px border · 8px radius · 16px pad.
- `Input` — control bg (darker than card = inset) · 1px border · 6px radius · focus = accent border + 2px ring.
- Nav active item: white `surface` fill + soft elevated shadow + bold text + accent icon.
- Chart grid: `--border` stroke dasharray 3 3, axes text mono 10px muted-2.
- Tooltips/popovers: surface-2, border-strong, 8px radius.

## Motion

- <300ms, transform/opacity only, ease-out `cubic-bezier(0.23,1,0.32,1)`.
- Button press `scale(0.97)`. No entrance animation on high-frequency views; subtle
  fade+4px rise on card grids (30ms stagger), respect `prefers-reduced-motion`.
