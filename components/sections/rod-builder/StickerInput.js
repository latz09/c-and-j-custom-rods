// Optional personalized text. Blank = no sticker, no charge.
const StickerInput = ({ value, onChange, maxLength }) => (
  <div>
    <input
      type="text"
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Fish Slayer"
      aria-label="Personalized sticker text"
    />
    <span>
      {value.length}/{maxLength}
    </span>
  </div>
)

export default StickerInput
