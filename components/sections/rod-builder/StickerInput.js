// Optional personalized text. Blank = no sticker, no charge.
const StickerInput = ({ value, onChange, maxLength }) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Fish Slayer"
      aria-label="Personalized sticker text"
      className="w-full rounded border border-accent bg-light py-0.75 pl-1 pr-3 text-paragraph transition-colors duration-300 focus:border-primary focus:outline-none"
    />
    <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-caption text-dark/60">
      {value.length}/{maxLength}
    </span>
  </div>
)

export default StickerInput
