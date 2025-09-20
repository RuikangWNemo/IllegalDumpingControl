"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Volume2, Lightbulb, Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

interface WasteEvent {
  id: string
  location_name: string
  event_type: string
  confidence_score: number
  detected_at: string
  status: string
}

interface RealTimeAlertsProps {
  events: WasteEvent[]
}

export function RealTimeAlerts({ events }: RealTimeAlertsProps) {
  const [alertSound, setAlertSound] = useState(true)
  const [activeAlerts, setActiveAlerts] = useState(
    events.filter((event) => event.event_type === "illegal_dumping" && event.status === "active"),
  )

  // Simulate real-time alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.2) {
        const newAlert = {
          id: `alert_${Date.now()}`,
          location_name: `社区垃圾站${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
          event_type: "illegal_dumping",
          confidence_score: 0.85 + Math.random() * 0.15,
          detected_at: new Date().toISOString(),
          status: "active",
        }
        setActiveAlerts((prev) => [newAlert, ...prev.slice(0, 4)])

        // Simulate alert sound
        if (alertSound) {
          console.log("[v0] Alert sound triggered for:", newAlert.location_name)
        }
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [alertSound])

  const triggerVoiceWarning = (locationName: string) => {
    console.log("[v0] Voice warning triggered for:", locationName)
    // In a real implementation, this would trigger the actual voice warning system
  }

  const triggerLightFlash = (locationName: string) => {
    console.log("[v0] Light flash triggered for:", locationName)
    // In a real implementation, this would trigger the actual light flash system
  }

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            实时警报
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAlertSound(!alertSound)}
              className={alertSound ? "text-primary" : "text-muted-foreground"}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
            <Badge variant="destructive" className="animate-pulse">
              {activeAlerts.length} 活跃
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-3">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无活跃警报</p>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-red-500 bg-red-500/5">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-red-400">非法倾倒检测</h4>
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          紧急
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.location_name}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>置信度: {(alert.confidence_score * 100).toFixed(0)}%</span>
                        <span>
                          {formatDistanceToNow(new Date(alert.detected_at), {
                            addSuffix: true,
                            locale: zhCN,
                          })}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 flex-1 bg-transparent"
                          onClick={() => triggerVoiceWarning(alert.location_name)}
                        >
                          <Volume2 className="w-3 h-3 mr-1" />
                          语音警告
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 flex-1 bg-transparent"
                          onClick={() => triggerLightFlash(alert.location_name)}
                        >
                          <Lightbulb className="w-3 h-3 mr-1" />
                          闪光警示
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
