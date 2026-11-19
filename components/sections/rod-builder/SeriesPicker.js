'use client'

import { useState } from 'react'
import SeriesCard from './SeriesCard'

// Ice is selected by default (95% of sales), even though the mock lists open water first.
const DEFAULT_WATER_TYPE = 'ice'

// Same active colors as the in-stock rods toggle: ice is primary, open water is secondary.
const tabClasses = (value, active) => {
  if (!active) return 'text-dark hover:text-primary'
  return value === 'ice' ? 'bg-primary text-light' : 'bg-secondary text-dark'
}

const SeriesPicker = ({ series = [], labels }) => {
  const { sectionHeading, iceTabLabel, openWaterTabLabel, comingSoonLabel } = labels ?? {}
  const [waterType, setWaterType] = useState(DEFAULT_WATER_TYPE)

  const tabs = [
    { value: 'open-water', label: openWaterTabLabel || 'Open water series' },
    { value: 'ice', label: iceTabLabel || 'Ice fishing series' },
  ]

  const visible = series.filter((s) => s.applicationType === waterType)

  return (
    <section className="section-x-padding pb-5 lg:pb-8.75">
      <h2>{sectionHeading || 'Category and series'}</h2>

      <div role="tablist" className="flex mt-1.5 lg:mt-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={waterType === tab.value}
            data-active={waterType === tab.value}
            className={`py-1 px-1.5 rounded transition-colors duration-300 ${tabClasses(tab.value, waterType === tab.value)}`}
            onClick={() => setWaterType(tab.value)}
          >
            <span className="text-button">{tab.label}</span>
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-1.5 lg:mt-2">
        {visible.length === 0 ? (
          <p className="text-paragraph-lg">No series available in this category yet.</p>
        ) : (
          <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((s, index) => (
              <SeriesCard key={s._id} series={s} comingSoonLabel={comingSoonLabel} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default SeriesPicker
