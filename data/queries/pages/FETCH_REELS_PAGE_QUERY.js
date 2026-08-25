export const FETCH_REELS_PAGE_QUERY = `*[_type == "reelsPage" && _id == "reelsPage"][0]{
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