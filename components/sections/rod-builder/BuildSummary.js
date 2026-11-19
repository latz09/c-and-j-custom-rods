import { gripText, applicationText } from '@/lib/builder/buildAttributes'
import { getStickerText } from '@/lib/builder/pricing'
import BuildTotal from './BuildTotal'

const NOT_PICKED = 'Not selected'

const threadLabel = (threads, id) => {
  const t = threads?.find((x) => x._id === id)
  return t ? `${t.name} (${t.code})` : null
}

// "Your Build" card. Safe on partial configs: unpicked rows read "Not selected".
// `action` is the add-to-cart button, passed in so the shell owns validation.
const BuildSummary = ({ config, catalog, price, hasBasePrice, action }) => {
  const find = (list, key, id) => list?.find((x) => x[key] === id)
  const isIce = catalog.applicationType === 'ice'
  const sticker = getStickerText(config)

  const rows = [{ label: 'Series', value: catalog.name }]

  if (isIce) {
    rows.push({ label: 'Length', value: config.length ? `${config.length}"` : NOT_PICKED })
  } else {
    rows.push({
      label: 'Application',
      value: applicationText(find(catalog.applications, '_key', config.applicationKey)) || NOT_PICKED,
    })
  }

  rows.push(
    { label: 'Blank color', value: find(catalog.blanks, '_id', config.blankId)?.name || NOT_PICKED },
    { label: 'Primary thread', value: threadLabel(catalog.threads, config.primaryThreadId) || NOT_PICKED },
    { label: 'Accent thread', value: threadLabel(catalog.threads, config.accentThreadId) || 'None' },
    { label: 'Grip', value: gripText(find(catalog.grips, '_id', config.gripId)) || NOT_PICKED },
    { label: 'Sticker', value: sticker ? `"${sticker}"` : 'None' }
  )

  return (
    <div className="mt-1 rounded bg-accent/30 p-1.25">
      <h5 className="mb-0.75">Your Build</h5>
      <dl>
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-1 border-b border-dark/20 py-0.5">
            <dt className="text-paragraph">{r.label}</dt>
            <dd className="text-paragraph font-[700] text-right">{r.value}</dd>
          </div>
        ))}
      </dl>
      <BuildTotal price={price} hasBasePrice={hasBasePrice} className="py-0.75" />
      {action}
    </div>
  )
}

export default BuildSummary
