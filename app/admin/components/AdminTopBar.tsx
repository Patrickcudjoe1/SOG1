"use client"

import { Bell, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AdminTopBar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - could add breadcrumbs here */}
        <div className="flex items-center gap-4">
          {/* Breadcrumbs can be added here */}
        </div>

        {/* Right side - actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <p className="text-sm font-semibold mb-2">Notifications</p>
                <div className="space-y-2">
                  <div className="text-sm p-2 hover:bg-accent rounded-md cursor-pointer">
                    <p className="font-medium">New order received</p>
                    <p className="text-xs text-muted-foreground">Order #12345 - ₵150.00</p>
                  </div>
                  <div className="text-sm p-2 hover:bg-accent rounded-md cursor-pointer">
                    <p className="font-medium">Low stock alert</p>
                    <p className="text-xs text-muted-foreground">T-Shirt Classic - 5 items left</p>
                  </div>
                  <div className="text-sm p-2 hover:bg-accent rounded-md cursor-pointer">
                    <p className="font-medium">Payment received</p>
                    <p className="text-xs text-muted-foreground">Order #12344 completed</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}