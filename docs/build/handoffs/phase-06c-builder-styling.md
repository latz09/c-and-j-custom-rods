# Phase 6C Handoff: Builder styling (approximate first pass)

**Date:** 2026-11-19
**Status:** Complete. Lint clean (one existing warning), `npm run build` passes. Not yet seen in a browser by Claude, so the checks below are Jordan's.
**Next phase:** 7, Checkout wiring + Shopify helper products

## Repo state at end of phase
- Frontend `latz09/c-and-j-custom-rods`: branch `phase-06c-builder-styling` (from `master` at `5d47893`). Commits: plan tracker, landing styling, builder styling, then the docs commit for this handoff. Merged to `master`: pending
- CMS: untouched.
- Pushed: no. Jordan pushes.

## What got styled
Existing Tailwind tokens and typography classes only. No new colors, fonts or config changes. The cart drawer is untouched.

| File | What changed |
|---|---|
| `app/shop/custom/page.js` | Hero panel: gradient, `Topography`, centered `h1` + `text-paragraph-lg`, same panel pattern as `RodSeriesHero` |
| `SeriesPicker.js` | Heading, tab buttons (ice = `bg-primary`, open water = `bg-secondary`, same as the in-stock toggle), 1 / 2 / 3 column grid |
| `SeriesCard.js` | Built from `RodCard`: same gradient shell, `bg-primary/50` / `bg-secondary/50` badge, image hover tilt, swap-arrow CTA. Coming-soon card has no link and no CTA |
| `BuilderShell.js` | `lg:grid-cols-5`: left 2 cols (rod image card + Your Build, sticky on desktop), right 3 cols (options). Stacks on mobile |
| `BuilderBreadcrumb.js`, `BuilderHeader.js`, `BuilderSection.js` | Breadcrumb links as in `ProductBreadcrumb`, `h1-product` title, `h5 text-primary` price, `h6` section labels with a small price note |
| `ApplicationSelect.js`, `BlankColorSelect.js`, `LengthSelect.js`, `ThreadColorSelect.js`, `GripSelect.js`, `StickerInput.js` | Chips, tiles and inputs. Selected state is gray (`bg-accent`) with a dark border |
| `optionClasses.js` | New. Shared `chipClasses` and `tileClasses` so all option groups match |
| `BuildSummary.js`, `BuildTotal.js` | Gray card with ruled rows, bold total. `BuildTotal` now takes `className` |
| `AddBuildToCartButton.js` | Full-width primary button with `CartIcon`, same disabled look as `AddToCartButton` |
| `MobileBuildBar.js` | Fixed bottom bar with border, background and `shadow-lifted` |

## Decisions
- Used `bg-accent` and `border-accent` instead of the `#D2D2D2` one-offs `RodCard` uses (same color, token).
- `text-paragraph-sm` is used in existing cards but has no CSS rule. New code uses `text-caption` instead.
- Left column is `lg:sticky lg:top-1.5`. If `StickyNav` covers it, bump the top offset.
- Grip subheadings ("Grip material", "Grip style") added to match the mock.
- Section labels are `h6`, "Your Build" is `h5`. Heading levels skip, like the rest of the site.

## Deviations from the mocks
- Series card image uses the existing `rodSeriesCard` preset (square), not the mock's wide crop.
- Rod image on the builder uses `rodSeriesHero`, contained.
- Thread dropdowns show the native select text (`Name (code)`), no custom dropdown.
- Open water tab uses the secondary green fill (no mock exists).

## How to verify
1. `npm run dev`, open `/shop/custom`: hero, tabs (both), cards, Ice Reaper coming-soon card without a link or CTA.
2. `/shop/custom/hole-hog` at 1024px and up: two columns, left column sticky, Your Build rows, button disabled with the missing-pick label, then enabled.
3. An open water series: application cards with Included / upcharge pills, selected card gray.
4. Under 1024px: single column, fixed bottom bar, last section not covered.
5. Check the sticky left column against `StickyNav` while scrolling.
6. `npm run lint` and `npm run build` pass (revert `public/sitemap-0.xml` after building).

## Known issues / loose ends
- Nothing seen in a browser by Claude. Expect spacing and sizing tweaks.
- Mobile layout is a basic stack until Alyssa sends hers (Q2).
- `BuildTotal` still has the options-only branch until Phase 7.
- Cart drawer styling waits until after Phase 7.
- Build and `npm run dev` can't run at once on Windows. Stop dev before building.

## Start of next phase
Same as the 6B handoff: Phase 7, first file `app/actions/builder.js`. Kickoff: `Starting Phase 7. Follow CLAUDE.md.`
