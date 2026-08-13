// feeds the three hub pages

import { shopifyFetch } from './shopifyFetch'

const COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      title
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            tags
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
            availableForSale
          }
        }
      }
    }
  }
`

export async function getProductsByCollection(handle, first = 50) {
  const data = await shopifyFetch({ query: COLLECTION_PRODUCTS_QUERY, variables: { handle, first } })
  return data?.collection?.products?.edges?.map((e) => e.node) ?? []
}