# Phase 5 Handoff: Builder logic

**Date:** 2026-11-19
**Status:** Complete. Lint clean (one existing warning), `npm run build` passes, `scripts/check-builder.mjs` passes 30 of 30 against the real dataset.
**Next phase:** 6A, Builder UI part 1

## Repo state at end of phase
- Frontend `latz09/c-and-j-custom-rods`: branch `phase-05-builder-logic` (branched from `phase-04-data-migration`), last code commit `e8a9e75`, followed by the docs commit for this handoff and the tracker. Merged to `master`: pending
- CMS `latz09/c-and-j-custom-rods-cms`: untouched this phase. Still on `phase-04-data-migration` at `7aea0c2`. Merged to `main`: pending
- Pushed: no. Nothing from Phases 3, 4 or 5 is pushed (the Phase 3 and 4 frontend branches are local only). Jordan pushes.

## What got built
| File | New / Changed | What it does |
|---|---|---|
| `data/queries/builder/FETCH_BUILDER_PAGE_QUERY.js` | New | Returns `{ page, series }`. `page`: title, hero, `seriesPicker` labels, `pricingRules`, seo. `series`: `builderStatus` live or comingSoon, ordered by `order` then name, with `image` = `coalesce(builderImage, previewImage)` |
| `data/queries/builder/FETCH_BUILDER_SERIES_QUERY.js` | New | Param `$slug`. One live series (null otherwise) with `blanks[]` (series order), `applications[]` (with `_key`), global `threads` (by code), `grips` filtered to the series' water type, plus `page.builderCopy` and `page.pricingRules` |
| `lib/builder/constants.js` | New | `DEFAULT_STICKER_MAX` (20), `OPTIONS_STEP` (5), `OPTIONS_MAX` (90), `emptyBuildConfig(slug)` |
| `lib/builder/pricing.js` | New | `getBuildPrice(config, catalog, rules, basePrice)` returns `{ base, lines, addOnTotal, total }`. Works in cents. Safe on partial configs for the live total. Also `getGripPrice`, `getStickerText`, `getStickerMax` |
| `lib/builder/validateBuild.js` | New | `validateBuild(config, catalog, rules)` returns `{ valid, missing, errors, firstProblem }`. `missing` feeds the "Choose a grip" button text, `errors` are disallowed picks |
| `lib/builder/buildAttributes.js` | New | `buildAttributes(config, catalog, buildId)` returns `[{ key, value }]` for line item properties. Also exports `gripText` and `applicationText` for the summary card |
| `utils/shopify/getBuilderProducts.js` | New | `getBuilderProducts({ fresh })` returns `{ base, options, ok }`. Plus `parseBuilderProducts` (testable without a network) |
| `scripts/check-builder.mjs` | New | Read-only check against the live Sanity dataset (no token). Run: `node --no-warnings scripts/check-builder.mjs` |

### Config shape (used by all three lib functions)
```
{ seriesSlug, applicationKey (open water, application._key), blankId, length (ice, inches),
  primaryThreadId, accentThreadId (optional), gripId, stickerText ('' = none) }
```
`catalog` is the FETCH_BUILDER_SERIES_QUERY result. `rules` is `pricingRules`. On the server, Phase 7 must fetch both fresh itself and never trust a client-supplied catalog or price.

### Order-facing attribute keys
`_buildId` (hidden), `Series`, `Length` (ice) or `Application` (open water), `Blank Color`, `Primary Thread` ("Name (code)"), `Accent Thread` or "None", `Grip` ("Cork - Split Grip - Finish"), `Sticker Text` or "None".

## Admin changes outside the code
- None. No Sanity writes, no Shopify calls this phase.

## Decisions made this phase
- **Base price is a fourth argument** to `getBuildPrice`, since it lives in Shopify.
- **SKU convention (needed in Phase 7):** each `Custom Rod Build` variant's SKU must equal the series slug (`hole-hog`, `hog-whip`, `panfish-carbon`, `eyece-commander`, `bass-spinning`, `walleye-spinning`, `panfish-spinning`, and `ice-reaper` when it goes live). `Build Options` variants are matched by price, so their titles don't matter.
- **Add-on total must be a multiple of $5, max $90.** Enforced in `validateBuild`, so a Sanity price edit that breaks the Build Options variants is rejected instead of mispriced. All 42 current application upcharges and all grip prices pass.
- **Sticker max** falls back to `DEFAULT_STICKER_MAX = 20` until Chris answers question 8 and `stickerMaxCharacters` is set in Sanity.
- **Ice lengths are flat** (no upcharge), pending question 1.
- Sticker text is trimmed, blank counts as none, control characters are rejected.
- The accent thread may equal the primary thread (not blocked).
- `.js` extensions on lib imports and on `getBuilderProducts`'s `shopifyFetch` import so the check script runs in plain Node.

## Deviations from the plan
- 5.2 also returns `page.builderCopy` and `page.pricingRules`, so the builder page needs one fetch instead of two.
- 5.3 `getBuildPrice` has the extra `basePrice` argument.
- Added `scripts/check-builder.mjs` (not in the plan).
- `getBuilderProducts` is untested against real Shopify: the helper products don't exist until Phase 7. Only the parser was tested, with a fake response.

## How to verify
1. `node --no-warnings scripts/check-builder.mjs` from the repo root: "All checks passed".
2. Mock totals: ice $144.99 (base 119.99 + cork split $15 + sticker $10), open water $459.99 (base 399.99 + application $0 + cork split grip $40 + accent $10 + sticker $10). The open water mock's "+$15" grip label is the ice price. The data says $40, and $40 is what reaches $459.99.
3. `npm run lint` passes with the existing `ApparelProductDetail.js` warning only. `npm run build` passes.

## Known issues / loose ends
- `getBuilderProducts` needs real products to test (Phase 7).
- `npm run build` rewrites `public/sitemap-0.xml`. Revert it with `git checkout public/sitemap-0.xml` before committing. Phase 8 removes generated sitemaps from the repo.
- Hidden series (Musky Casting etc.) have a price in the mock but can't be built. The check script swaps the live filter to price the mock.
- The check picks the first threads in the list instead of the mock's Teal and Haybale. Prices don't depend on thread choice.
- Thread categories are still guesses (Phase 4), and the Warm / Cool / No color dropdowns in 6A depend on them.

## New open questions
- For Chris: none new. Question 8 (sticker max) and question 1 (ice length upcharge) now have code defaults.
- For Alyssa: none new.

## Start of next phase
- Prerequisites: Phase 3, 4 and 5 branches pushed and merged in order. `sanity deploy` run. Phase 4 Studio checks done and series `order` values set.
- First file: `app/shop/custom/page.js` (plan 6.1).
- Files the next session should read: `docs/build/plan.md` Phase 6A, this handoff, `docs/build/design-notes.md` and the three images in `docs/build/design/`, `lib/builder/` and `data/queries/builder/`.
- UI note: for Shopify base prices on the landing page and builder header, call `getBuilderProducts()` (cached). Until Phase 7 creates the products it returns `ok: false` and empty maps, so the UI needs a no-price fallback (for example, hide "Starting at").
