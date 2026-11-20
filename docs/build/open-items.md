# Open items from the Sept 2 client meeting

**Last updated:** Nov 20, 2026

Everything the Sept 2 meeting left open that is not rod builder work. The builder is finished (Phases 5 to 7) and none of these were ever blocked by it. Original meeting context is the frozen `current/cj-consolidated-handoff-2026-09-02.md` in the claude.ai Project.

**What this file is for:** the current state and the decision for each item, and which phase implements it. It is not a log of client emails. When an item is decided and built, move the how-it-works part into `how-to-notes.md` and the guides, and mark the row Closed here.

| # | Item | State | Blocks / blocked by | Lands in |
|---|---|---|---|---|
| 1 | Shipping: Shippo vs Shopify native | Decided, recommendation ready to send | Blocks 2 | Phase 8B-3 |
| 2 | Free shipping threshold | Mechanism decided, needs a dollar number from Chris | Blocked by 1 | Phase 9 |
| 3 | Promotions + homepage popup | Architecture solved, needs two answers from Chris | None | Phase 9 |
| 4 | Cart upsells A and B | Priced, not sent | Sold or not before any work | Phase 10 |
| 5 | Hero image, reviews, blank photos | Waiting on client | None | n/a |

---

## 1. Shipping: Shippo vs Shopify native

**The ask (Sept 2):** C&J uses Shippo today. They asked whether Shopify has something comparable. What was promised was two options with pros and cons, not a single recommendation.

### The thing that makes this simple

Shipping is two separate jobs, and they do not have to use the same tool:

- **Job A, the rate the customer is charged at checkout.** Shopify always owns this. Rates are set in Settings, Shipping and delivery.
- **Job B, buying and printing the label.** Shippo does this today. Shopify Shipping does it in the admin. Either works, and switching one does not force the other.

Shippo is mostly a Job B tool. The only way Shippo touches Job A is its Rates at Checkout feature, and that is the expensive path. See the plan gate below.

### The plan gate (the whole decision turns on this)

Live carrier rates at checkout are "third-party carrier-calculated shipping" in Shopify's terms. That covers connecting C&J's own UPS or FedEx account **and** any app that quotes rates at checkout, Shippo included. Plan requirement:

| Plan | Third-party carrier-calculated rates |
|---|---|
| Basic ($39/mo) | Not available |
| Grow ($105/mo) | Annual billing, or a monthly add-on fee (community reports about $20/mo, confirm with Shopify support) |
| Advanced ($399/mo) | Included |
| Plus | Included |

C&J is planned for **Basic**, so live carrier rates at checkout are off the table unless they move up two tiers. Plan prices were confirmed Sept 2026, recheck before quoting them to Chris.

What Basic does get: flat rates, rates by order price, rates by weight, free shipping rates, and Shopify Shipping's own discounted labels (up to about 88% off USPS, headline figure, published Sept 2026). Reports differ on whether those label discounts still tier by plan, so check the real rates in the admin rather than quoting a number.

### The three options

**Option A: Shopify native rates at checkout, keep Shippo for labels. Recommended.**
Set weight or price based rates in Shopify. Keep buying labels in Shippo exactly as C&J does now, on the free tier (30 labels a month) or their current plan. Nothing in their fulfillment routine changes.
- Costs nothing extra, no plan change, no new app
- No disruption to a process that already works for them
- Rates at checkout are rules C&J sets, not live carrier quotes, so they can be wrong on odd orders
- Two places to look at shipping, but only one of them is customer facing

**Option B: all in on Shopify, drop Shippo.**
Same rates at checkout as A, plus buy labels in the Shopify admin next to the order.
- One system, one place, nothing to reconcile, tracking numbers flow back to the order automatically
- No Shippo subscription
- Fewer carriers than Shippo, and they lose any Shippo rate they are used to
- Worth comparing real label prices on a few typical shipments before switching

**Option C: live carrier rates at checkout, through Shippo or Shopify's own carrier accounts.**
Customers see real UPS or USPS quotes for their exact address and package.
- Most accurate charge, no money lost or overcharged on shipping
- Needs Advanced ($399/mo) or Grow on annual billing. Against a $39/mo Basic plan that is a big jump for a store this size
- Needs real weights and box dimensions on every product to be worth anything

### Recommendation

Start on **Option A**. Revisit Option C only if shipping cost on real orders turns out to vary enough to hurt, which is unlikely while about 95% of sales are ice rods going out in the same tube. Option B is a good follow-up once the store has been live a while and C&J can compare a month of real label prices side by side.

### What has to be set up either way (Phase 8B-3)

- Real **weight** on every Custom Rod Build variant and every in-stock rod, reel and apparel product. Price based rates can ignore this, weight based rates cannot, and Shippo needs it to quote anyway.
- Shipping comes off the **Custom Rod Build** line only. Build Options is not a physical product, so it carries no shipping. Confirm a build quotes the same as a single in-stock rod.
- Test a **mixed cart** (custom rod + reel + shirt) and check the rate is sane, not three separate rod rates stacked.
- Decide whether a second rod in the same order adds shipping or ships free. Rod tubes are long, so two rods usually means one longer tube, not two shipments.

### The ice vs open water wrinkle, worth knowing now

All custom builds, ice and open water, are variants of one product (`Custom Rod Build`). Shipping rules in Shopify are set per shipping profile, and a product or variant belongs to exactly one profile. So charging different shipping for ice builds and open water builds means assigning individual variants of that one product to different profiles. Shopify supports variant level assignment, but it is fiddly, and every new series variant has to be put in the right profile by hand or it silently falls back to General. Avoid needing it: one set of shipping rules for all rods is simpler and fits the 95% ice reality.

### What to ask Chris and Joe

- What do they pay Shippo per month today, and roughly how many labels?
- What does it actually cost them to ship one ice rod, and one open water rod?
- Do they ship anywhere outside the lower 48?

---

## 2. Free shipping threshold

**The ask:** a "spend $X more and shipping is free" nudge in the cart.

Unblocked as soon as item 1 lands. It needs a real shipping cost to set a sane number against.

### How it works, two halves that must agree

1. **Shopify side.** Settings, Shipping and delivery, add a **Free shipping** rate with a minimum order price condition. Works on every plan, costs nothing, and it is what actually makes shipping free at checkout.
2. **Website side.** The cart drawer cannot see shipping rates (Shopify does not price shipping until checkout), so the progress bar is a plain comparison of the cart subtotal against a number the site is told. That number lives in Sanity, one field on a settings document.

**The failure mode is drift.** If Chris changes the Shopify rate and not the Sanity number, the cart promises one thing and checkout does another. Whoever builds this writes the warning into `guide-chris.md`: these two numbers are changed together, or not at all.

### Sitewide or ice only

They floated ice only, since open water already costs more to ship. Shipping rates cannot target tags, and the collection trick that solves the promotions problem does not apply here, because rates are per shipping profile, not per collection. Ice only would mean the variant level profile juggling described in item 1.

**Recommendation:** one sitewide threshold, set high enough to cover an open water rod's shipping. Simpler to run, simpler to explain, and 95% of orders are ice anyway.

### What to ask Chris

Just the number, once he knows what shipping costs. Give him a steer: common practice is a threshold a bit above the average order, so it pulls a second item into the cart rather than discounting orders that were already going to happen.

---

## 3. Promotions system + homepage popup

**The ask:** Chris creates promos ("15% off all rods", "10% off ice rods") and a homepage popup advertises the active one.

### The Sept 2 catch, and the fix

The problem was: Shopify's no-code discount targeting works by **all products, specific collections, or a specific product list**, never by tag. Ice, open water and series are tags in this build, deliberately. So "10% off all ice rods" had no clean path, and the alternative, Shopify Functions, looked like it needed Plus.

**The fix is automated collections.** A Shopify automated (smart) collection takes a condition such as "Product tag is equal to ice" and keeps its own membership up to date forever. Create one per group that ever needs its own promo. Discounts can then target the collection, no code, any plan, nothing to maintain.

This removes the Functions question entirely. For the record, the Functions facts are: custom apps containing Functions require Plus, public App Store apps containing Functions work on any plan. So Functions were reachable through a public app, but there is no reason to go there.

**Collections to create (Shopify admin, Phase 9):**

| Collection | Condition | Why |
|---|---|---|
| Ice Rods | tag is `ice` | the likely promo group |
| Open Water Rods | tag is `open-water` | the other half |
| One per series | tag is the series slug | only if Chris wants single series promos |

Two things to get right:
- **Publish each new collection to the Cj Custom Rods Headless channel.** An unpublished collection comes back `null` with a clean 200, the standing gotcha in this build.
- These collections exist for discount targeting, not for browsing. The frontend does not render collections on its own, so they will not appear on the site. Leave it that way.

### Does the helper product get caught by a rods promo?

Watch this one. `Custom Rod Build` is deliberately in **no collection**, so a "10% off ice rods" collection discount will **not** touch custom builds. That may be exactly right (a promo on in-stock rods only) or exactly wrong (Chris meant custom rods too). Decide it per promo, and if custom builds should be included, the Custom Rod Build variants have to carry the right tag and sit in the collection, which means revisiting the never-in-a-collection rule in `how-to-notes.md`. Do not change that rule casually: it exists so a customer cannot buy a bare base price off the storefront.

### Who owns what

- **Shopify owns the discount.** An **automatic** discount, not a code. Automatic discounts need no cart work at all: the Cart API already returns them through `lines[].discountAllocations`, which Phase 2 queries, and they carry into hosted checkout. A code based promo would need either a discount code field in the cart (`cartDiscountCodesUpdate`, not built) or customers typing the code at checkout, where the cart total shown on site would not match. Prefer automatic.
- **Sanity owns the popup.** A `promotion` document: headline, body, optional image, CTA label and link, start and end dates, active toggle. The popup component reads the one active promo and shows it once per visitor per promo (localStorage key on the promo id), dismissible, never on checkout.

The old site's failure was Sanity promising a discount that Shopify was not applying. The guard is process, not code: the promo document gets a required field naming the matching Shopify discount, and `guide-chris.md` says the Shopify discount is created first, the Sanity promo second.

### Still owed by Chris, and it still matters

Two questions went out after Sept 2 and were never answered:

1. **How granular?** Sitewide, ice vs open water, or single series?
2. **How often?** A couple of times a year, or monthly?

The collections fix makes question 1 cheap to answer either way. Question 2 is now the one that decides the build: a couple of promos a year means Jordan sets up the discount and the popup by hand in ten minutes and there is nothing to build. Monthly means the Sanity promo document and popup are worth it so Chris can run them himself.

**Do not build this until question 2 is answered.**

---

## 4. Cart upsells (Features A and B)

Out of the original scope. They asked for a number at the Sept 2 meeting and the number was never sent. Scoping was done then, pricing is below.

### What changed since Sept 2

The cart now exists (Phase 2) and custom builds check out through it (Phase 7). That lowers the risk on A and raises the detection work on B, because a custom build in the cart is not a series product. It is a variant of the shared `Custom Rod Build` helper, with the series carried in the line attributes and in the variant SKU.

### Feature A: apparel suggested in the cart

Two or three apparel products shown in the cart drawer before checkout, add to cart in one tap.
- Rides on cart plumbing that is already built
- No new data relationship, apparel is one query
- 3 to 5 hours

### Feature B: series specific reel cross-sell

Add a Hole Hog, see the reels that pair with it.
- Needs a rod to reel data relationship that does not exist yet
- Recommended shape, consistent with "Shopify owns product level structured data": a **product-reference metafield** on in-stock rod products, plus the **same metafield at variant level** on each `Custom Rod Build` variant, since that is where a series lives for custom builds
- Cart side logic: detect the rods in the cart by two paths (in-stock product tags, and build lines by variant SKU or the Series attribute), resolve the linked reels, fetch display data, and decide what happens when the cart holds rods from more than one series
- Ice focused, which is where rod and reel pairing actually matters
- 10 to 15 hours

### The numbers to send

| | Price |
|---|---|
| Feature A, apparel in cart | **$450** |
| Feature B, series reel cross-sell | **$1,200** |
| Both together | **$1,500** |

Reasoning, for Jordan not the client: these sit with the existing post-launch upsell pricing in the client overview doc (email marketing $400 to $800, blog $400 to $600, advanced shipping $300 to $500), which runs higher per hour than the project rate, as add-on work should. B is priced toward the top of its hours because it is an average order value play aimed at the 95% of sales that are ice, not just a cart component, and because the two detection paths are real work. Send A and B as two separate numbers so it is a real choice, with the bundle as the nudge.

**Sell before building.** Nothing here starts until they say yes.

---

## 5. Waiting on client, nothing to do

- **Hero image.** They were not sold on the current one and were sending options. Nothing to do until they arrive.
- **Reviews.** They are sending more. At least one per series was the ask.
- **Blank color photos.** Still outstanding and now confirmed as a real gap: Phase 4 could not sample a swatch for **Seafoam** and **Titanium Chrome**, so both hex values in Sanity are guesses. Chase these two specifically, they are the only ones missing.

---

## Everything outstanding from Chris and Joe, in one list

For whenever the next email or call happens. The numbered questions are the builder list in `plan.md`.

**New, from this document:**
1. Shipping: what Shippo costs them per month, label volume, real cost to ship an ice rod and an open water rod, and whether they ship outside the lower 48
2. Free shipping threshold: the dollar number (after shipping is settled)
3. Promotions: how granular (sitewide, ice vs open water, single series)
4. Promotions: how often, a couple of times a year or monthly (this one decides whether anything gets built)
5. Cart upsells: yes or no on A, B, or both

**Already owed, from `plan.md`:**
- Question 13: contact page phone, location, hours
- Questions 10 and 11: build lead time, returns policy on custom builds
- Questions 1 to 9 and 12: the builder list, including Ice Reaper and Hole Hog base prices, blank color confirmations, grip finish names, Seafoam and Titanium Chrome photos
