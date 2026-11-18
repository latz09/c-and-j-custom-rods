# Phase 3 Handoff: CMS builder schemas

**Date:** 2026-11-18
**Status:** Complete in code, pending Jordan's check in the local studio and `sanity deploy`
**Next phase:** 4, Data migration

## Repo state at end of phase
- Frontend `latz09/c-and-j-custom-rods`: branch `phase-03-cms-schemas`, docs only (this handoff and the tracker). Phase 2 (`phase-02-cart`) should already be merged to `master`. Merged to `master`: pending
- CMS `latz09/c-and-j-custom-rods-cms`: branch `phase-03-cms-schemas`, last commit `4f59847`. Merged to `main`: pending
- Pushed: no, neither repo. Jordan pushes.

## What got built (CMS repo)
| File | New / Changed | What it does |
|---|---|---|
| `schemaTypes/builder/blankColor.js` | New | `name` (required), `hex` (validated `#RRGGBB`), `image`, `order` |
| `schemaTypes/builder/threadColor.js` | New | `name`, `code` (string, keeps leading zeros), `hex`, `category` (warm / cool / neutral), `order`. Sortable by code |
| `schemaTypes/builder/grip.js` | New | `waterType` (ice / open-water), `material` (cork / eva), `style` (split / straight), `finishName`, `legacyReferenceId`, `image`, `order`. All three of water type, material, style required |
| `schemaTypes/builder/application.js` | New | Inline object: `length`, `powerAction`, `lineWeight`, `lureWeight` (strings), `upcharge` (number), `usage`. Types checked against the old `openWaterApplication` docs |
| `schemaTypes/rodSeries.js` | Changed (additions only) | New "Rod Builder" group with `builderStatus` (live / comingSoon / hidden, default hidden), `builderCardBlurb`, `builderImage`, `builderBlankColors` (refs to `blankColor`), `applications[]` (hidden when `applicationType` is `ice`). Existing fields untouched and still ungrouped |
| `schemaTypes/customBuilderPage.js` | Changed (additions only) | Groups: Series Picker (`seriesPicker`), Builder Copy (`builderCopy`), Pricing Rules (`pricingRules`). Removed the "out of scope" comment. Existing fields untouched |
| `schemaTypes/index.js` | Changed | Registers `blankColor`, `threadColor`, `grip`, `application` |
| `structure.js` | Changed | "Custom Rod Builder" item is now a "Rod Builder" folder: Builder Page, Blank Colors, Thread Colors, Grips (Ice Grips / Open Water Grips lists). Same singleton document id |

### Field names for Phase 5 queries
- `customBuilderPage.seriesPicker`: `sectionHeading`, `iceTabLabel`, `openWaterTabLabel`, `comingSoonLabel`
- `customBuilderPage.builderCopy`: `applicationLabel`, `blankColorLabel`, `lengthLabel`, `primaryThreadLabel`, `accentThreadLabel`, `gripLabel`, `stickerLabel`, `accentHelperText`, `stickerHelperText`, `leadTimeNote`
- `customBuilderPage.pricingRules`: `iceLengths[]` (numbers, inches), `iceGripPrices` and `openWaterGripPrices` (each `corkSplit`, `corkStraight`, `evaSplit`, `evaStraight`), `accentPrice`, `stickerPrice`, `stickerMaxCharacters`
- `rodSeries`: `builderStatus`, `builderCardBlurb`, `builderImage`, `builderBlankColors[]`, `applications[]`

## Admin changes outside the code
- Check the types in the local studio (`npm run dev` in `../cms`, http://localhost:3333/): to do (Jordan)
- `sanity deploy`: to do (Jordan). Not run this phase.
- No dataset writes, no imports, no token use this phase.

## Decisions made this phase
- `rodSeries` fields stay ungrouped (under "All fields"); only builder fields are grouped. This keeps the "only add" rule and avoids touching existing fields.
- `application` text fields are strings, because the old data stores them as strings (`"8-14"`, `"1/8-3/8"`, `"Medium/Fast"`).
- Grip upcharges are in Pricing Rules per water type + material + style, not on each grip doc.
- Initial values from the data map: grip prices (ice 15 / 10 / 5 / 0, open water 40 / 30 / 10 / 0), accent $10, sticker $10, ice lengths 20 to 36 in steps of 2. They only fill in on new documents. The `customBuilderPage` singleton already exists, so Phase 4.4 must enter them.

## Deviations from the plan
- Step 3.8 (`sanity deploy`) left for Jordan, as planned.
- Added `blankColor.hex` and `threadColor.hex` validation (6-digit hex). Not in the plan.
- Plan says no ice length upcharge field. Chris question 1 is still open, so none was added. Add one if he says lengths cost extra.

## How to verify
1. In `../cms`, use Node 22.12 or newer (Sanity v6 needs it; the default shell Node is 20.19.5, `~/.nvm/versions/node/v22.23.2` works), then `npm run dev`.
2. Sidebar: "Rod Builder" folder with Builder Page, Blank Colors, Thread Colors, Grips (Ice, Open Water).
3. Rod Series: open any series, a "Rod Builder" tab shows status, blurb, image, blank colors. Applications show for an open water series and are hidden for an ice series. Existing fields unchanged under "All fields".
4. Builder Page: tabs for Hero, Series Picker, Builder Copy, Pricing Rules, SEO.
5. `npx sanity schema validate`: 0 errors, 0 warnings (run with Node 22).

## Known issues / loose ends
- Sanity v6 needs Node 22.12 or newer. Document it for the next CMS session. The studio runs on local 6.9.2 while the auto-update runtime is 6.24.0.
- `prettier --check` flags 14 files, including existing ones. Left alone.
- Existing `customBuilderPage` doc has no values for the new groups yet. The studio shows `initialValue`s only on new docs, so fill the labels and pricing in Phase 4.4.
- New grips created from inside the Ice or Open Water list do not pre-fill `waterType`. Set it by hand until Phase 4 creates all 28 with a script.

## New open questions
- For Chris: none new.
- For Alyssa: none new.

## Start of next phase
- Prerequisites: `sanity deploy` run (so the new types exist in the hosted studio), both `phase-03-cms-schemas` branches merged, `cj-old-full.tar.gz` available, a Sanity write token for project `vx4e4v7t` in the CMS repo's local env (Jordan adds it; Claude never reads it).
- First file: `scripts/migrate-builder-data.mjs` in the CMS repo (plan 4.1).
- Files the next session should read: `docs/build/plan.md` Phase 4, `docs/build/old-cms-data-map.md`, the four new schema files in `../cms/schemaTypes/builder/`, `../cms/schemaTypes/rodSeries.js`.
