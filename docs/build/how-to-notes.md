# How-to notes (raw material for the guides)

Running notes for the how-to guide on how the whole system works. Phase 8B-2 turned these into `guide-jordan.md` (technical) and `guide-chris.md` (plain language, no code). **Anything added here after 8B-2 (including the tax and shipping answers from 8B-3) must also be copied into those guides.** Every phase adds to this file whenever something needs explaining to Jordan or Chris. Tag each note **[Jordan]**, **[Chris]** or **[Both]** so the split is easy later.

---

## Shopify: the builder helper products

### What they are and why they exist [Both]
Custom rods check out through the normal Shopify cart, the same as a reel or a shirt. Shopify needs a real product with a real price to charge for, and a custom rod has thousands of possible combinations. So two hidden helper products carry the money:

- **Custom Rod Build**: the base price of the rod. One variant per series.
- **Build Options**: the add-ons total (application, grip, accent thread, sticker). One variant per $5 step.

When a customer adds a build, the website adds one Custom Rod Build line and one Build Options line to the cart. The price the customer pays comes from these products in Shopify, not from the website. The website never sends a price. The full spec (blank, threads, grip, length, sticker text) travels with the order as line item properties, so it shows on the order in Shopify admin.

### How they are set up [Both]
**Custom Rod Build**
- One variant per series. Price = that series' base price.
- The variant **SKU must equal the series slug exactly**: `hole-hog`, `hog-whip`, `panfish-carbon` (Carbon Crush uses `panfish-carbon`), `eyece-commander`, `bass-spinning`, `walleye-spinning`, `panfish-spinning`. Ice Reaper (`ice-reaper`) is not there yet.

**Build Options**
- Variants from $5 to $90 in $5 steps (18 variants). Not physical (no shipping on this line).

**Both products**
- Inventory tracking off.
- Tax on.
- Tag: `builder`.
- In no collection.
- Published only to the **Cj Custom Rods Headless** sales channel.

### How Chris changes a base price [Chris]
In Shopify admin, open **Custom Rod Build**, find the series' variant and edit its price. Save. The "Starting at" price on the website and the price charged at checkout both follow within about a minute. Do not touch the SKU.

Add-on prices (grips, accent, sticker, application upcharges) are not in Shopify. They are in Sanity (Builder Page pricing rules and each series' applications). Those totals must be a multiple of $5 and at most $90, or the website refuses the build. See below.

### How to add a new series to the builder [Both]
1. **Shopify:** add a variant to Custom Rod Build. Price = base price. SKU = the series slug exactly.
2. **Sanity:** the series doc (`rodSeries`) needs its Rod Builder fields filled in (blank colors, applications for open water, card blurb, image) and `builderStatus` set. Use `live` to show it, `comingSoon` for a card with no link.
3. Check the series page at `/shop/custom/<slug>` and add a build to the cart.

A series set to `live` in Sanity with no matching SKU in Shopify shows no "Starting at" price and cannot be added to the cart.

### How to bring Ice Reaper live [Both]
1. Decide the base price.
2. Shopify: add a variant to Custom Rod Build with price = base price and SKU `ice-reaper`.
3. Sanity: on the Ice Reaper series doc, fill in its blank colors and card blurb, then switch `builderStatus` from `comingSoon` to `live`.

### What breaks if someone edits them wrong [Both]
| Edit | What happens |
|---|---|
| SKU changed, mistyped or removed on a Custom Rod Build variant | That series loses its "Starting at" price and its builds cannot be added to the cart |
| Series slug in Sanity changed without changing the SKU (or the reverse) | Same as above. They must match exactly |
| Inventory tracking turned on | Builds can sell out and stop being added. Leave it off |
| A product unpublished from the Headless channel | The website gets nothing back for it. Prices vanish and the add to cart fails. Both must stay published |
| A Build Options amount deleted | Any build whose add-ons total is that amount fails. All 18 amounts from $5 to $90 are needed |
| A Build Options variant priced differently from its amount | The customer is charged the wrong add-on total. Variant price must be the amount |
| Either product deleted | Every custom build fails. Recreating it gives new IDs, and the handles must stay `custom-rod-build` and `build-options` |
| Product handle changed | The website cannot find it. Keep the handles as they are |

### They must never be shown or collected [Both]
Never put either product in a collection, and never publish them to the Online Store or any other channel. They are not products for sale on their own. If one shows up on the storefront, a customer could buy a bare base price or add-on amount with no spec.

### Notes for Jordan [Jordan]
- The code reads the products by handle (`custom-rod-build`, `build-options`) in `utils/shopify/getBuilderProducts.js`. Base variants are matched by SKU, option variants by price.
- Checked against live Shopify on Nov 20, 2026: both products came back, 7 base variants, 18 option variants, all available. Base prices at that time: Hole Hog $119, Hog Whip $119, Carbon Crush $124.99, Eyece Commander $129.99, Bass Spinning $229.99, Walleye Spinning $234.99, Panfish Spinning $219.99.
- Deviation from the plan: Build Options is not physical (plan said requires shipping on both). Shipping is charged on the base line.

---

## Research still needed: tax, shipping and the rest of the Shopify side [Both]
Jordan and Chris need to research and set up how Shopify handles these for C&J before launch. Not done yet, and the guide should cover each once answered:
- **Tax:** how to turn on and configure tax collection (which states or regions, tax rates, what counts as taxable). Tax is on for the helper products, but the store-level tax settings are not set up for real selling yet.
- **Shipping:** how shipping rates get calculated at checkout (flat rate, weight based, carrier calculated, free over a threshold). Custom rods and in-stock rods likely need different rules. The Shippo vs. Shopify native comparison is still owed (also in Phase 8).
- **Build Options and shipping:** Build Options is not physical, so shipping must come entirely from the Custom Rod Build line. Check shipping rates look right for a build, and decide the package weight on each Custom Rod Build variant.
- **Mixed carts:** how a cart with a custom rod plus a reel or apparel is taxed and shipped.
- **Payments and going live:** the store transfer, payment provider, and moving off Bogus Gateway.
- **Order handling:** how Chris reads the build specs on an order, and how orders get fulfilled and tracked.
- **Lead time and returns:** what to tell customers about build time and returns on custom rods (open questions 10 and 11).

Phase 8 turns the answers into steps in the guides.

---

## How a custom build looks in the cart and on the order (Phase 7)

### What the customer sees [Chris]
In the cart a custom rod shows as one item, "Custom <series>", with its specs listed (length or application, blank color, thread colors, grip, sticker text) and one price. The quantity buttons and Remove change the whole build. Behind the scenes it is two Shopify lines (the base price and the add-ons), but the customer never sees them separately.

### What Chris sees on an order [Chris]
In Shopify admin, an order with a custom rod has a Custom Rod Build line carrying the base price and a Build Options line carrying the add-ons total (no Build Options line if there were no add-ons). Both lines list the same specs under their properties: Series, Length or Application, Blank Color, Primary Thread, Accent Thread, Grip, Sticker Text. Use either line to build the rod. The Build Options line is only there for the money.

### How it works [Jordan]
- `addBuildToCart` in `app/actions/builder.js` is a server action. The browser sends only its picks. The server fetches the Sanity catalog, the pricing rules and the Shopify helper products fresh, validates, prices, then adds both lines with the same `_buildId` (a random id, hidden because it starts with an underscore).
- The cart drawer groups lines by `_buildId` (`groupCartLines`) and renders `CartBuildItem` for each group. Quantity and remove go through `updateCartLinesAction`, so both lines always move together.
- Shared cart cookie and add-or-create logic is in `lib/cart/cartServer.js`.
- If Shopify returns no base price for a series, the builder hides the total and disables Add to cart rather than showing the add-ons alone.
- A client could still call the plain add-to-cart action with a bare Custom Rod Build variant and no specs. They would pay its base price, so it is a data problem, not a price problem, but a guard is easy if it ever matters.

---

## For Chris: trying the preview (Phase 8A) [Chris]

Jordan will send you a link to a preview of the new site. It is a work in progress, so here is what to try and what is not done yet. Nothing you do on it is real: no card is charged and no rod is built.

### What is ready to try
- **Shop:** In-Stock Rods, Reels and Apparel. Open products, pick sizes or colors, add to cart.
- **Cart:** the cart button in the top bar opens the cart. Change quantities, remove items, check the subtotal.
- **Custom Build:** pick ice or open water, pick a series, then build a rod (blank, threads, grip, sticker). The total updates as you pick. Add it to the cart and it shows as one item with all its choices listed.
- **Checkout:** press Checkout in the cart. It is a test checkout, so use the **Bogus Gateway**. Card number **1** (just the digit 1), any name, any future expiry date, any 3 digit security code. That completes a fake order. Try it with a custom rod, an in-stock rod, a reel and a shirt in the same cart.

### What is not done yet (on purpose)
- **Contact form:** the Contact page has a "form coming soon" card. The email address is listed in the business info beside it.
- **Ice Reaper:** shows as Coming Soon in the builder until the price and photos are final.
- **In-stock rods:** only a few rods are loaded so far. Open water in-stock series are empty and hidden for now.
- **Real payments, shipping rates and tax:** not set up. Totals at checkout may not match what you will charge.
- **Contact details:** the phone number on the Contact page is a placeholder until you send the real one. Page text and the privacy policy are still first drafts.
- **Final domain:** this is a temporary address and is hidden from Google.

### If you see a password page
The test store is locked while it is being built, so you may land on a page asking for a password, most likely when you press Checkout. It is not part of the final site and customers will never see it. Enter the store password Jordan sends you, press Enter, and you will be taken on to checkout. The browser remembers it for a while, so you should only see it once. If it keeps coming back, tell Jordan.

### What helps most
Tell Jordan anything that looks wrong, confusing or unfinished, on a phone and on a computer. A screenshot with a note on what you expected is perfect.

### Notes for Jordan on the above [Jordan]
- The password page behavior is written from general Shopify behavior, not tested. Confirm where it actually appears (storefront password vs. checkout) and fix that section, and send Chris the real password, before the link goes out.
- Bogus Gateway card "1" is Shopify's documented test card for the Bogus Gateway.

---

## Builder data in Sanity (Phase 4)

### Where everything lives [Both]
The builder's options are all in Sanity Studio, in the **Rod Builder** folder:
- **Blank Colors** (14): name, swatch color and the blank photo.
- **Thread Colors** (63): name, code, swatch color and which dropdown it appears in (warm, cool or neutral).
- **Grips** (28, 13 ice and 15 open water): material, style, finish name and photo.
- **Builder Page**: page copy and the **Pricing Rules** tab (ice lengths, grip prices, accent price, sticker price).

Each series (**Rod Series**) has its own Rod Builder tab: which blank colors it offers, its card blurb, its image and, for open water, its applications. Base prices are not in Sanity. They are on the Custom Rod Build product in Shopify.

### A series has two visibility settings, and they are separate [Both]
- **Builder Status** (Rod Builder tab): controls the custom rod builder. Live shows it and lets people build. Coming soon shows a card with no link. Hidden removes it from the builder.
- **In-Stock Rods Status** (main fields): controls the In-Stock Rods pages only. Live shows the series card and its page. Coming soon shows a card with no link. Hidden removes the card and the series page stops working (shows "not found").

Use them independently. A series can be live in the builder and hidden from in-stock, which is how Bass Casting, Musky Casting and Musky Spinning are set up right now (hidden in both until they relaunch). Ice Reaper is Coming soon in both. If In-Stock Rods Status is left empty, the series counts as live.

### How Chris changes grip names, blank colors and thread colors [Chris]
- **Grip names:** open Rod Builder, Grips, pick a grip and edit **Finish Name**. This is the name that shows in the build summary and on the order. For now the names are "Cork Split 1", "Cork Split 2" and so on. Three ice cork split grips use the old short descriptions as names ("Light and dark brown" and similar).
- **Blank swatch colors:** edit **Swatch Hex** on the blank color. Most were picked automatically from the photo, so a swatch can look slightly off. Seafoam and Titanium Chrome have no photo yet, so their colors are guesses. Upload a photo and fix the color when you have them.
- **Thread dropdown groups:** edit **Picker Group** on each thread color (warm, cool or neutral). These were assigned automatically from the color, so a few may look wrong, such as Concrete and Rain Cloud in cool, or Neon Green and Spring Green in warm. Change any that don't look right.
- **Card blurbs:** every live series has a short blurb drafted from the old descriptions. Edit them on the series' Rod Builder tab. Ice Reaper's is a placeholder.

### What was guessed in the migration [Both]
- Thread groups (warm, cool, neutral): fitted to the expected 35 / 23 / 5 split from the colors alone, not from a real list.
- Seafoam and Titanium Chrome swatch colors: no photos.
- Which blank colors each series offers: taken from the August changelog lists, not what was live on the old site. Chris still has to confirm.
- Hog Whip, Ice Reaper and Carbon Crush's "Pink, Green, Orange, Blue" are assumed to mean Hot Pink, Neon Green, Neon Orange and Metallic Blue.

### Old site data migration [Jordan]
- Script: `scripts/migrate-builder-data.mjs` in the CMS repo. Commands: `generate`, `patch-series`, `pricing`, `create-series`, `blurbs`, `in-stock-status`. Most take `--dry-run`. Needs Node 22.12 or newer and `SANITY_WRITE_TOKEN` in `cms/.env.local`.
- It only ever reads the types it migrates. The old export holds customer orders and contact submissions and none of that was imported.
- **Do not re-run `generate` plus the dataset import after Chris starts editing in Studio.** The import uses fixed IDs and `--replace`, so it overwrites any edits to those 105 documents. The other commands only set specific fields, but `patch-series` overwrites each series' builder status, blank list, applications and image, so don't re-run that either.
- Backup taken before any write: `cj-export/backups/vx4e4v7t-production-pre-phase4-2026-11-18.tar.gz`. Restore with `sanity datasets import`.
- The old export extracted for the migration is in `cj-export/extracted-full/`, outside both repos.
- Carbon Crush is still `panfish-carbon` as the slug. The slug has to match the Shopify product tag and the Custom Rod Build SKU, so rename only the display name.
- The three hidden series have `order` 101 to 103. The other series have no order value, so their card order is arbitrary until order is set on each series in Studio.
- Grip upcharges are in Pricing Rules by water type, material and style, not on each grip. EVA straight is $0 (included).

---

## Contact form (Phase 8B-1)

### Where contact info comes from [Both]
- **Contact page** (Studio, Contact Page, Business Info tab): email, phone, location and hours shown on /contact. Empty fields are hidden.
- **SEO Settings** (Studio): its own phone, email and address, used for search engine data and the contact form emails. Keep it in step with the contact page.

### How the form works [Jordan]
- The form posts to pages/api/submitContactForm.js, which emails CLIENT_EMAIL through Resend (Reply-To is the person who filled it in) and saves the submission in Sanity as a Contact Form document.
- Fields, labels and email copy are in utils/email-configuration/client-config/clientConfig.js. Adding a field there adds it to the form, the email and the Sanity write. Add it to schemaTypes/contactForm.js too or Sanity drops it.
- The email logo is the Email Logo image on SEO Settings. With none set, the email header shows the business name as text.
- Auto-response to the customer is off (features.autoResponseEmail). It is a paid add-on.
- Emails send from forms@mail.latzwebdesign.com. Change it in the route if C&J gets its own sending domain.

### Seeing form submissions [Chris]
Every message is emailed to the business address and also saved in Studio under Contact Form.
