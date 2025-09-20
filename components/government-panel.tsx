"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VideoFeedPanel } from "@/components/video-feed-panel"
import {
  Shield,
  TrendingUp,
  TrendingDown,
  MapPin,
  FileText,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Users,
  Building2,
  Clock,
  Award,
  Activity,
  Monitor,
} from "lucide-react"
import { RealTimeMap } from "@/components/real-time-map"

interface CommunityData {
  id: string
  name: string
  violations: number
  compliance: number
  population: number
  bins: number
  trend: "up" | "down" | "stable"
  lastInspection: string
  status: "excellent" | "good" | "warning" | "critical"
}

interface CityStats {
  totalCommunities: number
  totalViolations: number
  averageCompliance: number
  topPerformer: string
  needsAttention: string
}

export function GovernmentPanel() {
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("week")
  const [communities, setCommunities] = useState<CommunityData[]>([])
  const [cityStats, setCityStats] = useState<CityStats>({
    totalCommunities: 0,
    totalViolations: 0,
    averageCompliance: 0,
    topPerformer: "",
    needsAttention: "",
  })

  useEffect(() => {
    const mockCommunities: CommunityData[] = [
      {
        id: "1",
        name: "听林园",
        violations: 12,
        compliance: 88.5,
        population: 2400,
        bins: 8,
        trend: "down",
        lastInspection: "2024-01-15",
        status: "good",
      },
      {
        id: "2",
        name: "万科城",
        violations: 8,
        compliance: 94.2,
        population: 3200,
        bins: 12,
        trend: "up",
        lastInspection: "2024-01-14",
        status: "excellent",
      },
      {
        id: "3",
        name: "玉山新城",
        violations: 25,
        compliance: 76.8,
        population: 4100,
        bins: 15,
        trend: "down",
        lastInspection: "2024-01-13",
        status: "warning",
      },
      {
        id: "4",
        name: "昆山杜克大学",
        violations: 3,
        compliance: 97.1,
        population: 1800,
        bins: 6,
        trend: "stable",
        lastInspection: "2024-01-16",
        status: "excellent",
      },
      {
        id: "5",
        name: "花桥商务城",
        violations: 18,
        compliance: 82.3,
        population: 5600,
        bins: 20,
        trend: "up",
        lastInspection: "2024-01-12",
        status: "good",
      },
      {
        id: "6",
        name: "城北新区",
        violations: 31,
        compliance: 71.2,
        population: 4800,
        bins: 18,
        trend: "down",
        lastInspection: "2024-01-11",
        status: "critical",
      },
    ]

    setCommunities(mockCommunities)
    setCityStats({
      totalCommunities: mockCommunities.length,
      totalViolations: mockCommunities.reduce((sum, c) => sum + c.violations, 0),
      averageCompliance: mockCommunities.reduce((sum, c) => sum + c.compliance, 0) / mockCommunities.length,
      topPerformer: mockCommunities.sort((a, b) => b.compliance - a.compliance)[0].name,
      needsAttention: mockCommunities.sort((a, b) => a.compliance - b.compliance)[0].name,
    })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-100 border-green-200"
      case "good":
        return "text-blue-600 bg-blue-100 border-blue-200"
      case "warning":
        return "text-yellow-600 bg-yellow-100 border-yellow-200"
      case "critical":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "优秀"
      case "good":
        return "良好"
      case "warning":
        return "警告"
      case "critical":
        return "严重"
      default:
        return "未知"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  const generateReport = () => {
    // Simulate report generation
    const reportData = {
      timestamp: new Date().toISOString(),
      communities: communities.length,
      totalViolations: cityStats.totalViolations,
      averageCompliance: cityStats.averageCompliance.toFixed(1),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `昆山市垃圾监管报告_${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const drillDownToCommunity = (communityId: string) => {
    setSelectedCommunity(communityId)
    if (selectedCommunity === communityId) {
      setSelectedCommunity(null)
    }
  }

  const systemSuggestions = [
    {
      type: "schedule",
      title: "延长投放时间",
      description: "建议城北新区延长垃圾投放时间至晚上10点",
      priority: "high",
      communities: ["城北新区"],
    },
    {
      type: "infrastructure",
      title: "增加照明设施",
      description: "玉山新城高违规点位建议增加夜间照明",
      priority: "medium",
      communities: ["玉山新城"],
    },
    {
      type: "education",
      title: "加强宣传教育",
      description: "针对老年人群体加强垃圾分类宣传",
      priority: "medium",
      communities: ["听林园", "城北新区"],
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">昆山市政府监管端</h1>
                <p className="text-sm text-muted-foreground">宏观监督 · 数据分析 · 政策支持</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-purple-500 border-purple-500/50">
                <Building2 className="w-3 h-3 mr-1" />
                政府监管
              </Badge>
              <Badge variant="outline" className="text-green-500 border-green-500/50">
                <Activity className="w-3 h-3 mr-1" />
                全市系统正常
              </Badge>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">今日</SelectItem>
                  <SelectItem value="week">本周</SelectItem>
                  <SelectItem value="month">本月</SelectItem>
                  <SelectItem value="quarter">本季度</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={generateReport}>
                <Download className="w-4 h-4 mr-2" />
                导出报告
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">城市概览</TabsTrigger>
            <TabsTrigger value="communities">社区排名</TabsTrigger>
            <TabsTrigger value="trends">趋势分析</TabsTrigger>
            <TabsTrigger value="monitoring">实时监控</TabsTrigger>
            <TabsTrigger value="suggestions">系统建议</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* City-wide Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-full">
                      <Building2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{cityStats.totalCommunities}</div>
                      <div className="text-sm text-muted-foreground">监管社区</div>
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
                      <div className="text-2xl font-bold">{cityStats.totalViolations}</div>
                      <div className="text-sm text-muted-foreground">总违规数</div>
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
                      <div className="text-2xl font-bold">{cityStats.averageCompliance.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">平均合规率</div>
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
                      <div className="text-lg font-bold">{cityStats.topPerformer}</div>
                      <div className="text-sm text-muted-foreground">最佳社区</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* City-wide Heatmap */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  昆山市垃圾监管全景图
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RealTimeMap
                  locations={communities.map((c) => ({
                    id: c.id,
                    name: c.name,
                    address: `${c.name}社区`,
                    coordinates: { lat: 31.2304 + Math.random() * 0.02, lng: 120.975 + Math.random() * 0.03 },
                    camera_status: "active",
                    last_ping: new Date().toISOString(),
                    community: c.name,
                  }))}
                  events={[]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performers */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-green-600">优秀社区 (合规率 ≥ 90%)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {communities
                    .filter((c) => c.compliance >= 90)
                    .sort((a, b) => b.compliance - a.compliance)
                    .map((community, index) => (
                      <Card key={community.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                <span className="font-medium">{community.name}</span>
                                {getTrendIcon(community.trend)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                人口: {community.population.toLocaleString()} | 垃圾桶: {community.bins}个
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="text-lg font-bold text-green-600">{community.compliance.toFixed(1)}%</div>
                              <div className="text-sm text-muted-foreground">{community.violations}次违规</div>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => drillDownToCommunity(community.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              查看详情
                            </Button>
                          </div>

                          {selectedCommunity === community.id && (
                            <div className="mt-4 border-t pt-4">
                              <VideoFeedPanel
                                communityId={community.id}
                                cameraId="camera-01"
                                showControls={false}
                                autoDetection={true}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </CardContent>
              </Card>

              {/* Need Attention */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-red-600">重点关注社区 (合规率 &lt; 85%)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {communities
                    .filter((c) => c.compliance < 85)
                    .sort((a, b) => a.compliance - b.compliance)
                    .map((community, index) => (
                      <Card key={community.id} className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  !
                                </div>
                                <span className="font-medium">{community.name}</span>
                                {getTrendIcon(community.trend)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                人口: {community.population.toLocaleString()} | 垃圾桶: {community.bins}个
                              </div>
                              <Badge className={getStatusColor(community.status)}>
                                {getStatusText(community.status)}
                              </Badge>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="text-lg font-bold text-red-600">{community.compliance.toFixed(1)}%</div>
                              <div className="text-sm text-muted-foreground">{community.violations}次违规</div>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => drillDownToCommunity(community.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              深入调查
                            </Button>
                          </div>

                          {selectedCommunity === community.id && (
                            <div className="mt-4 border-t pt-4">
                              <VideoFeedPanel
                                communityId={community.id}
                                cameraId="camera-01"
                                showControls={false}
                                autoDetection={true}
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    月度违规趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["1月", "2月", "3月", "4月", "5月", "6月"].map((month, index) => {
                      const violations = Math.floor(Math.random() * 50) + 20
                      const maxViolations = 70
                      const percentage = (violations / maxViolations) * 100

                      return (
                        <div key={month} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{month}</span>
                            <span>{violations}次</span>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    合规率变化
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {communities.slice(0, 6).map((community) => {
                      const change = (Math.random() - 0.5) * 10
                      const isPositive = change > 0

                      return (
                        <div
                          key={community.id}
                          className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm">{community.name}</span>
                            <Badge className={getStatusColor(community.status)}>
                              {getStatusText(community.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{community.compliance.toFixed(1)}%</span>
                            <div
                              className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}
                            >
                              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {Math.abs(change).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-blue-500" />
                    重点社区监控
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoFeedPanel
                    communityId="tinglin"
                    cameraId="camera-01"
                    showControls={false}
                    autoDetection={true}
                  />
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    系统运行状态
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-500">24/24</div>
                      <div className="text-sm text-muted-foreground">摄像头在线</div>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">99.8%</div>
                      <div className="text-sm text-muted-foreground">系统可用性</div>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-500">156</div>
                      <div className="text-sm text-muted-foreground">今日检测</div>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-500">94.2%</div>
                      <div className="text-sm text-muted-foreground">AI准确率</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  全市实时警报
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { community: "城北新区", type: "违规倾倒", time: "2分钟前", severity: "high" },
                    { community: "玉山新城", type: "垃圾桶满溢", time: "5分钟前", severity: "medium" },
                    { community: "听林园", type: "分类错误", time: "8分钟前", severity: "low" },
                    { community: "花桥商务城", type: "非投放时间", time: "12分钟前", severity: "medium" },
                  ].map((alert, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                        alert.severity === "high"
                          ? "border-l-red-500 bg-red-50/50"
                          : alert.severity === "medium"
                            ? "border-l-yellow-500 bg-yellow-50/50"
                            : "border-l-blue-500 bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle
                          className={`w-4 h-4 ${
                            alert.severity === "high"
                              ? "text-red-500"
                              : alert.severity === "medium"
                                ? "text-yellow-500"
                                : "text-blue-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium text-sm">{alert.community}</div>
                          <div className="text-xs text-muted-foreground">{alert.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{alert.time}</div>
                        <Badge
                          className={
                            alert.severity === "high"
                              ? "text-red-600 bg-red-100"
                              : alert.severity === "medium"
                                ? "text-yellow-600 bg-yellow-100"
                                : "text-blue-600 bg-blue-100"
                          }
                        >
                          {alert.severity === "high" ? "紧急" : alert.severity === "medium" ? "中等" : "一般"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  AI系统建议
                </CardTitle>
                <p className="text-sm text-muted-foreground">基于数据分析的智能建议，帮助提升城市垃圾管理效率</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemSuggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className={`border-l-4 ${
                      suggestion.priority === "high"
                        ? "border-l-red-500"
                        : suggestion.priority === "medium"
                          ? "border-l-yellow-500"
                          : "border-l-blue-500"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <Badge
                            variant={
                              suggestion.priority === "high"
                                ? "destructive"
                                : suggestion.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {suggestion.priority === "high"
                              ? "高优先级"
                              : suggestion.priority === "medium"
                                ? "中优先级"
                                : "低优先级"}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">{suggestion.description}</p>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">涉及社区:</span>
                          {suggestion.communities.map((community) => (
                            <Badge key={community} variant="outline" className="text-xs">
                              {community}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            查看详情
                          </Button>
                          <Button size="sm">采纳建议</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <FileText className="w-6 h-6" />
                    <span>生成月度报告</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Users className="w-6 h-6" />
                    <span>社区排名分析</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Clock className="w-6 h-6" />
                    <span>预约实地检查</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
