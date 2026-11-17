> Written in the claude.ai Project before the docs moved into the repo. Old paths map like this: `current/cj-rod-builder-finish-plan.md` is now `docs/build/plan.md`, `current/README-start-here.md` is replaced by `CLAUDE.md`, `rod-builder/*` is now `docs/build/*`, `handoffs/*` is now `docs/build/handoffs/*`.

# Phase 0 Handoff: Planning, decisions, project reorg, old data export

**Date:** 2026-11-17
**Status:** Complete
**Next phase:** 1, Quick fixes

## Repo state at end of phase
- Frontend `latz09/c-and-j-custom-rods` (`master`): commit `35d2e59` (Aug 26, 2026)
- CMS `latz09/c-and-j-custom-rods-cms` (`main`): commit `9e6f24b` (Aug 26, 2026)
- No code changed in this phase.

## What got built
No code. Planning docs: the plan, start-here protocol, handoff template, design notes (all three of Alyssa's screens) and the old CMS data map.

## What the repos actually contain (audit)
- **Frontend:** Next.js 15 App Router, plain JS, Tailwind, Framer Motion. All shop routes render real Shopify + Sanity data. `AddToCartButton` only logs to console. No cart code. `/shop/custom` and `/contact` were placeholder pages. Shopify utils in `utils/shopify/`, Sanity queries in `data/queries/`. `components/ui/Topography.js` exists (needed for the builder landing hero).
- **CMS:** 14 schema types. `rodSeries` has name, slug (series tag), applicationType, description, heroImage, previewImage, order. `customBuilderPage` is hero + SEO only. No builder option types exist; all builder data lives in the old site's Sanity project.

## Bugs found (fixed in Phase 1)
- `app/shop/rods/[slug]/page.js` imported `Link` from `react-email` (unused).
- Rod, reel and apparel product detail components never passed `variantId` to their CTA components.
- `shopifyFetch` hardcoded `next: { revalidate: 60 }`, which can't apply to cart calls.
- Contact page was a placeholder.

## Decisions made this phase
- **Cart API checkout for custom rods, not draft orders.** Two hidden Shopify helper products (`Custom Rod Build` with a variant per series at base price, `Build Options` in $5 steps to $90). Server validates and prices, adds both lines with shared `_buildId` attributes. Reasons: one checkout for rod + reel + apparel (keeps the ice rod + reel cross-sell working), testable now with Bogus Gateway, no draft-order clutter.
- Builder catalog lives in Sanity (blank colors, threads, grips, applications, pricing rules). Base prices live in Shopify and drive every "Starting at" price.
- Builder fields go on the existing `rodSeries` doc, not a separate series type.
- Series builder status is an enum (live / comingSoon / hidden), not a boolean, because the landing mock shows Ice Reaper as "Coming soon!".
- **Phase 4 does not import the whole old tarball** (it holds customer orders and contact submissions). A script builds a builder-only import file and patches `rodSeries`. Details in `docs/build/old-cms-data-map.md`.

## From the design screenshots
- **Landing:** hero, "Category and series" tabs (Ice selected by default), cards with image, water-type badge, name, "Starting at", short blurb, "Start building". Needs a card blurb field per series.
- **Builder:** two columns, rod photo + "Your Build" summary on the left, options on the right.
- Sticker is **personalized text** (+$10), not a toggle.
- Grip is material, then style (priced per material + water type), then a **named** finish photo ("Cork - Split Grip - Mosaic" in the summary).
- Mock prices are placeholders in two spots: open water grip chips show ice prices, and the ice total doesn't add upcharges.
- Full notes in `docs/build/design-notes.md`; images in `docs/build/design/`.

## Old Sanity export
- **Old v1 project:** `xov8qqkx`, dataset `production`. Old Studio repo: `/c/LatzWebDesign/CODE/Client-Code/Active/2025/c-and-j-custom-rods/cms`.
- Export: 292 documents, 387 images, published only.
- Files in `/c/LatzWebDesign/INFO/Clients/Active/2026/c-and-j/cj-export/`: `cj-old-full.tar.gz` (Phase 4 uses this) and `cj-old-data.tar.gz` (data only, image refs stripped).
- Key findings (full detail in `docs/build/old-cms-data-map.md`): photos exist for all 12 blanks, all 28 grips and every series; blank colors have no hex; grip finishes have no names; thread categories aren't in the data; live blank lists differ from Chris's Aug changelog; Hole Hog's live price is $119.
- **Gotcha:** Git Bash mangles `C:\...` paths. Use `/c/...`.

## Start of next phase
- First file: `app/shop/rods/[slug]/page.js`.
