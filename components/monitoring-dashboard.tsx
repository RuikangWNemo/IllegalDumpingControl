import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  Activity,
  Shield,
  Zap,
  BarChart3,
  Volume2,
  Settings,
  Monitor,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react"
import { StatsCards } from "@/components/stats-cards"
import { EventsList } from "@/components/events-list"
import { RealTimeMap } from "@/components/real-time-map"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import { AIMetricsDashboard } from "@/components/ai-metrics-dashboard"
import { VideoFeedPanel } from "@/components/video-feed-panel"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"

export async function MonitoringDashboard() {
  const supabase = await createClient()

  // Fetch recent events
  const { data: recentEvents } = await supabase
    .from("waste_events")
    .select("*")
    .order("detected_at", { ascending: false })
    .limit(10)

  // Fetch monitoring locations
  const { data: locations } = await supabase.from("monitoring_locations").select("*").order("name")

  // Fetch active alerts count
  const { count: activeAlertsCount } = await supabase
    .from("waste_events")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 neon-glow">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text">AI智能垃圾监管系统</h1>
                <p className="text-sm text-muted-foreground">实时监控 · 智能预警 · 数据分析</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-primary border-primary/50">
                <Activity className="w-3 h-3 mr-1" />
                系统运行中
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href="/events">
                  <Zap className="w-4 h-4 mr-2" />
                  事件管理
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  数据分析
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/alerts">
                  <Volume2 className="w-4 h-4 mr-2" />
                  警报系统
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/devices">
                  <Monitor className="w-4 h-4 mr-2" />
                  设备监控
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/rules">
                  <Settings className="w-4 h-4 mr-2" />
                  规则配置
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <AIMetricsDashboard />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">系统概览</TabsTrigger>
            <TabsTrigger value="realtime">实时监控</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
            <TabsTrigger value="devices">设备状态</TabsTrigger>
            <TabsTrigger value="reports">报告中心</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Stats and Alerts */}
              <div className="lg:col-span-1 space-y-6">
                <StatsCards
                  activeAlerts={activeAlertsCount || 0}
                  totalLocations={locations?.length || 0}
                  recentEvents={recentEvents?.length || 0}
                />
                <RealTimeAlerts events={recentEvents || []} />

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-500" />
                      系统健康状态
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI检测引擎</span>
                      <Badge className="text-green-600 bg-green-100">正常</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">数据库连接</span>
                      <Badge className="text-green-600 bg-green-100">正常</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">摄像头网络</span>
                      <Badge className="text-yellow-600 bg-yellow-100">警告</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">存储空间</span>
                      <Badge className="text-green-600 bg-green-100">充足</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column - Real-time Map */}
              <div className="lg:col-span-1">
                <RealTimeMap locations={locations || []} events={recentEvents || []} />
              </div>

              {/* Right Column - Events List */}
              <div className="lg:col-span-1">
                <Card className="glass h-[600px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-primary" />
                      实时事件流
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <EventsList events={recentEvents || []} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-500" />
                    主监控点 - 听林园A区
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoFeedPanel communityId="tinglin" cameraId="camera-01" showControls={true} autoDetection={true} />
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-500" />
                    监控点 - 昆山杜克大学
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoFeedPanel communityId="dku" cameraId="camera-02" showControls={true} autoDetection={true} />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-full">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-sm text-muted-foreground">在线摄像头</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">156</div>
                      <div className="text-sm text-muted-foreground">今日检测次数</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">8</div>
                      <div className="text-sm text-muted-foreground">待处理违规</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-full">
                      <TrendingUp className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">94.2%</div>
                      <div className="text-sm text-muted-foreground">检测准确率</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    违规类型分布
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "垃圾分类错误", count: 45, percentage: 35 },
                      { type: "违规倾倒", count: 32, percentage: 25 },
                      { type: "垃圾桶满溢", count: 28, percentage: 22 },
                      { type: "非投放时间", count: 23, percentage: 18 },
                    ].map((item) => (
                      <div key={item.type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.type}</span>
                          <span>
                            {item.count}次 ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted/50 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    24小时违规趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "06:00-09:00", violations: 12, color: "bg-red-500" },
                      { time: "09:00-12:00", violations: 8, color: "bg-yellow-500" },
                      { time: "12:00-15:00", violations: 15, color: "bg-red-500" },
                      { time: "15:00-18:00", violations: 6, color: "bg-green-500" },
                      { time: "18:00-21:00", violations: 18, color: "bg-red-500" },
                      { time: "21:00-06:00", violations: 3, color: "bg-green-500" },
                    ].map((item) => (
                      <div key={item.time} className="flex items-center gap-4">
                        <span className="text-sm w-24">{item.time}</span>
                        <div className="flex-1 bg-muted/50 rounded-full h-3">
                          <div
                            className={`${item.color} h-3 rounded-full transition-all duration-300`}
                            style={{ width: `${(item.violations / 20) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm w-8">{item.violations}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  社区合规率排行
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "昆山杜克大学", rate: 97.1, trend: "up" },
                    { name: "万科城", rate: 94.2, trend: "up" },
                    { name: "听林园", rate: 88.5, trend: "down" },
                    { name: "花桥商务城", rate: 82.3, trend: "up" },
                    { name: "玉山新城", rate: 76.8, trend: "down" },
                    { name: "城北新区", rate: 71.2, trend: "down" },
                  ].map((community, index) => (
                    <Card
                      key={community.name}
                      className={`border-l-4 ${
                        index < 2 ? "border-l-green-500" : index < 4 ? "border-l-yellow-500" : "border-l-red-500"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{community.name}</div>
                            <div className="text-lg font-bold">{community.rate}%</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {community.trend === "up" ? (
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                            )}
                            <span className="text-xs">#{index + 1}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-green-500" />
                    摄像头状态监控
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {locations?.slice(0, 8).map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            location.camera_status === "active" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium text-sm">{location.name}</div>
                          <div className="text-xs text-muted-foreground">{location.address}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            location.camera_status === "active"
                              ? "text-green-600 bg-green-100"
                              : "text-red-600 bg-red-100"
                          }
                        >
                          {location.camera_status === "active" ? "在线" : "离线"}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(location.last_ping).toLocaleTimeString("zh-CN")}
                        </div>
                      </div>
                    </div>
                  )) || []}
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    系统配置状态
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI检测阈值</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">自动报警</span>
                      <Badge className="text-green-600 bg-green-100">启用</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">数据保留期</span>
                      <span className="text-sm font-medium">30天</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">夜间模式</span>
                      <Badge className="text-blue-600 bg-blue-100">自动</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">存储使用率</span>
                      <span className="text-sm font-medium">67%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    报告生成
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="justify-start h-12 bg-transparent">
                      <BarChart3 className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">日报告</div>
                        <div className="text-xs text-muted-foreground">今日违规统计与分析</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-12 bg-transparent">
                      <BarChart3 className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">周报告</div>
                        <div className="text-xs text-muted-foreground">本周趋势分析</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-12 bg-transparent">
                      <BarChart3 className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">月报告</div>
                        <div className="text-xs text-muted-foreground">月度综合评估</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-12 bg-transparent">
                      <BarChart3 className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">社区对比报告</div>
                        <div className="text-xs text-muted-foreground">各社区表现对比</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    历史报告
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "2024年1月月报", date: "2024-01-31", size: "2.3MB" },
                    { name: "第3周周报", date: "2024-01-21", size: "1.8MB" },
                    { name: "第2周周报", date: "2024-01-14", size: "1.9MB" },
                    { name: "第1周周报", date: "2024-01-07", size: "2.1MB" },
                    { name: "2023年12月月报", date: "2023-12-31", size: "2.5MB" },
                  ].map((report) => (
                    <div
                      key={report.name}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm">{report.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {report.date} • {report.size}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        下载
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
