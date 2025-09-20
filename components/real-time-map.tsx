"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Camera, AlertTriangle, Navigation, Layers, Zap } from "lucide-react"

interface Location {
  id: string
  name: string
  address: string
  coordinates: { lat: number; lng: number }
  camera_status: string
  last_ping: string
  community: string
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

interface RealTimeMapProps {
  locations: Location[]
  events: WasteEvent[]
}

const DKU_CAMPUS_BOUNDARY = [
  { lat: 31.2304, lng: 120.9737 },
  { lat: 31.232, lng: 120.9755 },
  { lat: 31.2315, lng: 120.978 },
  { lat: 31.2295, lng: 120.9765 },
  { lat: 31.2304, lng: 120.9737 },
]

const REAL_COMMUNITIES = [
  { name: "听林园", center: { lat: 31.2285, lng: 120.972 }, bins: 8 },
  { name: "万科城", center: { lat: 31.234, lng: 120.98 }, bins: 12 },
  { name: "玉山新城", center: { lat: 31.225, lng: 120.985 }, bins: 15 },
  { name: "昆山杜克大学", center: { lat: 31.2304, lng: 120.975 }, bins: 6 },
  { name: "花桥商务城", center: { lat: 31.24, lng: 120.99 }, bins: 20 },
  { name: "城北新区", center: { lat: 31.245, lng: 120.965 }, bins: 18 },
]

export function RealTimeMap({ locations, events }: RealTimeMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [mapView, setMapView] = useState<"satellite" | "street" | "heatmap">("street")
  const [realTimeData, setRealTimeData] = useState<Record<string, any>>({})
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const newData: Record<string, any> = {}
      REAL_COMMUNITIES.forEach((community) => {
        newData[community.name] = {
          violations: Math.floor(Math.random() * 5),
          compliance: 85 + Math.random() * 15,
          lastUpdate: new Date().toISOString(),
          activeAlerts: Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0,
        }
      })
      setRealTimeData(newData)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return "bg-green-500"
    if (compliance >= 85) return "bg-yellow-500"
    return "bg-red-500"
  }

  const generateBinPositions = (community: any) => {
    const positions = []
    for (let i = 0; i < community.bins; i++) {
      const angle = (i / community.bins) * 2 * Math.PI
      const radius = 0.003 + Math.random() * 0.002
      positions.push({
        lat: community.center.lat + Math.cos(angle) * radius,
        lng: community.center.lng + Math.sin(angle) * radius,
        id: `${community.name}-bin-${i}`,
        status: Math.random() < 0.1 ? "violation" : "normal",
      })
    }
    return positions
  }

  return (
    <div className="space-y-6">
      <Tabs value={mapView} onValueChange={(value) => setMapView(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="street">街道视图</TabsTrigger>
          <TabsTrigger value="satellite">卫星视图</TabsTrigger>
          <TabsTrigger value="heatmap">合规热力图</TabsTrigger>
        </TabsList>

        <TabsContent value="street">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                昆山智能垃圾监管地图 - 街道视图
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  实时更新中
                </div>
                <Badge variant="outline">覆盖6个社区 · 79个智能垃圾桶</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={mapRef}
                className="h-[700px] relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('/kunshan-street-map-layout.jpg')] bg-cover bg-center opacity-30" />

                <div className="absolute inset-0">
                  <svg className="w-full h-full">
                    <polygon
                      points={DKU_CAMPUS_BOUNDARY.map(
                        (point) => `${((point.lng - 120.96) / 0.04) * 100}%,${((31.25 - point.lat) / 0.03) * 100}%`,
                      ).join(" ")}
                      fill="rgba(59, 130, 246, 0.1)"
                      stroke="rgba(59, 130, 246, 0.5)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                  </svg>
                  <div className="absolute top-[45%] left-[40%] transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-blue-500/20 text-blue-700 border-blue-300">昆山杜克大学校园</Badge>
                  </div>
                </div>

                {REAL_COMMUNITIES.map((community, index) => {
                  const communityData = realTimeData[community.name] || {
                    violations: 0,
                    compliance: 90,
                    activeAlerts: 0,
                  }
                  const binPositions = generateBinPositions(community)

                  const position = {
                    top: `${20 + ((index * 12) % 60)}%`,
                    left: `${15 + ((index * 15) % 70)}%`,
                  }

                  return (
                    <div key={community.name} className="absolute" style={position}>
                      {/* Community Center */}
                      <div className="relative">
                        <div className="flex flex-col items-center">
                          <div
                            className={`p-3 rounded-full ${getComplianceColor(communityData.compliance)} shadow-lg hover:scale-110 transition-transform cursor-pointer`}
                          >
                            <MapPin className="w-6 h-6 text-white" />
                            {communityData.activeAlerts > 0 && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs animate-pulse">
                                {communityData.activeAlerts}
                              </div>
                            )}
                          </div>
                          <Badge className="mt-2 text-xs bg-background/80 backdrop-blur-sm">{community.name}</Badge>
                        </div>

                        {/* Smart Bin Distribution */}
                        {binPositions.map((bin, binIndex) => (
                          <div
                            key={bin.id}
                            className="absolute w-2 h-2 rounded-full transition-all duration-300 hover:scale-150"
                            style={{
                              top: `${((binIndex * 8) % 40) - 20}px`,
                              left: `${((binIndex * 12) % 60) - 30}px`,
                              backgroundColor: bin.status === "violation" ? "#ef4444" : "#22c55e",
                              boxShadow:
                                bin.status === "violation"
                                  ? "0 0 10px rgba(239, 68, 68, 0.5)"
                                  : "0 0 5px rgba(34, 197, 94, 0.3)",
                            }}
                          >
                            {bin.status === "violation" && (
                              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
                            )}
                          </div>
                        ))}

                        {/* Community Info Panel */}
                        {selectedLocation === community.name && (
                          <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-80 glass z-20">
                            <CardContent className="p-4">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{community.name}</h4>
                                  <Badge
                                    className={`${getComplianceColor(communityData.compliance).replace("bg-", "text-")} border-current`}
                                  >
                                    合规率 {communityData.compliance.toFixed(1)}%
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-1">
                                    <div className="text-muted-foreground">智能垃圾桶</div>
                                    <div className="font-medium">{community.bins}个</div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="text-muted-foreground">今日违规</div>
                                    <div className="font-medium text-red-500">{communityData.violations}次</div>
                                  </div>
                                </div>

                                {communityData.activeAlerts > 0 && (
                                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <div className="flex items-center gap-2 text-red-600">
                                      <AlertTriangle className="w-4 h-4" />
                                      <span className="font-medium">活跃警报 {communityData.activeAlerts}个</span>
                                    </div>
                                  </div>
                                )}

                                <Button
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    /* Navigate to community panel */
                                  }}
                                >
                                  <Camera className="w-4 h-4 mr-2" />
                                  查看实时监控
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Map Controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button size="sm" variant="outline" className="glass bg-transparent">
                    <Layers className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="glass bg-transparent">
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>

                {/* Real-time Status Bar */}
                <div className="absolute bottom-4 left-4 right-4 glass p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm">实时监控中</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        最后更新: {new Date().toLocaleTimeString("zh-CN")}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span>
                          正常 (
                          {REAL_COMMUNITIES.reduce((acc, c) => acc + c.bins, 0) -
                            Object.values(realTimeData).reduce(
                              (acc: number, data: any) => acc + (data.violations || 0),
                              0,
                            )}
                          )
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span>
                          违规 (
                          {Object.values(realTimeData).reduce(
                            (acc: number, data: any) => acc + (data.violations || 0),
                            0,
                          )}
                          )
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satellite">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                昆山智能垃圾监管地图 - 卫星视图
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[700px] relative bg-gradient-to-br from-green-900 to-blue-900 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[url('/kunshan-satellite-aerial-view.jpg')] bg-cover bg-center opacity-60" />

                {/* Same community markers but with satellite styling */}
                {REAL_COMMUNITIES.map((community, index) => {
                  const communityData = realTimeData[community.name] || {
                    violations: 0,
                    compliance: 90,
                    activeAlerts: 0,
                  }

                  const position = {
                    top: `${20 + ((index * 12) % 60)}%`,
                    left: `${15 + ((index * 15) % 70)}%`,
                  }

                  return (
                    <div key={community.name} className="absolute" style={position}>
                      <div className="relative">
                        <div className="flex flex-col items-center">
                          <div
                            className={`p-3 rounded-full ${getComplianceColor(communityData.compliance)} shadow-2xl border-2 border-white/50 hover:scale-110 transition-transform cursor-pointer`}
                          >
                            <MapPin className="w-6 h-6 text-white" />
                            {communityData.activeAlerts > 0 && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs animate-pulse border border-white">
                                {communityData.activeAlerts}
                              </div>
                            )}
                          </div>
                          <Badge className="mt-2 text-xs bg-black/60 text-white border-white/30">
                            {community.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                昆山智能垃圾监管地图 - 合规热力图
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[700px] relative bg-gradient-to-br from-background to-muted/20 rounded-lg overflow-hidden">
                {REAL_COMMUNITIES.map((community, index) => {
                  const communityData = realTimeData[community.name] || {
                    violations: 0,
                    compliance: 90,
                    activeAlerts: 0,
                  }
                  const intensity = (100 - communityData.compliance) / 100

                  const position = {
                    top: `${15 + ((index * 12) % 65)}%`,
                    left: `${10 + ((index * 15) % 75)}%`,
                  }

                  return (
                    <div key={community.name} className="absolute" style={position}>
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/30 shadow-lg"
                        style={{
                          backgroundColor: `rgba(239, 68, 68, ${0.2 + intensity * 0.8})`,
                          boxShadow: `0 0 ${20 + intensity * 40}px rgba(239, 68, 68, ${0.3 + intensity * 0.5})`,
                        }}
                      >
                        <div className="text-center">
                          <div className="text-lg">{communityData.compliance.toFixed(0)}%</div>
                          <div className="text-xs opacity-80">{community.name}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Heatmap Legend */}
                <div className="absolute bottom-4 right-4 glass p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">合规率</div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span className="text-xs">95%+</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded" />
                      <span className="text-xs">85-95%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded" />
                      <span className="text-xs">&lt;85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
