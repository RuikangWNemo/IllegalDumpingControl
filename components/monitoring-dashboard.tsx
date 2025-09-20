"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Activity, Shield, Zap, BarChart3, Volume2, Settings, Monitor, ArrowLeft } from "lucide-react"
import { StatsCards } from "@/components/stats-cards"
import { EventsList } from "@/components/events-list"
import { InteractiveMap } from "@/components/interactive-map"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import { AIMetricsDashboard } from "@/components/ai-metrics-dashboard"
import { CommunityRankings } from "@/components/community-rankings"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { DataAnalysisModule } from "@/components/data-analysis-module"
import { useEffect, useState } from "react"

interface MonitoringDashboardProps {
  onBackToSelector?: () => void
}

export function MonitoringDashboard({ onBackToSelector }: MonitoringDashboardProps) {
  const [recentEvents, setRecentEvents] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [activeAlertsCount, setActiveAlertsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      try {
        // Fetch recent events
        const { data: eventsData } = await supabase
          .from("waste_events")
          .select("*")
          .order("detected_at", { ascending: false })
          .limit(10)

        // Fetch monitoring locations
        const { data: locationsData } = await supabase.from("monitoring_locations").select("*").order("name")

        // Fetch active alerts count
        const { count: alertsCount } = await supabase
          .from("waste_events")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")

        setRecentEvents(eventsData || [])
        setLocations(locationsData || [])
        setActiveAlertsCount(alertsCount || 0)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBackToSelector && (
                <Button variant="ghost" size="sm" onClick={onBackToSelector}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 neon-glow">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text">政府监管端 - AI智能垃圾监管系统</h1>
                <p className="text-sm text-muted-foreground">昆山市全域监控 · 智能预警 · 数据分析</p>
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
                <Link href="/data-analysis">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  数据分析
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  统计报表
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/alerts">
                  <Volume2 className="w-4 h-4 mr-2" />
                  警报系统
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/devices">
                  <Monitor className="w-4 h-4 mr-2" />
                  设备监控
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/rules">
                  <Settings className="w-4 h-4 mr-2" />
                  规则配置
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <AIMetricsDashboard />
        </div>

        <div className="mb-6">
          <CommunityRankings />
        </div>

        <div className="mb-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                数据分析概览
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataAnalysisModule />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats and Alerts */}
          <div className="lg:col-span-1 space-y-6">
            <StatsCards
              activeAlerts={activeAlertsCount}
              totalLocations={locations.length}
              recentEvents={recentEvents.length}
            />
            <RealTimeAlerts events={recentEvents} />
          </div>

          {/* Middle Column - Interactive Map */}
          <div className="lg:col-span-1">
            <InteractiveMap locations={locations} events={recentEvents} />
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
                <EventsList events={recentEvents} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
