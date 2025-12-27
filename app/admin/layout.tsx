"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminSidebar } from "./components/AdminSidebar"
import { AdminTopBar } from "./components/AdminTopBar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if we're on the login page - skip auth check
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    // Skip auth check on login page
    if (isLoginPage) {
      setLoading(false)
      return
    }

    let isMounted = true;
    
    // Check current session and admin status
    fetch("/api/admin/check", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store"
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not authorized");
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        
        console.log('🔍 [ADMIN LAYOUT] Admin check response:', data);
        
        // API response has data wrapped in 'data' property
        if (data.success && data.data?.isAdmin) {
          setIsAdmin(true);
          setSession(data.data.user);
          setLoading(false);
          console.log('✅ [ADMIN LAYOUT] Admin access granted');
        } else {
          console.log('❌ [ADMIN LAYOUT] Admin access denied, redirecting to login');
          router.push("/admin/login");
        }
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("❌ [ADMIN LAYOUT] Admin check failed:", error);
        router.push("/admin/login");
      });

    return () => {
      isMounted = false;
    };
  }, [router, isLoginPage])

  // Render login page directly without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <AdminSidebar user={session} />

      {/* Main Content */}
      <div className="ml-64 transition-all duration-300">
        <AdminTopBar />
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}