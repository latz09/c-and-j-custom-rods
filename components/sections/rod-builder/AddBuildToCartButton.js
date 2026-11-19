'use client'

import { validateBuild } from '@/lib/builder/validateBuild'
import { buildAttributes } from '@/lib/builder/buildAttributes'

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
    <button type="button" onClick={handleClick} disabled={!validation.valid}>
      {validation.valid ? 'Add to cart' : validation.firstProblem}
    </button>
  )
}

export default AddBuildToCartButton
