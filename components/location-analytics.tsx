"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, AlertTriangle, TrendingUp } from "lucide-react"

interface WasteEvent {
  id: string
  location_id: string
  location_name: string
  event_type: string
  status: string
}

interface Location {
  id: string
  name: string
}

interface LocationAnalyticsProps {
  events: WasteEvent[]
  locations: Location[]
}

export function LocationAnalytics({ events, locations }: LocationAnalyticsProps) {
  const getLocationStats = () => {
    return locations
      .map((location) => {
        const locationEvents = events.filter((event) => event.location_id === location.id)
        const illegalEvents = locationEvents.filter((event) => event.event_type === "illegal_dumping")
        const resolvedEvents = locationEvents.filter((event) => event.status === "resolved")

        return {
          ...location,
          totalEvents: locationEvents.length,
          illegalEvents: illegalEvents.length,
          resolvedEvents: resolvedEvents.length,
          resolutionRate: locationEvents.length > 0 ? (resolvedEvents.length / locationEvents.length) * 100 : 0,
          riskLevel: illegalEvents.length > 5 ? "high" : illegalEvents.length > 2 ? "medium" : "low",
        }
      })
      .sort((a, b) => b.totalEvents - a.totalEvents)
  }

  const locationStats = getLocationStats()

  const getRiskBadge = (riskLevel: string) => {
    const variants = {
      high: { variant: "destructive" as const, text: "高风险" },
      medium: { variant: "secondary" as const, text: "中风险" },
      low: { variant: "outline" as const, text: "低风险" },
    }
    return variants[riskLevel as keyof typeof variants] || variants.low
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          位置分析
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-4">
            {locationStats.map((location) => {
              const riskBadge = getRiskBadge(location.riskLevel)

              return (
                <Card key={location.id} className="border-l-4 border-l-primary/50">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{location.name}</h4>
                        <Badge {...riskBadge}>{riskBadge.text}</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold">{location.totalEvents}</p>
                          <p className="text-xs text-muted-foreground">总事件</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-red-400">{location.illegalEvents}</p>
                          <p className="text-xs text-muted-foreground">非法倾倒</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-400">{location.resolvedEvents}</p>
                          <p className="text-xs text-muted-foreground">已解决</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>解决率</span>
                          <span>{location.resolutionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={location.resolutionRate} className="h-2" />
                      </div>

                      {location.illegalEvents > 0 && (
                        <div className="flex items-center gap-2 text-xs text-red-400">
                          <AlertTriangle className="w-3 h-3" />
                          <span>需要重点关注</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="w-3 h-3" />
                        <span>
                          {location.totalEvents > 10
                            ? "活跃度高"
                            : location.totalEvents > 5
                              ? "活跃度中等"
                              : "活跃度低"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
