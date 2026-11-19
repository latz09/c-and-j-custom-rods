// Ice only. Chip row from pricingRules.iceLengths (inches).
const LengthSelect = ({ lengths = [], value, onChange }) => (
  <div role="radiogroup">
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
        >
          {length}&quot;
        </button>
      )
    })}
  </div>
)

export default LengthSelect
