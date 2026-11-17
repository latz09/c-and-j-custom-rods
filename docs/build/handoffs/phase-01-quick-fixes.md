> Written in the claude.ai Project before the docs moved into the repo. Old paths map like this: `current/cj-rod-builder-finish-plan.md` is now `docs/build/plan.md`, `rod-builder/*` is now `docs/build/*`, `handoffs/*` is now `docs/build/handoffs/*`.

# Phase 1 Handoff: Quick fixes

**Date:** 2026-11-17
**Status:** Complete (contact form backend moved out of this phase on purpose, see Deviations)
**Next phase:** 2, Cart

## Repo state at end of phase
- Frontend `latz09/c-and-j-custom-rods` (`master`): commit after `35d2e59`, hash not recorded in chat. Jordan applied every file below by hand and is committing and pushing at the end of this chat.
- CMS `latz09/c-and-j-custom-rods-cms` (`main`): `9e6f24b`, unchanged this phase.
- Pushed: frontend pending at time of writing. **Next chat:** confirm frontend HEAD is newer than `35d2e59` and that the files below match this handoff (`app/contact/page.js` imports `ContactBusinessInfo` and `ContactFormPlaceholder`; `shopifyFetch` takes `cache`). If HEAD is still `35d2e59`, stop and ask Jordan to push.

## What got built
| File | New / Changed | What it does |
|---|---|---|
| `app/shop/rods/[slug]/page.js` | Changed | Removed the unused `import { Link } from 'react-email'`. Fixed one space-indented line |
| `components/sections/in-stock-rods/product-detail/RodProductDetail.js` | Changed | `defaultVariant` = first variant for sale, else first variant. Passes `defaultVariant?.id` to `ProductSpecsAndCta` |
| `components/sections/reels/ReelProductDetail.js` | Changed | Same `defaultVariant` pattern, passes id to `ReelSpecsAndCta` |
| `components/sections/apparel/ApparelProductDetail.js` | Changed | Passes `selectedVariant?.id` (follows the color/size picker) to `ApparelSpecsAndCta`. Re-indented the return block |
| `utils/shopify/shopifyFetch.js` | Changed | New options `cache` and `revalidate` (default 60). `cache: 'no-store'` sends `cache: 'no-store'` and omits `next.revalidate`. Existing callers unchanged |
| `components/sections/contact/ContactBusinessInfo.js` | New | CMS business info: email as `mailto:`, phone as `tel:` (digits and leading `+` only), location, hours. Hides blank fields; hides the whole block (heading included) if all four are blank |
| `components/sections/contact/ContactFormPlaceholder.js` | New | Gray card (`#D4D4D4`, sampled from mock), "Fill out the form" heading, no inputs. Says "Form coming soon" plus a mailto fallback when the CMS has an email. `min-h` keeps the final layout proportions |
| `app/contact/page.js` | Changed | Built to Alyssa's contact design: two columns on `lg` (headline, subheadline, business info left; form card right), stacked on mobile. Headline/subheadline from CMS `hero` with schema-default fallbacks. Gradient from Alyssa: `bg-[linear-gradient(151deg,rgba(14,117,188,0)_46.37%,rgba(14,117,188,0.75)_189.03%)]` |

Notes found while reading:
- All three CTA components (`ProductSpecsAndCta`, `ReelSpecsAndCta`, `ApparelSpecsAndCta`) already accepted and forwarded `variantId`. Only the parents were missing it.
- `getProductByHandle` already returns `variants { id, availableForSale, selectedOptions, price, image }`.

## Admin changes outside the code
- **To do (Jordan), Sanity Studio:** Contact Page, Business Info, set Email to `candjcustomrods@gmail.com` and publish. Phone, location, hours stay blank until Chris sends them (the page hides blank fields).

## Decisions made this phase
- Contact info is CMS-driven (`contactPage.businessInfo`), never hardcoded.
- Contact page does not render the default testimonial, even though `FETCH_CONTACT_PAGE_QUERY` still returns it. Alyssa's design has no testimonial banner. Query left as is in case it comes back.
- In-stock rods and reels add the first **available** variant, not blindly `variants[0]`.

## Deviations from the plan
- **1.6 contact form backend moved out of Phase 1** (Jordan's call: page and layout now, no backend). Reason: the backend was never there. `/api/submitContactForm` does not exist, there are no email templates in the repo, and `utils/email-configuration/client-config/clientConfig.js` is still the starter template (`CLIENT_NAME`, a placeholder logo URL from another Sanity project). Resend and react-email are installed. The existing `ContactForm.js` + `SubmitContactForm.js` are untouched and ready to swap in for `ContactFormPlaceholder`. Added to Phase 8 in the plan.
- Plan doc updated to match (tracker, Phase 1 note, Phase 8 item, Chris question 13).

## How to verify
1. Rod, reel and apparel detail pages: click Add to cart, console logs `variantId: 'gid://shopify/ProductVariant/...'` (not `undefined`).
2. Apparel with options: change size or color, Add to cart logs a different variant id. Snapback Hat (no options) logs its single id.
3. Rod, reel and apparel pages still load and cache as before (default `revalidate: 60`).
4. `/contact` with email set in Studio: email shows under "Business info" and in the card, both open mail. With all business fields blank, the block disappears and the card says only "Form coming soon".
5. `/contact` on mobile: stacks, form card under business info.

## Known issues / loose ends
- Gradient angle: at `151deg` the blue lands bottom-right of the section; the mock shows it top-left. If it looks wrong, use `331deg`. Jordan to eyeball.
- `ApparelProductDetail`: `productVariants` is rebuilt every render, so the `selectedVariant` and `galleryImages` memos recompute every render. Harmless at this size; not changed.
- Contact form backend (see Deviations). When built: the design has **Inquiry type** (Custom rod / In-stock rod / Reels / Other) and **phone required**; `clientConfig.formFields` has no inquiry type yet.
- Contact `businessInfo` phone, location, hours still unknown. The mock values (`support@candjcustomrods.com`, `123-456-7890`, Waupaca WI, 8am - 4pm M-F) are placeholders, do not use.

## New open questions
- For Chris: phone number, location (city, state) and hours to show on the contact page (added as plan question 13).
- For Alyssa: none new.

## Start of next phase
- Prerequisites: frontend pushed (see Repo state). Storefront token must have cart scopes (`unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`); check in the Headless channel before testing.
- First file: `utils/shopify/cart/cartFragment.js` (plan 2.1).
- Files the next chat should read in the repo: `utils/shopify/shopifyFetch.js` (call cart ops with `cache: 'no-store'`), `components/ui/AddToCartButton.js`, `components/ui/CartIcon.js`, `components/layout/navigation/DesktopNavbar.js`, `MobileNavbar.js`, `NavigationContainer.js`, `app/layout.js`.
- **New workflow from Phase 2:** Claude Code in VS Code, branch `phase-02-cart`, see `CLAUDE.md`.
