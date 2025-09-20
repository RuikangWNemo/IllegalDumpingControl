"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Camera, AlertTriangle, CheckCircle, BarChart3, Clock, Eye } from "lucide-react"
import { EventDetailModal } from "@/components/event-detail-modal"

interface Location {
  id: string
  name: string
  address: string
  coordinates: { lat: number; lng: number }
  camera_status: string
  last_ping: string
}

interface WasteEvent {
  id: string
  location_id: string
  location_name: string
  event_type: string
  status: string
  detected_at: string
  confidence_score: number
  coordinates: { lat: number; lng: number }
  metadata: any
}

interface InteractiveMapProps {
  locations: Location[]
  events: WasteEvent[]
}

interface HeatmapData {
  hour: number
  violations: number
  intensity: number
}

export function InteractiveMap({ locations, events }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<WasteEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [simulatedEvents, setSimulatedEvents] = useState<Record<string, number>>({})
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])

  // Generate hourly violation heatmap data
  useEffect(() => {
    const hourlyData: HeatmapData[] = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      violations: Math.floor(Math.random() * 15) + 1,
      intensity: Math.random(),
    }))
    setHeatmapData(hourlyData)
  }, [])

  // Simulate real-time activity indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const newSimulatedEvents: Record<string, number> = {}
      locations.forEach((location) => {
        if (Math.random() < 0.2) {
          newSimulatedEvents[location.id] = Date.now()
        }
      })
      setSimulatedEvents(newSimulatedEvents)
    }, 3000)

    return () => clearInterval(interval)
  }, [locations])

  const getLocationStatus = (locationId: string) => {
    const recentEvents = events.filter((event) => event.location_id === locationId && event.status === "active")
    if (recentEvents.some((event) => event.event_type === "illegal_dumping")) {
      return { status: "alert", color: "bg-red-500", text: "警报", pulse: true }
    }
    if (recentEvents.length > 0) {
      return { status: "active", color: "bg-yellow-500", text: "活跃", pulse: false }
    }
    return { status: "normal", color: "bg-green-500", text: "正常", pulse: false }
  }

  const getLocationEvents = (locationId: string) => {
    return events.filter((event) => event.location_id === locationId).slice(0, 3)
  }

  const handleViewEventDetails = (event: WasteEvent) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const topViolationHours = heatmapData.sort((a, b) => b.violations - a.violations).slice(0, 5)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map">交互式地图</TabsTrigger>
          <TabsTrigger value="heatmap">违规热力图</TabsTrigger>
          <TabsTrigger value="analytics">时段分析</TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                监控点位分布图
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px] relative bg-gradient-to-br from-background to-muted/20 rounded-lg overflow-hidden">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 opacity-50" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />

                {/* Map Grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-primary/10" />
                    ))}
                  </div>
                </div>

                {/* Location Markers */}
                <div className="relative h-full p-6">
                  {locations.map((location, index) => {
                    const status = getLocationStatus(location.id)
                    const isActive = simulatedEvents[location.id] && Date.now() - simulatedEvents[location.id] < 3000
                    const position = {
                      top: `${20 + ((index * 15) % 60)}%`,
                      left: `${15 + ((index * 20) % 70)}%`,
                    }

                    return (
                      <div
                        key={location.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                        style={position}
                        onClick={() => setSelectedLocation(selectedLocation === location.id ? null : location.id)}
                      >
                        {/* Pulse Animation for Active Events */}
                        {(isActive || status.pulse) && (
                          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping scale-150" />
                        )}

                        {/* Location Marker */}
                        <div
                          className={`relative p-3 rounded-full ${status.color} shadow-lg hover:scale-110 transition-transform`}
                        >
                          <MapPin className="w-5 h-5 text-white" />
                          {status.status === "alert" && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                          )}
                        </div>

                        {/* Location Info Popup */}
                        {selectedLocation === location.id && (
                          <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 glass z-10">
                            <CardContent className="p-4">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm">{location.name}</h4>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${status.color.replace("bg-", "text-")} border-current`}
                                  >
                                    {status.text}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{location.address}</p>
                                <div className="flex items-center gap-2 text-xs">
                                  <Camera className="w-3 h-3" />
                                  <span
                                    className={location.camera_status === "active" ? "text-green-400" : "text-red-400"}
                                  >
                                    摄像头{location.camera_status === "active" ? "在线" : "离线"}
                                  </span>
                                </div>

                                {/* Latest 3 Evidence Cards */}
                                <div className="space-y-2">
                                  <h5 className="text-xs font-medium text-muted-foreground">最新事件证据</h5>
                                  {getLocationEvents(location.id).map((event) => (
                                    <Card key={event.id} className="border-l-4 border-l-primary/50">
                                      <CardContent className="p-3">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            {event.event_type === "illegal_dumping" ? (
                                              <AlertTriangle className="w-3 h-3 text-red-400" />
                                            ) : (
                                              <CheckCircle className="w-3 h-3 text-green-400" />
                                            )}
                                            <span className="text-xs font-medium">
                                              {event.event_type === "illegal_dumping" ? "非法倾倒" : "正常活动"}
                                            </span>
                                          </div>
                                          <Badge
                                            variant={event.status === "active" ? "destructive" : "outline"}
                                            className="text-xs"
                                          >
                                            {event.status === "active" ? "活跃" : "已处理"}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                          <span>置信度: {(event.confidence_score * 100).toFixed(0)}%</span>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 px-2 text-xs"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleViewEventDetails(event)
                                            }}
                                          >
                                            <Eye className="w-3 h-3 mr-1" />
                                            查看
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 glass p-3 rounded-lg">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span>正常</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span>活跃</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span>警报</span>
                    </div>
                  </div>
                </div>

                {/* Real-time Activity Indicator */}
                <div className="absolute top-4 right-4 glass p-2 rounded-lg">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>实时监控</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                违规行为热力图
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Hourly Heatmap */}
                <div className="space-y-4">
                  <h3 className="font-medium">24小时违规分布</h3>
                  <div className="grid grid-cols-12 gap-1">
                    {heatmapData.map((data) => (
                      <div
                        key={data.hour}
                        className="aspect-square rounded flex items-center justify-center text-xs font-medium relative group cursor-pointer"
                        style={{
                          backgroundColor: `rgba(239, 68, 68, ${0.2 + data.intensity * 0.8})`,
                          color: data.intensity > 0.5 ? "white" : "inherit",
                        }}
                      >
                        {data.hour}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-background border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {data.hour}:00 - {data.violations}次违规
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0:00</span>
                    <span>12:00</span>
                    <span>23:00</span>
                  </div>
                </div>

                {/* Location Heatmap */}
                <div className="space-y-4">
                  <h3 className="font-medium">监控点位违规强度</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {locations.map((location) => {
                      const locationEvents = events.filter((e) => e.location_id === location.id)
                      const violationCount = locationEvents.filter((e) => e.event_type === "illegal_dumping").length
                      const intensity = Math.min(violationCount / 10, 1)

                      return (
                        <Card
                          key={location.id}
                          className="border-l-4"
                          style={{
                            borderLeftColor: `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`,
                            backgroundColor: `rgba(239, 68, 68, ${0.05 + intensity * 0.1})`,
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-sm">{location.name}</h4>
                                <p className="text-xs text-muted-foreground">{violationCount}次违规事件</p>
                              </div>
                              <div className="text-right">
                                <div
                                  className="text-lg font-bold"
                                  style={{ color: `rgba(239, 68, 68, ${0.5 + intensity * 0.5})` }}
                                >
                                  {(intensity * 100).toFixed(0)}%
                                </div>
                                <p className="text-xs text-muted-foreground">违规强度</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                违规时段分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Top Violation Time Slots */}
                <div className="space-y-4">
                  <h3 className="font-medium">高发时段排行</h3>
                  <div className="space-y-3">
                    {topViolationHours.map((data, index) => (
                      <div key={data.hour} className="flex items-center gap-4 p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {data.hour}:00 - {data.hour + 1}:00
                            </span>
                            <span className="text-sm text-muted-foreground">{data.violations}次违规</span>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-2 mt-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(data.violations / Math.max(...topViolationHours.map((d) => d.violations))) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Pattern */}
                <div className="space-y-4">
                  <h3 className="font-medium">周违规模式</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day, index) => {
                      const violations = Math.floor(Math.random() * 20) + 5
                      const intensity = violations / 25

                      return (
                        <Card key={day} className="text-center">
                          <CardContent className="p-3">
                            <div className="text-xs text-muted-foreground mb-2">{day}</div>
                            <div
                              className="w-full h-16 rounded flex items-end justify-center text-white text-xs font-medium"
                              style={{
                                backgroundColor: `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`,
                              }}
                            >
                              <div className="mb-1">{violations}</div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EventDetailModal event={selectedEvent} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
