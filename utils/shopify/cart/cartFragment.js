// Shared cart shape. API 2026-07: line-level discounts only
// (lines[].discountAllocations), never the deprecated cart-level fields.
export const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        attributes { key value }
        cost {
          amountPerQuantity { amount currencyCode }
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        discountAllocations {
          __typename
          discountedAmount { amount currencyCode }
          ... on CartAutomaticDiscountAllocation { title }
          ... on CartCodeDiscountAllocation { code }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            selectedOptions { name value }
            image { url altText width height }
            product {
              handle
              title
              tags
              collections(first: 10) { nodes { handle } }
            }
          }
        }
      }
    }
  }
`;
