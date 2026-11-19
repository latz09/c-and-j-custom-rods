import SanityImage from '@/components/ui/SanityImage'

const BLANK_IMAGE_SIZE = { width: 160, height: 160, quality: 85, format: 'webp', fit: 'max' }

// Real blank photo with the swatch and name under it. Swatch only when there is no photo
// (Seafoam and Titanium Chrome for now).
const BlankColorSelect = ({ blanks = [], value, onChange }) => (
  <div role="radiogroup">
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
        >
          {blank.image?.asset && (
            <SanityImage image={blank.image} alt={blank.name} customSize={BLANK_IMAGE_SIZE} sizes="160px" />
          )}
          <span aria-hidden="true" style={{ backgroundColor: blank.hex }} />
          <span>{blank.name}</span>
        </button>
      )
    })}
  </div>
)

export default BlankColorSelect
