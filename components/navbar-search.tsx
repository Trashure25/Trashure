"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface AutocompleteSuggestion {
  type: string
  value: string
  label: string
}

export function NavbarSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAutocomplete = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions.slice(0, 8)) // Limit to 8 suggestions for navbar
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error('Autocomplete error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSuggestionClick = (suggestion: AutocompleteSuggestion) => {
    setQuery(suggestion.value)
    setShowSuggestions(false)
    router.push(`/search?q=${encodeURIComponent(suggestion.value)}`)
  }

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="flex-1 flex justify-center relative">
      <div className="flex w-full max-w-sm border border-gray-300 rounded-full overflow-hidden h-9 relative focus-within:border-accent focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-0 transition-all">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#06402B]" />
        </span>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search for anything"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            handleAutocomplete(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true)
          }}
          className="flex-1 pl-10 pr-4 py-2 text-sm bg-white focus:outline-none border-none rounded-none placeholder:text-gray-400"
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="px-4 font-bold uppercase border-l border-gray-300 bg-white text-[#06402B] hover:bg-[#06402B] hover:text-white text-xs transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>
      
      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-full max-w-sm bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Badge variant="outline" className="text-xs">
                {suggestion.type}
              </Badge>
              <span className="text-sm">{suggestion.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 