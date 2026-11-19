# Phase 6B Handoff: Builder UI part 2

**Date:** 2026-11-19
**Status:** Complete. Lint clean (one existing warning), `npm run build` passes. Jordan ran `npm run dev` and confirmed the builder renders unstyled, as intended. No full desktop and mobile walkthrough was reported back, so the checks under "How to verify" are still worth a pass.
**Next phase:** 7, Checkout wiring + Shopify helper products

## Repo state at end of phase
- Frontend `latz09/c-and-j-custom-rods`: branch `phase-06b-builder-summary` (from `master` at `e77594c`), code commits `ed86599`, `4b0b067`, `2ce5c7e`, `a9d6181`, followed by the docs commit for this handoff and the tracker. Merged to `master`: pending
- CMS `latz09/c-and-j-custom-rods-cms`: untouched this phase. On `main` at `7aea0c2`.
- Pushed: no. Jordan pushes.

## What got built
Structure and data only. The only classes are behavioral (`fixed`, `lg:hidden`, `hidden lg:block`, `pb-24 lg:pb-0`).

| File | New / Changed | What it does |
|---|---|---|
| `components/sections/rod-builder/BuildSummary.js` | New | "Your Build" card. Rows: Series, Length (ice) or Application (open water), Blank color, Primary thread, Accent thread, Grip (`Material - Style - Finish`), Sticker (quoted or "None"). Unpicked required rows read "Not selected". Renders the total and an `action` slot for the button |
| `.../BuildTotal.js` | New (not in plan) | Shared total line for the card and the mobile bar. Without a Shopify base price it reads "Options: +$X (base price coming)", never "Total" |
| `.../AddBuildToCartButton.js` | New | Disabled until `validateBuild` passes. Label shows `firstProblem` (e.g. "Choose a grip."), then "Add to cart". Click re-validates and logs `{ config, attributes }` (stub) |
| `.../MobileBuildBar.js` | New | Fixed bottom bar, `lg:hidden`, with the total line and the button |
| `.../BuilderShell.js` | Changed | Removed `SHOW_DEBUG_CONFIG`, the config `<pre>` and the placeholder total. Computes `validateBuild` once, passes the button to both the card (hidden below `lg`) and the bar. Added `pb-24 lg:pb-0` so the bar doesn't cover the last section |

## Admin changes outside the code
- None. No Sanity or Shopify writes.

## Decisions made this phase
- Until Phase 7, the add-ons-only number is labeled "Options: +$X (base price coming)" so it can't be read as the full price (Jordan's call).
- The cart button appears once per breakpoint: in the card on desktop, in the bar on mobile.
- The bar is bottom-anchored, so it needs no coordination with `StickyNav` (which hides at the top).
- First pass stays unstyled. Jordan applies classnames.

## Deviations from the plan
- Plan 6.13 to 6.15 followed. Added `BuildTotal.js` as a shared helper.
- `BuildSummary` builds its own rows instead of calling `buildAttributes`, because that function assumes a finished build. It reuses `gripText` and `applicationText`.
- Plan not changed beyond the tracker and the 6B "As built" note.

## How to verify
1. `npm run dev`, open `/shop/custom/hole-hog` and an open water series.
2. Desktop (1024px and up): the card sits under the rod photo with the right rows per water type. The button starts disabled and names the next missing pick, then enables as "Add to cart". Clicking it logs `[builder] add to cart (stub)` with config and attributes. Cork split + accent + sticker shows "Options: +$35 (base price coming)" on Hole Hog.
3. Mobile (under 1024px): fixed bottom bar with the options line and the button, card button hidden, last section not covered, no overlap with the nav while scrolling.
4. `npm run lint` and `npm run build` pass (revert `public/sitemap-0.xml` after building).

## Known issues / loose ends
- No real total until Phase 7 creates the Shopify `Custom Rod Build` product (variant SKU = series slug). Delete the options-only branch in `BuildTotal.js` then.
- `AddBuildToCartButton` is a stub. Phase 7 replaces the `console.log` with `addBuildToCart`.
- Nothing has been seen styled. Mobile layout is Jordan's styling (Alyssa Q2 unanswered).
- `getBuilderProducts` is still untested against real Shopify.
- Thread categories are still the fitted guess from Phase 4.
- Build and `npm run dev` can't run at once on Windows (`.next/trace` EPERM). Stop dev before building.

## New open questions
- For Chris: none new.
- For Alyssa: none new (Q2 mobile layout and Q5 thread split still open).

## Start of next phase
- Prerequisites: Phase 6B merged to `master`. Jordan creates the two Shopify helper products (plan 7.3) or does so alongside the phase: `Custom Rod Build` (one variant per series, SKU = series slug) and `Build Options` ($5 to $90 in $5 steps), both published to the Headless channel.
- First file: `app/actions/builder.js` (plan 7.1).
- Files the next session should read: `docs/build/plan.md` Phase 7, this handoff, `handoffs/phase-05-builder-logic.md` and `phase-02-cart.md`, `lib/builder/`, `utils/shopify/getBuilderProducts.js`, `app/actions/cart.js`, `components/sections/rod-builder/AddBuildToCartButton.js`.
