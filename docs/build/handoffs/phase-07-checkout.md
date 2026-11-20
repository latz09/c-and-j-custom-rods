# Phase 7 Handoff: Checkout wiring

**Date:** 2026-11-20
**Status:** Complete. Lint clean (one existing warning), `npm run build` passes. Jordan tested in the browser and reported it good (ice build, open water build, mixed cart, Bogus Gateway checkout).
**Next phase:** 8, Finish-up, cleanup, launch

## Repo state at end of phase
- Frontend `latz09/c-and-j-custom-rods`: branch `phase-07-checkout` (from `master` at `4bf2dd4`). Code commits: `fc61335` (addBuildToCart and cart wiring), `b773489` (drawer grouping). Docs commits on top: `5ce2acf` (how-to notes) and the final handoff commit (see `git log`). Merged to `master`: pending
- CMS `latz09/c-and-j-custom-rods-cms`: untouched. `main` at `7aea0c2`, with an uncommitted edit to `schemaTypes/globalCta.js` that is Jordan's, not part of this phase. Merged to `main`: n/a
- Pushed: no. Jordan pushes.

## What got built
| File | New / Changed | What it does |
|---|---|---|
| `app/actions/builder.js` | New | `addBuildToCart(config)`. Keeps only known pick fields, fetches catalog, rules and Shopify helper products fresh, validates, prices, resolves variants, adds both lines with a shared `_buildId`. Returns `{ cart, error }` |
| `lib/cart/cartServer.js` | New | Server-only cart cookie helpers plus `addLinesToCart` (add to the cart, or start a new one if it is missing or expired). Not a `'use server'` file |
| `app/actions/cart.js` | Changed | Uses `cartServer.js`. New `updateCartLinesAction(lineIds, quantity)` (0 removes) |
| `components/cart/CartProvider.js` | Changed | New `addBuild(config)` and `updateLines(lineIds, quantity)` |
| `components/cart/CartBuildItem.js` | New | One drawer item per build: "Custom <series>", specs, summed price, quantity and remove for both lines |
| `components/cart/CartDrawer.js` | Changed | `CartBuildItem` for groups with a `_buildId`, `CartLineItem` otherwise |
| `AddBuildToCartButton.js` | Changed | Calls `addBuild`, "Adding..." state, shows the server error under the button, disabled when there is no base price |
| `BuildTotal.js`, `BuilderShell.js` | Changed | Options-only branch removed. No base price shows "Total unavailable right now" |
| `docs/build/how-to-notes.md` | New | Running notes for the how-to guides (Shopify helper products, cart and order view, tax and shipping research list) |

## Admin changes outside the code
- Shopify `Custom Rod Build` (7 variants, SKU = slug) and `Build Options` ($5 to $90, 18 variants): done by Jordan. Inventory tracking off, tax on, tag `builder`, no collection, published only to the Cj Custom Rods Headless channel. Verified live with `getBuilderProducts` on Nov 20.
- Ice Reaper variant: not created (no price yet). To do when it goes live.
- No Sanity writes and no `sanity deploy` this phase.

## Decisions made this phase
- Both build lines carry the full spec attributes, so either line on the order shows the specs.
- The options line is skipped when add-ons total $0, since no $0 variant exists.
- Cart plumbing moved out of the `'use server'` file so the builder and cart actions share it without exposing helpers to the browser.
- No base price from Shopify means no total shown and Add to cart off, never an options-only number.
- Added `docs/build/how-to-notes.md`, a Phase 8 item to turn it into two guides, and an end-of-phase step in `CLAUDE.md` to keep adding to it.

## Deviations from the plan
- Build Options is not physical (plan 7.3 said requires shipping on both). Shipping comes from the base line. Plan updated.
- `CartLineItem.js` is unchanged. Grouping is a new `CartBuildItem.js` plus `CartDrawer.js`.

## How to verify
1. `/shop/custom/hole-hog`, pick everything, Add to cart: the drawer opens with one "Custom Hole Hog" item, specs listed, price = builder total.
2. Same on an open water series.
3. `+`, `-` and Remove on a build change both lines (check the subtotal and checkout).
4. Add a reel and apparel next to a build and check out with Bogus Gateway. The order in Shopify admin shows every spec on both lines, with `_buildId` hidden from the customer.
5. `npm run lint` and `npm run build` pass (stop `npm run dev` first, revert `public/sitemap-0.xml`).

## Known issues / loose ends
- The plain add-to-cart action still accepts any variant, so a bare Custom Rod Build variant with no specs can be added. Shopify prices it, so there is no price risk.
- Tax and shipping setup in Shopify is not researched yet. It is in `how-to-notes.md` and Phase 8.
- Cart drawer styling is still to do (it was waiting on this phase).
- Ice Reaper needs a Shopify variant (SKU `ice-reaper`) and `builderStatus: live` in Sanity.
- Sticker max still defaults to 20 and ice lengths are still flat (questions 8 and 1).

## New open questions
- For Chris: tax and shipping rules (see `how-to-notes.md`), Ice Reaper base price (question 2).
- For Alyssa: none.

## Start of next phase
- Prerequisites: Phase 3 to 7 branches pushed and merged in order. Phase 3 `sanity deploy` and Phase 4 Studio checks done.
- First file: the Phase 8 list in `plan.md`. Suggest starting with the contact form backend.
- Files the next session should read: `docs/build/plan.md` Phase 8, this handoff, `docs/build/how-to-notes.md`.
