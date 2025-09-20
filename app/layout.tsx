import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AccessibilityProvider } from "@/components/accessibility-provider"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI智能垃圾监管系统",
  description: "AI-powered waste management and monitoring system",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AccessibilityProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <AccessibilityToolbar />
          <Analytics />
        </AccessibilityProvider>
      </body>
    </html>
  )
}
