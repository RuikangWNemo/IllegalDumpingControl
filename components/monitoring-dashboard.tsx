"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Camera,
  Activity,
  Zap,
  BarChart3,
  Volume2,
  Settings,
  Monitor,
  ArrowLeft,
  Eye,
  ExternalLink,
} from "lucide-react"
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
import Image from "next/image"

interface MonitoringDashboardProps {
  onBackToSelector?: () => void
}

export function MonitoringDashboard({ onBackToSelector }: MonitoringDashboardProps) {
  const [recentEvents, setRecentEvents] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [activeAlertsCount, setActiveAlertsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showCameraStream, setShowCameraStream] = useState(false)

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
          <p className="mt-4 text-muted-foreground">Loading...</p>
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
              <div className="flex items-center justify-center">
                <Image src="/images/dku-logo.png" alt="DKU Logo" width={60} height={60} className="drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text">Government Panel - DKU Smart Waste Management System</h1>
                <p className="text-sm text-muted-foreground">City-wide Monitoring · Smart Alerts · Data Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-primary border-primary/50">
                <Activity className="w-3 h-3 mr-1" />
                System Running
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/events">
                  <Zap className="w-4 h-4 mr-2" />
                  Event Management
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/data-analysis">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Data Analysis
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics Reports
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/alerts">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Alert System
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/devices">
                  <Monitor className="w-4 h-4 mr-2" />
                  Device Monitoring
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/rules">
                  <Settings className="w-4 h-4 mr-2" />
                  Rule Configuration
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                Edge Device Monitoring - DKU Phase I
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50">
                    <div>
                      <h3 className="font-semibold text-lg">Riverbank Station A</h3>
                      <p className="text-sm text-muted-foreground">DKU-TRASH-A01</p>
                      <Badge variant="outline" className="mt-2 text-green-500 border-green-500/50">
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowCameraStream(!showCameraStream)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Video Stream
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="http://10.203.29.238:3001/" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Access Device
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                {showCameraStream && (
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg overflow-hidden bg-black">
                      <div className="p-3 bg-card/50 border-b border-border">
                        <h4 className="font-medium flex items-center gap-2">
                          <Camera className="w-4 h-4 text-primary" />
                          Live Video Stream - Pi Camera
                        </h4>
                      </div>
                      <div className="aspect-video flex items-center justify-center">
                        <img
                          src="http://10.203.29.238:1984/api/frame.jpeg?src=pi_camera"
                          alt="Live video stream"
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/camera-offline.jpg"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

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
                Data Analysis Overview
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
                  Real-time Event Stream
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
