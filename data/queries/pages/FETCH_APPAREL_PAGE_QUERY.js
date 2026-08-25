export const FETCH_APPAREL_PAGE_QUERY = `*[_type == "apparelPage" && _id == "apparelPage"][0]{
  title,
  hero{
    heading,
    body,
    image{asset->{url}, hotspot}
  },
  gridHeading,
  seo{
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url,
    noIndex
  }
}`