# Phase 4 Handoff: Data migration

**Date:** 2026-11-19
**Status:** Complete in Sanity and code. Jordan's Studio checks (4.6) and manual content steps (4.5) are still his.
**Next phase:** 5, Builder logic

## Repo state at end of phase
- Frontend `latz09/c-and-j-custom-rods`: branch `phase-04-data-migration`, last code commit `71eeb16`, followed by the docs commit for this handoff and the tracker. Merged to `master`: pending
- CMS `latz09/c-and-j-custom-rods-cms`: branch `phase-04-data-migration`, last commit `7aea0c2`. Merged to `main`: pending
- Pushed: no, neither repo. Jordan pushes.
- Phase 3 (`phase-03-cms-schemas`) was already on `main` in the CMS repo when this phase started (HEAD `4f59847`).

## What got built
| File | Repo | New / Changed | What it does |
|---|---|---|---|
| `scripts/migrate-builder-data.mjs` | CMS | New | Commands: `generate`, `patch-series`, `pricing`, `create-series`, `blurbs`, `in-stock-status`. The last four of those plus `patch-series` accept `--dry-run`. Reads the token from `cms/.env.local` (never printed) |
| `schemaTypes/rodSeries.js` | CMS | Changed | New `inStockStatus` field (live / comingSoon / hidden, default live), ungrouped, separate from `builderStatus` |
| `data/queries/rodSeries/FETCH_ALL_RODSERIES_QUERY.js` | Frontend | Changed | Filters `inStockStatus != "hidden"`, returns `inStockStatus` |
| `data/queries/pages/FETCH_IN_STOCK_RODS_PAGE_QUERY.js` | Frontend | Changed | Same filter and field in the `series` block |
| `data/queries/pages/FETCH_SERIES_LANDING_PAGE_QUERY.js` | Frontend | Changed | Returns null for hidden and comingSoon series, so `/shop/rods/[slug]` 404s |
| `components/sections/in-stock-rods/RodsBySeriesSection.js` | Frontend | Changed | `comingSoon` series render a "Coming soon" card: label and button text, no link, no "Starting at" line |
| `CLAUDE.md` | Frontend | Changed | `/add-dir` instruction replaced with the `.claude/settings.local.json` note. `.gitignore` now ignores that file |

## What is now in the production dataset (`vx4e4v7t`)
| Type | Count | Notes |
|---|---|---|
| `threadColor` | 63 | IDs `threadColor-001`. Category is a **guess** (see below) |
| `blankColor` | 14 | IDs `blankColor-black` etc. 12 with photos, Seafoam and Titanium Chrome without |
| `grip` | 28 | 13 ice, 15 open water. IDs like `grip-ice-cork-split-7`, `grip-open-water-cork-grip-1` |
| `rodSeries` patched | 8 existing | builder fields set, see below |
| `rodSeries` created | 3 | `rodSeries-bass-casting`, `-musky-casting`, `-musky-spinning` (hidden) |
| `customBuilderPage.pricingRules` | 1 | See below |

### rodSeries state
| Slug | builderStatus | inStockStatus | Blanks | Applications |
|---|---|---|---|---|
| hole-hog | live | live | Black, Seafoam, Chartreuse Yellow, Glow | n/a |
| hog-whip | live | live | Black, Hot Pink, Neon Green, Neon Orange | n/a |
| panfish-carbon (Carbon Crush) | live | live | Black, Metallic Blue | n/a |
| eyece-commander | live | live | Black, Titanium Chrome | n/a |
| ice-reaper | comingSoon | comingSoon | Black, Hot Pink, Neon Green, Neon Orange | n/a |
| bass-spinning | live | live | Black | 9 |
| walleye-spinning | live | live | Black | 5 |
| panfish-spinning | live | live | Black | 7 |
| bass-casting | hidden | hidden | Black | 15 |
| musky-casting | hidden | hidden | Black | 3 |
| musky-spinning | hidden | hidden | Black | 3 |

Applications total 42 across 6 open water series. Every live series has `builderImage` (the old `mainImage`); Ice Reaper has none. The three hidden series carry the shared old placeholder photo.

### Pricing Rules written
- `iceLengths`: 20 to 36 in steps of 2
- `iceGripPrices`: cork split 15, cork straight 10, EVA split 5, EVA straight 0
- `openWaterGripPrices`: cork split 40, cork straight 30, EVA split 10, EVA straight 0
- `accentPrice` 10, `stickerPrice` 10
- `stickerMaxCharacters`: **not set** (open question 8)

### Card blurbs written to `builderCardBlurb` (drafts, Jordan edits in Studio)
- hole-hog: Highly sensitive tip with a powerful backbone for confident panfish fishing. (from the landing mock)
- hog-whip: The Hole Hog's ultra-sensitive tip with a softer backbone, made for finesse presentations to finicky crappies and bluegills.
- panfish-carbon: A solid carbon blank with a fast taper to a sensitive tip. You feel the bite instead of watching for it.
- eyece-commander: A solid carbon walleye rod with a big backbone for hauling in large fish and a tip sensitive enough for lighter lures.
- ice-reaper: Our next ice rod is on the way. Check back soon. (placeholder, no old overview exists)
- bass-spinning: Lightweight, small-diameter graphite built as a true workhorse for nearly every modern bass technique.
- walleye-spinning: Ultra-high modulus graphite with an ultra-fine tip that picks up the subtlest bites.
- panfish-spinning: Light and sensitive for panfish jigs, bobbers with live bait and small inline spinners.

The mock only shows one blurb, and its example card isn't tied to a series in the design notes. It was given to Hole Hog.

## Admin changes outside the code
- Backup of the dataset before any write: `cj-export/backups/vx4e4v7t-production-pre-phase4-2026-11-18.tar.gz` (25 docs, 71 assets). Done.
- Import of `builder-import.ndjson` with `--replace`: done (105 docs).
- `patch-series`, `create-series`, `blurbs`, `pricing`, `in-stock-status` run for real: done.
- Extracted export (untouched, outside both repos): `cj-export/extracted-full/production-export-2026-11-17t18-39-26-656z/`, with `builder-import.ndjson` next to `data.ndjson`.
- `sanity deploy`: to do (Jordan). Needed for the hosted Studio to show `inStockStatus` (and the Phase 3 types if not yet deployed).
- Carbon Crush: rename the display name from "Panfish Carbon" in Studio, to do (Jordan). The slug stays `panfish-carbon`.
- Studio checks (4.6): to do (Jordan). Counts, every photo showing, hex values by eye.
- 4.5 manual: Ice Reaper `builderImage`, edits to the blurbs above, real grip finish names once Chris sends them.
- Base prices are not a Studio task. They live in Shopify (Phase 7).

## Decisions made this phase
- **Blank colors:** the target (changelog) lists, not the old live ones, per Jordan. Pending Chris's confirmation (question 4).
- **Blank hex:** sampled from the photos. Mean RGB of opaque pixels, trimmed to the middle 50% by brightness. The metallics come out darker than they look in the photos, and White reads grey-blue. Check by eye. **Seafoam `#7FD1B9` and Titanium Chrome `#8D9094` are guesses** (no photos).
- **Grip finish names:** "Cork Split 1, 2, 3" style, numbered per water type, material and style in the old array order. The three ice cork split grips that had old descriptions use them instead: `grip-ice-cork-split-8` "Light and dark brown", `-11` "Brown with shades of dark brown", `-12` "Brown with dark brown stripes". `grip-ice-cork-split-7` has no description and is "Cork Split 1".
- **Thread categories are a guess, not Chris's or Alyssa's.** Rule fitted to the expected 35 warm / 23 cool / 5 neutral split, which it hits exactly. Neutral: saturation under 0.07 or lightness under 0.10 (Black, White, Light Grey, Light Blue, CC/BC). Warm: hue 96 or below, or 279 or above. Cool: the rest. Odd-looking results: Concrete and Rain Cloud are cool, Med Green, Spring Green and Neon Green are warm, Purple is warm but Purple Haze is cool. Replace with the real list from `rod-builder-prototype-singlepage.html`, or edit in Studio.
- **Two separate visibility fields on `rodSeries`:** `builderStatus` controls the builder, `inStockStatus` controls the In-Stock Rods pages. An empty `inStockStatus` counts as live, so the in-stock page can't empty out. A hidden or comingSoon series' `/shop/rods/<slug>` 404s.
- **Ice Reaper** is `comingSoon` for both builder and in-stock, with a "Coming soon" card on each and no link.
- **Hidden series order values:** the three hidden series have `order` 101 to 103. The other eight series have no `order` at all, so their display order is arbitrary until real values are set in Studio.

## Deviations from the plan
- **Three series created in the new project.** Plan 4.3 patches existing `rodSeries` docs only, but Bass Casting, Musky Casting and Musky Spinning did not exist, so their 21 applications had nowhere to go. They were created hidden so the check (42 applications across 6 series) holds. Plan updated.
- **New field `inStockStatus` and frontend query changes** were not in the plan. Without them the new hidden series would have appeared as dead-end cards on the In-Stock Rods page. The first attempt filtered on `builderStatus`, which wrongly tied the two pages together; it was replaced by `inStockStatus` (`ab2a8e0` then `71eeb16`). Revisit in Phase 8 when `HIDE_EMPTY_STOCK_MESSAGING` comes out.
- **Coming-soon card behavior** added to `RodsBySeriesSection.js` (no link, no price line). This partly overlaps the temporary `HIDE_EMPTY_STOCK_MESSAGING` logic, which was left as is.
- **Script has extra commands** (`create-series`, `blurbs`, `in-stock-status`) and Ice Reaper handling inside `patch-series`. Plan 4.4 and 4.5 expected pricing and Ice Reaper by hand.
- **Image sampling uses `sharp` from the frontend repo's `node_modules`** (a Next.js dependency) because the CMS repo has none. No packages were installed. The script falls back to `../code/node_modules/sharp`.
- **Node 22 was needed for the Sanity CLI** and used for every command (`~/.nvm/versions/node/v22.23.2`). The default shell Node is 20.19.5.

## How to verify
1. In Studio (`npm run dev` in `../cms` with Node 22), Rod Builder folder: 63 thread colors, 14 blank colors (12 with photos), 28 grips (13 ice, 15 open water), all with photos where expected.
2. Rod Series: eleven docs. Each live series has blanks, blurb and builder image. Open water series show their applications (9, 5, 7, 15, 3, 3).
3. Builder Page, Pricing Rules tab: values as listed above.
4. `npm run dev` in the frontend: `/shop/rods` shows no Bass Casting, Musky Casting or Musky Spinning, and Ice Reaper appears as a "Coming soon" card with no link. `/shop/rods/bass-casting` and `/shop/rods/ice-reaper` both 404. Not yet browser-tested by Claude.
5. `npm run lint` in the frontend passes with one existing warning in `ApparelProductDetail.js`. `npm run build` was not run this session.

## Known issues / loose ends
- Thread categories, Seafoam and Titanium Chrome hex, and Ice Reaper's blurb are guesses or placeholders (see Decisions).
- Series display order is not set on the eight original series.
- Products tagged with a hidden series lose their series name label on in-stock rod cards (the label comes from the filtered series list). Only matters if a rod in a hidden series is ever stocked.
- `stickerMaxCharacters` unset, no ice length upcharge field (question 1 open).
- Carbon Crush's display name is still "Panfish Carbon" until Jordan renames it.
- The old description text for grips is gone for the other 25 grips (they had none).
- `builder-import.ndjson` re-runs are safe (fixed IDs, `--replace`), but a re-run overwrites any Studio edits to those 105 docs. Do not re-run `generate` plus import after Chris's edits begin.

## New open questions
- For Chris: confirm the thread warm / cool / neutral assignment is acceptable (or send the real one), and confirm hex for Seafoam and Titanium Chrome once photos exist.
- For Alyssa: none new. Question 5 (thread categories) is still the way to get the real split.

## Start of next phase
- Prerequisites: both `phase-04-data-migration` branches pushed and merged; `sanity deploy` run; Jordan's Studio checks done; series `order` values set if the card order matters.
- First file: `data/queries/builder/FETCH_BUILDER_PAGE_QUERY.js` (plan 5.1).
- Files the next session should read: `docs/build/plan.md` Phase 5, this handoff, `handoffs/phase-03-cms-schemas.md` (field names for the queries), the new schema files in `../cms/schemaTypes/builder/`, `../cms/schemaTypes/rodSeries.js`.
- Query note: builder series queries should use `builderStatus in ["live","comingSoon"]`. `inStockStatus` is for the in-stock pages only.
