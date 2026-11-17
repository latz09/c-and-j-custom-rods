const domain = process.env.SHOPIFY_STORE_DOMAIN
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
const apiVersion = '2026-07'

/**
 * Storefront API request.
 *
 * Caching:
 * - Default: cached, revalidates every 60s (catalog reads).
 * - `revalidate: n`: cached, revalidates every n seconds.
 * - `cache: 'no-store'`: never cached. Use for every cart read and mutation.
 */
export async function shopifyFetch({ query, variables, cache, revalidate = 60 }) {
  const cacheOptions =
    cache === 'no-store' ? { cache: 'no-store' } : { next: { revalidate } }

  try {
    const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      ...cacheOptions,
    })

    const json = await res.json()

    if (json.errors) {
      console.error('Shopify GraphQL errors:', JSON.stringify(json.errors, null, 2))
      throw new Error('Shopify API request failed')
    }

    return json.data
  } catch (error) {
    console.error('shopifyFetch error:', error)
    throw error
  }
}