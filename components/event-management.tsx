import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EventsTable } from "@/components/events-table"
import { EventStats } from "@/components/event-stats"
import { ArrowLeft, Search, Filter, Download } from "lucide-react"
import Link from "next/link"

export async function EventManagement() {
  const supabase = await createClient()

  // Fetch all events with pagination
  const { data: events, count } = await supabase
    .from("waste_events")
    .select("*", { count: "exact" })
    .order("detected_at", { ascending: false })
    .limit(50)

  // Fetch event statistics
  const { data: stats } = await supabase.from("waste_events").select("event_type, status")

  const eventStats = {
    total: count || 0,
    active: stats?.filter((s) => s.status === "active").length || 0,
    resolved: stats?.filter((s) => s.status === "resolved").length || 0,
    investigating: stats?.filter((s) => s.status === "investigating").length || 0,
    illegalDumping: stats?.filter((s) => s.event_type === "illegal_dumping").length || 0,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回监控台
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">事件管理</h1>
                <p className="text-sm text-muted-foreground">查看和管理所有检测事件</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出数据
              </Button>
              <Badge variant="outline" className="text-primary border-primary/50">
                {eventStats.total} 总事件
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Statistics Cards */}
          <EventStats stats={eventStats} />

          {/* Filters and Search */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                筛选和搜索
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="搜索事件、位置或描述..." className="pl-10" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="事件类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有类型</SelectItem>
                      <SelectItem value="illegal_dumping">非法倾倒</SelectItem>
                      <SelectItem value="normal_disposal">正常投放</SelectItem>
                      <SelectItem value="bin_full">垃圾桶满</SelectItem>
                      <SelectItem value="maintenance">设备维护</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有状态</SelectItem>
                      <SelectItem value="active">活跃</SelectItem>
                      <SelectItem value="investigating">调查中</SelectItem>
                      <SelectItem value="resolved">已解决</SelectItem>
                      <SelectItem value="false_positive">误报</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="7d">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="时间范围" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">今天</SelectItem>
                      <SelectItem value="7d">最近7天</SelectItem>
                      <SelectItem value="30d">最近30天</SelectItem>
                      <SelectItem value="90d">最近90天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events Table */}
          <EventsTable events={events || []} />
        </div>
      </div>
    </div>
  )
}
