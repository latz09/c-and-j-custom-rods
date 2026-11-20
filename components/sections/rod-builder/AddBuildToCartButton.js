'use client'

import { useState } from 'react'
import { validateBuild } from '@/lib/builder/validateBuild'
import { useCart } from '@/components/cart/CartProvider'
import CartIcon from '@/components/ui/CartIcon'

// Disabled until the build is valid; the label says what is missing ("Choose a grip.").
// The server action re-validates and prices against fresh data. Nothing here is trusted.
const AddBuildToCartButton = ({ config, catalog, rules, validation, hasBasePrice }) => {
  const { addBuild, isPending, error } = useCart()
  const [failed, setFailed] = useState(false)

  const handleClick = async () => {
    // Re-check at click time so a stale render can't submit an invalid build.
    const result = validateBuild(config, catalog, rules)
    if (!result.valid) return

    // Opens the drawer on success; errors show in the drawer.
    setFailed(!(await addBuild(config)))
  }

  const disabled = !validation.valid || !hasBasePrice || isPending

  return (
    <>
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="w-full py-0.75 px-1.25 bg-primary text-button hover:bg-dark transition duration-300 group text-light rounded inline-flex items-center justify-center gap-[0.625rem] disabled:bg-accent/80 disabled:text-primary/75 disabled:font-[700] disabled:cursor-not-allowed"
    >
      {!validation.valid ? validation.firstProblem : !hasBasePrice ? 'Price unavailable' : isPending ? 'Adding...' : 'Add to cart'}
      {validation.valid && hasBasePrice && !isPending && (
        <CartIcon className="group-hover:text-secondary transition duration-700 group-hover:translate-x-[0.4rem]" />
      )}
    </button>
    {failed && error && (
      <p role="alert" className="mt-0.5 text-paragraph">
        {error}
      </p>
    )}
    </>
  )
}

export default AddBuildToCartButton
