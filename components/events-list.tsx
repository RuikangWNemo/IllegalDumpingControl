"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle, Clock, Eye, MapPin, Play, Database } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { FalsePositiveHandler } from "@/components/false-positive-handler"
import { EventDetailModal } from "@/components/event-detail-modal"

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
  const [selectedEvent, setSelectedEvent] = useState<WasteEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
            video_clip: `clip_${Date.now()}.mp4`,
            video_duration: 12,
            data_source: Math.random() < 0.6 ? "实时" : "回放",
          },
        }
        setEvents((prev) => [newEvent, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleMarkFalsePositive = (eventId: string, reason: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, status: "false_positive", metadata: { ...event.metadata, false_positive_reason: reason } }
          : event,
      ),
    )
  }

  const handleMarkResolved = (eventId: string) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, status: "resolved" } : event)))
  }

  const handleViewDetails = (event: WasteEvent) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

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
    <>
      <ScrollArea className="h-[540px]">
        <div className="p-4 space-y-3">
          {events.map((event) => {
            const Icon = getEventIcon(event.event_type, event.status)
            const iconColor = getEventColor(event.event_type, event.status)
            const statusBadge = getStatusBadge(event.status)
            const dataSource = event.metadata?.data_source || (event.id.startsWith("sim_") ? "模拟" : "实时")

            return (
              <Card
                key={event.id}
                className="glass border-l-4 border-l-primary/50 hover:border-l-primary transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={dataSource === "实时" ? "default" : dataSource === "回放" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      <Database className="w-3 h-3 mr-1" />
                      {dataSource}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(event.detected_at), {
                        addSuffix: true,
                        locale: zhCN,
                      })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
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
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-muted-foreground">
                          置信度: {(event.confidence_score * 100).toFixed(0)}%
                        </span>
                        {event.metadata?.video_clip && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Play className="w-3 h-3" />
                            <span>{event.metadata.video_duration}s</span>
                          </div>
                        )}
                      </div>
                      {event.event_type === "illegal_dumping" && event.status === "active" && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 bg-transparent"
                            onClick={() => handleViewDetails(event)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            查看详情
                          </Button>
                          <FalsePositiveHandler
                            eventId={event.id}
                            onMarkFalsePositive={handleMarkFalsePositive}
                            onMarkResolved={handleMarkResolved}
                          />
                        </div>
                      )}
                      {event.status === "false_positive" && event.metadata?.false_positive_reason && (
                        <div className="mt-2 p-2 bg-yellow-400/10 rounded text-xs">
                          <span className="text-yellow-400">误报原因: </span>
                          <span className="text-muted-foreground">
                            {FALSE_POSITIVE_REASONS.find((r) => r.value === event.metadata.false_positive_reason)
                              ?.label || event.metadata.false_positive_reason}
                          </span>
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

      <EventDetailModal event={selectedEvent} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

const FALSE_POSITIVE_REASONS = [
  { value: "cat_dog", label: "猫/狗等动物" },
  { value: "delivery_box", label: "快递包裹" },
  { value: "passerby", label: "路人经过" },
  { value: "maintenance", label: "维护人员" },
  { value: "wind_debris", label: "风吹垃圾" },
  { value: "shadow_lighting", label: "阴影/光照" },
  { value: "other", label: "其他原因" },
]
