export const FETCH_ALL_RODSERIES_QUERY = `*[_type == "rodSeries" && builderStatus != "hidden"] | order(order asc) {
  name,
  slug,
  applicationType,
  previewImage
}`