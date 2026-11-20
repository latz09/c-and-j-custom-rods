# C&J Custom Rods: Architecture

Current as of Phase 8B-2 (Nov 20, 2026). Written from the code. Replaces the frozen `architecture-schemas-queries-pageRoutes.md` in the claude.ai Project.

## 1. Overview

Headless store. The frontend is a Next.js 15 App Router site (plain JavaScript, Tailwind 3, Framer Motion) on Vercel. Two backends feed it:

| System | Holds | Access |
|---|---|---|
| **Sanity** (project `vx4e4v7t`, dataset `production`) | Page copy, SEO settings, rod series, testimonials, the whole builder catalog (blanks, threads, grips, applications, pricing rules), contact form submissions | GROQ through `next-sanity` |
| **Shopify** (Storefront API `2026-07`, private token) | In-stock rods, reels, apparel, the two hidden builder helper products (base prices, add-on amounts), carts, checkout, orders | GraphQL through `utils/shopify/shopifyFetch.js` |

Checkout is Shopify's hosted checkout. The site never handles card data.

CMS repo: `../cms` (`latz09/c-and-j-custom-rods-cms`, branch `main`), Sanity Studio v6 (Node 22.12 or newer).

## 2. Routes

Every page uses `PageContainer`, `generateMetadata` via `BPM` (`buildPageMetadata`) and `export const revalidate = 10`.

| Route | File | Data |
|---|---|---|
| `/` | `app/page.js` | `FETCH_HOME_PAGE_QUERY` |
| `/about` | `app/about/page.js` | `FETCH_ABOUT_PAGE_QUERY` |
| `/reviews` | `app/reviews/page.js` | `FETCH_REVIEWS_PAGE_QUERY` |
| `/contact` | `app/contact/page.js` | `FETCH_CONTACT_PAGE_QUERY`, form posts to `/api/submitContactForm` |
| `/legal/privacy-policy` | `app/legal/privacy-policy/page.js` | static |
| `/shop/rods` | `app/shop/rods/page.js` | Sanity page + series list, Shopify products by tag per series, Shopify collection `in-stock-rods` |
| `/shop/rods/[slug]` | `app/shop/rods/[slug]/page.js` | One route, two branches: if `slug` is a `rodSeries` slug it is the series landing, else if it is a Shopify product handle it is the product detail |
| `/shop/reels`, `/shop/reels/[slug]` | `app/shop/reels/...` | Shopify collection `reels`, product by handle |
| `/shop/apparel`, `/shop/apparel/[slug]` | `app/shop/apparel/...` | Shopify collection `apparel`, product by handle |
| `/shop/custom` | `app/shop/custom/page.js` | `FETCH_BUILDER_PAGE_QUERY` + `getBuilderProducts` (base prices) |
| `/shop/custom/[series]` | `app/shop/custom/[series]/page.js` | `FETCH_BUILDER_SERIES_QUERY`; `notFound()` unless `builderStatus` is `live` |
| `/api/draft-mode/enable`, `/disable` | `app/api/draft-mode/` | Sanity visual editing |
| `/api/submitContactForm` | `pages/api/submitContactForm.js` | Pages Router API route (kept from the starter) |

Other: `app/not-found.js`, `middleware.js` (adds `X-Robots-Tag: noindex, nofollow` on hosts ending `.vercel.app` or `.latzwebdesign.com`; a custom domain stays indexable), `next-sitemap` runs in `postbuild` and writes `public/sitemap*.xml` and `robots.txt` (gitignored).

## 3. Folder map

```
app/                    routes, layout, server actions (app/actions/)
pages/api/              contact form route
components/
  cart/                 CartProvider, CartDrawer, CartLineItem, CartBuildItem, CartButton
  sections/<feature>/   page sections (rod-builder, in-stock-rods, reels, apparel, contact, ...)
  layout/, modals/, ui/, animations/, seo/
data/queries/           one GROQ query per file, export name = filename
  builder/ pages/ rodSeries/ seo/ navigation/ globalCta/ testimonials/
data/set-up/            Sanity Studio layout config (SanitySetup.js, SEOSetup.js)
lib/builder/            pricing, validation, order attributes, constants (pure functions)
lib/cart/               cartServer (cookie + add logic), cartHelpers (formatting, grouping)
lib/seo/, lib/gallery/
utils/cms/              sanityClient, fetchContent, fetchSeoSettings, image URL helper
utils/shopify/          shopifyFetch, product/collection/tag queries, getBuilderProducts, cart/ (fragment + mutations)
utils/email-configuration/client-config/clientConfig.js   contact form fields + email copy
emails/                 react-email templates
scripts/check-builder.mjs   checks builder logic against the live dataset
docs/build/             plan, handoffs, guides
```

Conventions are in `CLAUDE.md` (import aliases, `next/link` only, `SanityImage` vs `next/image`, dev flags as named constants).

## 4. Sanity side

### Fetching
- `fetchContent(query, params)` in `utils/cms/fetchContent.js`: published perspective, `revalidate: 10`. In draft mode it uses the `drafts` perspective with no cache.
- `sanityClient` (`utils/cms/sanityConnection.js`): `useCdn: false`, token `SANITY_API_TOKEN`.
- The builder server action bypasses `fetchContent` and calls `sanityClient.fetch` with `cache: 'no-store'` so prices and options are always fresh.
- `fetchSeoSettings` is called from `app/layout.js` and the contact route.

### Document types (CMS repo `schemaTypes/`)
Singletons: `homePage`, `inStockRodsPage`, `customBuilderPage`, `reelsPage`, `apparelPage`, `aboutPage`, `reviewsPage`, `contactPage`, `navigation`, `globalCta`, `seoSettings`.
Collections: `rodSeries`, `testimonial`, `contactForm` (form submissions), and the builder catalog in `schemaTypes/builder/`: `blankColor`, `threadColor`, `grip`, plus the `application` object type used inside `rodSeries.applications[]`.

### `rodSeries` (drives both in-stock and builder)
- `slug` (string, equals the Shopify product tag and the Custom Rod Build SKU), `name`, `applicationType` (`ice` or `open-water`).
- `inStockStatus` (live / comingSoon / hidden): In-Stock Rods pages only. Empty counts as live.
- Rod Builder group: `builderStatus` (live / comingSoon / hidden), `builderCardBlurb`, `builderImage` (falls back to `previewImage`), `builderBlankColors[]` (refs), `applications[]` (open water only).

### `customBuilderPage` (singleton)
Groups: Hero, Series Picker, Builder Copy (labels, helper text, lead-time note), **Pricing Rules** (`iceLengths`, `iceGripPrices`, `openWaterGripPrices`, `accentPrice`, `stickerPrice`, `stickerMaxCharacters`). Grip prices are keyed `corkSplit`, `corkStraight`, `evaSplit`, `evaStraight` per water type.

## 5. Shopify side

### Catalog reads (`utils/shopify/`)
- `getProductsByCollection(handle)`: feeds reels, apparel and the in-stock "all rods" grid.
- `getProductsByTagQuery(query)`: in-stock rods per series, `tag:'<applicationType>' AND tag:'<series slug>'`.
- `getProductByHandle(handle)`: product detail pages.
- Default cache is 60 seconds. Cart reads and mutations pass `cache: 'no-store'`.
- Series and ice / open water are product **tags**, not collections. Reels and apparel are collections.

### Builder helper products (`getBuilderProducts.js`)
- `custom-rod-build`: one variant per series, SKU = series slug, price = base price.
- `build-options`: variants $5 to $90 in $5 steps, matched by price.
- Returns `{ base, options, ok }`. `ok` is false if either product comes back null (usually not published to the Headless channel).

Both are tagged `builder` (`getProductUrl` returns null for them so they never get a page link), sit in no collection, and are published only to the Headless channel.

## 6. Cart

- `cartId` lives in the httpOnly cookie `cj_cart_id` (14 days), managed in `lib/cart/cartServer.js` (`readCartId`, `clearCartId`, `addLinesToCart`). `addLinesToCart` adds to the cookie's cart or creates a new one if it is missing or expired.
- Server actions in `app/actions/cart.js` (`getCartAction`, `addToCartAction`, `updateCartLineAction`, `updateCartLinesAction`, `removeCartLinesAction`) all return `{ cart, error }`.
- `components/cart/CartProvider.js` holds cart state and drawer open state on the client. `CartDrawer` renders groups from `groupCartLines` (`lib/cart/cartHelpers.js`): lines sharing a `_buildId` attribute render as one `CartBuildItem`, everything else as `CartLineItem`.
- Attributes starting with `_` are hidden from customers (`visibleAttributes`).
- Checkout: the drawer links to the cart's `checkoutUrl` (Shopify hosted).

## 7. The builder

### Data flow
1. **Landing** (`/shop/custom`): series with `builderStatus` live or comingSoon, grouped by water type. "Starting at" comes from `getBuilderProducts` matched by slug. No Shopify price, no "Starting at".
2. **Builder** (`/shop/custom/[series]`): one series, its blanks, applications, all threads, grips for its water type, copy and pricing rules. `BuilderShell` (client) keeps the config in a `useReducer` and calls `getBuildPrice` for the live total.
3. **Add to cart** (`app/actions/builder.js`, `addBuildToCart`), all on the server:
   1. `cleanConfig` keeps only known keys from the browser.
   2. Fetch the series catalog and rules from Sanity (no cache) and the Shopify helper products (no cache).
   3. `validateBuild`: series live, blank on the series, application or length valid, thread and grip ids exist, grip matches water type, sticker within max, add-on total a multiple of $5 and at most $90.
   4. Find the base variant by SKU = slug.
   5. `getBuildPrice(config, series, rules, basePrice)` gives base, add-on lines, add-on total, total.
   6. `buildAttributes` makes the order properties and a random `_buildId`.
   7. `cartLinesAdd` with the base line, plus a Build Options line when the add-on total is above $0. Both lines carry the same attributes.
4. The browser never sends a price.

### Files
| File | Role |
|---|---|
| `lib/builder/constants.js` | `DEFAULT_STICKER_MAX` (20), `OPTIONS_STEP` (5), `OPTIONS_MAX` (90), `emptyBuildConfig` |
| `lib/builder/pricing.js` | `getBuildPrice`, grip price lookup. Money in cents internally. Safe on partial configs |
| `lib/builder/validateBuild.js` | Returns `{ valid, missing, errors, firstProblem }` |
| `lib/builder/buildAttributes.js` | Order-facing rows: Series, Length or Application, Blank Color, Primary Thread, Accent Thread, Grip, Sticker Text |
| `components/sections/rod-builder/` | Picker, shell, option sections, summary, mobile bar, add-to-cart button |
| `scripts/check-builder.mjs` | Runs the logic against the live dataset (30 checks) |

These lib files have no imports from Next, so they run in the browser, on the server and in scripts.

## 8. Contact form

`components/sections/contact/SubmitContactForm.js` posts to `pages/api/submitContactForm.js`, which:
1. Loads `seoSettings` for the business name, phone, email and email logo (config values are the fallback).
2. Checks required fields from `clientConfig.formFields`.
3. Emails `CLIENT_EMAIL` through Resend with Reply-To set to the submitter (`emails/ClientNotificationEmail.jsx`).
4. Saves a `contactForm` document in Sanity.

Fields, labels and email copy live in `utils/email-configuration/client-config/clientConfig.js`. The auto-response email is off. From-address is `forms@mail.latzwebdesign.com`.

## 9. Environment variables

Names only. Values live in `.env.local` locally and in Vercel.

| Variable | Used for |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | Storefront API host |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Private Storefront token (sent as `Shopify-Storefront-Private-Token`) |
| `SANITY_PROJECT_ID` or `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset, defaults to `production` |
| `SANITY_API_TOKEN` | Read token for the client |
| `SANITY_VIEWER_TOKEN` | Draft mode / visual editing |
| `NEXT_PUBLIC_SANITY_STUDIO_URL`, `SANITY_STUDIO_PREVIEW_ORIGIN` | Studio links and preview origin |
| `RESEND_API_KEY`, `CLIENT_EMAIL` | Contact form email |
| `NEXT_PUBLIC_SITE_URL` | Sitemap and robots base URL |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console verification |

## 10. Platform gotchas

- Products **and** collections must each be published to the Headless channel. "Active" is not enough. A clean 200 with `null` usually means unpublished.
- Every custom metafield needs its own Storefront access toggle.
- Cart API 2026-07: use `lines[].discountAllocations` and `sourceDiscountApplication`. `sourceDiscountApplication` is not queried yet.
- `overflow-x: hidden` on both `html` and `body` breaks `position: sticky`. It is on `html` only.
- Never import `Link` from `react-email`. Use `next/link`.
- Sanity images use `SanityImage`. Shopify `{ url, altText }` images use `next/image` with `fill`. Not interchangeable.
- Changing a series slug in Sanity without the matching Custom Rod Build SKU (or the reverse) breaks that series' price and add to cart.

## 11. Dev flags

| Flag | File | Meaning |
|---|---|---|
| `HIDE_EMPTY_STOCK_MESSAGING` | `components/sections/in-stock-rods/RodsBySeriesSection.js` | `true` hides empty-series messaging. Remove once the full rod catalog is in Shopify (launch checklist) |

## 12. Known loose ends

- `components/sections/contact/ContactFormPlaceholder.js` is unused.
- The Studio CMS guide link is `cmsGuideUrl=""` in the CMS repo's `sanity.config.jsx` (line 57), so the button goes nowhere until a URL is set. `data/set-up/SanitySetup.js` and `SEOSetup.js` in this repo are unused starter files that point at `/static/cms-guide.pdf`, which does not exist.
- `HIDE_EMPTY_STOCK_MESSAGING` and tax, shipping and payments setup are Phase 8B-3.
