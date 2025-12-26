"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, MapPin } from "lucide-react"
import CountrySelector from "@/app/components/CountrySelector"
import RegionSelector from "@/app/components/RegionSelector"

interface Address {
  id: string
  fullName: string
  phone: string | null
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string | null
  postalCode: string
  country: string
  isDefault: boolean
}

interface AddressSectionProps {
  userId: string
}

export default function AddressSection({ userId }: AddressSectionProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "GH",
    isDefault: false,
  })
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/account/addresses", {
        cache: 'no-store', // User-specific data, don't cache
        credentials: 'same-origin', // Include cookies
      })
      if (res.ok) {
        const data = await res.json()
        setAddresses(data.addresses || [])
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const url = editingId ? `/api/account/addresses/${editingId}` : "/api/account/addresses"
      const method = editingId ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: 'same-origin', // Include cookies
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save address")
        return
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
        isDefault: false,
      })
      fetchAddresses()
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleEdit = (address: Address) => {
    setEditingId(address.id)
    setFormData({
      fullName: address.fullName,
      phone: address.phone || "",
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state || "",
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
        credentials: 'same-origin', // Include cookies
      })

      if (res.ok) {
        fetchAddresses()
      }
    } catch (err) {
      console.error("Failed to delete address:", err)
    }
  }

  if (loading) {
    return <div className="text-sm font-light text-gray-600">Loading addresses...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-light tracking-widest uppercase">Addresses</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-xs tracking-widest uppercase font-light hover:opacity-60"
          >
            <Plus size={14} /> Add Address
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 bg-white space-y-4 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase font-light mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 bg-white text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase font-light mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs tracking-widest uppercase font-light mb-2">Address Line 1</label>
              <input
                type="text"
                required
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs tracking-widest uppercase font-light mb-2">Address Line 2</label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase font-light mb-2">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase font-light mb-2">
                State / Region {formData.country && <span className="text-red-500">*</span>}
              </label>
              <RegionSelector
                countryCode={formData.country}
                value={formData.state}
                onChange={(region) => setFormData({ ...formData, state: region })}
                required={!!formData.country}
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase font-light mb-2">Postal Code</label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase font-light mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <CountrySelector
                value={formData.country}
                onChange={(code, name) => {
                  // Clear state when country changes
                  setFormData({ ...formData, country: code, state: "" })
                }}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isDefault" className="text-xs tracking-widest uppercase font-light">
              Set as default address
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs tracking-widest uppercase font-light border border-black hover:bg-black hover:text-white transition-colors"
            >
              {editingId ? "Update Address" : "Add Address"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setFormData({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "GH",
        isDefault: false,
                })
                setError("")
              }}
              className="px-4 py-2 text-xs tracking-widest uppercase font-light border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-sm font-light text-gray-600">No addresses saved yet</div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="p-4 border border-gray-200 bg-white relative transition-colors">
              {address.isDefault && (
                <span className="absolute top-2 right-2 text-xs tracking-widest uppercase font-light bg-black text-white px-2 py-1">
                  Default
                </span>
              )}
              <div className="flex items-start gap-2 mb-2">
                <MapPin size={16} className="mt-0.5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-light mb-1">{address.fullName}</p>
                  <p className="text-xs text-gray-600 font-light">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-xs text-gray-600 font-light">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-xs text-gray-600 font-light">{address.country}</p>
                  {address.phone && (
                    <p className="text-xs text-gray-600 font-light mt-1">Phone: {address.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(address)}
                  className="flex items-center gap-1 text-xs tracking-widest uppercase font-light hover:opacity-60"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1 text-xs tracking-widest uppercase font-light text-red-600 hover:opacity-60"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

