import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, MapPin, Activity, Shield, Zap, BarChart3, Volume2 } from "lucide-react"
import { StatsCards } from "@/components/stats-cards"
import { EventsList } from "@/components/events-list"
import { LocationsMap } from "@/components/locations-map"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import Link from "next/link"

export async function MonitoringDashboard() {
  const supabase = await createClient()

  // Fetch recent events
  const { data: recentEvents } = await supabase
    .from("waste_events")
    .select("*")
    .order("detected_at", { ascending: false })
    .limit(10)

  // Fetch monitoring locations
  const { data: locations } = await supabase.from("monitoring_locations").select("*").order("name")

  // Fetch active alerts count
  const { count: activeAlertsCount } = await supabase
    .from("waste_events")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 neon-glow">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text">AI智能垃圾监管系统</h1>
                <p className="text-sm text-muted-foreground">实时监控 · 智能预警 · 数据分析</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-primary border-primary/50">
                <Activity className="w-3 h-3 mr-1" />
                系统运行中
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/events">
                  <Zap className="w-4 h-4 mr-2" />
                  事件管理
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  数据分析
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/alerts">
                  <Volume2 className="w-4 h-4 mr-2" />
                  警报系统
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats and Alerts */}
          <div className="lg:col-span-1 space-y-6">
            <StatsCards
              activeAlerts={activeAlertsCount || 0}
              totalLocations={locations?.length || 0}
              recentEvents={recentEvents?.length || 0}
            />
            <RealTimeAlerts events={recentEvents || []} />
          </div>

          {/* Middle Column - Map */}
          <div className="lg:col-span-1">
            <Card className="glass h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  监控点位分布
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <LocationsMap locations={locations || []} events={recentEvents || []} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Events List */}
          <div className="lg:col-span-1">
            <Card className="glass h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  实时事件流
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <EventsList events={recentEvents || []} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
