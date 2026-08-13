export const FETCH_REVIEWS_PAGE_QUERY = `{
  "page": *[_type == "reviewsPage" && _id == "reviewsPage"][0]{
    title,
    hero{
      headline,
      subheadline
    },
    seo{
      title,
      description,
      keywords,
      "ogImage": ogImage.asset->url,
      noIndex
    }
  },
  "testimonials": *[_type == "testimonial"] | order(order asc){
    _id,
    name,
    photo{asset->{url}, hotspot},
    pullQuote,
    body
  }
}`
