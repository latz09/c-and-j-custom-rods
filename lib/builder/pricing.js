import { DEFAULT_STICKER_MAX } from './constants.js'

// Money is computed in cents so totals never pick up float noise.
const toCents = (n) => Math.round((Number(n) || 0) * 100)
const toDollars = (c) => c / 100

export const getStickerText = (config) => (config?.stickerText || '').trim()
export const getStickerMax = (rules) => rules?.stickerMaxCharacters || DEFAULT_STICKER_MAX

// 'cork' + 'split' -> 'corkSplit' (the key in iceGripPrices / openWaterGripPrices)
export const gripPriceKey = (grip) =>
  grip?.material && grip?.style
    ? `${grip.material}${grip.style[0].toUpperCase()}${grip.style.slice(1)}`
    : null

export function getGripPrice(grip, waterType, rules) {
  const table = waterType === 'ice' ? rules?.iceGripPrices : rules?.openWaterGripPrices
  const key = gripPriceKey(grip)
  return key ? Number(table?.[key]) || 0 : 0
}

/**
 * Price of a build. Safe on partial configs (the live total uses it while the customer is still
 * picking): anything not picked yet adds nothing.
 *
 * @param config    { applicationKey, gripId, accentThreadId, stickerText, ... }
 * @param catalog   FETCH_BUILDER_SERIES_QUERY result (applicationType, applications, grips)
 * @param rules     customBuilderPage.pricingRules
 * @param basePrice Shopify base price for the series (the Custom Rod Build variant)
 * @returns { base, lines: [{ key, label, amount }], addOnTotal, total }  all in dollars
 */
export function getBuildPrice(config, catalog, rules, basePrice) {
  const lines = []
  const waterType = catalog?.applicationType

  if (waterType === 'open-water') {
    const app = catalog.applications?.find((a) => a._key === config?.applicationKey)
    if (app) lines.push({ key: 'application', label: 'Application', cents: toCents(app.upcharge) })
  }

  const grip = catalog?.grips?.find((g) => g._id === config?.gripId)
  if (grip) {
    lines.push({ key: 'grip', label: 'Grip', cents: toCents(getGripPrice(grip, waterType, rules)) })
  }

  if (config?.accentThreadId) {
    lines.push({ key: 'accent', label: 'Accent thread', cents: toCents(rules?.accentPrice) })
  }

  if (getStickerText(config)) {
    lines.push({ key: 'sticker', label: 'Sticker', cents: toCents(rules?.stickerPrice) })
  }

  const baseCents = toCents(basePrice)
  const addOnCents = lines.reduce((sum, l) => sum + l.cents, 0)

  return {
    base: toDollars(baseCents),
    lines: lines.map(({ cents, ...l }) => ({ ...l, amount: toDollars(cents) })),
    addOnTotal: toDollars(addOnCents),
    total: toDollars(baseCents + addOnCents),
  }
}
