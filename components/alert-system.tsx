import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bell, Zap } from "lucide-react"
import { VoiceControls } from "@/components/voice-controls"
import { AlertSettings } from "@/components/alert-settings"
import { AlertHistory } from "@/components/alert-history"
import { EmergencyControls } from "@/components/emergency-controls"
import Link from "next/link"

export async function AlertSystem() {
  const supabase = await createClient()

  // Fetch recent alerts
  const { data: alerts } = await supabase
    .from("alerts")
    .select(`
      *,
      waste_events (
        id,
        location_name,
        event_type,
        confidence_score,
        detected_at
      )
    `)
    .order("sent_at", { ascending: false })
    .limit(50)

  // Fetch active events for emergency controls
  const { data: activeEvents } = await supabase
    .from("waste_events")
    .select("*")
    .eq("status", "active")
    .eq("event_type", "illegal_dumping")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/?panel=government">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Alert & Voice System</h1>
                <p className="text-sm text-muted-foreground">Real-time alert control and voice warning management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-primary border-primary/50">
                <Bell className="w-3 h-3 mr-1" />
                {alerts?.length || 0} Alerts
              </Badge>
              <Badge variant="destructive" className="animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                {activeEvents?.length || 0} Emergency Events
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Emergency Controls */}
          <EmergencyControls activeEvents={activeEvents || []} />

          {/* Main Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VoiceControls />
            <AlertSettings />
          </div>

          {/* Alert History */}
          <AlertHistory alerts={alerts || []} />
        </div>
      </div>
    </div>
  )
}
