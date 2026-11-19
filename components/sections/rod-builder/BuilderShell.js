'use client'

import { useReducer } from 'react'
import SanityImage from '@/components/ui/SanityImage'
import { emptyBuildConfig } from '@/lib/builder/constants'
import { getBuildPrice, getStickerMax } from '@/lib/builder/pricing'
import BuilderBreadcrumb from './BuilderBreadcrumb'
import BuilderHeader from './BuilderHeader'
import BuilderSection from './BuilderSection'
import ApplicationSelect from './ApplicationSelect'
import BlankColorSelect from './BlankColorSelect'
import LengthSelect from './LengthSelect'
import ThreadColorSelect from './ThreadColorSelect'
import GripSelect from './GripSelect'
import StickerInput from './StickerInput'
import { formatPrice } from './formatPrice'

// 6A only: shows a bare live total and the raw config so picks can be checked.
// 6B replaces this with BuildSummary, MobileBuildBar and the add-to-cart button.
const SHOW_DEBUG_CONFIG = true

const reducer = (config, { field, value }) => ({ ...config, [field]: value })

const BuilderShell = ({ catalog, copy, rules, basePrice }) => {
  const [config, dispatch] = useReducer(reducer, catalog.slug, emptyBuildConfig)
  const set = (field) => (value) => dispatch({ field, value })

  const isIce = catalog.applicationType === 'ice'
  const price = getBuildPrice(config, catalog, rules, basePrice ?? 0)
  const stickerMax = getStickerMax(rules)

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
    <div>
      <div>
        <div className="relative">
          <SanityImage
            image={catalog.image}
            alt={catalog.name}
            preset="rodSeriesCard"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        {/* 6B: BuildSummary card goes here */}
        <div>
          <p>
            {basePrice != null ? 'Total' : 'Add-ons total'}:{' '}
            {formatPrice(basePrice != null ? price.total : price.addOnTotal)}
          </p>
        </div>
        {SHOW_DEBUG_CONFIG && <pre>{JSON.stringify(config, null, 2)}</pre>}
      </div>

      <div>
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

        {copy?.leadTimeNote && <p>{copy.leadTimeNote}</p>}
      </div>
    </div>
  )
}

export default BuilderShell
