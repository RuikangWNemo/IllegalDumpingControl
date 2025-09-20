"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Thermometer } from "lucide-react"

interface WasteEvent {
  id: string
  location_id: string
  location_name: string
  event_type: string
  detected_at: string
  coordinates: { lat: number; lng: number }
}

interface Location {
  id: string
  name: string
  coordinates: { lat: number; lng: number }
}

interface HeatMapProps {
  events: WasteEvent[]
  locations: Location[]
}

export function HeatMap({ events, locations }: HeatMapProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")
  const [heatData, setHeatData] = useState<Record<string, number>>({})

  useEffect(() => {
    // Calculate heat intensity for each location
    const now = new Date()
    const timeRanges = {
      "1h": 1,
      "24h": 24,
      "7d": 24 * 7,
      "30d": 24 * 30,
    }

    const hoursBack = timeRanges[selectedTimeRange as keyof typeof timeRanges]
    const cutoffTime = new Date(now.getTime() - hoursBack * 60 * 60 * 1000)

    const recentEvents = events.filter((event) => new Date(event.detected_at) > cutoffTime)

    const locationHeat: Record<string, number> = {}
    locations.forEach((location) => {
      const locationEvents = recentEvents.filter((event) => event.location_id === location.id)
      const illegalEvents = locationEvents.filter((event) => event.event_type === "illegal_dumping")

      // Calculate heat score (illegal dumping events weighted more heavily)
      locationHeat[location.id] = locationEvents.length + illegalEvents.length * 2
    })

    setHeatData(locationHeat)
  }, [events, locations, selectedTimeRange])

  const getHeatIntensity = (locationId: string) => {
    const heat = heatData[locationId] || 0
    const maxHeat = Math.max(...Object.values(heatData), 1)
    return heat / maxHeat
  }

  const getHeatColor = (intensity: number) => {
    if (intensity > 0.8) return "bg-red-500"
    if (intensity > 0.6) return "bg-orange-500"
    if (intensity > 0.4) return "bg-yellow-500"
    if (intensity > 0.2) return "bg-green-500"
    return "bg-blue-500"
  }

  const getHeatLabel = (intensity: number) => {
    if (intensity > 0.8) return "极高"
    if (intensity > 0.6) return "高"
    if (intensity > 0.4) return "中等"
    if (intensity > 0.2) return "低"
    return "极低"
  }

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary" />
            事件热力图
          </CardTitle>
          <div className="flex gap-2">
            {["1h", "24h", "7d", "30d"].map((range) => (
              <Badge
                key={range}
                variant={selectedTimeRange === range ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTimeRange(range)}
              >
                {range}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heat Map Visualization */}
          <div className="relative h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-10 grid-rows-8 h-full">
                {Array.from({ length: 80 }).map((_, i) => (
                  <div key={i} className="border border-primary/10" />
                ))}
              </div>
            </div>

            {/* Location Heat Points */}
            {locations.map((location, index) => {
              const intensity = getHeatIntensity(location.id)
              const heatColor = getHeatColor(intensity)
              const position = {
                top: `${15 + ((index * 20) % 70)}%`,
                left: `${10 + ((index * 25) % 80)}%`,
              }

              return (
                <div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={position}
                >
                  {/* Heat Glow Effect */}
                  {intensity > 0.3 && (
                    <div
                      className={`absolute inset-0 rounded-full ${heatColor} opacity-30 blur-xl scale-[300%] animate-pulse`}
                    />
                  )}

                  {/* Location Marker */}
                  <div className={`relative p-3 rounded-full ${heatColor} shadow-lg`}>
                    <MapPin className="w-4 h-4 text-white" />
                  </div>

                  {/* Heat Info */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center">
                    <div className="glass p-2 rounded text-xs">
                      <div className="font-medium">{location.name}</div>
                      <div className="text-muted-foreground">
                        {getHeatLabel(intensity)} ({heatData[location.id] || 0})
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Heat Legend */}
          <div className="flex items-center justify-between p-4 glass rounded-lg">
            <div className="text-sm font-medium">热力强度</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-xs">极低</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-xs">低</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-xs">中等</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="text-xs">高</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-xs">极高</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
