import { formatPrice } from './formatPrice'

// Open water only. Stacked cards, one per application. Upcharge 0 reads "Included".
const ApplicationSelect = ({ applications = [], value, onChange }) => (
  <div role="radiogroup">
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
        >
          <span>{app.upcharge > 0 ? `+${formatPrice(app.upcharge)}` : 'Included'}</span>
          <span>{app.length}</span>
          <span>
            <span>{app.powerAction}</span>
            <small>Power/action</small>
          </span>
          <span>
            <span>{app.lineWeight}</span>
            <small>Line weight</small>
          </span>
          <span>
            <span>{app.lureWeight}</span>
            <small>Lure weight</small>
          </span>
          {app.usage && <span>{app.usage}</span>}
        </button>
      )
    })}
  </div>
)

export default ApplicationSelect
