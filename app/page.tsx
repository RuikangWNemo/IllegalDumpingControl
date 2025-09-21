"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { MonitoringDashboard } from "@/components/monitoring-dashboard"
import { CommunityPanel } from "@/components/community-panel"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { AuthGuard } from "@/components/auth-guard"
import { ClientSelector } from "@/components/client-selector"
import { useSearchParams } from "next/navigation"

export default function HomePage() {
  const [clientType, setClientType] = useState<"government" | "community" | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const panel = searchParams.get("panel")
    if (panel === "government" || panel === "community") {
      setClientType(panel)
    }
  }, [searchParams])

  const handleClientSelect = (type: "government" | "community") => {
    setClientType(type)
    window.history.pushState({}, "", `/?panel=${type}`)
  }

  const handleBackToSelector = () => {
    setClientType(null)
    window.history.pushState({}, "", "/")
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {!clientType ? (
          <ClientSelector onClientSelect={handleClientSelect} />
        ) : (
          <Suspense fallback={<DashboardSkeleton />}>
            {clientType === "government" ? (
              <MonitoringDashboard onBackToSelector={handleBackToSelector} />
            ) : (
              <CommunityPanel onBackToSelector={handleBackToSelector} />
            )}
          </Suspense>
        )}
      </div>
    </AuthGuard>
  )
}
