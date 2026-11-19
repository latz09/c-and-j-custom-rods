// Builder landing page (/shop/custom): page copy, pricing rules and the series cards.
// Only live and comingSoon series come back. `builderStatus` is separate from `inStockStatus`.
export const FETCH_BUILDER_PAGE_QUERY = `{
  "page": *[_type == "customBuilderPage" && _id == "customBuilderPage"][0]{
    title,
    hero{
      headline,
      subheadline,
      image{asset->{url}, hotspot}
    },
    seriesPicker{
      sectionHeading,
      iceTabLabel,
      openWaterTabLabel,
      comingSoonLabel
    },
    pricingRules{
      iceLengths,
      iceGripPrices,
      openWaterGripPrices,
      accentPrice,
      stickerPrice,
      stickerMaxCharacters
    },
    seo{
      title,
      description,
      keywords,
      "ogImage": ogImage.asset->url,
      noIndex
    }
  },
  "series": *[_type == "rodSeries" && builderStatus in ["live", "comingSoon"]] | order(order asc, name asc){
    _id,
    name,
    slug,
    applicationType,
    builderStatus,
    builderCardBlurb,
    "image": coalesce(builderImage, previewImage)
  }
}`
