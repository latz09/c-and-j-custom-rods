// Shared wrapper for each option group: label, optional price note, then the picker.
const BuilderSection = ({ label, priceNote, helperText, children }) => (
  <section>
    <div>
      <h2>{label}</h2>
      {priceNote && <span>{priceNote}</span>}
    </div>
    {helperText && <p>{helperText}</p>}
    {children}
  </section>
)

export default BuilderSection
