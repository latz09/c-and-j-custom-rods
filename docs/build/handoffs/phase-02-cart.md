# Phase 2 Handoff: Cart

**Date:** 2026-11-18
**Status:** Complete
**Next phase:** 3, CMS builder schemas (or 4 onward in order; 3 can run any time)

## Repo state at end of phase
- Frontend `latz09/c-and-j-custom-rods`: branch `phase-02-cart`, last code commit `9d688d8`. The docs commit (this handoff and the tracker) sits on top of it. Merged to `master`: pending
- CMS `latz09/c-and-j-custom-rods-cms`: untouched this phase (HEAD `b27d9d3`). Merged to `main`: n/a
- Pushed: no. Jordan pushes the branch.

## What got built
| File | New / Changed | What it does |
|---|---|---|
| `utils/shopify/cart/cartFragment.js` | New | `CART_FRAGMENT` (`CartFields`): id, `checkoutUrl`, `totalQuantity`, cart cost, and per line quantity, attributes, cost, `discountAllocations`, merchandise (variant, options, image, availability, product handle / title / tags / collection handles) |
| `utils/shopify/cart/cartQueries.js` | New | `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, `getCart`. All `shopifyFetch` with `cache: 'no-store'`. Mutations return `{ cart, userErrors }` |
| `app/actions/cart.js` | New | Server actions: `getCartAction`, `addToCartAction(lines)`, `updateCartLineAction(lineId, qty)` (0 removes), `removeCartLinesAction(lineIds)`. All return `{ cart, error }`. Cart id in httpOnly cookie `cj_cart_id` (14 days, `sameSite: lax`, `secure` in production). Add falls back to creating a new cart if the saved one is dead |
| `components/cart/CartProvider.js` | New | Client context and `useCart()`: cart, lines, totalQuantity, isOpen, isPending, error, openCart, closeCart, addLines, updateLine, removeLines. Loads the cart on mount. Mutations run in `useTransition`, no optimistic updates. `addLines` opens the drawer on success |
| `components/cart/CartDrawer.js` | New | Right-side drawer with overlay, Escape and overlay close, scroll lock, empty state, subtotal, error line, Checkout link to `checkoutUrl` |
| `components/cart/CartLineItem.js` | New | Image, title (links to product page), options, visible attributes, line discounts, quantity stepper, Remove |
| `components/cart/CartButton.js` | New | Nav cart button with count badge, `isDark` support |
| `lib/cart/cartHelpers.js` | New | `formatMoney`, `visibleAttributes` (hides keys starting with `_`), `getProductUrl` (reels and apparel by collection, rods otherwise, none for `builder`-tagged), `groupCartLines` (groups by `_buildId`) |
| `components/layout/navigation/DesktopNavbar.js` | Changed | `CartButton` after the nav links |
| `components/modals/MobileNavbar.js` | Changed | `CartButton` in the header next to the menu icon (the mobile nav lives in `components/modals/`, not `components/layout/navigation/`) |
| `components/ui/AddToCartButton.js` | Changed | Calls `addLines`, shows "Adding..." while pending, disabled without a `variantId`. "Out of stock" only when `disabled` is passed. `onAddToCart` prop still overrides |
| `app/layout.js` | Changed | `CartProvider` wraps nav, page and footer; `CartDrawer` mounted inside it. `Analytics` sits outside |

## Admin changes outside the code
- Storefront token cart scopes (`unauthenticated_read_checkouts`, `unauthenticated_write_checkouts`): confirmed enabled in the Headless channel by Jordan. Done.
- Shopify Bogus Gateway test checkout: run by Jordan, passed. Done.

## Decisions made this phase
- Server actions return `{ cart, error }` with plain messages. Raw Shopify `userErrors` never reach the client.
- No optimistic updates: the UI shows only what Shopify confirmed.
- Product links from the cart use collection handles (reels, apparel) because rods are tag-based.
- Cart lines are already grouped by `_buildId` in `groupCartLines`, but the drawer still renders every line as its own item. Phase 7 swaps in one combined build item.

## Deviations from the plan
- `sourceDiscountApplication` is not in the fragment. Only `lines[].discountAllocations` is queried (with automatic title and code). Add it only if a later phase needs the source application.
- Plan said the mobile nav was `MobileNavbar.js` under the navigation folder. It is `components/modals/MobileNavbar.js`. Plan text left as is.
- Added `lib/cart/cartHelpers.js` and `components/cart/CartButton.js`, which were not listed in the plan.
- Plan updated: tracker only.

## How to verify
1. `npm run dev`. Add a rod, a reel and an apparel item. The drawer opens each time with the right image, title and options.
2. Quantity +/-, Remove, nav badge count. Reload the page: the cart persists.
3. Click Checkout, finish with Bogus Gateway (card `1`). The order in Shopify admin has all three items.
4. `npm run lint` (one existing warning in `ApparelProductDetail.js`) and `npm run build` pass.

## Known issues / loose ends
- Build was run with the dev server stopped. `next build` fails with `EPERM` on `.next/trace` if `npm run dev` is running.
- `next build` regenerates `public/sitemap-0.xml`. Don't commit it (Phase 8 removes the generated sitemaps).
- Cart styling is structure only: existing tokens, no design pass. Check the count badge position and `text-paragraph` sizes in the drawer. Jordan applies his own classnames.
- The cart-expired fallback in `addToCartAction` matches the word "cart" in Shopify's error message. Not hit in testing; revisit if a stale cart ever fails to recover.
- The build route list shows `/api/submitContactForm` under `pages`. The Phase 1 handoff said that route did not exist. Check it before Phase 8, which plans to build it.
- No stock re-check at checkout beyond what Shopify does.

## New open questions
- For Chris: none.
- For Alyssa: cart drawer design (none exists yet), and whether the cart button sits in the mobile header or inside the menu.

## Start of next phase
- Prerequisites: `phase-02-cart` pushed, Vercel preview checked, merged into `master`. Phase 3 also needs `../cms` readable (`/add-dir ../cms` if not).
- First file: `schemaTypes/builder/blankColor.js` in the CMS repo (plan 3.1).
- Files the next session should read: `docs/build/plan.md` Phase 3, `docs/build/old-cms-data-map.md`, `../cms/schemaTypes/rodSeries.js`, `../cms/schemaTypes/customBuilderPage.js`, `../cms/schemaTypes/index.js`, `../cms/structure.js`.
- Phase 7 will extend `components/cart/CartLineItem.js` and `CartDrawer.js` (build grouping) and use `addToCartAction` with two lines sharing `_buildId`.
