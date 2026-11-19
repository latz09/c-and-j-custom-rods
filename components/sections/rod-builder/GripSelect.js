'use client'

import { useState } from 'react'
import SanityImage from '@/components/ui/SanityImage'
import { getGripPrice } from '@/lib/builder/pricing'
import { formatPrice } from './formatPrice'
import { chipClasses, tileClasses } from './optionClasses'

const GRIP_IMAGE_SIZE = { width: 200, height: 200, quality: 85, format: 'webp', fit: 'max' }
const MATERIAL_LABELS = { cork: 'Cork', eva: 'EVA Foam' }
const STYLE_LABELS = { split: 'Split Grip', straight: 'Straight Grip' }
const MATERIAL_ORDER = ['cork', 'eva']
const STYLE_ORDER = ['split', 'straight']

const sortBy = (order) => (a, b) => order.indexOf(a) - order.indexOf(b)

// Material chips, then style chips (priced for that material + water type), then named finish
// photo tiles. Only the finish sets the config (`gripId`). Material and style are local, so
// changing either clears the picked grip.
const GripSelect = ({ grips = [], waterType, rules, value, onChange }) => {
  const selectedGrip = grips.find((g) => g._id === value)
  const [material, setMaterial] = useState(selectedGrip?.material ?? null)
  const [style, setStyle] = useState(selectedGrip?.style ?? null)

  const materials = [...new Set(grips.map((g) => g.material))].sort(sortBy(MATERIAL_ORDER))
  const styles = [...new Set(grips.filter((g) => g.material === material).map((g) => g.style))].sort(
    sortBy(STYLE_ORDER)
  )
  const finishes = grips.filter((g) => g.material === material && g.style === style)

  const pickMaterial = (m) => {
    if (m === material) return
    setMaterial(m)
    setStyle(null)
    onChange(null)
  }
  const pickStyle = (s) => {
    if (s === style) return
    setStyle(s)
    onChange(null)
  }

  return (
    <div className="space-y-1">
      <div>
      <p className="text-paragraph font-[700] mb-0.5">Grip material</p>
      <div role="radiogroup" aria-label="Grip material" className="flex flex-wrap gap-0.5">
        {materials.map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={material === m}
            data-selected={material === m}
            onClick={() => pickMaterial(m)}
            className={chipClasses(material === m)}
          >
            {MATERIAL_LABELS[m] ?? m}
          </button>
        ))}
      </div>
      </div>

      {material && (
        <div>
        <p className="text-paragraph font-[700] mb-0.5">Grip style</p>
        <div role="radiogroup" aria-label="Grip style" className="flex flex-wrap gap-0.5">
          {styles.map((s) => {
            const price = getGripPrice({ material, style: s }, waterType, rules)
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={style === s}
                data-selected={style === s}
                onClick={() => pickStyle(s)}
                className={chipClasses(style === s)}
              >
                {STYLE_LABELS[s] ?? s} {price > 0 && `+${formatPrice(price)}`}
              </button>
            )
          })}
        </div>
        </div>
      )}

      {material && style && (
        <div role="radiogroup" aria-label="Grip finish" className="grid grid-cols-2 gap-0.75 sm:grid-cols-4">
          {finishes.map((g) => (
            <button
              key={g._id}
              type="button"
              role="radio"
              aria-checked={value === g._id}
              data-selected={value === g._id}
              onClick={() => onChange(g._id)}
              className={`flex flex-col items-center gap-0.5 ${tileClasses(value === g._id)}`}
            >
              <SanityImage image={g.image} alt={g.finishName || ''} customSize={GRIP_IMAGE_SIZE} sizes="200px" className="h-auto w-full rounded-sm" />
              <span className={`text-caption ${value === g._id ? 'font-[700]' : ''}`}>{g.finishName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default GripSelect
