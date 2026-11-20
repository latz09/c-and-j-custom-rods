import { formatPrice } from './formatPrice'

// Shared by BuildSummary and MobileBuildBar.
// hasBasePrice is false only when Shopify didn't return the series base price (helper product
// unpublished, SKU wrong). The add-ons alone must never read as the full price, so show nothing.
const BuildTotal = ({ price, hasBasePrice, className = '' }) => {
  if (!hasBasePrice) {
    return (
      <p className={`text-paragraph-lg font-[700] ${className}`}>Total unavailable right now</p>
    )
  }
  return (
    <p className={`text-paragraph-lg font-[700] ${className}`}>Total: {formatPrice(price.total)}</p>
  )
}

export default BuildTotal
