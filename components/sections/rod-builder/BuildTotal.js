import { formatPrice } from './formatPrice'

// Shared by BuildSummary and MobileBuildBar.
// Until Shopify has the series base price (Phase 7), only the add-ons are known. That number must
// never read as the full price, so it is labeled as options only.
const BuildTotal = ({ price, hasBasePrice }) => {
  // Phase 7: hasBasePrice will always be true once Custom Rod Build exists. Delete the
  // options-only branch then and show `Total: formatPrice(price.total)` only.
  if (!hasBasePrice) {
    return <p>Options: +{formatPrice(price.addOnTotal)} (base price coming)</p>
  }
  return <p>Total: {formatPrice(price.total)}</p>
}

export default BuildTotal
