import { getBuildPrice, getStickerMax, getStickerText } from './pricing.js'
import { OPTIONS_MAX, OPTIONS_STEP } from './constants.js'

const FIELD_LABELS = {
  applicationKey: 'an application',
  blankId: 'a blank color',
  length: 'a length',
  primaryThreadId: 'a primary thread color',
  gripId: 'a grip',
}

/**
 * Checks a build against the catalog. On the server, `catalog` and `rules` must be fetched fresh
 * from Sanity by the server itself, never taken from the client.
 *
 * @returns { valid, missing: [field], errors: [{ field, message }], firstProblem }
 *   `missing` = required picks not made yet (the UI uses it for "Choose a grip").
 *   `errors`  = picks that are not allowed.
 */
export function validateBuild(config, catalog, rules) {
  const missing = []
  const errors = []
  const fail = (field, message) => errors.push({ field, message })

  if (!catalog || catalog.builderStatus !== 'live') {
    fail('series', 'This series is not available to build.')
    return finish(missing, errors)
  }
  if (config?.seriesSlug !== catalog.slug) fail('series', 'Series does not match.')

  const isIce = catalog.applicationType === 'ice'

  // Application (open water)
  if (!isIce) {
    if (!config?.applicationKey) missing.push('applicationKey')
    else if (!catalog.applications?.some((a) => a._key === config.applicationKey)) {
      fail('applicationKey', 'That application is not offered on this series.')
    }
  }

  // Blank color
  if (!config?.blankId) missing.push('blankId')
  else if (!catalog.blanks?.some((b) => b?._id === config.blankId)) {
    fail('blankId', 'That blank color is not offered on this series.')
  }

  // Length (ice)
  if (isIce) {
    if (config?.length == null) missing.push('length')
    else if (!rules?.iceLengths?.includes(Number(config.length))) {
      fail('length', 'That length is not offered.')
    }
  }

  // Threads
  const threadIds = new Set(catalog.threads?.map((t) => t._id))
  if (!config?.primaryThreadId) missing.push('primaryThreadId')
  else if (!threadIds.has(config.primaryThreadId)) fail('primaryThreadId', 'Unknown thread color.')
  if (config?.accentThreadId && !threadIds.has(config.accentThreadId)) {
    fail('accentThreadId', 'Unknown accent thread color.')
  }

  // Grip (catalog.grips is already filtered to the water type, but check it anyway)
  if (!config?.gripId) missing.push('gripId')
  else {
    const grip = catalog.grips?.find((g) => g._id === config.gripId)
    if (!grip || grip.waterType !== catalog.applicationType) {
      fail('gripId', 'That grip is not offered on this series.')
    }
  }

  // Sticker
  const sticker = getStickerText(config)
  const max = getStickerMax(rules)
  if (sticker.length > max) fail('stickerText', `Sticker text can be at most ${max} characters.`)
  if (/[\u0000-\u001f\u007f]/.test(sticker)) fail('stickerText', 'Sticker text has invalid characters.')

  // The add-on total must match a Build Options variant ($5 steps, $5 to $90)
  const { addOnTotal } = getBuildPrice(config, catalog, rules, 0)
  if (Math.round(addOnTotal * 100) % (OPTIONS_STEP * 100) !== 0 || addOnTotal > OPTIONS_MAX) {
    fail(
      'price',
      `Add-on total $${addOnTotal} can't be charged. It must be a multiple of $${OPTIONS_STEP}, up to $${OPTIONS_MAX}.`
    )
  }

  return finish(missing, errors)
}

function finish(missing, errors) {
  const firstProblem =
    errors[0]?.message ?? (missing[0] ? `Choose ${FIELD_LABELS[missing[0]]}.` : null)
  return { valid: !missing.length && !errors.length, missing, errors, firstProblem }
}
