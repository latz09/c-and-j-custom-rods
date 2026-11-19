// utils/shopify/getBuilderProducts.js
// Fetches the two hidden helper products that carry custom build prices:
//   `Custom Rod Build`: one variant per series, price = base price. The variant SKU is the series
//                       slug (e.g. "hole-hog"), which is how a variant is matched to a series.
//   `Build Options`:    variants from $5 to $90 in $5 steps. Matched by price, not by title.
// Both must be published to the Headless channel. Created in Shopify admin in Phase 7.
import { shopifyFetch } from './shopifyFetch.js'

export const BUILD_PRODUCT_HANDLE = 'custom-rod-build'
export const OPTIONS_PRODUCT_HANDLE = 'build-options'

const QUERY = `
  query BuilderProducts($buildHandle: String!, $optionsHandle: String!) {
    build: product(handle: $buildHandle) { ...BuilderProduct }
    options: product(handle: $optionsHandle) { ...BuilderProduct }
  }
  fragment BuilderProduct on Product {
    id
    handle
    variants(first: 100) {
      edges {
        node {
          id
          sku
          title
          availableForSale
          price { amount currencyCode }
        }
      }
    }
  }
`

const nodes = (product) => product?.variants?.edges?.map((e) => e.node) ?? []

/**
 * @param {{ fresh?: boolean }} opts  fresh: true = no cache. Use it on the server when adding to
 *   the cart. The landing page and builder header can use the cached default.
 * @returns {{ base, options, ok }}
 *   base: series slug to { variantId, price, title, availableForSale }
 *   options: dollar amount (5, 10 ... 90) to { variantId, availableForSale }
 *   ok: false when either product came back null (usually unpublished from the Headless channel)
 */
export async function getBuilderProducts({ fresh = false } = {}) {
  const data = await shopifyFetch({
    query: QUERY,
    variables: { buildHandle: BUILD_PRODUCT_HANDLE, optionsHandle: OPTIONS_PRODUCT_HANDLE },
    ...(fresh && { cache: 'no-store' }),
  })

  return parseBuilderProducts(data)
}

// Split out so it can be tested without a network call.
export function parseBuilderProducts(data) {
  const base = {}
  for (const v of nodes(data?.build)) {
    if (!v.sku) continue
    base[v.sku] = {
      variantId: v.id,
      price: Number(v.price.amount),
      title: v.title,
      availableForSale: v.availableForSale,
    }
  }

  const options = {}
  for (const v of nodes(data?.options)) {
    options[Number(v.price.amount)] = { variantId: v.id, availableForSale: v.availableForSale }
  }

  const ok = Boolean(data?.build && data?.options)
  if (!ok) {
    console.warn(
      'Builder helper products missing: check they exist and are published to the Headless channel.'
    )
  }
  return { base, options, ok }
}
