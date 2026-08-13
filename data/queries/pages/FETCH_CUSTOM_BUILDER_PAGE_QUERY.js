export const FETCH_CUSTOM_BUILDER_PAGE_QUERY = `*[_type == "customBuilderPage" && _id == "customBuilderPage"][0]{
  title,
  hero{
    headline,
    subheadline,
    image{asset->{url}, hotspot}
  },
  seo{
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url,
    noIndex
  }
}`
