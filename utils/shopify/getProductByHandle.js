// utils/shopify/getProductByHandle.js
import { shopifyFetch } from './shopifyFetch';

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
      options { name values }
      metafields(identifiers: [
        { namespace: "custom", key: "rod_length" }
        { namespace: "custom", key: "line_weight" }
        { namespace: "custom", key: "lure_weight" }
        { namespace: "custom", key: "short_description" }
        { namespace: "custom", key: "grip_description" }
        { namespace: "custom", key: "thread_color" }
        { namespace: "custom", key: "blank" }
        { namespace: "custom", key: "max_drag" }
        { namespace: "custom", key: "weight" }
        { namespace: "custom", key: "gear_ratio" }
        { namespace: "custom", key: "bearings" }
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
`;

export async function getProductByHandle(handle) {
	const data = await shopifyFetch({
		query: PRODUCT_QUERY,
		variables: { handle },
	});
	const product = data?.product;

	if (!product) return null;

	const metafields = Object.fromEntries(
		product.metafields.filter(Boolean).map((m) => [m.key, m.value]),
	);

	return { ...product, metafields };
}