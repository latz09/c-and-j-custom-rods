# CMS Guide: Rod Builder section

Section to add to the Sanity Studio CMS guide (the PDF behind the Studio's guide button). Field names below are the labels you see in Studio. Written for Chris.

## Where things are

In the left menu, **Rod Builder** opens a folder with:
- **Builder Page**: wording and pricing rules for the builder.
- **Blank Colors** (14)
- **Thread Colors** (63)
- **Grips** (28, ice and open water)

Series themselves are under **Rod Series**. Each series has a **Rod Builder** tab.

## Builder Page

| Tab | What it controls |
|---|---|
| Hero | Headline, subheadline and image at the top of the Custom Rod Builder page |
| Series Picker | Section heading, tab labels and the "coming soon" label on the series cards |
| Builder Copy | Section labels, helper text for accent thread and sticker, and the lead-time note |
| Pricing Rules | Ice rod lengths, grip upcharges, accent thread price, sticker price, sticker maximum characters |

### Pricing Rules
- **Ice Rod Lengths (inches):** the lengths customers can pick on ice rods.
- **Ice Grip Upcharges / Open Water Grip Upcharges:** a price for Cork Split, Cork Straight, EVA Foam Split and EVA Foam Straight. EVA Foam Straight is $0 (included).
- **Accent Thread Price ($)** and **Personalized Sticker Price ($)**: both $10 today.
- **Sticker Max Characters:** how long the sticker text can be (20 if left empty).

**Rule:** every add-on price must be a multiple of $5, and one rod's add-ons together must not pass $90. Otherwise the website refuses the build. Base prices are not here. They are on Custom Rod Build in Shopify.

## Rod Series: Rod Builder tab

| Field | What it does |
|---|---|
| **Builder Status** | Live (customers can build), Coming soon (card with no link), Hidden (not shown in the builder) |
| **Builder Card Blurb** | One or two sentences on the series card |
| **Builder Image** | Photo on the builder card and page. If empty, the Card Preview Image is used |
| **Available Blank Colors** | Which blank colors this series offers. Pick from the Blank Colors list, drag to reorder |
| **Applications** | Open water only. One entry per option: Length, Power / Action, Line Weight, Lure Weight, Usage and **Upcharge ($)** |

**In-Stock Rods Status** (on the main fields tab) is a separate switch that controls only the In-Stock Rods pages. A series can be Live in the builder and Hidden in-stock, or the other way around. If In-Stock Rods Status is empty the series counts as Live.

**Series Tag** and **Water Type Tag** must match the Shopify product tags and the Custom Rod Build SKU. Do not change a Series Tag without asking Jordan.

## Blank Colors
- **Color Name**
- **Swatch Hex:** the color chip shown when there is no photo, and next to the photo
- **Blank Photo:** the real photo of the blank
- **Display Order**

Seafoam and Titanium Chrome have no photo yet and their Swatch Hex values are guesses.

## Thread Colors
- **Color Name** and **Thread Code** (for example 001). Both appear on the order.
- **Swatch Hex**
- **Picker Group:** Warm, Cool or Neutral / No color. This is which dropdown the color shows in. Some were assigned automatically and may need fixing.
- **Display Order**

## Grips
- **Water Type:** Ice or Open Water. Each grip belongs to one.
- **Material** (Cork or EVA Foam) and **Style** (Split or Straight): these set the price.
- **Finish Name:** the name customers see and that prints on the order. Most are placeholders like "Cork Split 1".
- **Grip Photo**
- **Legacy Reference ID:** the old site's code. Leave it.
- **Display Order**

## Adding a new series (summary)
1. Shopify: add a variant on Custom Rod Build (price, SKU as Jordan gives you).
2. Studio: create or open the series, fill the Rod Builder tab, set Builder Status to Live.
3. Try a build on the site.

## Do not
- Change a Series Tag, or delete a blank, thread or grip that a live series uses, without checking with Jordan.
- Run any import or migration. It overwrites your edits.
