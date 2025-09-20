import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, Search, TrendingUp } from "lucide-react"

interface EventStatsProps {
  stats: {
    total: number
    active: number
    resolved: number
    investigating: number
    illegalDumping: number
  }
}

export function EventStats({ stats }: EventStatsProps) {
  const statCards = [
    {
      title: "总事件数",
      value: stats.total,
      icon: Search,
      color: "text-primary",
      bgColor: "bg-primary/10",
      change: "+5.2%",
    },
    {
      title: "活跃警报",
      value: stats.active,
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      change: "-12%",
    },
    {
      title: "已解决",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      change: "+18%",
    },
    {
      title: "调查中",
      value: stats.investigating,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      change: "+3%",
    },
    {
      title: "非法倾倒",
      value: stats.illegalDumping,
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      change: "-8%",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">{stat.change}</span>
                  </div>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
