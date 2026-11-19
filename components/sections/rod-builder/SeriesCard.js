import Link from 'next/link'
import SanityImage from '@/components/ui/SanityImage'

const WATER_TYPE_BADGE = { ice: 'Ice fishing', 'open-water': 'Open water' }

import { formatPrice } from './formatPrice'

const SeriesCard = ({ series, comingSoonLabel }) => {
  const { name, slug, applicationType, builderStatus, builderCardBlurb, image, startingPrice } = series
  const isLive = builderStatus === 'live'

  const content = (
    <>
      <div className="relative">
        <SanityImage image={image} alt={name} preset="rodSeriesCard" sizes="(min-width: 1024px) 33vw, 100vw" />
        <span>{WATER_TYPE_BADGE[applicationType]}</span>
      </div>
      <h3>{name}</h3>
      {isLive ? (
        startingPrice != null && <p>Starting at {formatPrice(startingPrice)}</p>
      ) : (
        <p>{comingSoonLabel || 'Coming soon!'}</p>
      )}
      {builderCardBlurb && <p>{builderCardBlurb}</p>}
      {isLive && <span>Start building</span>}
    </>
  )

  // Coming-soon cards have no link (Alyssa Q4).
  return isLive ? (
    <Link href={`/shop/custom/${slug}`} className="group block">
      {content}
    </Link>
  ) : (
    <div>{content}</div>
  )
}

export default SeriesCard
