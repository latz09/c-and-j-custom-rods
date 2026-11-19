import Link from 'next/link'

const WATER_TYPE_CRUMB = { ice: 'Ice Rods', 'open-water': 'Open water rods' }
const LINK_CLASSES = 'text-dark text-caption font-[500] hover:text-primary transition duration-300'

const BuilderBreadcrumb = ({ seriesName, applicationType }) => (
  <nav aria-label="Breadcrumb" className="text-caption font-[500]">
    <Link href="/shop/custom" className={LINK_CLASSES}>
      Custom Rod Builder
    </Link>
    <span> / </span>
    <Link href="/shop/custom" className={LINK_CLASSES}>
      {WATER_TYPE_CRUMB[applicationType]}
    </Link>
    <span> / </span>
    <span aria-current="page">{seriesName}</span>
  </nav>
)

export default BuilderBreadcrumb
