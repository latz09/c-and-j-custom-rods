'use client'

import { useState } from 'react'
import SeriesCard from './SeriesCard'

// Ice is selected by default (95% of sales), even though the mock lists open water first.
const DEFAULT_WATER_TYPE = 'ice'

// Same active colors as the in-stock rods toggle: ice is primary, open water is secondary.
const tabClasses = (value, active) => {
  if (!active) return ''
  return value === 'ice' ? 'bg-primary' : 'bg-secondary'
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
        {tabs.map((tab) => {
          const active = waterType === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              data-active={active}
              className={`group py-1 px-1.5 rounded transition-colors duration-300 ${tabClasses(tab.value, active)}`}
              onClick={() => setWaterType(tab.value)}
            >
              <h5
                className={`transition-colors duration-300 ${
                  active ? 'text-light' : 'group-hover:text-primary'
                }`}
              >
                {tab.label}
              </h5>
            </button>
          )
        })}
      </div>

      <div role="tabpanel" className="mt-1.5 lg:mt-2">
        {visible.length === 0 ? (
          <p className="text-paragraph-lg">No series available in this category yet.</p>
        ) : (
          <div className="grid gap-1.5 lg:gap-1.25 sm:grid-cols-2 lg:grid-cols-3">
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