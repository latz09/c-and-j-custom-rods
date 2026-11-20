# How-to notes (raw material for the guides)

Running notes for the how-to guide on how the whole system works. Phase 8 turns these into two versions: one for Jordan (technical) and one for Chris (plain language, no code). Every phase adds to this file whenever something needs explaining to Jordan or Chris. Tag each note **[Jordan]**, **[Chris]** or **[Both]** so the split is easy later.

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
