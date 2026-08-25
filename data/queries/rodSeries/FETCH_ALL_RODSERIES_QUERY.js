export const FETCH_ALL_RODSERIES_QUERY = `*[_type == "rodSeries"] | order(order asc) {
  name,
  slug,
  applicationType,
  previewImage
}`