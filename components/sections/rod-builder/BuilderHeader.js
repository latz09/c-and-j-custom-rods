import { formatPrice } from './formatPrice'

// Plain series name as the title (Alyssa Q3). "Starting at" hidden until Shopify returns a base price.
const BuilderHeader = ({ name, basePrice }) => (
  <header>
    <h1>{name}</h1>
    {basePrice != null && <p>Starting at {formatPrice(basePrice)}</p>}
  </header>
)

export default BuilderHeader
