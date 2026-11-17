# Rod Builder: Design Notes (from Alyssa's screenshots)

**Images in `docs/build/design/`:**
1. `custom-rod-landing-page.png`: `/shop/custom` landing + series picker
2. `custom-icerod-options-page.png`: ice builder, desktop (Hole Hog example)
3. `custom-openwater-rod-options-page.png`: open water builder, desktop (Musky Casting example)

The yellow "A" circles and the red horizontal line in the screenshots are design-tool comment markers and guides, not UI.

---

## 1. Landing page: `/shop/custom`

**Hero**
- Big all-caps heading: "BUILD YOUR CUSTOM ROD"
- Subtext: "Choose your category (ice fishing or open water) and then choose a series to start."
- Light gray panel with the topography line pattern (repo already has `components/ui/Topography.js`)
- Copy comes from `customBuilderPage.hero`

**Series picker**
- Section heading: "Category and series"
- Two tab buttons: "Open water series" / "Ice fishing series". Ice is selected by default (blue fill), even though open water is listed first.
- Card grid, 3 columns on desktop. Each card:
  - Rod photo (isolated, angled) on a light gradient
  - Pill badge top-right: "Ice fishing" (open water cards would read "Open water")
  - Series name (e.g. "Hole Hog")
  - "Starting at $119" (base price)
  - One- or two-sentence blurb (e.g. "Highly sensitive tip with a powerful backbone for confident panfish fishing.")
  - "Start building →" link
- Ice series shown: Hole Hog ($119), Hog Whip ($119), Carbon Crush ($124.99), Eyece Commander ($129.99), Ice Reaper ("Coming soon!")

**Ice Reaper is "Coming soon!"** in place of a price, but the card still shows "Start building". A series needs three states, not on/off: **live** (normal card), **coming soon** (card shows, no price, no link), **hidden** (not shown, e.g. Bass Casting, Musky Casting, Musky Spinning).

## 2. Builder page layout (desktop, both water types)

Two columns.

**Left column**
- Rod photo in a rounded card.
- "Your Build" summary card below it:
  - Ice rows: Series, Blank color, Length, Primary thread, Accent thread, Grip, Sticker
  - Open water rows: Series, Application, Blank color, Primary thread, Accent thread, Grip, Sticker
  - Grip reads `Material - Style - Finish` (e.g. "Cork - Split Grip - Mosaic"). **Grip finishes have names.**
  - Sticker shows the text in quotes, or "None"
  - **Total** row
  - Full-width blue "Add to cart" button with cart icon

**Right column, top**
- Breadcrumb: `Custom Rod Builder / Ice Rods / Custom Hole Hog` or `Custom Rod Builder / Open water rods / Musky Casting`
- H1 series name. Ice mock uses "Custom Hole Hog" (prefix "Custom"); open water mock uses plain "Musky Casting". Pick one (open question for Alyssa).
- "Starting at $X" in brand blue

## 3. Option sections

Order matches the confirmed flow. **Ice:** blank, length, primary thread, accent, grip, sticker. **Open water:** application, blank, primary thread, accent, grip, sticker.

**Select application (open water only, "3 options")**
- Stacked full-width cards. Each: length (large), three spec columns (Power/action, Line weight, Lure weight) with small labels under the values, then a usage line.
- Upcharge pill top-right: green "Included" or the amount. Selected card: gray fill, white pill.

**Blank Color**
- Swatch tiles with the name under each (Black, Sea foam, Chartreuse, Glow on Hole Hog). Selected tile gets a gray background.
- Mocks still show swatch only. Final build shows the real blank photo with the swatch underneath (Sept 2 decision). Swatch-only fallback when no photo (Seafoam, Titanium Chrome for now).

**Rod length (ice only)**
- Row of chips: 20" through 36" in 2" steps. Selected chip gray.

**Primary thread color / Accent thread color (optional +$10)**
- Three dropdowns in a row: "Warm colors (35)", "Cool colors (23)", "No color (5)".
- The dropdown holding the pick fills gray and reads e.g. "Warm colors (35) - DK's Fire Coral" with a color dot. The other two stay empty. Picking in one clears the others.
- Same component for both.

**Grip material**
- Chips: Cork / EVA Foam.

**Grip style**
- Chips with upcharge, e.g. "Split Grip +$15" / "Straight grip +$10" (ice cork prices).
- Prices depend on material and water type. Open water cork: split +$40, straight +$30. EVA: split +$5 ice / +$10 open water, straight included. The open water mock shows ice prices; the build pulls from the CMS table.

**Grip finish**
- Row of real grip photo tiles (4 for cork split). Selected tile gray background. Finish name appears in the summary.

**Personalized sticker (optional +$10)**
- **Text input** (examples: "Fish Slayer", "Chris's Rod"). Not a toggle. Empty means no sticker and no charge.

## 4. Pricing checks

- Open water mock total $459.99 = $399.99 base + $0 application + $40 cork split + $10 accent + $10 sticker. Correct.
- Ice mock total shows $119.99 with cork split and an accent picked. Should be $144.99 ($119.99 + $15 + $10). Mock placeholder, not a design decision; the build always computes the total.
- **Hole Hog base price shows three ways:** $119 (landing card), $119.99 (builder header), $119.00 (option reference). The old live CMS has $119. Shopify `Custom Rod Build` variant price is the source of truth.

## 5. Build implications (already in the plan)

- Series builder status is an enum: live / coming soon / hidden.
- Series card needs a short blurb field and a card image (fall back to the existing `previewImage`).
- Grip docs need a finish name; summary shows material, style and finish.
- `GripSelect`: material, then style (priced per material + water type), then finish photo.
- `StickerInput`: text with a CMS max length; blank = no sticker.
- `ThreadColorSelect`: three dropdowns, one selection across them.
- Summary rows differ by water type (Length vs Application).

## 6. Not covered by the mocks

- Mobile layout for the builder and the landing page (sticky summary bar agreed in concept).
- Whether the left rod photo swaps with the selected blank color.
- Coming-soon card behavior (no link vs. link to a notify page).
- Open water tab of the landing page (assumed same card layout with an "Open water" badge).
