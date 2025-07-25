import * as React from "react"
import { Input } from "@/components/ui/input"

interface AdvancedAutocompleteProps {
  options: string[]
  value?: string
  onChange?: (value: string) => void
  onSelect?: (value: string) => void
  placeholder?: string
  allowCustom?: boolean
  className?: string
  id?: string
  name?: string
  autoComplete?: string
}

export const AdvancedAutocomplete = React.memo<AdvancedAutocompleteProps>(({
  options,
  value = "",
  onChange,
  onSelect,
  placeholder = "",
  allowCustom = true,
  className = "",
  id,
  name,
  autoComplete = "off"
}) => {
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [search, setSearch] = React.useState(value)

  // Update search when value prop changes
  React.useEffect(() => {
    setSearch(value)
  }, [value])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filtered = React.useMemo(() => {
    if (!search) return options
    return options.filter(opt => 
      opt.toLowerCase().includes(search.toLowerCase())
    )
  }, [options, search])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex(prev => 
        prev < filtered.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === "Enter") {
      if (open && activeIndex >= 0 && filtered[activeIndex]) {
        const selectedValue = filtered[activeIndex]
        setSearch(selectedValue)
        onSelect?.(selectedValue)
        setOpen(false)
        setActiveIndex(-1)
        e.preventDefault()
      } else if (allowCustom && search.trim()) {
        const customValue = search.trim()
        setSearch(customValue)
        onSelect?.(customValue)
        setOpen(false)
        setActiveIndex(-1)
        e.preventDefault()
      }
    } else if (e.key === "Escape") {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearch(newValue)
    setOpen(true)
    setActiveIndex(-1)
    // Don't call onChange to prevent parent re-renders that cause focus loss
  }, [])

  const handleOptionClick = React.useCallback((optionValue: string) => {
    setSearch(optionValue)
    onSelect?.(optionValue)
    setOpen(false)
    setActiveIndex(-1)
  }, [onSelect])

  const handleFocus = React.useCallback(() => {
    setOpen(true)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <Input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={search}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className={className}
      />
      {open && (filtered.length > 0 || allowCustom) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {filtered.length === 0 && allowCustom && search.trim() ? (
            <div
              className="px-4 py-2 text-gray-500 text-sm cursor-pointer hover:bg-accent"
              onClick={() => handleOptionClick(search.trim())}
            >
              Add "{search.trim()}"
            </div>
          ) : (
            <>
              {filtered.map((opt, i) => (
                <div
                  key={opt}
                  className={`px-4 py-2 cursor-pointer text-sm hover:bg-accent ${i === activeIndex ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => handleOptionClick(opt)}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  {opt}
                </div>
              ))}
              {allowCustom && search.trim() && !filtered.includes(search.trim()) && (
                <div
                  className="px-4 py-2 text-gray-500 text-sm cursor-pointer hover:bg-accent border-t"
                  onClick={() => handleOptionClick(search.trim())}
                >
                  Add "{search.trim()}"
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}) 