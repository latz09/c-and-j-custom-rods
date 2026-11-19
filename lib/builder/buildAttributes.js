import { getStickerText } from './pricing.js'

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '')
const MATERIAL = { cork: 'Cork', eva: 'EVA Foam' }
const STYLE = { split: 'Split Grip', straight: 'Straight Grip' }

const threadText = (t) => (t ? `${t.name} (${t.code})` : 'None')

// "Cork - Split Grip - Mosaic"
export const gripText = (g) =>
  g
    ? [MATERIAL[g.material] || cap(g.material), STYLE[g.style] || cap(g.style), g.finishName]
        .filter(Boolean)
        .join(' - ')
    : ''

// "7'10" Extra-Heavy/Moderate-Fast"
export const applicationText = (a) => (a ? [a.length, a.powerAction].filter(Boolean).join(' ') : '')

/**
 * Valid config to order-facing rows: [{ key, value }]. Keys are the line item property names
 * Chris sees in Shopify admin. Pass `buildId` to prepend the hidden `_buildId` (properties that
 * start with an underscore are hidden from the customer). Call only after validateBuild passes.
 * The same rows can feed the "Your Build" summary card.
 */
export function buildAttributes(config, catalog, buildId) {
  const find = (list, key, id) => list?.find((x) => x[key] === id)
  const isIce = catalog.applicationType === 'ice'
  const rows = []

  if (buildId) rows.push({ key: '_buildId', value: buildId })
  rows.push({ key: 'Series', value: catalog.name })

  if (isIce) {
    rows.push({ key: 'Length', value: `${config.length}"` })
  } else {
    rows.push({
      key: 'Application',
      value: applicationText(find(catalog.applications, '_key', config.applicationKey)),
    })
  }

  rows.push({ key: 'Blank Color', value: find(catalog.blanks, '_id', config.blankId)?.name || '' })
  rows.push({
    key: 'Primary Thread',
    value: threadText(find(catalog.threads, '_id', config.primaryThreadId)),
  })
  rows.push({
    key: 'Accent Thread',
    value: config.accentThreadId
      ? threadText(find(catalog.threads, '_id', config.accentThreadId))
      : 'None',
  })
  rows.push({ key: 'Grip', value: gripText(find(catalog.grips, '_id', config.gripId)) })
  rows.push({ key: 'Sticker Text', value: getStickerText(config) || 'None' })

  return rows
}
