import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import ClientRoot from "./components/ClientRoot"

// inter (Logo, Navbar)
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600', '700'] })

// Clean Sans (Body text)
const fogSans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-fog-sans",
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
      className={`${inter.variable} ${fogSans.variable} ${inter.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
      </head>

      <body className={`antialiased`}>
        <ClientRoot>{children}</ClientRoot>
        <Analytics />
      </body>
    </html>
  )
}
