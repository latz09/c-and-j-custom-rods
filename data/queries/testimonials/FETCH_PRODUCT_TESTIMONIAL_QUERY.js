export const FETCH_PRODUCT_TESTIMONIAL_QUERY = `{
  "matched": *[_type == "testimonial" && seriesTag == $seriesTag][0]{
    name,
    photo{asset->{url}, hotspot},
    pullQuote,
    body
  },
  "default": *[_type == "testimonial" && isDefault == true][0]{
    name,
    photo{asset->{url}, hotspot},
    pullQuote,
    body
  }
}`