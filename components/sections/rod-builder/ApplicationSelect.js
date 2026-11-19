import { formatPrice } from './formatPrice'
import { tileClasses } from './optionClasses'

const pillClasses = (selected, upcharge) => {
  if (selected) return 'bg-light'
  return upcharge > 0 ? 'bg-accent' : 'bg-secondary/50'
}

// Open water only. Stacked cards, one per application. Upcharge 0 reads "Included".
const ApplicationSelect = ({ applications = [], value, onChange }) => (
  <div role="radiogroup" className="space-y-0.75">
    {applications.map((app) => {
      const selected = value === app._key
      return (
        <button
          key={app._key}
          type="button"
          role="radio"
          aria-checked={selected}
          data-selected={selected}
          onClick={() => onChange(app._key)}
          className={`relative block w-full p-1.25 text-left ${tileClasses(selected)}`}
        >
          <span
            className={`absolute right-0.75 top-0.75 rounded-full px-0.75 py-0.25 text-caption font-[700] ${pillClasses(selected, app.upcharge)}`}
          >
            {app.upcharge > 0 ? `+${formatPrice(app.upcharge)}` : 'Included'}
          </span>
          <span className="block text-callout font-[600]">{app.length}</span>
          <span className="mt-0.75 grid grid-cols-3 gap-1">
            <span>
              <span className="block text-paragraph font-[700]">{app.powerAction}</span>
              <small className="block text-caption">Power/action</small>
            </span>
            <span>
              <span className="block text-paragraph font-[700]">{app.lineWeight}</span>
              <small className="block text-caption">Line weight</small>
            </span>
            <span>
              <span className="block text-paragraph font-[700]">{app.lureWeight}</span>
              <small className="block text-caption">Lure weight</small>
            </span>
          </span>
          {app.usage && <span className="mt-0.75 block text-caption">{app.usage}</span>}
        </button>
      )
    })}
  </div>
)

export default ApplicationSelect
