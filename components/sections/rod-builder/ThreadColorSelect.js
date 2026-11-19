import { chipClasses } from './optionClasses'

const GROUPS = [
  { category: 'warm', label: 'Warm colors' },
  { category: 'cool', label: 'Cool colors' },
  { category: 'neutral', label: 'No color' },
]

// Three dropdowns (warm / cool / no color). One pick across all three: the dropdown holding the
// pick shows it, the others are empty, so picking in one clears the others. Used for primary and
// accent. `optional` adds a clear button (the accent can be removed).
const ThreadColorSelect = ({ id, threads = [], value, onChange, optional = false }) => {
  const selected = threads.find((t) => t._id === value)

  return (
    <div>
      <div className="flex flex-wrap gap-0.75">
        {GROUPS.map(({ category, label }) => {
          const options = threads.filter((t) => t.category === category)
          const holdsPick = selected?.category === category
          return (
            <label
              key={category}
              data-selected={holdsPick}
              className={`inline-flex items-center gap-0.5 ${chipClasses(holdsPick)}`}
            >
              {holdsPick && (
                <span
                  aria-hidden="true"
                  className="block h-0.75 w-0.75 shrink-0 rounded-full border border-dark/20"
                  style={{ backgroundColor: selected.hex }}
                />
              )}
              <span className="sr-only">{label}</span>
              <select
                className="cursor-pointer bg-transparent text-caption focus:outline-none"
                id={`${id}-${category}`}
                value={holdsPick ? value : ''}
                onChange={(e) => onChange(e.target.value || null)}
              >
                <option value="">{`${label} (${options.length})`}</option>
                {options.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </label>
          )
        })}
      </div>
      {optional && value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-0.5 text-caption underline hover:text-primary transition duration-300"
        >
          Remove
        </button>
      )}
    </div>
  )
}

export default ThreadColorSelect
