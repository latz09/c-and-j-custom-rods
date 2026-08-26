export const FETCH_IN_STOCK_RODS_PAGE_QUERY = `{
  "page": *[_type == "inStockRodsPage" && _id == "inStockRodsPage"][0]{
    title,
    season,
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