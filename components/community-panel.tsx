"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  ArrowLeft,
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Bell,
  Settings,
  Eye,
  MessageSquare,
  Calendar,
  BarChart3,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { CommunityMap } from "@/components/community-map"
import { ViolationHandler } from "@/components/violation-handler"
import { CommunityStats } from "@/components/community-stats"
import { ResidentFeedback } from "@/components/resident-feedback"

interface CommunityPanelProps {
  onBackToSelector?: () => void
}

export function CommunityPanel({ onBackToSelector }: CommunityPanelProps) {
  const [selectedCommunity] = useState("玉山镇中心社区")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBackToSelector && (
                <Button variant="ghost" size="sm" onClick={onBackToSelector}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/20 neon-glow">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text">社区管理端 - {selectedCommunity}</h1>
                <p className="text-sm text-muted-foreground">精细化管理 · 实时监控 · 居民服务</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-500 border-green-500/50">
                <CheckCircle className="w-3 h-3 mr-1" />
                在线管理
              </Badge>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                通知中心
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                社区设置
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              概览
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              实时监控
            </TabsTrigger>
            <TabsTrigger value="violations" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              违规处理
            </TabsTrigger>
            <TabsTrigger value="residents" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              居民反馈
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              报告统计
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CommunityStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    社区排名状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>昆山市排名</span>
                      <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/50">第1名</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>综合评分</span>
                      <span className="text-2xl font-bold text-primary">95分</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>合规率</span>
                        <span>98%</span>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>处理效率</span>
                        <span>96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-500">
                      <TrendingUp className="w-4 h-4" />
                      <span>本月提升 +5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    今日工作概览
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">已处理违规</span>
                      </div>
                      <span className="font-semibold">8起</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">待处理违规</span>
                      </div>
                      <span className="font-semibold">2起</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">居民反馈</span>
                      </div>
                      <span className="font-semibold">5条</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">设备在线</span>
                      </div>
                      <span className="font-semibold">24/24</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <CommunityMap />
          </TabsContent>

          <TabsContent value="violations" className="space-y-6">
            <ViolationHandler />
          </TabsContent>

          <TabsContent value="residents" className="space-y-6">
            <ResidentFeedback />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  月度统计报告
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <div className="text-2xl font-bold text-green-500">98.2%</div>
                    <div className="text-sm text-muted-foreground">月度合规率</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <div className="text-2xl font-bold text-blue-500">156</div>
                    <div className="text-sm text-muted-foreground">处理事件</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <div className="text-2xl font-bold text-orange-500">2.3小时</div>
                    <div className="text-sm text-muted-foreground">平均响应时间</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-card/50">
                    <div className="text-2xl font-bold text-purple-500">4.8</div>
                    <div className="text-sm text-muted-foreground">居民满意度</div>
                  </div>
                </div>
                <Button className="w-full">生成详细报告</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
