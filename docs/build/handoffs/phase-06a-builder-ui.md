# Phase 6A Handoff: Builder UI part 1

**Date:** 2026-11-19
**Status:** Complete. Lint clean (one existing warning), `npm run build` passes. Jordan tested both builders in the browser: all picks work and the live total updates.
**Next phase:** 6B, Builder UI part 2 (summary card, mobile bar, add-to-cart button)

## Repo state at end of phase
- Frontend `latz09/c-and-j-custom-rods`: branch `phase-06a-builder-ui` (from `master` at `b89f5dd`), code commits `e31d906` and `d72a9ea`, followed by the docs commit for this handoff and the tracker. Merged to `master`: pending
- CMS `latz09/c-and-j-custom-rods-cms`: untouched this phase. On `main` at `7aea0c2`.
- Pushed: no. Jordan pushes.

## What got built
All structure and data only. No styling classes beyond behavioral ones (`relative`, `group block`). Option state is exposed as `data-selected` and `aria-checked` so styling can hook onto it.

| File | New / Changed | What it does |
|---|---|---|
| `app/shop/custom/page.js` | Changed | Landing. Fetches `FETCH_BUILDER_PAGE_QUERY` + `getBuilderProducts()`, renders hero (`Topography`) and the picker. Metadata still uses the old `FETCH_CUSTOM_BUILDER_PAGE_QUERY` because `BPM` expects top-level `seo` |
| `app/shop/custom/[series]/page.js` | New | Fetches the series (`notFound()` unless live) and base price, renders `BuilderShell` |
| `components/sections/rod-builder/SeriesPicker.js` | New | Client. Water-type tabs, Ice default |
| `.../SeriesCard.js` | New | Card. Live links to `/shop/custom/[slug]`. Coming-soon shows the CMS label, no link, no "Start building" |
| `.../BuilderShell.js` | New | Client. `useReducer` config, live total via `getBuildPrice`, section order by water type, fixed series photo |
| `.../BuilderBreadcrumb.js`, `BuilderHeader.js`, `BuilderSection.js` | New | Breadcrumb, plain series name + "Starting at", shared section wrapper |
| `.../ApplicationSelect.js` | New | Open water stacked cards, "Included" or upcharge |
| `.../BlankColorSelect.js` | New | Photo + swatch + name, swatch-only fallback |
| `.../LengthSelect.js` | New | Ice chip row from `pricingRules.iceLengths` |
| `.../ThreadColorSelect.js` | New | Warm / Cool / No color dropdowns, one pick across all three. `optional` adds "Remove" (accent) |
| `.../GripSelect.js` | New | Material, then priced style, then finish photo tiles. Changing material or style clears the grip |
| `.../StickerInput.js` | New | Text input capped at the CMS max, character count |
| `.../formatPrice.js` | New | `$119` / `$124.99`. Also used by `SeriesCard` |

## Admin changes outside the code
- None. No Sanity or Shopify writes.

## Decisions made this phase
- Alyssa Q1: rod photo is one fixed series photo, no swap on blank color.
- Alyssa Q3: builder title is the plain series name.
- Alyssa Q4: coming-soon cards have no link.
- Alyssa Q2: no mobile design, so everything stacks in one column. Real mobile layout is Jordan's styling.
- "Starting at" is hidden when Shopify returns no base price (no fallback price source).
- Both Phase 6A pages stay unstyled until Jordan applies classnames.

## Deviations from the plan
- Plan 6.3 to 6.12 followed. `formatPrice.js` added as a shared helper (not in the plan).
- `BuilderShell` carries a temporary left-column placeholder: a bare total and a config `<pre>` behind `SHOW_DEBUG_CONFIG`. 6B removes both.
- Plan not changed.

## How to verify
1. `npm run dev`, open `/shop/custom`: both tabs list their series, Ice first. Ice Reaper (if present) shows the coming-soon label with no link.
2. `/shop/custom/hole-hog` (ice) and an open water series: every option can be picked, the add-ons total updates. Hole Hog with cork split + accent + sticker shows $35 of add-ons while there is no Shopify base price.
3. Picking a thread in one dropdown clears the other two. Changing grip material or style clears the finish.
4. A hidden or unknown slug (e.g. `/shop/custom/musky-casting`) returns 404.
5. `npm run lint` and `npm run build` pass (revert `public/sitemap-0.xml` after building).

## Known issues / loose ends
- "Starting at" and the full total only appear once Phase 7 creates the Shopify `Custom Rod Build` product (variant SKU = series slug). Until then the total shows add-ons only.
- `getBuilderProducts` still untested against real Shopify.
- Thread categories are still the fitted guess from Phase 4. Dropdown counts depend on them.
- The Phase 5 handoff says Phases 3 to 5 were unmerged. `origin/master` is at `b89f5dd`, so they were merged.
- No metadata for the builder page beyond the title (`Custom <name> | Rod Builder`).
- Build and the `npm run dev` server can't run at once on Windows (`.next/trace` EPERM). Stop dev before building.

## New open questions
- For Chris: none new.
- For Alyssa: none new (Q1 to Q4 answered by Jordan this session, Q5 still open).

## Start of next phase
- Prerequisites: Phase 6A merged to `master`.
- First file: `components/sections/rod-builder/BuildSummary.js` (plan 6.13).
- Files the next session should read: `docs/build/plan.md` Phase 6B, this handoff, `docs/build/design-notes.md` and the builder screenshots, `BuilderShell.js`, `lib/builder/` (`buildAttributes.js` exports `gripText` and `applicationText` for summary rows, `validateBuild` returns `missing` for the button text).
