// One live series for the builder (/shop/custom/[series]). Param: $slug.
// Returns null unless builderStatus is "live", so the page can notFound().
// Grips are filtered to the series' water type (rodSeries.applicationType matches grip.waterType).
// Threads are global. Blanks keep the order set on the series.
export const FETCH_BUILDER_SERIES_QUERY = `*[_type == "rodSeries" && slug == $slug && builderStatus == "live"][0]{
  _id,
  name,
  slug,
  applicationType,
  builderStatus,
  builderCardBlurb,
  "image": coalesce(builderImage, previewImage),
  "blanks": builderBlankColors[]->{
    _id,
    name,
    hex,
    image
  },
  applications[]{
    _key,
    length,
    powerAction,
    lineWeight,
    lureWeight,
    upcharge,
    usage
  },
  "threads": *[_type == "threadColor"] | order(code asc){
    _id,
    name,
    code,
    hex,
    category
  },
  "grips": *[_type == "grip" && waterType == ^.applicationType] | order(order asc){
    _id,
    waterType,
    material,
    style,
    finishName,
    image
  },
  "page": *[_type == "customBuilderPage" && _id == "customBuilderPage"][0]{
    builderCopy{
      applicationLabel,
      blankColorLabel,
      lengthLabel,
      primaryThreadLabel,
      accentThreadLabel,
      gripLabel,
      stickerLabel,
      accentHelperText,
      stickerHelperText,
      leadTimeNote
    },
    pricingRules{
      iceLengths,
      iceGripPrices,
      openWaterGripPrices,
      accentPrice,
      stickerPrice,
      stickerMaxCharacters
    }
  }
}`
