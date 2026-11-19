import BuildTotal from './BuildTotal'

// Sticky bottom bar, mobile only (lg:hidden). Sits at the bottom, so it does not collide with
// StickyNav, which hides at the top. `action` is the add-to-cart button.
const MobileBuildBar = ({ price, hasBasePrice, action }) => (
  <div className="fixed bottom-0 left-0 z-40 w-full lg:hidden">
    <BuildTotal price={price} hasBasePrice={hasBasePrice} />
    {action}
  </div>
)

export default MobileBuildBar
