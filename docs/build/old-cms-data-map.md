# Old CMS Data Map (v1 site, for Phases 3 and 4)

**Source:** old Sanity project `xov8qqkx`, dataset `production`, exported Nov 17, 2026 (published only).
**Totals:** 292 documents, 387 images.
**Files (Jordan's machine):** `/c/LatzWebDesign/INFO/Clients/Active/2026/c-and-j/cj-export/`
- `cj-old-full.tar.gz`: `data.ndjson` + `assets.json` + `images/` (387 files). **Phase 4 reads this one.**
- `cj-old-data.tar.gz`: `data.ndjson` only, and image references are stripped. Fine for reading structure, useless for images.

Extract with `tar -xzf cj-old-full.tar.gz` into its own folder (outside both repos). It unpacks to `production-export-<timestamp>/`.

In the full export, images look like this inside `data.ndjson`:
```json
"image": { "_type": "image", "_sanityAsset": "image@file://./images/<hash>-1500x2000.png" }
```

---

## Type inventory

| Old type | Count | Has images | Verdict |
|---|---|---|---|
| `threadWrapColors` | 63 | no | **Migrate** to `threadColor` |
| `iceRodBlankColor` | 12 | yes (12) | **Migrate** to `blankColor` |
| `iceRodSeries` | 4 | yes (`mainImage`) | **Migrate** onto `rodSeries` builder fields |
| `openWaterRodSeries` | 6 | yes (`mainImage`) | **Migrate** onto `rodSeries` builder fields |
| `openWaterApplication` | 42 | no | **Migrate** into `rodSeries.applications[]` |
| `iceRodGrips` | 1 (singleton, 13 grips) | yes (13) | **Migrate** to `grip` docs + ice prices to Pricing Rules |
| `openWaterRodGrips` | 1 (singleton, 15 grips) | yes (15) | **Migrate** to `grip` docs + open water prices to Pricing Rules |
| `customIceRodOptions` | 4 | no | Skip (dead, includes Panger) |
| `icerods` | 46 | yes (137) | Skip. Old in-stock rod listings. Possible source for loading the rest of the Shopify catalog (Phase 8) |
| `openWaterRods` | 11 | yes (41) | Skip. Same as above |
| `receivedOrder` | 50 | no | Skip. Customer order data, stays in the old project |
| `contactForm` | 41 | no | Skip. Customer submissions, stays in the old project |
| `discount` | 5 | no | Skip (promotions direction still open) |
| `testimonials` | 1 (5 entries) | yes (5) | Skip (reviews already handled in the new CMS) |
| `homepage`, `whoWeAre`, `contactPage`, `callToAction`, `assets` | 1 each | some | Skip (pages already rebuilt) |

**Do not import the whole tarball into the new project.** It would bring orders, contact submissions and old page types along. See "Phase 4 approach" below. Don't print or log `receivedOrder` or `contactForm` contents; they hold customer personal data.

---

## Field mapping

### `threadWrapColors` to `threadColor`
| Old | New | Notes |
|---|---|---|
| `title` | `name` | |
| `referenceNumber` | `code` | "001" to "059", "501" to "504" |
| `hexColor` | `hex` | All 63 have hex (trim whitespace) |
| (none) | `category` | **Not in old data.** See finding 3 |

### `iceRodBlankColor` to `blankColor`
| Old | New | Notes |
|---|---|---|
| `title` | `name` | |
| `image` | `image` | All 12 have photos |
| (none) | `hex` | **Not in old data.** See finding 1 |

12 colors: White, Black, Hot Pink, Metallic Blue, Neon Orange, Metallic Green, Glow, Metallic Purple, Metallic Red, Metallic Gun Metal, Chartreuse Yellow, Neon Green. New: Seafoam, Titanium Chrome (no photos yet).

### `iceRodSeries` / `openWaterRodSeries` to `rodSeries` (Rod Builder group)
Match by slug: old `slug.current` equals new `rodSeries.slug`, except `panfish-carbon` (now Carbon Crush, check the new tag).

| Old | New | Notes |
|---|---|---|
| `title` | (already on `rodSeries.name`) | Don't overwrite |
| `slug.current` | match key | |
| `available` | `builderStatus` | true = live, false = hidden |
| `availableBlankColors[]` | `builderBlankColors[]` | **Use the target lists below, not the old ones** |
| `mainImage` | `builderImage` | Bass Casting, Musky Casting and Musky Spinning all share one placeholder photo |
| `overview` | reference for `builderCardBlurb` | Old overviews are paragraphs; card blurbs are 1 or 2 sentences |
| `price` | **Shopify** `Custom Rod Build` variant | Not stored in Sanity |
| `rodType` (OW only) | not needed | spinning / casting, already in the series name |
| `availableApplications[]` (OW only) | `applications[]` | Inline the referenced `openWaterApplication` docs |
| `categorySlug` | not needed | |

Old prices: Hole Hog **119**, Hog Whip 119, Eyece Commander 129.99, Panfish Carbon 124.99, Bass Spinning 229.99, Walleye Spinning 234.99, Bass Casting 254.99, Musky Casting 399.99, Musky Spinning 399.99, Panfish Spinning 219.99.

### `openWaterApplication` to `rodSeries.applications[]`
Fields carry over as-is: `length`, `powerAction`, `lineWeight`, `lureWeight`, `upcharge`, `usage`. Linked by `series._ref`. Counts per series: Bass Spinning 9, Walleye Spinning 5, Bass Casting 15, Musky Casting 3, Musky Spinning 3, Panfish Spinning 7 (42 total).

### `iceRodGrips` / `openWaterRodGrips` to `grip`
Each singleton has four arrays. Each array item becomes one `grip` doc.

| Old array | material | style |
|---|---|---|
| `corkSplitGrips` | cork | split |
| `corkStraightGrips` | cork | straight |
| `evaFoamSplitGrips` | eva | split |
| `evaFoamStraightGrips` | eva | straight |

Item fields: `referenceId` (e.g. `cork-split-7`), `image`, and `description` on 3 ice cork split items only. Ice and open water grips are **separate photo sets** (28 distinct images), so each `grip` doc has one water type. Note `cork-straight-1` and `cork-straight-2` exist in both sets with different photos, so include the water type in the new ID.

| | Ice | Open water |
|---|---|---|
| Cork split | 4, +$15 | 4, +$40 |
| Cork straight | 2, +$10 | 4, +$30 |
| EVA split | 5, +$5 | 4, +$10 |
| EVA straight | 2, included | 3, included |

Prices come from `corkSplitPrice`, `corkStraightPrice`, `evaSplitPrice` on each singleton and go into `customBuilderPage` Pricing Rules.

---

## Findings that affect the build

1. **Blank colors have no hex values.** Only a name and a photo. Options: sample the main color from each blank photo during migration (Phase 4 can do this automatically), or Chris/Alyssa set them in Studio. Recommend sampling, then a quick visual check.
2. **Grip finishes have no names.** 25 of 28 have only an ID like `cork-split-7`; 3 have a short description. "Mosaic" in the mockup is a placeholder. Need real names from Chris, or fall back to "Cork Split 1, 2, 3...". The order and summary show this name.
3. **Thread warm / cool / neutral categories aren't in the old data**, and no simple hue rule reproduces the 35 / 23 / 5 split. Still need `rod-builder-prototype-singlepage.html`, or Chris/Alyssa assign categories in Studio after migration.
4. **Live blank assignments differ from Chris's Aug changelog.** The option reference docs and Alyssa's ice mock follow the changelog, so the migration should use the changelog lists. Confirm with Chris.

| Series | Old live CMS | Target (changelog / option doc / mock) |
|---|---|---|
| Hole Hog | Black, White, Metallic Purple, Neon Green | Black, Seafoam (new), Chartreuse Yellow, Glow |
| Hog Whip | Hot Pink, Neon Orange, Neon Green | Black, Pink, Green, Orange |
| Carbon Crush (was Panfish Carbon) | Metallic Blue, Neon Orange, Metallic Purple, Neon Green | Black, Blue |
| Eyece Commander | Neon Orange, Hot Pink | Black, Titanium Chrome (new) |
| Ice Reaper | (new) | Black, Pink, Green, Orange |
| All open water | Black | Black |

"Pink / Green / Orange / Blue" are assumed to mean Hot Pink / Neon Green / Neon Orange / Metallic Blue until Chris says otherwise.

5. **Hole Hog's live price is $119** (not $119.99), which leans toward the landing card's "$119".
6. **Ice lengths are not in the old CMS** (confirmed). They go into Pricing Rules as 20" to 36" in 2" steps.

---

## Phase 4 approach

1. Extract `cj-old-full.tar.gz` into its own folder outside both repos.
2. `scripts/migrate-builder-data.mjs` (CMS repo) reads that `data.ndjson` and writes `builder-import.ndjson` **into the same extracted folder**, containing only new-type docs: `threadColor` x63, `blankColor` x14 (12 + Seafoam + Titanium Chrome), `grip` x28. Keep each image as `_sanityAsset: "image@file://./images/<file>"` so the import uploads it. Use fixed IDs (`threadColor-001`, `blankColor-black`, `grip-ice-cork-split-7`) so re-running is safe.
3. Import: `npx sanity datasets import <folder>/builder-import.ndjson production --replace` from the CMS repo.
4. A second step in the script patches the builder fields onto the existing `rodSeries` docs with `@sanity/client` (write token from the CMS repo's local env), so series names, descriptions and hero images aren't overwritten. Series `builderImage` uploads go through `client.assets.upload` here.
5. Pricing Rules (grip prices, accent, sticker, ice lengths) are entered once in `customBuilderPage`, by script or by hand.
