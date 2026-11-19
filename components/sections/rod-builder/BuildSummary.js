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
    <div>
      <h2>Your Build</h2>
      <dl>
        {rows.map((r) => (
          <div key={r.label}>
            <dt>{r.label}</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
      <BuildTotal price={price} hasBasePrice={hasBasePrice} />
      {action}
    </div>
  )
}

export default BuildSummary
