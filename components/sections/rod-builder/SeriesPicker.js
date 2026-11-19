'use client'

import { useState } from 'react'
import SeriesCard from './SeriesCard'

// Ice is selected by default (95% of sales), even though the mock lists open water first.
const DEFAULT_WATER_TYPE = 'ice'

const SeriesPicker = ({ series = [], labels }) => {
  const { sectionHeading, iceTabLabel, openWaterTabLabel, comingSoonLabel } = labels ?? {}
  const [waterType, setWaterType] = useState(DEFAULT_WATER_TYPE)

  const tabs = [
    { value: 'open-water', label: openWaterTabLabel || 'Open water series' },
    { value: 'ice', label: iceTabLabel || 'Ice fishing series' },
  ]

  const visible = series.filter((s) => s.applicationType === waterType)

  return (
    <section>
      <h2>{sectionHeading || 'Category and series'}</h2>

      <div role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={waterType === tab.value}
            data-active={waterType === tab.value}
            onClick={() => setWaterType(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {visible.length === 0 ? (
          <p>No series available in this category yet.</p>
        ) : (
          <div>
            {visible.map((s) => (
              <SeriesCard key={s._id} series={s} comingSoonLabel={comingSoonLabel} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default SeriesPicker
