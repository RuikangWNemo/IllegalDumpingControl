import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EnhancedMonitoringDashboard } from "@/components/enhanced-monitoring-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile to determine role
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", data.user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  return <EnhancedMonitoringDashboard userProfile={profile} />
}
