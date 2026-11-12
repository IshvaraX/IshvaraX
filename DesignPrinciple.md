# IshvaraX design principles

How the IshvaraX web app should look, read and move. This is the reference for anyone
adding a page or component — follow it so new work is indistinguishable from existing work.

The system is **Material 3 tokens, one typeface, one bold moment per page.** Everything
else is quiet.

---

## 1. Who it's for

Developers early in their journey who want to learn by building real things with other
people. The site must feel like a place made by coders for coders: direct, warm, unfussy.
Not a SaaS landing page, not a bootcamp brochure.

Three jobs, in order: show open projects, show what you can learn, make joining easy.

---

## 2. Color

All colors come from the Material 3 scheme in `src/app/theme.css`, exposed to Tailwind
via `@theme inline` in `globals.css`. **Never hard-code a hex in a component.**

| Role | Light | Dark | Tailwind class |
|---|---|---|---|
| Primary (purple) | `#6442d6` | `#9f86ff` | `bg-primary` / `text-primary` |
| Primary container | `#e7deff` | `#4b27bd` | `bg-primary-container` |
| Secondary container | `#dcdaf5` | `#45455a` | `bg-secondary-container` |
| Tertiary container | `#f1d3f9` | `#553f5d` | `bg-tertiary-container` |
| Amber container (extended) | `#ffdcc2` | `#6a3c00` | `bg-amber-container` |
| Canvas (page) | `#f2ecee` | `#211f21` | `bg-canvas` |
| Panel | `#f8f1f6` | `#1c1b1d` | `.m3-panel` |
| Surface containers | low → highest | | `bg-surface-container-{low,high,highest}` |
| On-surface / variant | `#1c1b1d` / `#4d4256` | `#e6e1e3` / `#cbc4cc` | `text-on-surface`, `text-on-surface-variant` |
| Outline variant (hairlines) | `#cbc4cc` | `#4d4256` | `border-outline-variant` |

Both themes are first-class. `color-scheme: light dark` follows the OS; the toggle writes
`data-theme` to `<html>` and `localStorage["ix-theme"]`.

### How to use it

- **Primary is for the one thing that matters** on a screen: the filled CTA, the live
  "open projects" count, focus rings, selected states. If two things on screen are
  solid primary, one of them is wrong.
- **The pastel rotation** (primary / secondary / tertiary / amber containers, see
  `PALETTE` in `PastelProjectCard.tsx`) is reserved for **card media headers** —
  project cards and Latest-content tiles. It is the site's signature; do not spend it
  on markers, badges, section backgrounds or icons.
- Everything else sits on neutral surfaces. Tiles are `.m3-panel`; nested emphasis
  uses `surface-container-high` / `-highest`, not a tinted container.
- Error is the only red. Status "closed" is `error-container`; "open" is `primary-container`.
- Text on a container always uses its paired `on-*` token. Never `opacity` text for
  hierarchy — use `on-surface-variant`.

---

## 3. Typography

One family: **Poppins** (400 / 500 / 600 / 700 loaded via `next/font`). **Roboto Mono**
only inside `code`, `pre`, and the `</>` hero glyph.

Body is 16 px / 24 px, letter-spacing **0**. Poppins is already wide; never add tracking
to body or labels.

| Class | Size / line | Weight | Tracking | Use |
|---|---|---|---|---|
| `.m3-hero-title` | clamp(2.5–4.5rem) / 1.02 | 600 | −0.035em | Home hero only |
| `.m3-section-title` | clamp(1.75–2.5rem) / 1.1 | 600 | −0.025em | Every `h1`/`h2` section header |
| `.m3-section-lead` | 17 / 26 | 400 | 0 | The one sentence under a section title; max 36rem |
| `.m3-headline-small` | 20 / 28 | 600 | −0.005em | Dialog titles, asides |
| `.m3-tile-title` | 20 / 26 | 600 | −0.01em | Card titles |
| `.m3-title-medium` | 16 / 24 | 500 | 0 | Names, list titles |
| `.m3-body-large` / `.m3-tile-desc` | 16 / 24 | 400 | 0 | Body copy |
| `.m3-body-medium` | 14 / 20 | 400 | 0 | Secondary copy |
| `.m3-label-large` | 14 / 20 | 500 | 0 | Buttons, chips, meta |
| `.m3-label-medium` | 12 / 16 | 500 | 0.01em | Tags, small badges |

Rules:

- **Weight carries hierarchy, not size alone.** Headings are 600; body is 400. Don't
  reach for 700 — it's loaded for the wordmark and nothing else.
- Headlines use `text-wrap: balance` (already in the classes). Body paragraphs cap at
  ~60–70 characters: `max-w-[34rem]`, `max-w-md`, or `max-w-prose`.
- Negative tracking scales with size: the bigger the type, the tighter. Never track
  small text out.
- **No all-caps labels. No eyebrow above a heading.** The section title is the first
  thing; the lead sentence is the second. A label is allowed *inside* a card when it
  encodes something (category, date) — never as decoration above a title.
- Don't accent a single word in a headline with color or italics.

---

## 4. Layout and spacing

- Page content lives in `main.mx-auto.max-w-[1320px]` with `px-5 md:px-12 xl:px-[88px]`.
  The hero alone breaks out to `max-w-[1680px]`.
- **Section rhythm is fixed:** `pt-20 md:pt-28` on every `<section>`, then title → lead
  → `mt-10` → content. No section adds bottom padding; the next section's top padding is
  the gap.
- Card grids use `gap-5`. Hero mosaic uses `gap-3`.
- Radius encodes depth: **24 px** for panels and tiles (`.m3-panel`, `.m3-tile`),
  **16 px** for media inside a tile (`.m3-tile-media`, `rounded-2xl` hero cells),
  **full** for buttons, chips, avatars. Inputs are 4 px (M3 outlined field). Don't
  invent a fifth radius.
- Elevation is almost never used. Tiles sit flat on the canvas; `is-interactive` tiles
  gain `elevation-2` on hover only. Dialogs use `elevation-3`.
- Hairlines (`border-outline-variant`) separate footer regions and frame asides. They
  are never decorative — the footer wave was removed for this reason.
- Avoid orphans in grids. Five items → first spans two columns (`md:col-span-2`) so the
  grid fills 2 + 3. Count your items before choosing columns.

### The hero

The bento mosaic is the single bold element on the site. Discipline keeps it readable:

- The live **"N open projects"** cell is the only solid-primary surface. It is the focal point.
- Product tiles rotate through `inverse-surface` and neutral containers, with
  `secondary-container` used at most once.
- Fillers (shown when fewer than five products are featured) are neutral with a
  primary-tinted icon. Never bring amber or tertiary into the hero.
- Left panel: brand mark + name → headline → one sentence → filled CTA + outlined CTA.
  Nothing else.

---

## 5. Components

Use the existing classes; don't restyle in place.

| Need | Use |
|---|---|
| Primary action | `.m3-btn.m3-btn-filled` (`.m3-btn-large` in the hero only) |
| Secondary action beside a primary | `.m3-btn.m3-btn-outlined` |
| Low-emphasis action in a card | `.m3-btn.m3-btn-tonal` |
| Inline link-like action | `.m3-btn.m3-btn-text` |
| Icon-only | `.m3-icon-btn` |
| Status / filter toggle | `.m3-segmented` + `.m3-segment[aria-pressed]` |
| Tag / skill | `.m3-chip`; `.m3-chip[aria-pressed]` when selectable |
| Text input | `<label class="m3-field"><input class="g-input"/><span class="m3-field-label">` (floating label) — or the `Field` component |
| Card | `.m3-tile` (+ `.is-interactive` if it has a hover target) → `.m3-tile-media` → `.m3-tile-body` |
| Page/section surface | `.m3-panel` |
| Key/value meta in a card | `<dl>` with `m3-label-medium` `dt` and `m3-body-medium` `dd` |
| Modal | `.m3-scrim` + `.m3-dialog` |

Rules:

- **Buttons never end in `→`** or carry a trailing chevron. The label states the action.
- Meta is never joined with middle dots (`A · B`). Use a labelled pair (`<dl>`), a
  preposition ("Python in Backend"), or separate lines.
- Status chips capitalize one word ("Open", "Closed"). No icons inside status chips.
- Numbered markers appear only for a real sequence (the five-step "How it works"). One
  color: `bg-primary-container text-on-primary-container`.
- Every image has a sized container and `object-cover`. User photos fall back to
  `.m3-avatar` initials.

---

## 6. Motion

Motion is for answering a user's action. Ambient motion is kept to one small thing.

- `Reveal` (scroll-in) is **opacity + 6 px, 350 ms, standard-decelerate.** It exists so
  sections don't pop; it should be barely perceptible. Stagger delays ≤ 40 ms per item.
- State layers (`.m3-state`, buttons, chips) use the M3 hover/press opacities. No
  scale, no lift, no color-shift on hover beyond that.
- Drawer slides in once (`m3-drawer-in`). Dialogs appear without animation.
- `prefers-reduced-motion: reduce` disables Reveal and the marquee entirely — already
  wired in `globals.css`; don't add motion outside those hooks.

---

## 7. Writing

Words are part of the interface. Write for the person reading, not the system.

- **Sentence case everywhere.** Headlines, buttons, labels, tabs.
- **Buttons name the outcome:** "Create an account", "Browse open projects", "Send
  message", "Set new password". Not "Submit", "Go", "Learn more".
- Keep one name per thing across the whole flow: it's *projects* (not opportunities,
  openings, gigs), *learnings* (not courses, videos), *apply* (not express interest).
- Section leads are one plain sentence that says what's below. No marketing adjectives.
- Errors say what happened and what to do: "This reset link has expired. Request a new
  one." Never apologise, never be vague.
- Empty states invite action: "No projects match that search. Try a different skill or
  keyword."
- Status messages reuse the button's verb: "Sent" after "Send", "Saved" after "Save".
- Em dashes are rare and only in body copy — not in labels or headings.
- Stay honest about PINAKA: it's a *separate* research project; the site says so once,
  in the compact aside, and nowhere else.

---

## 8. Accessibility floor

Non-negotiable, already met by the existing components; keep it that way.

- Visible focus: `outline: 2px solid primary; outline-offset: 2px` on every focusable.
- Color contrast follows M3 token pairs (`bg-X` always with `text-on-X`).
- Every icon-only control has `aria-label`. Decorative icons/`<span>`s have `aria-hidden`.
- Live regions: `role="status"` for success/notice text, `role="alert"` for errors.
- Dialogs: `role="dialog" aria-modal aria-labelledby`, scrim click closes.
- Inputs are wrapped in `<label>`; the floating label is real label text, not a placeholder.
- Images: meaningful `alt`, or `alt=""` when purely decorative.
- Layout holds from 360 px up; nothing relies on hover to be discoverable.

---

## 9. Don't

Things that were removed in the November 2026 refinement and must not return:

- `→` / `›` appended to button or link text
- `A · B · C` meta strings
- ALL-CAPS tracked eyebrow labels above headings
- Rainbow numbered markers / multi-color icon tiles
- Decorative dividers (waves, dotted rules, gradient bars)
- A floating "scroll down" FAB
- Fade-up-18px entrance on every section
- Section titles for content that is a note (PINAKA)
- Body letter-spacing, 500-weight headlines, 13 px control text
- New hex values, new radii, new typefaces

---

## 10. Checklist before opening a PR

- [ ] Section uses `m3-section-title` + `m3-section-lead`, `pt-20 md:pt-28`, `mt-10` to content
- [ ] One primary-colored element per viewport at most
- [ ] Pastel containers appear only in card media headers
- [ ] No `→`, no `·`, no all-caps labels, no eyebrow
- [ ] Buttons describe the outcome in sentence case
- [ ] Grid has no orphan at `md` and `lg`
- [ ] Works in both themes (toggle it)
- [ ] Keyboard: can reach and see focus on every control
- [ ] `tsc --noEmit` and `eslint src` pass
