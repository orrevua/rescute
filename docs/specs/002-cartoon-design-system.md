# Cartoon Design System — Spec

**Status:** Draft
**Date:** 2026-07-05
**Related:** `docs/HANDOFF.md` (section "Cartoon Design System Applied Globally"), `rescute/src/app/globals.css`

## Goal
Document the "cartoon" visual language exactly as it exists today, tokenize its repeated raw values (hex colors, border widths, radii, shadow offsets, transition timings) into CSS custom properties so they stop being duplicated across a dozen rules and ~15 inline `className` strings, and close the gaps where UI elements were never converted to the shared classes. This is a systematization pass — **no visual redesign**.

## Context & Current State

The design language lives entirely in `rescute/src/app/globals.css:19-289` and is applied via four utility classes plus a card-hover/badge-animation subsystem. Every color, width, radius, offset, and timing is hardcoded as a literal (`#1a3a38`, `3px`, `5px 5px 0`, `0.15s`), repeated in-place.

### The ink color and the four component classes (source of truth)

- **Ink color** `#1a3a38` (dark teal) — the single border/shadow color. Also set globally as `* { border-color: #1a3a38 }` (`globals.css:21-23`).
- **Accent** `#0d9488` (focus + splash), **accent-soft** `#ccfbf1` (badge bg), **accent-strong** `#115e59` (badge text).
- **Font**: Inter, via `@theme inline { --font-sans: var(--font-inter) }` and the explicit `body` rule (`globals.css:3-10`).

| Class | Location | Border | Radius | Rest shadow | Hover | Active/Focus | Transition |
|---|---|---|---|---|---|---|---|
| `.cartoon-card` | `globals.css:26-36` | none (3px ring via shadow) | `1.5rem` | `0 0 0 3px #1a3a38, 5px 5px 0 #1a3a38` | ring + `7px 7px 0`, `translate(-2px,-2px)` | — | `transform/box-shadow 0.15s ease` |
| `.cartoon-btn` | `globals.css:39-55` | none (3px ring via shadow) | `9999px` | `0 0 0 3px #1a3a38, 4px 4px 0 #1a3a38` | ring + `5px 5px 0`, `translate(-1px,-1px)` | active: ring + `1px 1px 0`, `translate(2px,2px)` | `0.1s ease`; `font-weight:800` |
| `.cartoon-input` | `globals.css:58-69` | `2.5px solid #1a3a38` | `1rem` | `3px 3px 0 #1a3a38` | — | focus: `5px 5px 0 #0d9488`, `translate(-1px,-1px)`, `outline:none` | `box-shadow/transform 0.15s ease` |
| `.cartoon-section` | `globals.css:285-289` | `3px solid #1a3a38` | `2rem` | `6px 6px 0 #1a3a38` | — | — | none |

### Card-hover + badge animation subsystem (leave visually intact)
`.cat-card-grid`, `.cat-card-wrapper` and the `:hover` scale/blur/z-index rules (`globals.css:71-102`); the health-badge water-drop system `.card-badges`, `.card-badge-slot`, `.card-badge-drop`, `.card-badge-label`, `.drop-svg` and keyframes `cbDropFall`, `cbBadgePop`, `cbSplashA`, `cbSplashB` (`globals.css:104-282`). These reuse the same ink `#1a3a38` and accents `#0d9488/#ccfbf1/#115e59` inline.

### Where the tokens are duplicated (hardcoded raw values)
`#1a3a38` appears ~20× in `globals.css` alone and again across component files. Inline re-implementations of the cartoon look (not using the classes):

- `rescute/src/components/ui/Badge.tsx:4` — pill + `border-2 border-teal-950` + `shadow-[2px_2px_0_#1a3a38]`, re-inlined verbatim in `rescute/src/app/dashboard/donations/page.tsx:44`, `rescute/src/app/dashboard/intents/page.tsx:39`, `rescute/src/app/dashboard/partners/page.tsx:66`.
- `rescute/src/components/ui/ActionCard.tsx:28,37` — hand-rolled `shadow-[0_0_0_3px_#1a3a38,4px_4px_0_#1a3a38]` + hover, mirroring `.cartoon-card`/`.cartoon-btn`. Re-inlined in `rescute/src/app/page.tsx:31,78`.
- `rescute/src/components/dashboard/DashboardNav.tsx:26` — hand-rolled `.cartoon-btn` shadow/hover/active inline.
- `rescute/src/components/dashboard/CatForm.tsx:129,137,168,198,209` — inline `shadow-[0_0_0_2.5px_#1a3a38,3px_3px_0_#1a3a38]` and `shadow-[2px_2px_0_#1a3a38]` tiles/chips.
- `rescute/src/app/foster/profile/page.tsx:64`, `rescute/src/app/dashboard/profile/page.tsx:77`, `rescute/src/components/dashboard/CatForm.tsx:209` — identical accent pill `shadow-[0_0_0_2.5px_#0d9488,3px_3px_0_#0d9488]` (3× duplicate).
- `rescute/src/app/cat-care/page.tsx:66,77` — chat bubbles `border-2 border-teal-950 shadow-[2px_2px_0_#1a3a38]`.
- `rescute/src/components/ui/Navbar.tsx:31` (`shadow-[0_3px_0_#1a3a38]`) and `rescute/src/components/ui/Footer.tsx:7` (`shadow-[0_-3px_0_#1a3a38]`).

### Color inconsistency (real bug, not just style)
Several elements draw their border with Tailwind's `border-teal-950` while drawing their shadow with `#1a3a38`. **`teal-950` is not `#1a3a38`** — the border and its own drop-shadow render as two different dark-teal shades. Affected: `Badge.tsx:4`, `Navbar.tsx:31`, `Footer.tsx:7`, `cat-care/page.tsx:66,77`, `DonationCard.tsx:27` (`border-2 border-teal-950` progress bar), and the three re-inlined badges above.

### Gaps — plain Tailwind never converted to the cartoon language
- `rescute/src/components/ai/ChatInput.tsx:20,25` — input `border border-stone-300` + button `rounded-xl bg-teal-800`. Plain.
- `rescute/src/components/foster/FosterForm.tsx:11,14` — city input, textareas `rounded-xl border border-stone-300`, submit button `rounded-2xl bg-teal-800`. Plain.
- `rescute/src/components/dashboard/DonationPostForm.tsx:24-49` — form `rounded-3xl bg-white p-6 shadow-sm`, all inputs/textarea/select `rounded-xl border`, button `rounded-xl bg-teal-800`. Plain.
- `rescute/src/app/dashboard/donations/[id]/edit/page.tsx:42-77` — same plain pattern as DonationPostForm (its sibling create form). Plain.
- `rescute/src/components/cats/AdoptionModal.tsx:12,15` — inputs `rounded-xl border border-stone-300`, buttons `rounded-xl bg-teal-800` / `rounded-2xl bg-amber-400`. Plain. (Its structural twin `ContributionModal.tsx` is fully converted and is the reference.)
- `rescute/src/app/error.tsx:10` — button `rounded-xl bg-teal-800`. Plain.
- `rescute/src/components/ai/FAQAccordion.tsx:10-11` — accordion `border-b border-stone-200`, no cartoon treatment (minor; the `cat-care` page wraps it in a `cartoon-section`).
- `rescute/src/components/cats/CatGallery.tsx:23,38` — main image `rounded-[2rem]` and thumbnails `border-2` have no ink border/offset shadow (minor).

### Already compliant (reference implementations — do not touch)
`ContributionModal.tsx`, `PartnerForm.tsx`, `PartnerCard.tsx`, `DonationCard.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`, `Modal.tsx`, `Card.tsx`, `SearchBar.tsx`, `FilterBar.tsx`, `CepSearch.tsx`.

## Proposed Design

### 1. Token layer in `globals.css`
Add a `:root` custom-property block and a Tailwind `@theme` color so both raw CSS and Tailwind utilities resolve to one source of truth. **All computed values below equal what is used today — no visual change.**

```
:root {
  /* ink + accents */
  --cartoon-ink: #1a3a38;
  --cartoon-accent: #0d9488;
  --cartoon-accent-soft: #ccfbf1;
  --cartoon-accent-strong: #115e59;
  /* border widths */
  --cartoon-border: 3px;        /* ring / section */
  --cartoon-border-input: 2.5px;
  /* radii */
  --cartoon-radius-card: 1.5rem;
  --cartoon-radius-section: 2rem;
  --cartoon-radius-input: 1rem;
  --cartoon-radius-pill: 9999px;
  /* transitions */
  --cartoon-ease-card: 0.15s;
  --cartoon-ease-btn: 0.1s;
}
```

Expose the ink to Tailwind utilities via `@theme` so `border-ink` / `bg-ink` / `text-ink` replace `border-teal-950` and inline `#1a3a38`:

```
@theme inline {
  --color-ink: #1a3a38;
  --color-cartoon-accent: #0d9488;
}
```

Rewrite the four component classes and the global `* { border-color }` to consume the variables (e.g. `box-shadow: 0 0 0 var(--cartoon-border) var(--cartoon-ink), 5px 5px 0 var(--cartoon-ink)`). Shadow **offsets** (`4px/5px/6px/7px/8px`) stay literal — they are per-state design values, not a repeated token; only the ink color and shared widths/radii/timings get variables.

### 2. Usage guide (add as a comment block at the top of the cartoon section in `globals.css`, and mirror in this spec)
- **`cartoon-section`** — the outermost container of a page region or a form/modal body (largest radius `2rem`, static `6px` shadow). One per region. Example: filters bar, chat container, `Modal` body, `PartnerForm`.
- **`cartoon-card`** — a discrete content item inside a section/grid (radius `1.5rem`, animated hover lift). Use for cat cards, donation cards, partner cards, dashboard list items. Prefer the `<Card>` component (`components/ui/Card.tsx`) which already wraps it.
- **`cartoon-btn`** — any actionable `<button>`/`<a role=button>`/`<Link>` styled as a button (pill, press animation). Never a bare `rounded-xl bg-teal-800`.
- **`cartoon-input`** — any `<input>`/`<textarea>`/`<select>` (radius `1rem`, focus lifts to accent shadow). Never a bare `rounded-xl border`.
- **`<Badge>`** — the pill badge (`components/ui/Badge.tsx`); always import the component instead of re-inlining the pill markup.
- **Ink color** — always `border-ink` / `text-ink` / `bg-ink` or `var(--cartoon-ink)`; never `border-teal-950` and never a raw `#1a3a38` literal in new code.

### Trade-offs
- **Tailwind `@theme` color vs. pure CSS vars**: exposing `--color-ink` lets existing `border-teal-950` sites migrate to `border-ink` with a one-word swap and fixes the border/shadow mismatch for free. Chosen over leaving those as arbitrary `[#1a3a38]` values.
- **Keeping shadow offsets literal**: turning every `4px/5px/7px` into a variable would over-abstract state-specific values and make the rules harder to read for zero dedup benefit (each offset appears in one place). Rejected.
- **ActionCard / DashboardNav inline shadows**: these are hand-rolled variants of `cartoon-card`/`cartoon-btn` with extra image/gradient behavior. Migrating them to the classes risks visual drift; the low-risk win is only to swap their raw `#1a3a38`/`border-teal-950` for the `ink` token. Full class migration is out of scope.

## Scope
- **In scope**: token extraction in `globals.css`; usage-guide comment; converting the plain-Tailwind gap files to the four classes; swapping `border-teal-950`/raw `#1a3a38` for the `ink` token; de-duplicating the re-inlined `<Badge>` and accent-pill markup.
- **Out of scope**: any change to computed colors, radii, offsets, or timings (pixel-identical output required); redesigning the badge animation; migrating `ActionCard`/`DashboardNav` off their bespoke inline shadows (token-swap only); a mobile hamburger menu (tracked separately in HANDOFF).

## Interfaces / Models / Endpoints
No API/type changes. New CSS contract only:
- CSS custom properties on `:root` (names above).
- Tailwind theme colors `ink`, `cartoon-accent` (usable as `border-ink`, `bg-ink`, `text-ink`, `shadow-[…var(--cartoon-ink)]`).
- No change to the four class names or the badge/grid class names — existing 34 files keep working unchanged.

## Impact Analysis
- **Tests**: none exist for CSS; verification is visual + `npx tsc --noEmit` (unaffected, no TS surface change).
- **Backward compatibility**: token rewrite is internal to `globals.css`; the four classes render pixel-identically, so the ~34 consuming files need no change from the tokenization unit.
- **Blast radius**: the `border-ink` swaps change border color on Badge/Navbar/Footer/DonationCard/cat-care bubbles from `teal-950` → `#1a3a38` — this is the intended bug fix (matches the shadow). Confirm the shift is acceptable during review (it makes borders slightly lighter/greener to match existing shadows).
- **Failure modes**: Tailwind v4 `@theme` must be at top level of `globals.css`; a missing var falls back to nothing (border-color would be transparent) — keep the `* { border-color }` fallback pointed at the var.
- **Performance**: none (static CSS).

## Implementation Units

1. **Extract tokens in globals.css** — files: `rescute/src/app/globals.css` — change: add `:root` custom-property block and extend the `@theme` block with `--color-ink`/`--color-cartoon-accent`; rewrite `* { border-color }` and the four component classes (`.cartoon-card`, `.cartoon-btn`, `.cartoon-input`, `.cartoon-section`) to reference the vars for ink color, border widths, radii, and transition timings. Offsets stay literal. — acceptance: compiled CSS for the four classes is byte-for-byte equivalent to today; no visual diff.
2. **Tokenize badge/animation subsystem** — files: `rescute/src/app/globals.css` — change: replace remaining raw `#1a3a38`/`#0d9488`/`#ccfbf1`/`#115e59` literals in `.card-badge-*`, splash, and keyframe rules with the vars. — acceptance: badge water-drop animation unchanged; grep for raw ink hex in globals.css returns only the `:root`/`@theme` definitions.
3. **Add usage-guide comment** — files: `rescute/src/app/globals.css` — change: insert the "which class for which role" guide as a comment above the component classes. — acceptance: comment present, matches the guide in this spec.
4. **Convert ChatInput** — files: `rescute/src/components/ai/ChatInput.tsx` — change: input → `cartoon-input`; button → `cartoon-btn`. — acceptance: renders with ink border + offset shadow; no `border-stone-300`.
5. **Convert AdoptionModal** — files: `rescute/src/components/cats/AdoptionModal.tsx` — change: `Input` helper + message textarea → `cartoon-input`; both buttons → `cartoon-btn` (keep `bg-amber-400`/`bg-teal-800`). Mirror `ContributionModal.tsx`. — acceptance: no `rounded-xl border border-stone-300`; buttons are cartoon pills.
6. **Convert FosterForm** — files: `rescute/src/components/foster/FosterForm.tsx` — change: `Question` textarea + city input → `cartoon-input`; submit button → `cartoon-btn`. — acceptance: no `border border-stone-300`.
7. **Convert DonationPostForm** — files: `rescute/src/components/dashboard/DonationPostForm.tsx` — change: form wrapper → `cartoon-section bg-white`; inputs/textarea/select → `cartoon-input`; button → `cartoon-btn`. — acceptance: no `rounded-xl border` / `shadow-sm`.
8. **Convert edit-donation page** — files: `rescute/src/app/dashboard/donations/[id]/edit/page.tsx` — change: same conversions as Unit 7 on the edit form. — acceptance: matches the converted create form.
9. **Convert error page button** — files: `rescute/src/app/error.tsx` — change: button → `cartoon-btn bg-teal-800`. — acceptance: cartoon pill.
10. **De-duplicate re-inlined Badges** — files: `rescute/src/app/dashboard/donations/page.tsx`, `rescute/src/app/dashboard/intents/page.tsx`, `rescute/src/app/dashboard/partners/page.tsx` — change: replace the inline pill markup with `<Badge>` (pass color classes via `className`). — acceptance: no inline `shadow-[2px_2px_0_#1a3a38]` badge spans in these three files.
11. **Fix ink/teal-950 mismatch** — files: `rescute/src/components/ui/Badge.tsx`, `rescute/src/components/ui/Navbar.tsx`, `rescute/src/components/ui/Footer.tsx`, `rescute/src/components/donations/DonationCard.tsx`, `rescute/src/app/cat-care/page.tsx` — change: replace `border-teal-950` → `border-ink` and raw `#1a3a38` shadow literals → `var(--cartoon-ink)` (or `shadow-[…theme]`). — acceptance: border and shadow use the same ink value; no `border-teal-950` remains in these files.
12. **De-duplicate accent pill** — files: `rescute/src/app/foster/profile/page.tsx`, `rescute/src/app/dashboard/profile/page.tsx`, `rescute/src/components/dashboard/CatForm.tsx` — change: swap the raw `#0d9488` shadow literal in the identical accent pill for `var(--cartoon-accent)`. — acceptance: no raw `#0d9488` shadow literal in these three files.

## Open Questions
- The `border-ink` fix (Unit 11) intentionally changes rendered border color from `teal-950` to `#1a3a38`. Confirm at review that matching the shadow (rather than repainting shadows to `teal-950`) is the desired direction. Default assumption: yes — `#1a3a38` is the documented ink and the majority of surfaces already use it.
- `FAQAccordion` (`components/ai/FAQAccordion.tsx`) and `CatGallery` thumbnails are only lightly off-language. Left out of units as low-value; add as a follow-up only if visual audit flags them.
