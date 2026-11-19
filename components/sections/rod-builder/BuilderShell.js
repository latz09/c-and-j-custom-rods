'use client'

import { useReducer } from 'react'
import SanityImage from '@/components/ui/SanityImage'
import { emptyBuildConfig } from '@/lib/builder/constants'
import { getBuildPrice, getStickerMax } from '@/lib/builder/pricing'
import { validateBuild } from '@/lib/builder/validateBuild'
import BuilderBreadcrumb from './BuilderBreadcrumb'
import BuilderHeader from './BuilderHeader'
import BuilderSection from './BuilderSection'
import ApplicationSelect from './ApplicationSelect'
import BlankColorSelect from './BlankColorSelect'
import LengthSelect from './LengthSelect'
import ThreadColorSelect from './ThreadColorSelect'
import GripSelect from './GripSelect'
import StickerInput from './StickerInput'
import BuildSummary from './BuildSummary'
import MobileBuildBar from './MobileBuildBar'
import AddBuildToCartButton from './AddBuildToCartButton'
import { formatPrice } from './formatPrice'

const reducer = (config, { field, value }) => ({ ...config, [field]: value })

const BuilderShell = ({ catalog, copy, rules, basePrice }) => {
  const [config, dispatch] = useReducer(reducer, catalog.slug, emptyBuildConfig)
  const set = (field) => (value) => dispatch({ field, value })

  const isIce = catalog.applicationType === 'ice'
  const price = getBuildPrice(config, catalog, rules, basePrice ?? 0)
  const stickerMax = getStickerMax(rules)
  const validation = validateBuild(config, catalog, rules)
  // Phase 7: basePrice is always set once Custom Rod Build exists in Shopify.
  const hasBasePrice = basePrice != null

  const cartButton = (
    <AddBuildToCartButton config={config} catalog={catalog} rules={rules} validation={validation} />
  )

  const accentNote = rules?.accentPrice > 0 ? `+${formatPrice(rules.accentPrice)}` : null
  const stickerNote = rules?.stickerPrice > 0 ? `+${formatPrice(rules.stickerPrice)}` : null

  const applicationSection = (
    <BuilderSection
      key="application"
      label={copy?.applicationLabel || 'Select application'}
      priceNote={`${catalog.applications?.length ?? 0} options`}
    >
      <ApplicationSelect
        applications={catalog.applications}
        value={config.applicationKey}
        onChange={set('applicationKey')}
      />
    </BuilderSection>
  )

  const blankSection = (
    <BuilderSection key="blank" label={copy?.blankColorLabel || 'Blank color'}>
      <BlankColorSelect blanks={catalog.blanks} value={config.blankId} onChange={set('blankId')} />
    </BuilderSection>
  )

  const lengthSection = (
    <BuilderSection key="length" label={copy?.lengthLabel || 'Rod length'}>
      <LengthSelect lengths={rules?.iceLengths} value={config.length} onChange={set('length')} />
    </BuilderSection>
  )

  return (
    <div className="section-x-padding mt-1 lg:mt-2 pb-24 lg:pb-5 grid gap-1.5 lg:grid-cols-5 lg:gap-2.5">
      <div className="lg:col-span-2 lg:self-start lg:sticky lg:top-1.5">
        <div className="relative overflow-hidden rounded border border-accent bg-gradient-to-b from-light via-accent/0 to-accent/60 p-2">
          <SanityImage
            image={catalog.image}
            alt={catalog.name}
            preset="rodSeriesHero"
            objectFit="contain"
            className="mx-auto h-auto w-full max-w-[22rem] lg:max-w-none"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
        {/* Desktop button lives in the card; mobile uses MobileBuildBar */}
        <BuildSummary
          config={config}
          catalog={catalog}
          price={price}
          hasBasePrice={hasBasePrice}
          action={<div className="hidden lg:block">{cartButton}</div>}
        />
      </div>

      <div className="lg:col-span-3">
        <BuilderBreadcrumb seriesName={catalog.name} applicationType={catalog.applicationType} />
        <BuilderHeader name={catalog.name} basePrice={basePrice} />

        {/* Ice: blank, length. Open water: application, blank. */}
        {isIce ? [blankSection, lengthSection] : [applicationSection, blankSection]}

        <BuilderSection label={copy?.primaryThreadLabel || 'Primary thread color'}>
          <ThreadColorSelect
            id="primary-thread"
            threads={catalog.threads}
            value={config.primaryThreadId}
            onChange={set('primaryThreadId')}
          />
        </BuilderSection>

        <BuilderSection
          label={copy?.accentThreadLabel || 'Accent thread color (optional)'}
          priceNote={accentNote}
          helperText={copy?.accentHelperText}
        >
          <ThreadColorSelect
            id="accent-thread"
            threads={catalog.threads}
            value={config.accentThreadId}
            onChange={set('accentThreadId')}
            optional
          />
        </BuilderSection>

        <BuilderSection label={copy?.gripLabel || 'Grip'}>
          <GripSelect
            grips={catalog.grips}
            waterType={catalog.applicationType}
            rules={rules}
            value={config.gripId}
            onChange={set('gripId')}
          />
        </BuilderSection>

        <BuilderSection
          label={copy?.stickerLabel || 'Personalized sticker (optional)'}
          priceNote={stickerNote}
          helperText={copy?.stickerHelperText}
        >
          <StickerInput value={config.stickerText} onChange={set('stickerText')} maxLength={stickerMax} />
        </BuilderSection>

        {copy?.leadTimeNote && <p className="mt-2 text-caption">{copy.leadTimeNote}</p>}
      </div>

      <MobileBuildBar price={price} hasBasePrice={hasBasePrice} action={cartButton} />
    </div>
  )
}

export default BuilderShell
