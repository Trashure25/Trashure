import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface AdvancedAutocompleteProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  allowCustom?: boolean
  className?: string
}

export const AdvancedAutocomplete: React.FC<AdvancedAutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder = "",
  allowCustom = true,
  className = ""
}) => {
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [search, setSearch] = React.useState(value)

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
        onChange(filtered[activeIndex])
        setOpen(false)
        setActiveIndex(-1)
        e.preventDefault()
      } else if (allowCustom && search.trim()) {
        onChange(search.trim())
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
          placeholder={placeholder}
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
            if (!e.target.value && allowCustom) onChange("")
          }}
          onFocus={() => setOpen(true)}
          onBlur={e => {
            // Only close if the next focused element is not inside the popover
            const next = e.relatedTarget as HTMLElement | null
            if (!next || !next.closest('[data-autocomplete-popover]')) {
              setOpen(false)
              setActiveIndex(-1)
            }
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className={className}
        />
      </PopoverTrigger>
      <PopoverContent data-autocomplete-popover className="p-0 w-full min-w-[200px] max-h-60 overflow-y-auto">
        {filtered.length === 0 && allowCustom ? (
          <div
            className="px-4 py-2 text-gray-500 text-sm cursor-pointer hover:bg-accent"
            onMouseDown={() => {
              onChange(search.trim())
              setOpen(false)
              setActiveIndex(-1)
            }}
          >
            Add "{search.trim()}"
          </div>
        ) : (
          filtered.map((opt, i) => (
            <div
              key={opt}
              className={`px-4 py-2 cursor-pointer text-sm hover:bg-accent ${i === activeIndex ? "bg-accent text-accent-foreground" : ""}`}
              onMouseDown={() => {
                onChange(opt)
                setOpen(false)
                setActiveIndex(-1)
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {opt}
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  )
} 