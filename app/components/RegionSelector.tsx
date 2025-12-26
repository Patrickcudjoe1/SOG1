"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"
import { getRegionsForCountry } from "@/app/lib/countries-data"

interface RegionSelectorProps {
  countryCode: string
  value: string
  onChange: (region: string) => void
  disabled?: boolean
  required?: boolean
  className?: string
  error?: string
}

export default function RegionSelector({
  countryCode,
  value,
  onChange,
  disabled = false,
  required = false,
  className = "",
  error
}: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const regions = getRegionsForCountry(countryCode)
  const hasRegions = regions.length > 0
  const isDisabled = disabled || !countryCode || !hasRegions

  const filteredRegions = regions.filter(region =>
    region.toLowerCase().includes(searchTerm.toLowerCase())
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
      if (regions.length > 8) {
        setTimeout(() => searchInputRef.current?.focus(), 0)
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, regions.length])

  const handleSelect = (region: string) => {
    onChange(region)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      setSearchTerm("")
    } else if (e.key === "Enter" && filteredRegions.length === 1) {
      e.preventDefault()
      handleSelect(filteredRegions[0])
    }
  }

  const getPlaceholderText = () => {
    if (!countryCode) return "Select country first"
    if (!hasRegions) return "No regions available"
    return "Select region"
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`w-full px-4 py-2 border border-gray-300 text-sm text-left focus:outline-none focus:border-black transition-colors flex items-center justify-between ${
          isDisabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white hover:border-gray-400"
        } ${error ? "border-red-500" : ""}`}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || getPlaceholderText()}
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? "rotate-180" : ""} ${isDisabled ? "text-gray-400" : "text-gray-600"}`} 
        />
      </button>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}

      {isOpen && hasRegions && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-80 overflow-hidden">
          {/* Search Input - Only show if many regions */}
          {regions.length > 8 && (
            <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search regions..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          )}

          {/* Regions List */}
          <div className="overflow-y-auto max-h-64">
            {filteredRegions.length > 0 ? (
              filteredRegions.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => handleSelect(region)}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                    region === value ? "bg-gray-50 font-medium" : ""
                  }`}
                >
                  {region}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-sm text-gray-500 text-center">
                No regions found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}