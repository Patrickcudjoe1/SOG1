"use client"

import { useState } from "react"
import { Edit2, Save, X } from "lucide-react"

interface ProfileSectionProps {
  userId: string
  initialName: string | null
  initialEmail: string
}

export default function ProfileSection({ userId, initialName, initialEmail }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSave = async () => {
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: 'same-origin', // Include cookies
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to update profile")
        return
      }

      setSuccess("Profile updated successfully")
      setIsEditing(false)
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-light tracking-widest uppercase">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-xs tracking-widest uppercase font-light hover:opacity-60"
          >
            <Edit2 size={14} /> Edit
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">{success}</div>
      )}

      <div className="space-y-4 border-b border-gray-200 pb-8">
        <div>
          <p className="text-xs text-gray-600 tracking-widest uppercase mb-1">Name</p>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Your name"
            />
          ) : (
            <p className="text-sm font-light">{name || "Not set"}</p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-600 tracking-widest uppercase mb-1">Email</p>
          <p className="text-sm font-light">{initialEmail}</p>
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        {isEditing && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase font-light border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-60"
            >
              <Save size={14} /> {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setName(initialName || "")
                setError("")
                setSuccess("")
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase font-light border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

