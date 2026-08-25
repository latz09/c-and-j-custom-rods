// Called as getProductsByTagQuery("tag:'open-water' AND tag:'panfish-spinning'") from the series branch, or just getProductsByTagQuery("tag:'open-water'") for the plain water-type filter on the hub page.

import { shopifyFetch } from './shopifyFetch'

const PRODUCTS_BY_QUERY = `
  query GetProductsByQuery($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          tags
          featuredImage { url altText }
          images(first: 2) { edges { node { url altText } } }
          priceRange { minVariantPrice { amount currencyCode } }
          availableForSale
        }
      }
    }
  }
`

export async function getProductsByTagQuery(query, first = 50) {
  const data = await shopifyFetch({ query: PRODUCTS_BY_QUERY, variables: { query, first } })
  return data?.products?.edges?.map((e) => e.node) ?? []
}