// Phase 5 check: runs the builder queries against the real Sanity dataset and exercises
// pricing, validation and attributes. Read-only, no token. Shopify is not called.
// Run from the repo root: node scripts/check-builder.mjs
import { createClient } from '@sanity/client'
import { FETCH_BUILDER_PAGE_QUERY } from '../data/queries/builder/FETCH_BUILDER_PAGE_QUERY.js'
import { FETCH_BUILDER_SERIES_QUERY } from '../data/queries/builder/FETCH_BUILDER_SERIES_QUERY.js'
import { getBuildPrice } from '../lib/builder/pricing.js'
import { validateBuild } from '../lib/builder/validateBuild.js'
import { buildAttributes } from '../lib/builder/buildAttributes.js'
import { parseBuilderProducts } from '../utils/shopify/getBuilderProducts.js'

const client = createClient({
  projectId: 'vx4e4v7t',
  dataset: 'production',
  apiVersion: '2022-03-07',
  useCdn: false,
})

let failures = 0
const check = (label, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`)
}

const { page, series } = await client.fetch(FETCH_BUILDER_PAGE_QUERY)
const rules = page.pricingRules

console.log('\n-- Page query')
check('pricing rules present', !!rules?.iceGripPrices && !!rules?.openWaterGripPrices)
check('series list is live + comingSoon only', series.every((s) => ['live', 'comingSoon'].includes(s.builderStatus)), series.map((s) => `${s.slug}:${s.builderStatus}`).join(', '))
check('ice series: 5 (4 live + Ice Reaper)', series.filter((s) => s.applicationType === 'ice').length === 5)
check('open water series: 3 live', series.filter((s) => s.applicationType === 'open-water').length === 3)
check('hidden series absent', !series.some((s) => /casting|musky-spinning/.test(s.slug)))

// Hidden series (Musky Casting) are not buildable, so the mock check swaps the live filter out.
const anyStatus = FETCH_BUILDER_SERIES_QUERY.replace('builderStatus == "live"', 'true')
const fetchSeries = (slug, any = false) =>
  client.fetch(any ? anyStatus : FETCH_BUILDER_SERIES_QUERY, { slug })

console.log('\n-- Series query')
check('hidden series returns null', (await fetchSeries('musky-casting')) === null)
check('comingSoon series returns null', (await fetchSeries('ice-reaper')) === null)

const hole = await fetchSeries('hole-hog')
check('Hole Hog: 4 blanks', hole.blanks.length === 4, hole.blanks.map((b) => b.name).join(', '))
check('Hole Hog: 63 threads', hole.threads.length === 63)
check('Hole Hog: 13 ice grips only', hole.grips.length === 13 && hole.grips.every((g) => g.waterType === 'ice'))

const musky = await fetchSeries('musky-casting', true)
check('Musky Casting: 3 applications, 15 open water grips', musky.applications.length === 3 && musky.grips.length === 15 && musky.grips.every((g) => g.waterType === 'open-water'))

console.log('\n-- Application upcharges are multiples of $5 (Build Options variants)')
const allApps = await client.fetch(`*[_type=="rodSeries"]{slug, "u": applications[].upcharge}`)
const bad = allApps.flatMap((s) => (s.u || []).filter((u) => u == null || u % 5 !== 0).map((u) => `${s.slug}:${u}`))
check('all 42 upcharges are multiples of 5', bad.length === 0 && allApps.reduce((n, s) => n + (s.u?.length || 0), 0) === 42, bad.join(', '))

console.log('\n-- Pricing: mocks')
const pick = (list, fn) => list.find(fn)
// Ice mock: base 119.99 (mock placeholder) + cork split $15 + sticker $10 = 144.99
const iceGrip = pick(hole.grips, (g) => g.material === 'cork' && g.style === 'split')
const iceCfg = {
  seriesSlug: 'hole-hog', blankId: hole.blanks[0]._id, length: 28,
  primaryThreadId: hole.threads[0]._id, accentThreadId: null, gripId: iceGrip._id, stickerText: 'Fish Slayer',
}
const ice = getBuildPrice(iceCfg, hole, rules, 119.99)
check('ice mock total = 144.99', ice.total === 144.99, `$${ice.total}`)
check('ice build validates', validateBuild(iceCfg, hole, rules).valid, validateBuild(iceCfg, hole, rules).firstProblem || '')

// Open water mock: base 399.99, application $0, accent +10, cork split +40, sticker +10 = 459.99
const owGrip = pick(musky.grips, (g) => g.material === 'cork' && g.style === 'split')
const owCfg = {
  seriesSlug: 'musky-casting', applicationKey: musky.applications[0]._key, blankId: musky.blanks[0]._id,
  primaryThreadId: musky.threads[0]._id, accentThreadId: musky.threads[1]._id, gripId: owGrip._id, stickerText: 'Fish Slayer',
}
const ow = getBuildPrice(owCfg, musky, rules, 399.99)
check('open water mock total = 459.99', ow.total === 459.99, `$${ow.total}`)
console.log('      lines:', ow.lines.map((l) => `${l.key} $${l.amount}`).join(', '))
// Musky is hidden in Sanity, so validation must reject it even though the price works.
check('hidden series fails validation', !validateBuild(owCfg, { ...musky }, rules).valid)
check('same build passes once live', validateBuild(owCfg, { ...musky, builderStatus: 'live' }, rules).valid, validateBuild(owCfg, { ...musky, builderStatus: 'live' }, rules).firstProblem || '')

console.log('\n-- Validation rejects bad builds')
const v = (cfg, cat = hole) => validateBuild(cfg, cat, rules)
check('missing picks listed', v({ seriesSlug: 'hole-hog' }).missing.join() === 'blankId,length,primaryThreadId,gripId')
check('blank from another series', v({ ...iceCfg, blankId: 'blankColor-white' }).errors[0]?.field === 'blankId')
check('length not offered', v({ ...iceCfg, length: 99 }).errors[0]?.field === 'length')
check('open water grip on ice series', v({ ...iceCfg, gripId: owGrip._id }).errors[0]?.field === 'gripId')
check('sticker too long (default max 20)', v({ ...iceCfg, stickerText: 'x'.repeat(21) }).errors[0]?.field === 'stickerText')
check('wrong series slug', v({ ...iceCfg, seriesSlug: 'hog-whip' }).errors[0]?.field === 'series')
check('non-live catalog', !v(iceCfg, { ...hole, builderStatus: 'comingSoon' }).valid)
check('bad add-on total (not multiple of 5)', v(iceCfg, hole).valid && !validateBuild(iceCfg, hole, { ...rules, stickerPrice: 7 }).valid)
check('blank sticker = no charge', getBuildPrice({ ...iceCfg, stickerText: '   ' }, hole, rules, 119.99).addOnTotal === 15)

console.log('\n-- Attributes')
const attrs = buildAttributes(owCfg, { ...musky, builderStatus: 'live' }, 'test-build-id')
attrs.forEach((a) => console.log(`      ${a.key}: ${a.value}`))
check('first attribute is hidden _buildId', attrs[0].key === '_buildId')
check('ice attributes use Length, not Application', buildAttributes(iceCfg, hole).some((a) => a.key === 'Length') && !buildAttributes(iceCfg, hole).some((a) => a.key === 'Application'))

console.log('\n-- Shopify parser (fake response, products arrive in Phase 7)')
const fake = parseBuilderProducts({
  build: { variants: { edges: [{ node: { id: 'gid://v/1', sku: 'hole-hog', title: 'Hole Hog', availableForSale: true, price: { amount: '119.0' } } }] } },
  options: { variants: { edges: [{ node: { id: 'gid://v/2', sku: '', title: '$25', availableForSale: true, price: { amount: '25.0' } } }] } },
})
check('base keyed by SKU, options by price', fake.base['hole-hog']?.price === 119 && fake.options[25]?.variantId === 'gid://v/2' && fake.ok)

console.log(`\n${failures ? `${failures} FAILED` : 'All checks passed'}`)
process.exit(failures ? 1 : 0)
