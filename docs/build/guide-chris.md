# Your New Website: A Guide for Chris

Plain-language steps for running the C&J Custom Rods site. If something here is unclear or does not match what you see, tell Jordan.

## How the site is set up

- **Shopify** is where your products, prices and orders live. Same as before.
- **Sanity Studio** is where you edit the website's words, pictures and the rod builder's options. Think of it as the website's control panel.

The site picks up changes by itself. After you save, give it a minute and refresh.

## What lives where

| I want to change... | Go to |
|---|---|
| The starting price of a custom rod series | Shopify |
| In-stock rods, reels, apparel and their prices | Shopify |
| Grip, accent thread or sticker prices | Sanity: Rod Builder, Builder Page, Pricing Rules |
| Grip names, blank colors, thread colors | Sanity: Rod Builder folder |
| The short blurb on a series card | Sanity: Rod Series, then the Rod Builder tab |
| Phone, location, hours on the Contact page | Sanity: Contact Page, Business Info tab |
| Website wording | Sanity: the page's own entry |

## How a custom rod is sold

A custom rod is the base price for its series plus add-ons (application, grip, accent thread, sticker). The customer sees one item at one price. In Shopify behind the scenes it uses two hidden products, **Custom Rod Build** and **Build Options**. You only ever edit prices on Custom Rod Build.

### Change a series' starting price
1. In Shopify, open **Custom Rod Build**.
2. Find the series' variant and edit its price. Save.
3. The website follows within about a minute.

**Do not change the SKU.** The SKU (for example `hole-hog`) is how the website matches the price to the series.

### Change add-on prices
Add-on prices are in Sanity, not Shopify: Rod Builder, Builder Page, Pricing Rules tab. Keep every add-on **a multiple of $5** (so $5, $10, $15...). A build's add-ons must also add up to **$90 or less**. The website refuses builds that break these rules.

### Add a new series
1. In Shopify, add a variant to Custom Rod Build with the base price. Ask Jordan for the exact SKU to use (it must match the series).
2. In Sanity, open the series under Rod Series and fill in its Rod Builder tab: blank colors, applications (open water only), card blurb and image.
3. Set **Builder Status** to **Live**.
4. Try building one on the site.

### Bring Ice Reaper live
Today Ice Reaper shows as **Coming soon**. When you are ready:
1. Tell Jordan the base price (or add the variant yourself with SKU `ice-reaper`).
2. In Sanity, open the Ice Reaper series, fill in blank colors and the blurb.
3. Change **Builder Status** from Coming soon to **Live**.

## Showing or hiding a series

Each series has two switches. They work separately:
- **Builder Status** (Rod Builder tab): the custom builder.
- **In-Stock Rods Status**: the In-Stock Rods pages.

Each can be **Live** (shown), **Coming soon** (a card with no link) or **Hidden** (gone). A Hidden In-Stock series also stops its page from working. Bass Casting, Musky Casting and Musky Spinning are hidden for now.

## Changing names and colors in the builder

- **Grip names:** Rod Builder, Grips, pick a grip, edit **Finish Name**. This name shows in the customer's summary and on your order. Right now most are "Cork Split 1, 2, 3" and so on. Better names are welcome.
- **Blank swatch color:** Rod Builder, Blank Colors, edit **Swatch Hex**. Most were picked from the photo and may look slightly off. Seafoam and Titanium Chrome have no photo yet, so their colors are guesses. Upload photos when you have them.
- **Thread dropdown groups:** Rod Builder, Thread Colors, edit **Picker Group** (warm, cool or neutral). These were assigned automatically, so a few may look wrong (for example Concrete and Rain Cloud under cool, or Neon Green and Spring Green under warm). Fix any you spot.
- **Card blurbs:** every live series has a drafted blurb. Edit it on the series' Rod Builder tab. Ice Reaper's is a placeholder.

## Reading a custom rod order

In Shopify, an order with a custom rod has a **Custom Rod Build** line (base price) and, if there were add-ons, a **Build Options** line (the add-ons total). Both list the same specs under their properties:

Series, Length or Application, Blank Color, Primary Thread, Accent Thread, Grip, Sticker Text.

Build the rod from either line. The Build Options line is only there for the money.

## Contact form

Every message is emailed to the business address and also saved in Sanity under **Contact Form**. Hit Reply in your email to answer the customer directly.

Phone, location and hours on the Contact page are filled in Sanity (Contact Page, Business Info). Empty fields are hidden. Send Jordan the real ones, or fill them in yourself.

## Please do not touch

- **Custom Rod Build and Build Options in Shopify**, except base prices on Custom Rod Build. In particular do not:
  - change a SKU or product handle,
  - delete a variant, or delete either product,
  - turn on inventory tracking,
  - put them in a collection or sell them on any other sales channel,
  - change a Build Options price (each price must equal its amount).
- The **Series Tag** on a series in Sanity (it must match Shopify).

If any of these go wrong, custom builds stop working or are charged the wrong price.

## Still to be confirmed

These are open and may change what you see:
- Ice Reaper base price and photos.
- Hole Hog base price ($119 is what is set now).
- Final grip names and which blank colors each series offers.
- Sticker rules (character limit, font or color choice) and a notes field on builds.
- How long a custom build takes, and the returns policy on custom rods.
- Tax and shipping rates, real payments, and when the site goes live.
- Whether to carry over your old in-stock rod listings.
- Phone, location and hours for the Contact page.

## Trying the preview

When Jordan sends you the preview link, nothing you do is real: no card is charged and no rod is built.

**Try these:**
- **Shop:** In-Stock Rods, Reels and Apparel. Open products, pick sizes or colors, add to cart.
- **Cart:** the cart button in the top bar. Change quantities, remove items, check the subtotal.
- **Custom Build:** pick ice or open water, pick a series, build a rod. The total updates as you pick. It shows in the cart as one item with all its choices.
- **Checkout:** press Checkout in the cart. It is a test checkout. Use card number **1** (just the digit), any name, any future expiry date and any 3 digit security code. Try one cart with a custom rod, an in-stock rod, a reel and a shirt.

**Not done yet, on purpose:** only some in-stock rods are loaded and open water in-stock is empty for now; real payments, shipping rates and tax are not set up (checkout totals may not match what you will charge); this is a temporary address hidden from Google.

**If you see a password page:** the test store is locked while it is being built, so you may see a password page, most likely when you press Checkout. Customers will never see it. Enter the store password Jordan sends you and press Enter.

**What helps most:** tell Jordan anything that looks wrong, confusing or unfinished, on a phone and on a computer. A screenshot with a note on what you expected is perfect.
