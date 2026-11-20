'use client'

import { validateBuild } from '@/lib/builder/validateBuild'
import { buildAttributes } from '@/lib/builder/buildAttributes'
import CartIcon from '@/components/ui/CartIcon'

// Disabled until the build is valid; the label says what is missing ("Choose a grip.").
// 6B stub: logs the validated config. Phase 7 swaps the log for the addBuildToCart server action.
const AddBuildToCartButton = ({ config, catalog, rules, validation }) => {
  const handleClick = () => {
    // Re-check at click time so a stale render can't submit an invalid build.
    const result = validateBuild(config, catalog, rules)
    if (!result.valid) return

    // Phase 7: replace with `await addBuildToCart(config)` (server action, re-validates and prices
    // against fresh CMS data, then opens the cart drawer).
    console.log('[builder] add to cart (stub)', {
      config,
      attributes: buildAttributes(config, catalog),
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!validation.valid}
      className="w-full py-0.75 px-1.25 bg-primary text-button hover:bg-dark transition duration-300 group text-light rounded inline-flex items-center justify-center gap-[0.625rem] disabled:bg-accent/80 disabled:text-primary/75 disabled:font-[700] disabled:cursor-not-allowed"
    >
      {validation.valid ? 'Add to cart' : validation.firstProblem}
      {validation.valid && (
        <CartIcon className="group-hover:text-secondary transition duration-700 group-hover:translate-x-[0.4rem]" />
      )}
    </button>
  )
}

export default AddBuildToCartButton
