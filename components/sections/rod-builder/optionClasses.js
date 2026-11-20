// Shared selected / unselected looks for chips and tiles, so every option group matches.
const BASE = 'border rounded-sm transition-colors duration-300'

export const chipClasses = (selected) =>
  `${BASE} px-0.75 py-0.5 text-caption ${
    selected ? 'bg-accent border-accent font-[700]' : 'bg-light border-accent'
  }`

export const tileClasses = (selected) =>
  `${BASE} p-0.75 ${selected ? 'bg-accent border-accent' : 'bg-light border-accent'}`
