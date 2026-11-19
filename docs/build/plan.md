# C&J Custom Rods: Finish Plan + Rod Builder Build

**Last updated:** Nov 19, 2026 (Phase 6B done)
**How this runs:** one phase per Claude Code session in VS Code, following `CLAUDE.md` at the repo root: read the docs, give the rundown, work on a phase branch, write a handoff to `docs/build/handoffs/`, update the tracker below.

**Decisions locked Nov 17:**
- **Custom rods check out through the regular Cart API, not draft orders.** Supersedes the draft-order plan in the older reference docs (technical overview, Shopify build reference sections 4 and 7, wireframe builder annotation, Sept 2 consolidated handoff section 7).
- From Phase 2 on, Claude Code edits the repos directly on a branch per phase. Jordan reviews, pushes and merges. Phases 0 and 1 ran in claude.ai with copy and paste.

Design reference for the builder UI: `docs/build/design-notes.md` + `docs/build/design/` (all three of Alyssa's screens).
Old v1 CMS structure and migration mapping: `docs/build/old-cms-data-map.md` (required reading for Phases 3 and 4).

---

## Phase tracker

Update the Status and Handoff columns at the end of every phase.

| Phase | Scope | Depends on | Status | Handoff |
|---|---|---|---|---|
| 0 | Planning, decisions, project reorg, old data export + map | none | Done | `handoffs/phase-00-planning.md` |
| 1 | Quick fixes (6 small edits) | 0 | Done (form backend moved to Phase 8) | `handoffs/phase-01-quick-fixes.md` |
| 2 | Cart | 1 | Done | `handoffs/phase-02-cart.md` |
| 3 | CMS builder schemas | 0 | Done in code (needs `sanity deploy` by Jordan) | `handoffs/phase-03-cms-schemas.md` |
| 4 | Data migration into new Sanity | 3 + `cj-old-full.tar.gz` | Done in Sanity (Jordan: Studio checks, `sanity deploy`, manual content) | `handoffs/phase-04-data-migration.md` |
| 5 | Builder logic (queries, pricing, validation) | 4 | Done | `handoffs/phase-05-builder-logic.md` |
| 6A | Builder UI: landing/picker, builder shell, option sections | 5 | Done (unstyled, Jordan applies classnames) | `handoffs/phase-06a-builder-ui.md` |
| 6B | Builder UI: summary card, mobile bar, add-to-cart button | 6A | Done (unstyled, cart call stubbed) | `handoffs/phase-06b-builder-summary.md` |
| 7 | Checkout wiring + Shopify helper products | 2, 6B | Not started | |
| 8 | Finish-up, cleanup, launch | 7 | Not started | |

Phase 3 can run before or alongside 2 if that's more convenient. Everything else is in order.

**Between phases:** Jordan pushes the phase branch, checks the Vercel preview, and merges into `master` (and `main` in the CMS repo). The next session starts from the merged branch. The handoff records branch names and commit hashes.

---

## How custom rods get paid for (locked)

Two hidden helper products in Shopify:

- **`Custom Rod Build`**: one variant per series, priced at that series' base price. Chris edits base prices here. This price is also what the landing cards and builder header show as "Starting at".
- **`Build Options`**: variants in $5 steps from $5 to $90. Covers every add-on total (max is $30 application + $40 grip + $10 accent + $10 sticker = $90).

When a customer adds a build, our server action:
1. Validates every pick against the CMS (no impossible builds).
2. Computes the add-on total from the CMS pricing rules.
3. Adds the base line + the options line in one call, with shared line attributes: `_buildId` (hidden from the customer), plus Series, Blank, Length or Application, Primary Thread, Accent Thread, Grip (material, style, finish), Sticker Text.
4. Specs show on the order in Shopify admin as line item properties.

The client never sends a price. Prices are Shopify variant prices, and only our server (private token) adds lines. Cart UI groups the two lines by `_buildId` and removes or re-quantities them together. Hosted checkout doesn't allow line edits.

---

## Phase 0: Planning (done)

- Old v1 CMS exported (project `xov8qqkx`, 292 docs, 387 images). Files in `/c/LatzWebDesign/INFO/Clients/Active/2026/c-and-j/cj-export/`. Structure mapped in `docs/build/old-cms-data-map.md`.
- All three design screenshots captured in `docs/build/design-notes.md` and `docs/build/design/`.
- Still wanted: `rod-builder-prototype-singlepage.html` for the warm / cool / neutral thread split (not in the old data, and no hue rule reproduces it).

## Phase 1: Quick fixes (frontend) (done)

| # | File | Fix |
|---|---|---|
| 1.1 | `app/shop/rods/[slug]/page.js` | Remove `import { Link } from 'react-email'` (unused, known silent-styling gotcha) |
| 1.2 | `components/sections/in-stock-rods/product-detail/RodProductDetail.js` | Pass `variantId` (first available variant, else first) to `ProductSpecsAndCta` |
| 1.3 | `components/sections/reels/ReelProductDetail.js` | Pass `variantId` to `ReelSpecsAndCta` |
| 1.4 | `components/sections/apparel/ApparelProductDetail.js` | Pass the **selected** variant's id from the color/size picker |
| 1.5 | `utils/shopify/shopifyFetch.js` | Add a `cache` option. Cart reads and mutations run `no-store` |
| 1.6 | `app/contact/page.js` | Build out with Chris's real info |

**Done when:** every product page logs a real variant id on Add to cart, contact page shows real info.

**As built:** 1.6 built to Alyssa's contact design with CMS-driven business info (`ContactBusinessInfo.js`) and a no-input form placeholder card (`ContactFormPlaceholder.js`). The form backend never existed (no API route, no email templates, starter `clientConfig.js`), so it moved to Phase 8. Phone, location and hours are still owed by Chris (question 13).

## Phase 2: Cart

API 2026-07 discount fields only (`lines[].discountAllocations`, `sourceDiscountApplication`). Every cart call uses `shopifyFetch({ ..., cache: 'no-store' })`.

| # | File | Purpose |
|---|---|---|
| 2.1 | `utils/shopify/cart/cartFragment.js` | Shared fragment: lines (merchandise, image, attributes, cost), totals, `checkoutUrl`, `totalQuantity` |
| 2.2 | `utils/shopify/cart/cartQueries.js` | `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, `getCart` |
| 2.3 | `app/actions/cart.js` | Server actions. `cartId` in an httpOnly cookie, created on first add |
| 2.4 | `components/cart/CartProvider.js` | Client context: cart state, drawer open/close, pending state |
| 2.5 | `components/cart/CartDrawer.js` + `CartLineItem.js` | Drawer, qty, remove, subtotal, Checkout to `checkoutUrl`. Built so build lines can be grouped by `_buildId` later |
| 2.6 | Nav (`DesktopNavbar.js`, `MobileNavbar.js`) | Cart button with count |
| 2.7 | `components/ui/AddToCartButton.js` | Wire to server action, open drawer on success |
| 2.8 | `app/layout.js` | Wrap in `CartProvider`, mount drawer |
| 2.9 | Test | Bogus Gateway checkout end to end |

**Done when:** rod, reel and apparel can be added, edited, removed and checked out with Bogus Gateway.

**As built:** all steps done and tested. Extras: `lib/cart/cartHelpers.js` and `components/cart/CartButton.js`. The mobile nav is `components/modals/MobileNavbar.js`. `sourceDiscountApplication` not queried. Details in `handoffs/phase-02-cart.md`.

## Phase 3: CMS builder schemas (CMS repo)

Read `docs/build/old-cms-data-map.md` first so field names line up with the migration.

Builder fields go **on `rodSeries`** in a new "Rod Builder" group, so one doc per series serves both the in-stock series page and the builder.

| # | File | Contents |
|---|---|---|
| 3.1 | `schemaTypes/builder/blankColor.js` | name, hex (swatch; sampled from the photo during migration), image (real blank photo), order. Replaces the misnamed `iceRodBlankColor` |
| 3.2 | `schemaTypes/builder/threadColor.js` | name, code (`001`), hex, category (warm / cool / neutral), order |
| 3.3 | `schemaTypes/builder/grip.js` | waterType (ice / open-water, one per doc; ice and open water use different photos), material (cork / EVA), style (split / straight), finish name (shown in the build summary), legacyReferenceId (e.g. `cork-split-7`), image, order |
| 3.4 | `schemaTypes/builder/application.js` | Object for open water: length, power/action, line weight, lure weight, upcharge, usage |
| 3.5 | `schemaTypes/rodSeries.js` | "Rod Builder" group: `builderStatus` (**live / comingSoon / hidden**), `builderCardBlurb` (one or two sentences for the landing card), `builderImage` (optional; falls back to `previewImage`), `builderBlankColors` (refs), `applications[]` (hidden for ice). No price here, base price lives in Shopify |
| 3.6 | `schemaTypes/customBuilderPage.js` | Drop the "out of scope" comment. Groups: Hero (exists), Series Picker (section heading "Category and series", tab labels, coming-soon label), Builder Copy (section labels, helper text, lead-time note), Pricing Rules (ice lengths, grip upcharge table per water type and material + style, accent price, sticker price, sticker max characters) |
| 3.7 | `schemaTypes/index.js` + `structure.js` | Register types. "Rod Builder" folder: Builder Page, Blank Colors, Thread Colors, Grips (grouped or filtered by water type) |
| 3.8 | Deploy | `sanity deploy` (Jordan) |

**Done when:** studio deploys, all new types editable, `rodSeries` shows the Rod Builder group.

**As built:** 3.1 to 3.7 done on branch `phase-03-cms-schemas`, schema validates clean. 3.8 is Jordan's. Sanity v6 needs Node 22.12 or newer. Field names for Phase 5 and details are in `handoffs/phase-03-cms-schemas.md`.

## Phase 4: Data migration (CMS repo)

Read `docs/build/old-cms-data-map.md` first. **Do not import the whole old tarball**: it contains 50 customer orders, 41 contact submissions and old page types.

Needs: `cj-old-full.tar.gz` extracted (Claude Code can extract it from the export folder), a Sanity write token for the new project in the CMS repo's local env (Jordan adds it; Claude never reads it).

| # | File / step | Purpose |
|---|---|---|
| 4.1 | `scripts/migrate-builder-data.mjs` (part 1) | Read the old `data.ndjson`, write `builder-import.ndjson` into the same extracted folder with only `threadColor` (63), `blankColor` (12 + Seafoam + Titanium Chrome), `grip` (28). Keep `_sanityAsset: image@file://./images/...` so the import uploads photos. Fixed IDs (`threadColor-001`, `blankColor-black`, `grip-ice-cork-split-7`). Sample a hex from each blank photo. Apply thread categories if the prototype file is available |
| 4.2 | Import | `npx sanity datasets import <folder>/builder-import.ndjson production --replace` from the CMS repo (Jordan approves) |
| 4.3 | `scripts/migrate-builder-data.mjs` (part 2) | Patch builder fields onto existing `rodSeries` docs by slug with `@sanity/client`: `builderStatus` (old `available`: true = live, false = hidden), `builderBlankColors` (**target lists from the data map, not the old ones**), `builderImage` (upload old `mainImage`), `applications[]` (inline the old `openWaterApplication` docs). Panfish Carbon maps to Carbon Crush |
| 4.4 | Pricing Rules | Enter grip prices, accent $10, sticker $10, ice lengths 20" to 36" in `customBuilderPage` |
| 4.5 | Manual | Ice Reaper series doc (`builderStatus: comingSoon`), card blurbs for every live series, grip finish names once Chris sends them |
| 4.6 | Verify | Counts match the data map (63 threads, 14 blanks, 28 grips, 42 applications across 6 open water series), blank lists match the target table, every photo shows in Studio |

**Done when:** every series, blank, thread, grip and application exists in the new studio with photos, and nothing else from the old project came across.

**As built:** 105 docs imported (63 threads, 14 blanks, 28 grips) after a backup, then series patched, pricing rules written and card blurbs drafted by `scripts/migrate-builder-data.mjs` in the CMS repo. Blank hex sampled from photos (Seafoam and Titanium Chrome guessed). Thread categories are a fitted guess (35 / 23 / 5). Grip names are "Cork Split 1, 2, 3" style, with old descriptions used for three. Deviations: Bass Casting, Musky Casting and Musky Spinning were created as hidden series to hold their 21 applications (42 total across 6 open water series), and a new `rodSeries.inStockStatus` field (live / comingSoon / hidden, separate from `builderStatus`) now drives the In-Stock Rods pages, with coming-soon cards and 404s for hidden series. Revisit with `HIDE_EMPTY_STOCK_MESSAGING` in Phase 8. Details in `handoffs/phase-04-data-migration.md`.

## Phase 5: Builder logic (frontend, shared)

Same pricing function runs in the browser (live total) and on the server (what gets charged).

| # | File | Purpose |
|---|---|---|
| 5.1 | `data/queries/builder/FETCH_BUILDER_PAGE_QUERY.js` | Page copy + pricing rules + series list (live and comingSoon only) with card fields |
| 5.2 | `data/queries/builder/FETCH_BUILDER_SERIES_QUERY.js` | One series + blanks + applications + global threads + grips for its water type |
| 5.3 | `lib/builder/pricing.js` | `getBuildPrice(config, catalog, rules)`: base, each upcharge, add-on total, grand total |
| 5.4 | `lib/builder/validateBuild.js` | Rejects non-live series, blank not on series, bad length or application, grip not for water type, sticker text over limit, missing required picks |
| 5.5 | `lib/builder/buildAttributes.js` | Valid config to order-facing attributes (readable names, thread codes, grip as material - style - finish) |
| 5.6 | `utils/shopify/getBuilderProducts.js` | Fetch `Custom Rod Build` variants (base prices) and `Build Options` variants |

**Done when:** queries return real migrated data and pricing reproduces the open water mock total ($459.99 for the Musky Casting example) and computes the ice mock correctly ($144.99; the mock's $119.99 is a placeholder).

**As built:** all six steps done on `phase-05-builder-logic`, checked by `scripts/check-builder.mjs` against the live dataset (30 of 30). Deviations: `getBuildPrice` takes `basePrice` as a fourth argument, the series query also returns builder copy and pricing rules, and the validator enforces that add-ons are a multiple of $5 up to $90. `Custom Rod Build` variant SKUs must equal the series slug (Phase 7). Sticker max defaults to 20 in code. `getBuilderProducts` is untested against real Shopify until Phase 7. Details in `handoffs/phase-05-builder-logic.md`.

## Phase 6A: Builder UI, part 1 (per `docs/build/design-notes.md`)

Routes:
- `/shop/custom`: hero + "Category and series" tabs (Ice selected by default) + series cards.
- `/shop/custom/[series]`: the builder. `notFound()` unless the series is live.

Flow: **Ice:** blank, length, primary thread, accent (optional), grip, sticker (optional). **Open water:** application, blank, primary thread, accent (optional), grip, sticker (optional).

Folder: `components/sections/rod-builder/`

| # | File | Purpose |
|---|---|---|
| 6.1 | `app/shop/custom/page.js` | Landing (server): hero with topography background, picker |
| 6.2 | `app/shop/custom/[series]/page.js` | Fetch series + catalogs + base price |
| 6.3 | `SeriesPicker.js` + `SeriesCard.js` | Water-type tabs; cards with image, water-type badge, name, "Starting at", blurb, "Start building". Coming-soon cards show the coming-soon label and no link |
| 6.4 | `BuilderShell.js` | Client. `useReducer` config, two-column layout, live total. Optional URL param sync |
| 6.5 | `BuilderBreadcrumb.js` + `BuilderHeader.js` | "Custom Rod Builder / Ice Rods / Series", title, "Starting at $X" |
| 6.6 | `BuilderSection.js` | Shared section wrapper (label, optional price note) |
| 6.7 | `ApplicationSelect.js` | Open water. Stacked cards: length, power/action, line, lure, usage, upcharge pill |
| 6.8 | `BlankColorSelect.js` | Real blank photo with swatch + label. Swatch-only fallback |
| 6.9 | `LengthSelect.js` | Ice only, chip row |
| 6.10 | `ThreadColorSelect.js` | Warm (35) / Cool (23) / No color (5) dropdowns. Picking in one clears the others. Reused for primary + accent |
| 6.11 | `GripSelect.js` | Material chips, then style chips priced for that material + water type, then named finish photo tiles |
| 6.12 | `StickerInput.js` | Optional personalized text (+$10), max length from CMS, blank = none |

**Done when:** landing works for both tabs, and every option for an ice and an open water series can be picked with the live total updating.

**As built:** all steps done on `phase-06a-builder-ui` and tested by Jordan. Structure and data only. Decisions: fixed series photo (no swap on blank), plain series name as title, coming-soon cards have no link, single-column stacking. "Starting at" hides until Shopify has the base price (Phase 7). Left column holds a placeholder total and config dump (`SHOW_DEBUG_CONFIG`) that 6B replaces. Added `formatPrice.js`. Details in `handoffs/phase-06a-builder-ui.md`.

## Phase 6B: Builder UI, part 2

| # | File | Purpose |
|---|---|---|
| 6.13 | `BuildSummary.js` | "Your Build" card under the rod image. Rows by water type (Length for ice, Application for open water), grip as material - style - finish, sticker text or "None", Total, Add to cart |
| 6.14 | `MobileBuildBar.js` | Mobile sticky summary + total + CTA. Coordinate with `StickyNav` hide-on-scroll |
| 6.15 | `AddBuildToCartButton.js` | Disabled until valid, says what's missing. Stubbed to log the validated config until Phase 7 |

First pass in 6A and 6B maps data with structure only; Jordan applies classnames.

**Done when:** desktop and mobile builder is complete apart from the actual cart call.

**As built:** all three steps done on `phase-06b-builder-summary`, structure only. Added `BuildTotal.js`, shared by the card and the bar. Until Phase 7 the total line reads "Options: +$X (base price coming)", never "Total" (remove that branch in Phase 7). The button shows once per breakpoint (card on desktop, bar on mobile) and logs the validated config. `BuilderShell` no longer has the debug config. Details in `handoffs/phase-06b-builder-summary.md`.

## Phase 7: Checkout wiring

| # | File | Purpose |
|---|---|---|
| 7.1 | `app/actions/builder.js` | `addBuildToCart(config)`: validate, price, resolve base + options variants, `cartLinesAdd` both with shared `_buildId` |
| 7.2 | `components/cart/CartLineItem.js` + `app/actions/cart.js` | Group build lines, list specs, qty/remove act on the whole build |
| 7.3 | Shopify admin (Jordan) | Create `Custom Rod Build` (variant per series) and `Build Options` ($5 to $90). Inventory not tracked, requires shipping, published to Headless channel, in no collection, tagged `builder` |
| 7.4 | Test | Ice build, open water build, mixed cart with reel + apparel, Bogus Gateway, confirm properties on the order |

**Done when:** a custom build and in-stock products check out together and the order in Shopify shows every spec.

## Phase 8: Finish-up + launch

**Code cleanup**
- Delete `test-shopify.js`, generated `public/sitemap*.xml`, rename `package.json` name from `starter-code`
- Remove `HIDE_EMPTY_STOCK_MESSAGING` once the full catalog is in
- CMS: fill `cmsGuideUrl`, add builder section to the CMS guide
- Write a current architecture doc into `docs/build/` from the real codebase (replaces the frozen `architecture-schemas-queries-pageRoutes.md` in the claude.ai Project)

**Contact form backend (moved from Phase 1)**
- `app/api/submitContactForm/route.js` with Resend (installed) + a react-email notification template
- Fill `utils/email-configuration/client-config/clientConfig.js` (still the starter template: `CLIENT_NAME`, placeholder logo URL from another Sanity project)
- Add **Inquiry type** select (Custom rod / In-stock rod / Reels / Other) and make phone required, per Alyssa's contact design
- Swap `ContactFormPlaceholder` for `SubmitContactForm` in `app/contact/page.js`
- Vercel env vars: Resend key, `CLIENT_EMAIL`

**Shopify / data**
- Rest of rod catalog loaded. The old CMS has 57 in-stock listings (46 ice, 11 open water) with descriptions and 178 photos in the export, a possible source if Chris wants them carried over
- Confirm reel metafield Storefront toggles (Bearings, Gear Ratio, Weight, Max Drag)
- Shipping: Shippo vs. Shopify native comparison still owed
- Contact Page business info: phone, location, hours once Chris sends them

**Waiting on client**
- Hero image options, more reviews (one per series)
- Promotions direction (context in the Sept 2 consolidated handoff, claude.ai Project)
- Upsell Feature A / B quote still owed

**Launch**
- Store transfer, plan selected, real payments on
- Vercel production env vars, DNS
- Confirm `middleware.js` noindex only hits preview hosts
- Full test pass incl. mobile
- Vercel analytics events on builder steps + add-to-cart

---

## Open questions for Chris (builder)

1. Ice length upcharge, or flat?
2. Ice Reaper base price
3. Hole Hog base price: old CMS has $119; mocks show $119 and $119.99. Confirm $119
4. **Blank colors per series:** confirm the Aug changelog lists replace what's live now (table in `docs/build/old-cms-data-map.md`), and that "Pink / Green / Orange / Blue" mean Hot Pink / Neon Green / Neon Orange / Metallic Blue
5. **Grip finish names:** the old CMS only has IDs like `cork-split-7`. Names for all 28 (13 ice, 15 open water). Currently "Cork Split 1, 2, 3" style in Sanity, with old descriptions for three ice cork split grips
6. Seafoam + Titanium Chrome photos
7. Bass Casting, Musky Casting, Musky Spinning: relaunch or keep hidden?
8. Sticker: max characters, and any font or color choice?
9. Notes field on custom builds?
10. Build lead time to show customers
11. Returns policy on custom builds
12. Carry over the old in-stock rod listings into Shopify, or start fresh?
13. Contact page: phone number, location (city, state) and hours to show. Email on file is `candjcustomrods@gmail.com`; the mock's support@ address, 123-456-7890, Waupaca and 8am - 4pm are placeholders

## Open questions for Alyssa

1. Does the rod image in the left column swap with the selected blank color, or stay a fixed series photo?
2. Mobile layout for the builder and landing page
3. Builder title: "Custom Hole Hog" (ice mock) or plain series name (open water mock)?
4. Coming-soon card: no link at all, or keep "Start building" pointing somewhere?
5. Thread color warm / cool / neutral split: send the prototype file, or the list from it
