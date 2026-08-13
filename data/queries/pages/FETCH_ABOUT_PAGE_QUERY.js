export const FETCH_ABOUT_PAGE_QUERY = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  title,
  hero{
    headline,
    subheadline,
    image{asset->{url}, hotspot}
  },
  story{
    heading,
    photo{asset->{url}, hotspot},
    body
  },
  successGallery{
    heading,
    images[]{asset->{url}, hotspot}
  },
  commitment{
    heading,
    subheading,
    items[]{
      icon{asset->{url}},
      title,
      description
    }
  },
  seo{
    title,
    description,
    keywords,
    "ogImage": ogImage.asset->url,
    noIndex
  }
}`
