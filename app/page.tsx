import { Suspense } from "react"
import { MonitoringDashboard } from "@/components/monitoring-dashboard"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<DashboardSkeleton />}>
        <MonitoringDashboard />
      </Suspense>
    </div>
  )
}
