# Phase 8B-2 Handoff: Docs and guides

**Date:** 2026-11-20
**Status:** Complete. Docs only, no app code changed, so lint and build were not run.
**Next phase:** 8B-3, Launch (Shopify tax and shipping, reel toggles, launch checklist, analytics events)

## Repo state at end of phase
- Frontend `latz09/c-and-j-custom-rods`: branch `phase-08b-2-docs` (from `master` at `d856370`), docs commit on top (see `git log`). Merged to `master`: pending.
- CMS `latz09/c-and-j-custom-rods-cms`: untouched by this phase. Still has Jordan's uncommitted edits to `schemaTypes/contactForm.js`, `globalCta.js` and `seoSettings.js` (8B-1 to-dos plus a new Custom Rod Banner group in `globalCta`). Not committed by Claude.
- Pushed: no. Jordan pushes.

## What got built
| File | New / Changed | What it does |
|---|---|---|
| `docs/build/architecture.md` | New | Current architecture from the real code: routes, folders, Sanity and Shopify sides, cart, builder flow, contact form, env var names, gotchas, dev flags |
| `docs/build/guide-jordan.md` | New | Technical guide: operations, what breaks if edited wrong, migration cautions, checks, deploys, known issues |
| `docs/build/guide-chris.md` | New | Plain-language guide for Chris: prices, new series, Ice Reaper, names and colors, reading orders, do-not-touch list, still-to-confirm list, preview instructions |
| `docs/build/cms-guide-builder-section.md` | New | Builder section for the Studio CMS guide, using the field labels as they appear in Studio |
| `docs/build/how-to-notes.md` | Changed | Header now points at the guides and says later notes must be copied into them |
| `docs/build/plan.md` | Changed | Tracker, last-updated date, 8B-2 as built |

## Admin changes outside the code
- Turn `cms-guide-builder-section.md` into the CMS guide PDF, host it, and set `cmsGuideUrl` in the CMS repo's `sanity.config.jsx` (line 57, currently `""`). To do (Jordan).
- Send Chris `guide-chris.md` in whatever format he prefers (copy to Google Doc or PDF). To do (Jordan).
- Commit the CMS repo's pending schema edits and `sanity deploy`. To do (Jordan), carried from 8B-1.

## Decisions made this phase
- Guides are markdown in `docs/build/` (Jordan's call).
- The Chris guide includes the preview instructions from `how-to-notes.md` at the end, so it is one document.

## Deviations from the plan
- The plan said "CMS: fill `cmsGuideUrl`, add builder section to the CMS guide". No CMS guide exists in either repo, so only the builder section was written, and `cmsGuideUrl` stays empty.
- `data/set-up/SanitySetup.js` and `SEOSetup.js` in the frontend point at `/static/cms-guide.pdf`. They are unused starter files (the real Studio config is in the CMS repo). Not deleted. Delete if wanted.

## How to verify
1. Open the four new files in `docs/build/` and read them against the app.
2. Spot-check against live Studio: the field labels in the CMS section match what Studio shows. They were taken from the schema files, not from the running Studio.
3. Confirm the Chris guide's Shopify steps against the Shopify admin (it was written from the notes, not clicked through).

## Known issues / loose ends
- Chris guide says to "ask Jordan for the exact SKU" when adding a series. Change it if Chris should do it himself.
- The preview password-page text is still unverified (flagged in `how-to-notes.md` and `guide-jordan.md`).
- `ContactFormPlaceholder.js` is still unused.
- The architecture doc has no line-level detail on the in-stock product detail components or the SEO helpers. Add if needed.
- Everything in the 8A and 8B-1 loose-ends lists still stands.

## New open questions
- For Chris: none new. Still owed: question 13 (phone, location, hours), 10 and 11 (lead time, returns), and the rest of the "Still to be confirmed" list in his guide.
- For Alyssa: none.

## Start of next phase
- Prerequisites: Jordan pushes `phase-08b-2-docs`, merges to `master`, then creates the next branch (8B-3 can use `phase-08b-3-launch`). CMS pending edits committed.
- First file: `how-to-notes.md`, section "Research still needed", then Shopify admin for tax and shipping.
- Files to read: `docs/build/plan.md` (8B), this handoff, `how-to-notes.md`, `guide-chris.md` ("Still to be confirmed").
- When 8B-3 answers tax, shipping and payments, add them to `guide-jordan.md` and `guide-chris.md`, not only `how-to-notes.md`.
- `HIDE_EMPTY_STOCK_MESSAGING` goes on the launch checklist.
