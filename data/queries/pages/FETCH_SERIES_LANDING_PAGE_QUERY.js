// Parameterized — call with { slug: 'panfish-spinning' } from the route param.
// Returns the Sanity marketing copy for a series landing page (/shop/rods/[series]).
// The product grid itself is NOT part of this query — fetch it from Shopify
// Storefront API separately using:
//   query: "tag:'" + applicationType + "' AND tag:'" + slug + "'"
// There is no Shopify collection for a series — tags only, no collection(handle:) lookup.

export const FETCH_SERIES_LANDING_PAGE_QUERY = `*[_type == "rodSeries" && slug == $slug][0]{
  name,
  slug,
  applicationType,
  description,
  heroImage{asset->{url}, hotspot}
}`
