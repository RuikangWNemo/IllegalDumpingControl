"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, AlertTriangle, CheckCircle } from "lucide-react"

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
}

interface LocationsMapProps {
  locations: Location[]
  events: WasteEvent[]
}

export function LocationsMap({ locations, events }: LocationsMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [simulatedEvents, setSimulatedEvents] = useState<Record<string, number>>({})

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
      return { status: "alert", color: "bg-red-500", text: "警报" }
    }
    if (recentEvents.length > 0) {
      return { status: "active", color: "bg-yellow-500", text: "活跃" }
    }
    return { status: "normal", color: "bg-green-500", text: "正常" }
  }

  return (
    <div className="h-[540px] relative bg-gradient-to-br from-background to-muted/20 rounded-lg overflow-hidden">
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
              {isActive && <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping scale-150" />}

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
                <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 glass z-10">
                  <CardContent className="p-4">
                    <div className="space-y-3">
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
                        <span className={location.camera_status === "active" ? "text-green-400" : "text-red-400"}>
                          摄像头{location.camera_status === "active" ? "在线" : "离线"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {events
                          .filter((event) => event.location_id === location.id && event.status === "active")
                          .slice(0, 2)
                          .map((event) => (
                            <div key={event.id} className="flex items-center gap-2 text-xs">
                              {event.event_type === "illegal_dumping" ? (
                                <AlertTriangle className="w-3 h-3 text-red-400" />
                              ) : (
                                <CheckCircle className="w-3 h-3 text-green-400" />
                              )}
                              <span className="text-muted-foreground">
                                {event.event_type === "illegal_dumping" ? "非法倾倒" : "正常活动"}
                              </span>
                            </div>
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
            <div className="w-3 h-3 bg-red-500 rounded-full" />
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
  )
}
