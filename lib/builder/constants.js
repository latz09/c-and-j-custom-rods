// Builder constants. No imports, so the same files run in the browser, on the server and in scripts.

// Used until Chris sets pricingRules.stickerMaxCharacters in Sanity (open question 8).
export const DEFAULT_STICKER_MAX = 20

// The Build Options product has variants from $5 to $90 in $5 steps.
// Every add-on total must land on one of them.
export const OPTIONS_STEP = 5
export const OPTIONS_MAX = 90

export const emptyBuildConfig = (seriesSlug) => ({
  seriesSlug,
  applicationKey: null, // open water only: application._key
  blankId: null,
  length: null, // ice only: inches
  primaryThreadId: null,
  accentThreadId: null, // optional
  gripId: null,
  stickerText: '', // optional, blank = none
})
