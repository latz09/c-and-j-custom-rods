// feeds the rods resolver's product branch, reels, apparel

import { shopifyFetch } from './shopifyFetch'

const PRODUCT_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      tags
      availableForSale
      featuredImage { url altText }
      images(first: 10) { edges { node { url altText } } }
      priceRange { minVariantPrice { amount currencyCode } }
      metafields(identifiers: [
        { namespace: "custom", key: "rod_length" }
        { namespace: "custom", key: "line_weight" }
        { namespace: "custom", key: "lure_weight" }
      ]) { key value }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions { name value }
            price { amount currencyCode }
            image { url altText }
          }
        }
      }
    }
  }
`

export async function getProductByHandle(handle) {
  const data = await shopifyFetch({ query: PRODUCT_QUERY, variables: { handle } })
  return data?.product ?? null
}