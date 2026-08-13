// Parameterized — call with { seriesTag: '<rodSeries.slug of the product being viewed>' }.
// Used on the product detail page banner. In the frontend:
//   const testimonial = data.matched || data.default

export const FETCH_PRODUCT_TESTIMONIAL_QUERY = `{
  "matched": *[_type == "testimonial" && seriesTag == $seriesTag][0]{
    name,
    photo{asset->{url}, hotspot},
    pullQuote
  },
  "default": *[_type == "testimonial" && isDefault == true][0]{
    name,
    photo{asset->{url}, hotspot},
    pullQuote
  }
}`
