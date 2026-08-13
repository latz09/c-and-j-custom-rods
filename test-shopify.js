const domain = process.env.SHOPIFY_STORE_DOMAIN
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

async function test() {
  const res = await fetch(`https://${domain}/api/2026-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Shopify-Storefront-Private-Token': token,
    },
    body: JSON.stringify({ query: `{ shop { name } }` }),
  })
  console.log('HTTP status:', res.status)
  console.log(await res.text())
}

test()