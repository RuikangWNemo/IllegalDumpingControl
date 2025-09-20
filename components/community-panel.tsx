"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { VideoFeedPanel } from "@/components/video-feed-panel"
import { Camera, AlertTriangle, CheckCircle, Users, TrendingUp, Clock, MapPin, Send, Award, Star } from "lucide-react"

interface ViolationEvent {
  id: string
  timestamp: string
  type: string
  location: string
  confidence: number
  status: "active" | "in_progress" | "resolved"
  screenshot: string
  description: string
}

export function CommunityPanel() {
  const [activeAlert, setActiveAlert] = useState<ViolationEvent | null>(null)
  const [videoPlaying, setVideoPlaying] = useState(true)
  const [videoMuted, setVideoMuted] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [events, setEvents] = useState<ViolationEvent[]>([])
  const [stats, setStats] = useState({
    todayViolations: 0,
    weeklyCompliance: 0,
    resolutionTime: 0,
    communityPoints: 0,
  })

  useEffect(() => {
    const mockEvents: ViolationEvent[] = [
      {
        id: "1",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: "illegal_dumping",
        location: "垃圾桶A-01",
        confidence: 94,
        status: "active",
        screenshot: "/placeholder.svg?height=120&width=200&text=违规倾倒",
        description: "检测到大件垃圾违规投放",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        type: "improper_sorting",
        location: "垃圾桶B-03",
        confidence: 87,
        status: "in_progress",
        screenshot: "/placeholder.svg?height=120&width=200&text=分类错误",
        description: "湿垃圾投入干垃圾桶",
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: "illegal_dumping",
        location: "垃圾桶C-05",
        confidence: 91,
        status: "resolved",
        screenshot: "/placeholder.svg?height=120&width=200&text=已处理",
        description: "建筑垃圾违规投放 - 已清理",
      },
    ]

    setEvents(mockEvents)
    setStats({
      todayViolations: 3,
      weeklyCompliance: 92.5,
      resolutionTime: 15,
      communityPoints: 1250,
    })

    // Simulate new alert
    const alertInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const newAlert: ViolationEvent = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: "illegal_dumping",
          location: `垃圾桶${String.fromCharCode(65 + Math.floor(Math.random() * 3))}-${String(Math.floor(Math.random() * 10)).padStart(2, "0")}`,
          confidence: 85 + Math.random() * 15,
          status: "active",
          screenshot: "/placeholder.svg?height=120&width=200&text=新违规",
          description: "检测到新的违规行为",
        }
        setActiveAlert(newAlert)
        setEvents((prev) => [newAlert, ...prev.slice(0, 9)])
      }
    }, 10000)

    return () => clearInterval(alertInterval)
  }, [])

  const handleDispatchStaff = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, status: "in_progress" as const } : event)),
    )
    setActiveAlert(null)
  }

  const handleResolveEvent = (eventId: string) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, status: "resolved" as const } : event)))
    setResolutionNotes("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-red-500 bg-red-500/10 border-red-500/20"
      case "in_progress":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      case "resolved":
        return "text-green-500 bg-green-500/10 border-green-500/20"
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "待处理"
      case "in_progress":
        return "处理中"
      case "resolved":
        return "已解决"
      default:
        return "未知"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20">
                <Camera className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">听林园社区管理端</h1>
                <p className="text-sm text-muted-foreground">实时监控 · 快速响应 · 现场执行</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-blue-500 border-blue-500/50">
                <Users className="w-3 h-3 mr-1" />
                物业管理
              </Badge>
              <div className="text-right">
                <div className="text-sm font-medium">社区积分</div>
                <div className="text-lg font-bold text-blue-500">{stats.communityPoints}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Active Alert Banner */}
      {activeAlert && (
        <div className="bg-red-500 text-white p-4 animate-pulse">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <div className="font-bold">紧急违规警报！</div>
                <div className="text-sm opacity-90">
                  {activeAlert.location} - {activeAlert.description} (置信度: {activeAlert.confidence.toFixed(0)}%)
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleDispatchStaff(activeAlert.id)}>
                <Send className="w-4 h-4 mr-2" />
                派遣人员
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setActiveAlert(null)}>
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monitoring">实时监控</TabsTrigger>
            <TabsTrigger value="events">事件处理</TabsTrigger>
            <TabsTrigger value="stats">合规统计</TabsTrigger>
            <TabsTrigger value="rewards">积分奖励</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Feed */}
              <div className="lg:col-span-2">
                <VideoFeedPanel communityId="tinglin" cameraId="camera-01" showControls={true} autoDetection={true} />
              </div>

              {/* Real-time Event Cards */}
              <div className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">实时事件</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {events.slice(0, 3).map((event) => (
                      <Card key={event.id} className={`border-l-4 ${getStatusColor(event.status)}`}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge className={getStatusColor(event.status)}>{getStatusText(event.status)}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleTimeString("zh-CN")}
                              </span>
                            </div>

                            <img
                              src={event.screenshot || "/placeholder.svg"}
                              alt="事件截图"
                              className="w-full h-20 object-cover rounded"
                            />

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </div>
                              <div className="text-sm text-muted-foreground">{event.description}</div>
                              <div className="text-xs text-muted-foreground">
                                置信度: {event.confidence.toFixed(0)}%
                              </div>
                            </div>

                            {event.status === "active" && (
                              <Button size="sm" className="w-full" onClick={() => handleDispatchStaff(event.id)}>
                                <Send className="w-4 h-4 mr-2" />
                                派遣人员处理
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>待处理事件</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {events
                    .filter((e) => e.status !== "resolved")
                    .map((event) => (
                      <Card key={event.id} className={`border-l-4 ${getStatusColor(event.status)}`}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge className={getStatusColor(event.status)}>{getStatusText(event.status)}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleString("zh-CN")}
                              </span>
                            </div>

                            <div className="flex gap-3">
                              <img
                                src={event.screenshot || "/placeholder.svg"}
                                alt="事件截图"
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1 space-y-1">
                                <div className="font-medium text-sm">{event.location}</div>
                                <div className="text-sm text-muted-foreground">{event.description}</div>
                                <div className="text-xs text-muted-foreground">
                                  置信度: {event.confidence.toFixed(0)}%
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Textarea
                                placeholder="处理备注..."
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                                className="text-sm"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                {event.status === "active" && (
                                  <Button size="sm" variant="outline" onClick={() => handleDispatchStaff(event.id)}>
                                    派遣人员
                                  </Button>
                                )}
                                <Button size="sm" onClick={() => handleResolveEvent(event.id)}>
                                  标记已解决
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>已解决事件</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {events
                    .filter((e) => e.status === "resolved")
                    .map((event) => (
                      <Card key={event.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge className="text-green-500 bg-green-500/10 border-green-500/20">已解决</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleString("zh-CN")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>
                                {event.location} - {event.description}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.todayViolations}</div>
                      <div className="text-sm text-muted-foreground">今日违规</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.weeklyCompliance}%</div>
                      <div className="text-sm text-muted-foreground">周合规率</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-full">
                      <Clock className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.resolutionTime}分</div>
                      <div className="text-sm text-muted-foreground">平均处理时间</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-full">
                      <Award className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.communityPoints}</div>
                      <div className="text-sm text-muted-foreground">社区积分</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  积分奖励系统
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-yellow-500">{stats.communityPoints}</div>
                  <div className="text-muted-foreground">当前社区积分</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="font-medium text-green-600">正确分类奖励</div>
                        <div className="text-sm text-muted-foreground">每次正确分类投放 +10分</div>
                        <div className="text-lg font-bold">+50分 (本周)</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="font-medium text-blue-600">快速响应奖励</div>
                        <div className="text-sm text-muted-foreground">15分钟内处理违规 +20分</div>
                        <div className="text-lg font-bold">+60分 (本周)</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="font-medium text-purple-600">零违规奖励</div>
                        <div className="text-sm text-muted-foreground">连续7天零违规 +100分</div>
                        <div className="text-lg font-bold">进度: 3/7天</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="font-medium text-orange-600">居民教育奖励</div>
                        <div className="text-sm text-muted-foreground">成功教育违规居民 +30分</div>
                        <div className="text-lg font-bold">+90分 (本月)</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
