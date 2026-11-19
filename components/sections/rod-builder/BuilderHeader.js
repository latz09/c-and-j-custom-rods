import { formatPrice } from './formatPrice'

// Plain series name as the title (Alyssa Q3). "Starting at" hidden until Shopify returns a base price.
const BuilderHeader = ({ name, basePrice }) => (
  <header className="mt-1">
    <h1 className="h1-product normal-case">{name}</h1>
    {basePrice != null && <h5 className="mt-0.75 text-primary">Starting at {formatPrice(basePrice)}</h5>}
  </header>
)

export default BuilderHeader
