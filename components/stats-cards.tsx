import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, MapPin, Activity, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  activeAlerts: number
  totalLocations: number
  recentEvents: number
}

export function StatsCards({ activeAlerts, totalLocations, recentEvents }: StatsCardsProps) {
  const stats = [
    {
      title: "活跃警报",
      value: activeAlerts,
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      change: "+12%",
      trend: "up",
    },
    {
      title: "监控点位",
      value: totalLocations,
      icon: MapPin,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "100%",
      trend: "stable",
    },
    {
      title: "今日事件",
      value: recentEvents,
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      change: "+8%",
      trend: "up",
    },
  ]

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <Card key={index} className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">{stat.change}</span>
                  </div>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
