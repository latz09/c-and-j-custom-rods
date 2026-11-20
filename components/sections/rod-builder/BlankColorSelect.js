import SanityImage from '@/components/ui/SanityImage'
import { tileClasses } from './optionClasses'

const BLANK_IMAGE_SIZE = { width: 160, height: 160, quality: 85, format: 'webp', fit: 'max' }

// Real blank photo with the swatch and name under it. Swatch only when there is no photo
// (Seafoam and Titanium Chrome for now).
const BlankColorSelect = ({ blanks = [], value, onChange }) => (
  <div role="radiogroup" className="flex flex-wrap gap-0.75">
    {blanks.filter(Boolean).map((blank) => {
      const selected = value === blank._id
      return (
        <button
          key={blank._id}
          type="button"
          role="radio"
          aria-checked={selected}
          data-selected={selected}
          onClick={() => onChange(blank._id)}
          className={`flex w-7.5 flex-col items-center gap-0.5 ${tileClasses(selected)} ${
            value && !selected ? 'opacity-60 hover:opacity-100' : ''
          }`}
        >
          {blank.image?.asset ? (
            <SanityImage
              image={blank.image}
              alt={blank.name}
              customSize={BLANK_IMAGE_SIZE}
              sizes="160px"
              className="h-auto w-full rounded-sm"
            />
          ) : (
            blank.hex && (
              <span
                aria-hidden="true"
                className="block aspect-square w-full rounded-sm border border-dark/10"
                style={{ backgroundColor: blank.hex }}
              />
            )
          )}
          <span className={`text-caption ${selected ? 'font-[700]' : ''}`}>{blank.name}</span>
        </button>
      )
    })}
  </div>
)

export default BlankColorSelect
