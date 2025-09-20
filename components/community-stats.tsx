"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Camera, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"

export function CommunityStats() {
  const stats = [
    {
      title: "社区人口",
      value: "8,500",
      change: "+2.3%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "监控设备",
      value: "24",
      change: "100%在线",
      trend: "stable",
      icon: Camera,
      color: "green",
    },
    {
      title: "今日违规",
      value: "2",
      change: "-60%",
      trend: "down",
      icon: AlertTriangle,
      color: "orange",
    },
    {
      title: "处理完成",
      value: "8",
      change: "+25%",
      trend: "up",
      icon: CheckCircle,
      color: "green",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === "up" && <TrendingUp className="w-3 h-3 text-green-500" />}
                    <span
                      className={`text-xs ${
                        stat.trend === "up"
                          ? "text-green-500"
                          : stat.trend === "down"
                            ? "text-red-500"
                            : "text-muted-foreground"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
