import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface AdvancedAutocompleteProps {
  options: string[]
  value?: string
  onChange?: (value: string) => void // called on every keystroke
  onSelect?: (value: string) => void // called only on selection/Enter
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
  const [search, setSearch] = React.useState(value)
  // If value prop changes (from parent), update local search
  React.useEffect(() => {
    setSearch(value)
  }, [value])

  const filtered = options.filter(
    (opt) => !search || opt.toLowerCase().includes(search.toLowerCase())
  )

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && ["ArrowDown", "ArrowUp"].includes(e.key)) {
      setOpen(true)
      setActiveIndex(0)
      return
    }
    if (e.key === "ArrowDown") {
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      if (open && activeIndex >= 0 && filtered[activeIndex]) {
        onSelect?.(filtered[activeIndex])
        setOpen(false)
        setActiveIndex(-1)
        e.preventDefault()
      } else if (allowCustom && search.trim()) {
        onSelect?.(search.trim())
        setOpen(false)
        setActiveIndex(-1)
        e.preventDefault()
      }
    } else if (e.key === "Escape") {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <Popover open={open && (filtered.length > 0 || allowCustom)} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
            onChange?.(e.target.value)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={className}
        />
      </PopoverTrigger>
      <PopoverContent data-autocomplete-popover className="p-0 w-full min-w-[200px] max-h-60 overflow-y-auto bg-white shadow-lg rounded-xl border z-50">
        {filtered.length === 0 && allowCustom && search.trim() ? (
          <div
            className="px-4 py-2 text-gray-500 text-sm cursor-pointer hover:bg-accent"
            onClick={() => {
              onSelect?.(search.trim())
              setOpen(false)
              setActiveIndex(-1)
            }}
          >
            Add "{search.trim()}"
          </div>
        ) : (
          <>
            {filtered.map((opt, i) => (
              <div
                key={opt}
                className={`px-4 py-2 cursor-pointer text-sm hover:bg-accent ${i === activeIndex ? "bg-accent text-accent-foreground" : ""}`}
                onClick={() => {
                  onSelect?.(opt)
                  setOpen(false)
                  setActiveIndex(-1)
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                {opt}
              </div>
            ))}
            {allowCustom && search.trim() && !filtered.includes(search.trim()) && (
              <div
                className="px-4 py-2 text-gray-500 text-sm cursor-pointer hover:bg-accent border-t"
                onClick={() => {
                  onSelect?.(search.trim())
                  setOpen(false)
                  setActiveIndex(-1)
                }}
              >
                Add "{search.trim()}"
              </div>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}) 