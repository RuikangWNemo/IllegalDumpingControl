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

const kunshanCommunities = [
  { id: "yushan", name: "玉山镇中心社区", district: "玉山镇", x: 45, y: 35, population: 8500 },
  { id: "huaqiao", name: "花桥经济开发区", district: "花桥镇", x: 75, y: 25, population: 12000 },
  { id: "bacheng", name: "巴城镇老街社区", district: "巴城镇", x: 25, y: 55, population: 6800 },
  { id: "zhoushi", name: "周市镇工业园区", district: "周市镇", x: 55, y: 65, population: 15000 },
  { id: "qiandeng", name: "千灯镇古镇社区", district: "千灯镇", x: 35, y: 75, population: 5200 },
  { id: "lujia", name: "陆家镇商业区", district: "陆家镇", x: 65, y: 45, population: 9800 },
  { id: "zhangpu", name: "张浦镇新城区", district: "张浦镇", x: 85, y: 55, population: 7600 },
  { id: "dianshanhu", name: "淀山湖镇生态区", district: "淀山湖镇", x: 15, y: 25, population: 4200 },
]

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
          <TabsTrigger value="map">昆山市监控地图</TabsTrigger>
          <TabsTrigger value="heatmap">违规热力图</TabsTrigger>
          <TabsTrigger value="analytics">时段分析</TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                昆山市智能垃圾监管系统 - 全域监控
              </CardTitle>
              <p className="text-sm text-muted-foreground">覆盖8个镇区，135个监控点位，实时AI识别</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px] relative bg-gradient-to-br from-background to-muted/20 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20" />
                <div className="absolute inset-0 bg-[url('/kunshan-satellite-aerial-view.jpg')] bg-cover bg-center opacity-30" />

                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <path
                      d="M10,20 L90,20 L90,80 L10,80 Z"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      fill="none"
                      strokeDasharray="2,2"
                    />
                    <path d="M30,20 L30,80" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1,1" />
                    <path d="M50,20 L50,80" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1,1" />
                    <path d="M70,20 L70,80" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1,1" />
                    <path d="M10,40 L90,40" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1,1" />
                    <path d="M10,60 L90,60" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1,1" />
                  </svg>
                </div>

                <div className="relative h-full p-6">
                  {kunshanCommunities.map((community) => {
                    const communityEvents = events.filter((e) => e.location_name?.includes(community.name.slice(0, 2)))
                    const hasViolations = communityEvents.some(
                      (e) => e.event_type === "illegal_dumping" && e.status === "active",
                    )
                    const isActive = simulatedEvents[community.id] && Date.now() - simulatedEvents[community.id] < 3000

                    const status = hasViolations
                      ? { status: "alert", color: "bg-red-500", text: "违规", pulse: true }
                      : communityEvents.length > 0
                        ? { status: "active", color: "bg-yellow-500", text: "活跃", pulse: false }
                        : { status: "normal", color: "bg-green-500", text: "正常", pulse: false }

                    return (
                      <div
                        key={community.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        style={{ left: `${community.x}%`, top: `${community.y}%` }}
                        onClick={() => setSelectedLocation(selectedLocation === community.id ? null : community.id)}
                      >
                        {/* Pulse Animation for Active Events */}
                        {(isActive || status.pulse) && (
                          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping scale-150" />
                        )}

                        {/* Community Marker */}
                        <div
                          className={`relative p-3 rounded-full ${status.color} shadow-lg hover:scale-110 transition-transform`}
                        >
                          <MapPin className="w-5 h-5 text-white" />
                          {status.status === "alert" && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                          )}
                        </div>

                        {/* Community Label */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-medium text-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                          {community.name}
                        </div>

                        {/* Community Info Popup */}
                        {selectedLocation === community.id && (
                          <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 glass z-10">
                            <CardContent className="p-4">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm">{community.name}</h4>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${status.color.replace("bg-", "text-")} border-current`}
                                  >
                                    {status.text}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{community.district}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Camera className="w-3 h-3" />
                                    <span>{Math.floor(community.population / 400)}个摄像头</span>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  人口: {community.population.toLocaleString()}人
                                </div>

                                {/* Community Events */}
                                <div className="space-y-2">
                                  <h5 className="text-xs font-medium text-muted-foreground">最新事件</h5>
                                  {communityEvents.slice(0, 3).map((event) => (
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
                                  {communityEvents.length === 0 && (
                                    <p className="text-xs text-muted-foreground text-center py-2">暂无事件记录</p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="absolute bottom-4 left-4 glass p-3 rounded-lg">
                  <div className="space-y-2 text-xs">
                    <div className="font-semibold mb-2">昆山市监控状态</div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span>正常运行</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span>检测活跃</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span>违规警报</span>
                    </div>
                    <div className="border-t border-border/50 pt-2 mt-2">
                      <div className="text-muted-foreground">覆盖范围: 8镇区</div>
                      <div className="text-muted-foreground">监控点位: 135个</div>
                    </div>
                  </div>
                </div>

                {/* Real-time Activity Indicator */}
                <div className="absolute top-4 right-4 glass p-2 rounded-lg">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>昆山市实时监控</span>
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
