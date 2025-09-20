"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart3 } from "lucide-react"

interface WasteEvent {
  id: string
  event_type: string
  detected_at: string
  status: string
}

interface EventsChartProps {
  events: WasteEvent[]
}

export function EventsChart({ events }: EventsChartProps) {
  // Process data for the last 7 days
  const processChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    return last7Days.map((date) => {
      const dayEvents = events.filter((event) => event.detected_at.split("T")[0] === date)

      return {
        date: new Date(date).toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
        total: dayEvents.length,
        illegal_dumping: dayEvents.filter((e) => e.event_type === "illegal_dumping").length,
        normal_disposal: dayEvents.filter((e) => e.event_type === "normal_disposal").length,
        resolved: dayEvents.filter((e) => e.status === "resolved").length,
      }
    })
  }

  const chartData = processChartData()

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          事件趋势分析
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="illegal_dumping" fill="hsl(var(--destructive))" name="非法倾倒" radius={[2, 2, 0, 0]} />
              <Bar dataKey="normal_disposal" fill="hsl(var(--primary))" name="正常投放" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
