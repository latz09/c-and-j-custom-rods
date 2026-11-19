// Shared wrapper for each option group: label, optional price note, then the picker.
const BuilderSection = ({ label, priceNote, helperText, children }) => (
  <section className="mt-2 lg:mt-2.5">
    <div className="flex items-baseline gap-0.75 mb-0.75">
      <h6>{label}</h6>
      {priceNote && <span className="text-caption font-[700] text-primary">{priceNote}</span>}
    </div>
    {helperText && <p className="text-caption mb-0.75">{helperText}</p>}
    {children}
  </section>
)

export default BuilderSection
