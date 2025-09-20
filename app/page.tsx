import { Suspense } from "react"
import { MonitoringDashboard } from "@/components/monitoring-dashboard"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { AuthGuard } from "@/components/auth-guard"

export default function HomePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Suspense fallback={<DashboardSkeleton />}>
          <MonitoringDashboard />
        </Suspense>
      </div>
    </AuthGuard>
  )
}
