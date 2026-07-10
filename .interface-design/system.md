# Interface Design System — Monochrome

## Direction and feel

A precise instrument panel for Instagram growth, rendered in **strict black / grey / white**
(Grok-style). The user is a creator checking their account's vitals: cool, focused,
data-forward. Feels like a terminal for your account, not a brochure. Dense but never
cramped; hierarchy comes from weight and value, never hue.

- **No chromatic color anywhere.** The accent is black (light mode) / white (dark mode).
- Meaning is never carried by hue alone: deltas use arrows + signs, status uses icons
  (check / cross / alert) and text, chart series use greyscale steps + dash patterns.
- Depth strategy: **borders only.** No drop shadows anywhere. Low-opacity black/white
  alpha borders — no blue cast.

## Tokens

Light (default):

| Token        | Value                       | Role                          |
|--------------|-----------------------------|-------------------------------|
| background   | `#fafafa`                   | canvas                        |
| surface      | `#ffffff`                   | cards                         |
| surface-2    | `#f4f4f4`                   | insets, inputs, hover fills   |
| surface-3    | `#ebebeb`                   | deeper insets                 |
| border       | `rgba(0,0,0,0.10)`          | hairlines                     |
| border-strong| `rgba(0,0,0,0.22)`          | emphasis / hover borders      |
| foreground   | `#111111`                   | primary text                  |
| muted        | `#555555`                   | secondary text                |
| muted-2      | `#999999`                   | tertiary/metadata text        |
| accent       | `#111111`                   | black — primary actions, nav  |
| on-accent    | `#ffffff`                   | text on accent                |
| success/danger| `#111111`                  | greyscale; icon/sign carries meaning |
| chart-1..4   | `#111111 #666666 #a3a3a3 #cccccc` | series greys            |

Dark (`.dark`):

| Token        | Value                       |
|--------------|-----------------------------|
| background   | `#0a0a0a`                   |
| surface      | `#141414`                   |
| surface-2    | `#1c1c1c`                   |
| surface-3    | `#242424`                   |
| border       | `rgba(255,255,255,0.11)`    |
| border-strong| `rgba(255,255,255,0.24)`    |
| foreground   | `#f0f0f0`                   |
| muted        | `#a3a3a3`                   |
| muted-2      | `#6b6b6b`                   |
| accent       | `#f5f5f5` (white)           |
| on-accent    | `#0a0a0a`                   |
| success/danger| `#f0f0f0`                  |
| chart-1..4   | `#f5f5f5 #a3a3a3 #737373 #4d4d4d` |

Theme switching: `next-themes`, `attribute="class"`, system default, manual override.

## Monochrome semantics

- **Deltas**: positive = `text-foreground`, negative = `text-muted`; direction always
  shown by arrow icon (`ArrowUpRight` / `ArrowDownRight`) and `+`/`−` sign.
- **Banners**: neutral surface + border-strong; `CheckCircle2` (success) or
  `AlertCircle` (danger) icon carries the tone.
- **Status badges**: filled black/white chip (`bg-accent text-on-accent`) = active/connected;
  outline + muted text = inactive.
- **Multi-series charts**: greyscale steps plus `strokeDasharray` per series
  (solid, `5 3`, `2 2`, `7 3 2 3` — see `chartDashes` in `components/charts.tsx`);
  legend swatches are line samples that mirror the dash.
- **Toasts**: Sonner icons overridden to greyscale in `components/toaster.tsx`.

## Typography

- UI text: **Geist Sans**. Numerals, stat labels, deltas, timestamps, code-ish metadata: **Geist Mono**.
- Hero stat values: mono 28px/500, `tabular-nums`, letter-spacing -0.02em.
- Secondary stat values: mono 20px/500.
- Stat labels: mono 10px/500 uppercase, tracking 0.07em, muted.
- Page titles: sans 22px/600, tracking -0.02em.
- Section titles: sans 14px/600.
- Body: sans 13px, muted. Captions/meta: 11px muted-2.
- Text hierarchy = 4 levels: foreground / muted / muted-2 / disabled (muted-2 at 60%).

## Spacing, radius, density

- Base unit 4px. Card padding **16px** (tight, workbench density). Section gaps 24–32px.
- Radius scale: **6px** controls, **8px** cards, 12px modals. No pills except week-strip segments.
- Grid gaps: 12px between stat cards, 16px between chart cards.

## Signature

**Week strip** — a 7-segment horizontal strip (2px tall segments, 4px gaps, filled = days
elapsed this week, accent color). Appears on: dashboard hero card, sync status,
loading skeletons. Unique to this product's "week" mental model.

Other signatures: mono uppercase labels with underscore styling available (`FOLLOWERS_GAINED`
optional — keep normal spaces in real UI, mono uppercase is enough), hairline dividers,
single-pixel accent left-edge on active nav item.

## Component patterns

- `Button primary` — 34px h · 8px 15px pad · 6px radius · 13px/500 · black bg (light) / white bg (dark), on-accent text.
- `Button secondary` — same metrics · surface-2 bg · border.
- `Card` — surface bg · 1px border · 8px radius · 16px pad.
- `Input` — surface-2 bg (darker than card = inset) · 1px border · 6px radius · focus = accent border + 2px ring at 25% opacity.
- Nav active item: surface-2 fill + 2px accent left edge + foreground text.
- Chart grid: `--border` stroke dasharray 3 3, axes text mono 10px muted-2.
- Tooltips/popovers: surface-2, border-strong, 8px radius.

## Motion

- <300ms, transform/opacity only, ease-out `cubic-bezier(0.23,1,0.32,1)`.
- Button press `scale(0.97)`. No entrance animation on high-frequency views; subtle
  fade+4px rise on card grids (30ms stagger), respect `prefers-reduced-motion`.
