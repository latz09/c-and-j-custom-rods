// Picks a readable text class (dark or light) for text sitting on a hex background.
// Uses perceived brightness (YIQ). Falls back to dark text on anything that isn't a hex.
export const readableTextClass = (hex) => {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex ?? '')
  if (!match) return 'text-dark'
  const full = match[1].length === 3 ? match[1].replace(/./g, '$&$&') : match[1]
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? 'text-dark' : 'text-light'
}
