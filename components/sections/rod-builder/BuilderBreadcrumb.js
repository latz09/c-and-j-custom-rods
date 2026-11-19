import Link from 'next/link'

const WATER_TYPE_CRUMB = { ice: 'Ice Rods', 'open-water': 'Open water rods' }

const BuilderBreadcrumb = ({ seriesName, applicationType }) => (
  <nav aria-label="Breadcrumb">
    <Link href="/shop/custom">Custom Rod Builder</Link>
    <span> / </span>
    <Link href="/shop/custom">{WATER_TYPE_CRUMB[applicationType]}</Link>
    <span> / </span>
    <span aria-current="page">{seriesName}</span>
  </nav>
)

export default BuilderBreadcrumb
