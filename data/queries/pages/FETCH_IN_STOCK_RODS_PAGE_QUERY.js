export const FETCH_IN_STOCK_RODS_PAGE_QUERY = `{
  "page": *[_type == "inStockRodsPage" && _id == "inStockRodsPage"][0]{
    title,
    hero{
      headline,
      subheadline,
      image{asset->{url}, hotspot},
      ctaSeries{label, url},
      ctaAllRods{label, url}
    },
    bySeries{
      heading,
      subheading
    },
    fullGrid{
      heading
    },
    seo{
      title,
      description,
      keywords,
      "ogImage": ogImage.asset->url,
      noIndex
    }
  },
  "series": *[_type == "rodSeries"] | order(order asc){
    _id,
    name,
    slug,
    applicationType,
    heroImage{asset->{url}, hotspot}
  }
}`

// "series" gives you the card list for the "In-Stock Rods by Series" section.
// For each card's live price/stock, hit the Shopify Storefront API per card
// with: query: "tag:'" + applicationType + "' AND tag:'" + slug + "'"
// There is no Shopify collection to look up — series filtering is tag-only.
