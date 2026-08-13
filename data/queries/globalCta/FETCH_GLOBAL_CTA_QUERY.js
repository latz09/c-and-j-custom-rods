export const FETCH_GLOBAL_CTA_QUERY = `*[_type == "globalCta" && _id == "globalCta"][0]{
  tripleCtaBanner{
    heading,
    body,
    ctaCustom{label, url},
    ctaInStock{label, url},
    ctaContact{label, url}
  },
  productCtaBanner{
    heading,
    body,
    ctaCustom{label, url},
    ctaContact{label, url}
  }
}`
