// Shared wrapper for each option group: label, optional price note, then the picker.
// `active` false dims the section (still clickable) until the shopper reaches it.
const BuilderSection = ({ label, priceNote, helperText, active = true, children }) => (
  <section className={`relative focus-within:z-20 mt-2 lg:mt-1.5 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-60'}`}>
    <div className="flex items-baseline gap-0.75 mb-0.75">
      <p className="text-paragraph-sm font-[700]">{label}</p>
      {priceNote && <span className="text-paragraph-sm font-[700] text-primary">{priceNote}</span>}
    </div>
    {helperText && <p className="text-paragraph-sm mb-0.75">{helperText}</p>}
    {children}
  </section>
)

export default BuilderSection
