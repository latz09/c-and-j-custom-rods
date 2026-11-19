import { chipClasses } from './optionClasses'

// Ice only. Chip row from pricingRules.iceLengths (inches).
const LengthSelect = ({ lengths = [], value, onChange }) => (
  <div role="radiogroup" className="flex flex-wrap gap-0.5">
    {lengths.map((length) => {
      const selected = value === length
      return (
        <button
          key={length}
          type="button"
          role="radio"
          aria-checked={selected}
          data-selected={selected}
          onClick={() => onChange(length)}
          className={chipClasses(selected)}
        >
          {length}&quot;
        </button>
      )
    })}
  </div>
)

export default LengthSelect
