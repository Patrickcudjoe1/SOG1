"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"
import { COUNTRIES, type Country } from "@/app/lib/countries-data"

interface CountrySelectorProps {
  value: string
  onChange: (countryCode: string, countryName: string) => void
  disabled?: boolean
  required?: boolean
  className?: string
  error?: string
}

export default function CountrySelector({
  value,
  onChange,
  disabled = false,
  required = false,
  className = "",
  error
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedCountry = COUNTRIES.find(c => c.code === value || c.name === value)
  
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 0)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (country: Country) => {
    onChange(country.code, country.name)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      setSearchTerm("")
    } else if (e.key === "Enter" && filteredCountries.length === 1) {
      e.preventDefault()
      handleSelect(filteredCountries[0])
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-2 border border-gray-300 text-sm text-left focus:outline-none focus:border-black transition-colors flex items-center justify-between ${
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white hover:border-gray-400"
        } ${error ? "border-red-500" : ""}`}
      >
        <span className={selectedCountry ? "text-gray-900" : "text-gray-400"}>
          {selectedCountry ? selectedCountry.name : "Select country"}
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? "rotate-180" : ""} ${disabled ? "text-gray-400" : "text-gray-600"}`} 
        />
      </button>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search countries..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="overflow-y-auto max-h-64">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                    country.code === value ? "bg-gray-50 font-medium" : ""
                  }`}
                >
                  {country.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-sm text-gray-500 text-center">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}