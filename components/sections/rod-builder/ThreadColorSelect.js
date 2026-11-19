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
      <div>
        {GROUPS.map(({ category, label }) => {
          const options = threads.filter((t) => t.category === category)
          const holdsPick = selected?.category === category
          return (
            <label key={category} data-selected={holdsPick}>
              {holdsPick && <span aria-hidden="true" style={{ backgroundColor: selected.hex }} />}
              <span className="sr-only">{label}</span>
              <select
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
        <button type="button" onClick={() => onChange(null)}>
          Remove
        </button>
      )}
    </div>
  )
}

export default ThreadColorSelect
