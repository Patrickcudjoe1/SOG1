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
        <h2 className="text-sm font-light tracking-widest uppercase dark:text-white">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-xs tracking-widest uppercase font-light hover:opacity-60 dark:text-white"
          >
            <Edit2 size={14} /> Edit
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">{success}</div>
      )}

      <div className="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-8">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 tracking-widest uppercase mb-1">Name</p>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors dark:text-white"
              placeholder="Your name"
            />
          ) : (
            <p className="text-sm font-light dark:text-white">{name || "Not set"}</p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 tracking-widest uppercase mb-1">Email</p>
          <p className="text-sm font-light dark:text-white">{initialEmail}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        {isEditing && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase font-light border border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors disabled:opacity-60 dark:text-white"
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
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase font-light border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dark:text-white"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

