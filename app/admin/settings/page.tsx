"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Save, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeEmail: "",
    notificationEmail: "",
    enableEmailNotifications: true,
    maintenanceMode: false,
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    // Load settings
    fetch("/api/admin/settings", { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.data)
        }
      })
      .catch((err) => console.error("Failed to load settings:", err))
      .finally(() => setLoading(false))
  }, [])

  const handleCheckStatus = async () => {
    setChecking(true)
    try {
      const res = await fetch("/api/admin/maintenance/status")
      const data = await res.json()
      
      if (data.success) {
        toast.info(`Maintenance Mode: ${data.maintenanceMode ? "ENABLED ✅" : "DISABLED ❌"}`, {
          description: `Status checked at ${new Date(data.timestamp).toLocaleTimeString()}`,
        })
      } else {
        toast.error("Failed to check status")
      }
    } catch (error) {
      console.error("Check status error:", error)
      toast.error("Failed to check status")
    } finally {
      setChecking(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'same-origin',
        body: JSON.stringify(settings),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Settings saved successfully")
        
        // Clear middleware cache for maintenance mode
        if (settings.maintenanceMode !== undefined) {
          fetch("/api/admin/maintenance/clear-cache", {
            method: "POST",
            credentials: 'same-origin',
          }).catch((err) => console.error("Failed to clear cache:", err))
          
          if (settings.maintenanceMode) {
            toast.info("Maintenance mode enabled. Storefront is now locked.", {
              description: "Refresh may be needed for changes to take effect (max 30s)",
              duration: 5000,
            })
          } else {
            toast.info("Maintenance mode disabled. Storefront is now accessible.", {
              description: "Changes take effect within 30 seconds",
              duration: 5000,
            })
          }
        }
      } else {
        toast.error(data.error || "Failed to save settings")
      }
    } catch (error) {
      console.error("Save settings error:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your store settings and preferences
        </p>
      </div>

      {/* Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            Configure your store's basic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeEmail">Store Email</Label>
            <Input
              id="storeEmail"
              type="email"
              value={settings.storeEmail}
              onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
              placeholder="store@example.com"
            />
            <p className="text-xs text-muted-foreground">
              This email will be used for customer communications
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationEmail">Admin Notification Email</Label>
            <Input
              id="notificationEmail"
              type="email"
              value={settings.notificationEmail}
              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
              placeholder="admin@example.com"
            />
            <p className="text-xs text-muted-foreground">
              Receive order notifications at this email
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for new orders
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.enableEmailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enableEmailNotifications: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced</CardTitle>
          <CardDescription>
            Advanced store configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable the storefront
              </p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceMode: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handleCheckStatus} 
          disabled={checking}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {checking ? "Checking..." : "Check Current Status"}
        </Button>
        
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}