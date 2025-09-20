"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle, Clock, Eye, MapPin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

interface WasteEvent {
  id: string
  location_id: string
  location_name: string
  event_type: string
  confidence_score: number
  detected_at: string
  status: string
  coordinates: { lat: number; lng: number }
  metadata: any
}

interface EventsListProps {
  events: WasteEvent[]
}

export function EventsList({ events: initialEvents }: EventsListProps) {
  const [events, setEvents] = useState(initialEvents)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new simulated events
      if (Math.random() < 0.3) {
        const newEvent: WasteEvent = {
          id: `sim_${Date.now()}`,
          location_id: `loc_00${Math.floor(Math.random() * 4) + 1}`,
          location_name: `社区垃圾站${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
          event_type: Math.random() < 0.7 ? "illegal_dumping" : "normal_disposal",
          confidence_score: 0.8 + Math.random() * 0.2,
          detected_at: new Date().toISOString(),
          status: "active",
          coordinates: {
            lat: 39.9 + (Math.random() - 0.5) * 0.1,
            lng: 116.4 + (Math.random() - 0.5) * 0.1,
          },
          metadata: {
            detected_objects: ["plastic_bags", "cardboard"],
            person_count: Math.floor(Math.random() * 3) + 1,
          },
        }
        setEvents((prev) => [newEvent, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getEventIcon = (eventType: string, status: string) => {
    if (status === "resolved") return CheckCircle
    if (eventType === "illegal_dumping") return AlertTriangle
    return Clock
  }

  const getEventColor = (eventType: string, status: string) => {
    if (status === "resolved") return "text-green-400"
    if (eventType === "illegal_dumping") return "text-red-400"
    return "text-yellow-400"
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "destructive" as const, text: "活跃" },
      investigating: { variant: "secondary" as const, text: "调查中" },
      resolved: { variant: "outline" as const, text: "已解决" },
      false_positive: { variant: "outline" as const, text: "误报" },
    }
    return variants[status as keyof typeof variants] || variants.active
  }

  const getEventTypeText = (eventType: string) => {
    const types = {
      illegal_dumping: "非法倾倒",
      normal_disposal: "正常投放",
      bin_full: "垃圾桶满",
      maintenance: "设备维护",
    }
    return types[eventType as keyof typeof types] || eventType
  }

  return (
    <ScrollArea className="h-[540px]">
      <div className="p-4 space-y-3">
        {events.map((event) => {
          const Icon = getEventIcon(event.event_type, event.status)
          const iconColor = getEventColor(event.event_type, event.status)
          const statusBadge = getStatusBadge(event.status)

          return (
            <Card
              key={event.id}
              className="glass border-l-4 border-l-primary/50 hover:border-l-primary transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full bg-background/50 ${event.event_type === "illegal_dumping" && event.status === "active" ? "pulse-alert" : ""}`}
                  >
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm truncate">{getEventTypeText(event.event_type)}</h4>
                      <Badge {...statusBadge}>{statusBadge.text}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.location_name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        置信度: {(event.confidence_score * 100).toFixed(0)}%
                      </span>
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(event.detected_at), {
                          addSuffix: true,
                          locale: zhCN,
                        })}
                      </span>
                    </div>
                    {event.event_type === "illegal_dumping" && event.status === "active" && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                          <Eye className="w-3 h-3 mr-1" />
                          查看详情
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                          标记已处理
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </ScrollArea>
  )
}
