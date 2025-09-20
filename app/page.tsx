"use client"

import { useState, Suspense } from "react"
import { MonitoringDashboard } from "@/components/monitoring-dashboard"
import { CommunityPanel } from "@/components/community-panel"
import { GovernmentPanel } from "@/components/government-panel"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { AuthGuard } from "@/components/auth-guard"
import { ClientSelector, type ClientType } from "@/components/client-selector"

export default function HomePage() {
  const [clientType, setClientType] = useState<ClientType | null>(null)

  const handleClientSelect = (type: ClientType) => {
    setClientType(type)
  }

  const renderDashboard = () => {
    switch (clientType) {
      case "community":
        return <CommunityPanel />
      case "government":
        return <GovernmentPanel />
      default:
        return <MonitoringDashboard />
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {!clientType && <ClientSelector onClientSelect={handleClientSelect} />}
        {clientType && <ClientSelector onClientSelect={handleClientSelect} currentClient={clientType} />}
        <Suspense fallback={<DashboardSkeleton />}>{renderDashboard()}</Suspense>
      </div>
    </AuthGuard>
  )
}
