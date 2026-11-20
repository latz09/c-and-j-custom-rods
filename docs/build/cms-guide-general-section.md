# CMS Guide: How Studio works and what is in it

Companion to `cms-guide-builder-section.md`. Covers everything in Sanity Studio except the Rod Builder folder. Field names are the labels you see in Studio. Written for Chris.

## The basics

**What Studio is.** Sanity Studio is the control panel for the website's words, pictures and a few settings. Products, prices and orders are not here. They are in Shopify.

**What is where, at a glance**

| Lives in Studio | Lives in Shopify |
|---|---|
| Page wording, hero images, banners | Rods, reels, apparel and their prices and photos |
| Rod series info (names, intro text, status) | Cart, checkout, orders |
| Reviews | Base price of custom rods |
| Business info, SEO, navigation | |
| Rod builder options (see the builder section) | |

**Saving and publishing.** Edit a field and Studio saves a draft automatically. Click **Publish** (bottom right) to put it on the site. Until you publish, visitors see the old version. After publishing, wait about a minute and refresh the site.

**Two kinds of entries in the left menu**
- **Single pages** (Home Page, About Page and so on): there is only one of each. Click it and edit.
- **Lists** (Rod Series, Testimonials, Contact Form): click to see a list, then click an entry or the **+** to add a new one.

**Things you will see in fields**
- **Fixed destination, read-only in practice** (on button links): the button's label can change but the link is fixed by design. Leave the link alone.
- **Images:** drag in a file. Where you see a hotspot or crop control, use it to pick the focus point so the image crops well on phones.
- **Display Order:** a number. Lower shows first.

## Left menu, top to bottom

### Navigation
The top menu links, as a flat list. Each link has a **Label**, a **URL** (for example `/shop/rods`) and **Show as CTA Button** (the highlighted Contact button). You can reorder or relabel links. Do not change URLs unless a page moved. A wrong URL means a broken menu link.

### Home Page
Tabs in order:
1. **Hero:** Headline, Subheadline, Hero Background Image (water or lifestyle scene), Hero Rod Image (rod shot layered on top) and two buttons: Custom Rod Builder and In-Stock Rods.
2. **Featured Product:** an Eyebrow Text line, the **Shopify Product Handle** of the product to feature, and its **Product Category** (Rod, Reel or Apparel). The handle is the last part of the product's web address in Shopify (for example `my-product-name`). Category decides which shop section the card links to. If the handle is wrong or the product is unpublished, the card shows nothing.
3. **Shop Collections:** a Section Heading and exactly four cards. Labels are editable, destinations are fixed.
4. **About Blurb:** Heading, Body, Image and the button to the About page.
5. **SEO:** see "SEO on every page" below.

### In-Stock Rods (page)
- **Page Title**
- **Current Season:** Open Water or Ice Fishing. This sets which filter is selected first when the page loads. **Switch it with the seasons.** Ice is most of C&J's sales, so set it to Ice when ice season starts.
- **Hero:** headline, subheadline, image, and two buttons that jump down the page (to the series section and to the full grid).
- **By Series:** the heading and subheading above the series cards.
- **Full Grid:** the heading above the full list of rods. The rods themselves come live from Shopify.

### Rod Builder
Covered in `cms-guide-builder-section.md`.

### Reels and Apparel (pages)
Each has a **Hero** (headline, body, image) and a **Product Grid Heading**. The products themselves come from the Shopify collections named **reels** and **apparel**. To add, remove or reprice a reel or shirt, use Shopify.

### About Page
Tabs: **Hero** (subheadline and a team or founders photo), **Our Story** (a photo and 2 to 4 paragraphs on C&J's history and craftsmanship), **Success on the Water** (a carousel of customer catch photos you upload), **Our Commitment** (a subheading and commitment cards, each with an icon, title and text; upload icons as SVG for crisp lines).

### Reviews (page)
Only the hero wording is here. The review cards come from the Testimonials list.

### Contact Page
- **Hero:** headline and subheadline.
- **Business Info:** Section Heading, **Email** (click-to-email), **Phone Number** (click-to-call on phones), **Location** (City, State) and **Hours** (for example `8am to 4pm M to F`). **Any field left empty is hidden** on the site, so empty is better than a placeholder.

Keep this in step with the phone, email and address in **SEO Settings**. They are separate fields.

## Below the divider

### Rod Series
One entry per rod series. The same entry feeds the In-Stock Rods pages and the builder.

| Field | What it does |
|---|---|
| **Series Name** | Display name, for example "Hole Hog" |
| **Series Tag** | A short code that must match the tag on the series' products in Shopify, and the SKU on Custom Rod Build. **Do not change it without asking Jordan** |
| **Water Type Tag** | Ice Fishing or Open Water |
| **In-Stock Rods Status** | Live, Coming soon (card, no link) or Hidden (card gone and the series page stops working). Empty counts as Live |
| **Series Description** | Intro text on the series page |
| **Hero Image** | Large image at the top of the series page |
| **Card Preview Image** | Image on the series card |
| **Display Order** | Lower shows first |
| **Rod Builder tab** | Builder Status and builder options. See the builder section |

Which in-stock rods show in a series is decided in Shopify by tags (`ice` or `open-water`, plus the Series Tag). A rod with the right tags shows up in its series automatically.

### Testimonials
One entry per review.
- **Angler Name** and optional **Photo**.
- **Pull Quote:** the short headline quote. Used on the Reviews grid and in the product page banner.
- **Full Review:** the longer text, in paragraphs.
- **Series Tag (optional):** type a Rod Series' Series Tag exactly (for example `panfish-spinning`). That review then appears on that series' product pages.
- **Default / Fallback Testimonial:** shows on the Contact page banner, and on any product page whose series has no review of its own. **Mark only one review as default.**
- **Display Order**

One review per series is wanted. Series with none fall back to the default.

### Global CTA Banners
The call-to-action banners that repeat on many pages. Edit them once and they change everywhere.
1. **Multi-CTA Banner:** shown on Home, About and Reviews. Body text plus three buttons (Custom Rod Builder, In-Stock Rods, Contact).
2. **Product-Page Banner:** shown at the bottom of every product page. Body plus two buttons (Custom Rod Builder, Contact).
3. **Custom Rod Banner:** shown on the custom rod builder page. Body plus two buttons (In-Stock Rods, Contact).

Each body item shows as its own paragraph. Button labels are editable, links are fixed.

### SEO Settings
Site-wide search and social settings. Pages with a blank SEO tab use these.
- **Site Name**, **Site URL** (the live address with https), **Title Template** (use `%s` for the page title), **Default Title** (50 to 60 characters), **Default Description** (150 to 160 characters), **Keywords** (5 to 10).
- **Default OG Image:** the picture that shows when the site is shared on social media (1200 by 630 pixels).
- **Email Logo:** shown at the top of contact form emails only, not on the site. PNG or JPG, about 500 pixels wide (email apps do not show SVG). With none set, the emails show the business name as text.
- **Twitter / X Handle**, **Schema Type** (Organization or LocalBusiness: how search engines see the business), **Phone Number**, **Email Address**, **Address**, **Service Areas**, **Price Range**.

Site URL must be the real address at launch, or search engines get the wrong one.

### Contact Form
Every message sent from the Contact page is saved here: Name, Email, Phone Number, Inquiry Type, Message and Sent At. A copy also goes to the business email. You normally only read these. They can be deleted when you are done with them.

## SEO on every page
Each page has an **SEO** tab or section with Page Title (50 to 60 characters), Meta Description (150 to 160 characters) and Keywords. **Leave it blank to use the SEO Settings defaults.** Fill it in when you want a page to show specific wording in Google results.

## Do not
- Change a **Series Tag** or a button link.
- Run any import or migration.
- Delete a Rod Series, Blank Color, Thread Color or Grip that a live series uses.
- Mark more than one testimonial as default.
- Leave Site URL pointing at a test address after launch.

## When something looks wrong on the site
1. Did you click **Publish**? Drafts do not show.
2. Wait a minute and refresh.
3. For a product, price or photo, check Shopify, not Studio.
4. Still wrong: tell Jordan the page and what you expected.
