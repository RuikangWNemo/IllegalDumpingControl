"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { RealTimeMap } from "@/components/real-time-map"
import { CommunityPanel } from "@/components/community-panel"
import { GovernmentPanel } from "@/components/government-panel"
import { VideoFeedPanel } from "@/components/video-feed-panel"

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: "government" | "community"
  organization: string
}

interface EnhancedMonitoringDashboardProps {
  userProfile: UserProfile
}

export function EnhancedMonitoringDashboard({ userProfile }: EnhancedMonitoringDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI智能垃圾监管系统</h1>
                <p className="text-sm text-gray-600">{userProfile.organization}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={userProfile.role === "government" ? "default" : "secondary"}>
                {userProfile.role === "government" ? "政府监管" : "社区管理"}
              </Badge>
              <span className="text-sm text-gray-700">{userProfile.full_name}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="map">实时地图</TabsTrigger>
            <TabsTrigger value="video">视频监控</TabsTrigger>
            <TabsTrigger value="management">{userProfile.role === "government" ? "监管面板" : "社区管理"}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">今日检测事件</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs opacity-75">比昨日 +12%</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">处理完成</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98</div>
                  <p className="text-xs opacity-75">处理率 77%</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">待处理</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">29</div>
                  <p className="text-xs opacity-75">平均响应 15分钟</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">活跃摄像头</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45/48</div>
                  <p className="text-xs opacity-75">在线率 94%</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>系统性能概览</CardTitle>
                  <CardDescription>实时监控系统各项指标</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI检测准确率</span>
                      <span>94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>响应时间</span>
                      <span>12.3秒</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>系统可用性</span>
                      <span>99.8%</span>
                    </div>
                    <Progress value={99.8} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>最近事件</CardTitle>
                  <CardDescription>最新的垃圾检测和处理事件</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "14:32", location: "昆山市区-建设路", type: "乱扔垃圾", status: "已处理" },
                      { time: "14:28", location: "昆山市区-人民路", type: "垃圾桶满溢", status: "处理中" },
                      { time: "14:25", location: "昆山市区-中山路", type: "分类错误", status: "已处理" },
                      { time: "14:20", location: "昆山市区-解放路", type: "乱扔垃圾", status: "待处理" },
                    ].map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{event.location}</span>
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                        </div>
                        <Badge
                          variant={
                            event.status === "已处理"
                              ? "default"
                              : event.status === "处理中"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map">
            <RealTimeMap userRole={userProfile.role} />
          </TabsContent>

          <TabsContent value="video">
            <VideoFeedPanel userRole={userProfile.role} />
          </TabsContent>

          <TabsContent value="management">
            {userProfile.role === "government" ? <GovernmentPanel /> : <CommunityPanel />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
