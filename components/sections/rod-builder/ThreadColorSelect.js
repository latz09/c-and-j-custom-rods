'use client'

import { useEffect, useRef, useState } from 'react'
import { chipClasses } from './optionClasses'
import { readableTextClass } from './readableText'

const GROUPS = [
  { category: 'warm', label: 'Warm colors' },
  { category: 'cool', label: 'Cool colors' },
  { category: 'neutral', label: 'No color' },
]

const Chevron = ({ open }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 10 6"
    className={`h-[0.4rem] w-[0.65rem] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M1 1l4 4 4-4" />
  </svg>
)

// Three dropdowns (warm / cool / no color). One pick across all three: the dropdown holding the
// pick fills with the thread color (text color picked for contrast), the others stay empty, so
// picking in one clears the others. Options show a swatch with the name. Used for primary and
// accent. `optional` adds a clear button (the accent can be removed).
const ThreadColorSelect = ({ id, threads = [], value, onChange, optional = false }) => {
  const selected = threads.find((t) => t._id === value)
  const [openCategory, setOpenCategory] = useState(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!openCategory) return
    const onPointerDown = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpenCategory(null)
    }
    const onKeyDown = (e) => e.key === 'Escape' && setOpenCategory(null)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openCategory])

  const pick = (threadId) => {
    onChange(threadId)
    setOpenCategory(null)
  }

  return (
    <div ref={wrapperRef}>
      <div className="flex flex-wrap gap-0.75">
        {GROUPS.map(({ category, label }) => {
          const options = threads.filter((t) => t.category === category)
          const holdsPick = selected?.category === category
          const open = openCategory === category
          const listId = `${id}-${category}`
          return (
            <div key={category} className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                data-selected={holdsPick}
                onClick={() => setOpenCategory(open ? null : category)}
                className={`inline-flex items-center gap-0.75 ${
                  holdsPick
                    ? `border rounded-sm px-0.75 py-0.5 text-caption font-[700] border-transparent ${readableTextClass(selected.hex)}`
                    : chipClasses(false)
                }`}
                style={holdsPick ? { backgroundColor: selected.hex } : undefined}
              >
                {holdsPick ? `${selected.name} (${selected.code})` : `${label} (${options.length})`}
                <Chevron open={open} />
              </button>

              {open && (
                <ul
                  id={listId}
                  role="listbox"
                  aria-label={label}
                  className="absolute left-0 top-full z-30 mt-0.25 max-h-[18rem] w-max min-w-full overflow-y-auto rounded border border-accent bg-light py-0.25 shadow-lifted"
                >
                  {options.map((t) => {
                    const isPick = t._id === value
                    return (
                      <li key={t._id} role="option" aria-selected={isPick}>
                        <button
                          type="button"
                          onClick={() => pick(t._id)}
                          className={`flex w-full items-center gap-0.75 px-0.75 py-0.5 text-left text-caption transition-colors duration-300 hover:bg-accent/30 ${
                            isPick ? 'bg-accent/30 font-[700]' : ''
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="block h-1.25 w-1.25 shrink-0 rounded-full border border-dark/20"
                            style={{ backgroundColor: t.hex }}
                          />
                          {t.name} ({t.code})
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
      {optional && value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-0.5 text-caption underline hover:text-primary transition duration-300"
        >
          Remove
        </button>
      )}
    </div>
  )
}

export default ThreadColorSelect
