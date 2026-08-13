export const FETCH_HOME_PAGE_QUERY = `*[_type == "homePage" && _id == "homePage"][0]{
  title,
  hero{
    headline,
    subheadline,
    image{asset->{url}, hotspot},
    ctaPrimary{label, url},
    ctaSecondary{label, url}
  },
  featuredProduct{
    eyebrow,
    productHandle,
    category,
  },
  shopCollections{
    heading,
    items[]{
      image{asset->{url}, hotspot},
      label,
      url
    }
  },
  aboutBlurb{
    heading,
    body,
    image{asset->{url}, hotspot},
    cta{label, url}
  },
  seo{
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url,
    noIndex
  }
}`
