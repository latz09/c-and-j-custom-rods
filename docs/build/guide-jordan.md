# C&J Custom Rods: Technical Guide (Jordan)

How the system fits together and how to operate it. For the full code map see `architecture.md`. For plain-language steps for Chris see `guide-chris.md`.

## 1. The system in one minute

- **Sanity** holds all copy, SEO, series and the builder catalog (blanks, threads, grips, applications, pricing rules).
- **Shopify** holds in-stock products, base prices, add-on amounts, carts and checkout.
- **Next.js on Vercel** reads both and renders. Pages revalidate every 10 seconds (Sanity) and 60 seconds (Shopify catalog). Cart and builder calls are never cached.

Where each thing is edited:

| Thing | Where |
|---|---|
| Page copy, SEO, contact info | Sanity Studio |
| Series visibility, card blurbs, blank lists, applications | Sanity, Rod Series |
| Blank, thread and grip names and swatches | Sanity, Rod Builder folder |
| Grip, accent, sticker prices, ice lengths | Sanity, Builder Page, Pricing Rules |
| Base price of a custom rod | Shopify, product Custom Rod Build, variant price |
| In-stock rod, reel and apparel products | Shopify |

## 2. How custom rods get paid for

Two hidden Shopify products carry the money.

**Custom Rod Build** (handle `custom-rod-build`): one variant per series. Price = base price. **SKU = series slug exactly.** SKUs today: `hole-hog`, `hog-whip`, `panfish-carbon` (Carbon Crush), `eyece-commander`, `bass-spinning`, `walleye-spinning`, `panfish-spinning`. `ice-reaper` is not added yet.

**Build Options** (handle `build-options`): 18 variants, $5 to $90 in $5 steps. Not physical (no shipping on this line). Matched by price, so the variant price must equal its amount.

Both products: inventory tracking off, tax on, tag `builder`, in no collection, published only to the **Cj Custom Rods Headless** channel.

When a customer adds a build, `addBuildToCart` (`app/actions/builder.js`) validates every pick against Sanity, computes the add-on total from the pricing rules, and adds two cart lines (base, then options if the add-on total is above $0) sharing a hidden `_buildId` and the same specs as line item properties. The browser sends only its picks. The price is always the Shopify variant price.

Add-on total rules: the sum of application upcharge (open water), grip upcharge, accent ($10 today) and sticker ($10 today) must be a multiple of $5 and at most $90. If a Pricing Rules edit breaks that, builds with that total fail validation and users see "This combination cannot be ordered yet" or a validation message.

## 3. Common operations

### Add a series to the builder
1. Shopify: add a variant to Custom Rod Build. Price = base price. SKU = series slug.
2. Sanity: fill the series' Rod Builder tab (blank colors, applications for open water, card blurb, image). Set `builderStatus` to `live` (full) or `comingSoon` (card, no link).
3. Check `/shop/custom/<slug>` and add a build to the cart.

A `live` series with no matching SKU shows no "Starting at" and cannot be added to the cart.

### Bring Ice Reaper live
1. Get the base price from Chris (open question 2).
2. Shopify: add a variant with that price and SKU `ice-reaper`.
3. Sanity: fill blank colors and card blurb, set `builderStatus` to `live`. Also set `inStockStatus` when the in-stock series should show.

### Change a base price
Edit the variant price in Custom Rod Build. Both "Starting at" and the charge follow within about a minute.

### Series visibility
Two separate fields on `rodSeries`:
- `builderStatus` (Rod Builder tab): the builder.
- `inStockStatus` (main fields): the In-Stock Rods pages. Hidden removes the card and the series page returns 404. Empty counts as live.

Bass Casting, Musky Casting and Musky Spinning are hidden in both until relaunched (open question 7). They exist to hold their 21 applications.

### Add a contact form field
Add it to `clientConfig.formFields` in `utils/email-configuration/client-config/clientConfig.js` (form, email and Sanity write follow), then add it to `schemaTypes/contactForm.js` in the CMS repo or Sanity drops it. Run `sanity deploy` afterward.

### Change the email logo or business name in emails
Studio, SEO Settings: Email Logo and Site Name. No logo means the header shows the name as text.

## 4. What breaks if edited wrong

| Edit | Result |
|---|---|
| SKU on a Custom Rod Build variant changed, mistyped or removed | That series loses "Starting at" and cannot be added to the cart |
| Series slug changed in Sanity without the SKU (or reverse) | Same. They must match exactly. Series slug also must match the Shopify product tag for in-stock rods |
| Inventory tracking turned on for a helper product | Builds can sell out and stop being added |
| Helper product unpublished from the Headless channel | Prices vanish and add to cart fails (Storefront returns `null`) |
| A Build Options amount deleted | Any build with that add-on total fails. All 18 amounts are needed |
| A Build Options variant priced differently from its amount | Customer is charged the wrong add-on total |
| Either helper product deleted | Every custom build fails. Handles must stay `custom-rod-build` and `build-options` |
| Product handle changed | The site cannot find it |
| A helper product put in a collection or published to another channel | It becomes buyable on its own. Never do this |
| Pricing rules edited so add-ons are not multiples of $5 or exceed $90 | Builds fail validation |

## 5. Sanity data and the migration

- Catalog: 63 threads, 14 blanks, 28 grips (13 ice, 15 open water), 42 applications across 6 open water series.
- Migration script: `scripts/migrate-builder-data.mjs` in the CMS repo. Commands: `generate`, `patch-series`, `pricing`, `create-series`, `blurbs`, `in-stock-status`. Most take `--dry-run`. Needs Node 22.12+ and `SANITY_WRITE_TOKEN` in `cms/.env.local`.
- **Do not re-run `generate` plus the dataset import after Chris starts editing.** The import uses fixed IDs and `--replace`, so it overwrites edits to those 105 docs. `patch-series` overwrites each series' builder status, blank list, applications and image, so do not re-run it either.
- Backup taken before any write: `cj-export/backups/vx4e4v7t-production-pre-phase4-2026-11-18.tar.gz`. Restore with `sanity datasets import`.
- The old export is extracted at `cj-export/extracted-full/`. It holds customer orders and contact submissions, none of which were imported. Never import it whole.
- Grip upcharges are by water type, material and style in Pricing Rules, not on each grip. EVA straight is $0.
- Series have no `order` value except the three hidden ones (101 to 103), so card order is arbitrary until set in Studio.
- Carbon Crush keeps the slug `panfish-carbon`. Rename the display name only.
- Guessed in migration: thread picker groups (fitted to 35 / 23 / 5), Seafoam and Titanium Chrome hex values, blank lists per series (from the August changelog), "Pink / Green / Orange / Blue" read as Hot Pink / Neon Green / Neon Orange / Metallic Blue.

## 6. Checks

- `npm run lint` and `npm run build` before any merge.
- `node scripts/check-builder.mjs`: logic checks against the live dataset (30 of 30 at Phase 5). It reads Sanity, so it needs the env file.
- Shopify check from Nov 20, 2026: both helper products returned, 7 base variants, 18 option variants, all available. Base prices then: Hole Hog $119, Hog Whip $119, Carbon Crush $124.99, Eyece Commander $129.99, Bass Spinning $229.99, Walleye Spinning $234.99, Panfish Spinning $219.99.
- Order properties on an order: Series, Length or Application, Blank Color, Primary Thread, Accent Thread, Grip, Sticker Text, hidden `_buildId`. Both lines carry them.

## 7. Contact form

Posts to `pages/api/submitContactForm.js`: emails `CLIENT_EMAIL` through Resend (Reply-To = submitter) and saves a Contact Form doc in Sanity. Auto-response is off (`features.autoResponseEmail`, a paid add-on). From-address `forms@mail.latzwebdesign.com` is a Latz Web Design domain, so revisit at launch.

Contact info lives in two places that must stay in step: Contact Page, Business Info tab (shown on `/contact`; empty fields are hidden) and SEO Settings (structured data and emails).

## 8. Deploys and environments

- Branch per phase, merge to `master` (frontend) and `main` (CMS). Vercel builds a preview per branch.
- `middleware.js` adds noindex on `*.vercel.app` and `*.latzwebdesign.com`. A custom domain is indexable. Confirm this on the launch checklist.
- CMS schema changes need `sanity deploy` from the CMS repo (Jordan). The Studio CMS guide button reads `cmsGuideUrl=""` in `cms/sanity.config.jsx`. Set it once the CMS guide has a home.
- Env var names are in `architecture.md` section 9.

## 9. Known issues and to-dos

- Cart: a client could call the plain `addToCartAction` with a bare Custom Rod Build variant and no specs. They would pay its base price. A data problem, not a price problem. Add a guard if it matters.
- `ContactFormPlaceholder.js` is unused.
- Preview password: the Chris preview notes describe the Shopify password page from general behavior, not tested. Confirm where it appears and send Chris the password before sending a link.
- `HIDE_EMPTY_STOCK_MESSAGING` stays on until the rod catalog is loaded.
- Tax, shipping, payments and going live are Phase 8B-3 (see `how-to-notes.md`, "Research still needed").
- SEO settings `siteUrl`, privacy policy text and reviews page text are first drafts (8A loose ends).
