import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Lato, Great_Vibes } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import ClientRoot from "./components/ClientRoot"

// Playfair Display for headings
const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '900']
})

// Lato for body text
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
})

// Great Vibes for accent/buttons
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-accent",
})



export const metadata: Metadata = {
  title: "Son of God",
  description:
    "Walk in faith. Wear your purpose. A Christian clothing brand inspired by devotion, strength, and grace.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${lato.variable} ${greatVibes.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
      </head>

      <body className="antialiased bg-background text-foreground">
        <ClientRoot>{children}</ClientRoot>
        <Analytics />
      </body>
    </html>
  )
}
