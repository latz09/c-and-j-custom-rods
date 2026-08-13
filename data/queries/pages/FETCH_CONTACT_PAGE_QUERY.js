export const FETCH_CONTACT_PAGE_QUERY = `{
  "page": *[_type == "contactPage" && _id == "contactPage"][0]{
    title,
    hero{
      headline,
      subheadline
    },
    businessInfo{
      heading,
      email,
      phone,
      location,
      hours
    },
    seo{
      title,
      description,
      keywords,
      "ogImage": ogImage.asset->url,
      noIndex
    }
  },
  "testimonial": *[_type == "testimonial" && isDefault == true][0]{
    name,
    photo{asset->{url}, hotspot},
    pullQuote
  }
}`
