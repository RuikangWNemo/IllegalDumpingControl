"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface WasteEvent {
  id: string
  event_type: string
  detected_at: string
  status: string
}

interface TrendAnalysisProps {
  events: WasteEvent[]
}

export function TrendAnalysis({ events }: TrendAnalysisProps) {
  // Process data for hourly trends over the last 24 hours
  const processTrendData = () => {
    const last24Hours = Array.from({ length: 24 }, (_, i) => {
      const date = new Date()
      date.setHours(date.getHours() - (23 - i), 0, 0, 0)
      return date
    })

    return last24Hours.map((hour) => {
      const hourEvents = events.filter((event) => {
        const eventDate = new Date(event.detected_at)
        return eventDate.getHours() === hour.getHours() && eventDate.getDate() === hour.getDate()
      })

      return {
        hour: hour.getHours().toString().padStart(2, "0") + ":00",
        total: hourEvents.length,
        illegal_dumping: hourEvents.filter((e) => e.event_type === "illegal_dumping").length,
        resolved: hourEvents.filter((e) => e.status === "resolved").length,
      }
    })
  }

  const trendData = processTrendData()

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          24小时趋势分析
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="总事件"
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="illegal_dumping"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                name="非法倾倒"
                dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="已解决"
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
