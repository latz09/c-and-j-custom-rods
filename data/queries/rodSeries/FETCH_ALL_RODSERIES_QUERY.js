export const FETCH_ALL_RODSERIES_QUERY = `*[_type == "rodSeries" && inStockStatus != "hidden"] | order(order asc) {
  name,
  slug,
  applicationType,
  inStockStatus,
  previewImage
}`