"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Clock, CheckCircle, Eye, MessageSquare, Camera, MapPin, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const violationData = [
  {
    id: "V001",
    type: "illegal_dumping",
    location: "玉山镇中心社区-垃圾分类点A",
    time: "2024-01-15 14:30",
    status: "pending",
    priority: "high",
    confidence: 95,
    description: "检测到非法倾倒建筑垃圾",
    reporter: "AI系统自动检测",
    assignee: "张管理员",
    estimatedTime: "30分钟",
  },
  {
    id: "V002",
    type: "wrong_sorting",
    location: "玉山镇中心社区-垃圾分类点B",
    time: "2024-01-15 13:45",
    status: "processing",
    priority: "medium",
    confidence: 87,
    description: "居民垃圾分类错误",
    reporter: "居民举报",
    assignee: "李管理员",
    estimatedTime: "15分钟",
  },
  {
    id: "V003",
    type: "overflow",
    location: "玉山镇中心社区-垃圾分类点C",
    time: "2024-01-15 12:20",
    status: "resolved",
    priority: "low",
    confidence: 92,
    description: "垃圾桶溢出需要清理",
    reporter: "定时巡检",
    assignee: "王管理员",
    estimatedTime: "已完成",
  },
]

export function ViolationHandler() {
  const [selectedViolation, setSelectedViolation] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive">待处理</Badge>
      case "processing":
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/50">处理中</Badge>
      case "resolved":
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/50">已解决</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "illegal_dumping":
        return "非法倾倒"
      case "wrong_sorting":
        return "分类错误"
      case "overflow":
        return "垃圾溢出"
      default:
        return "其他违规"
    }
  }

  const filteredViolations = filter === "all" ? violationData : violationData.filter((v) => v.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">违规处理中心</h2>
          <p className="text-muted-foreground">实时处理社区垃圾分类违规事件</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Camera className="w-4 h-4 mr-2" />
            查看监控
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            通知居民
          </Button>
        </div>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">全部 ({violationData.length})</TabsTrigger>
          <TabsTrigger value="pending">
            待处理 ({violationData.filter((v) => v.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="processing">
            处理中 ({violationData.filter((v) => v.status === "processing").length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            已解决 ({violationData.filter((v) => v.status === "resolved").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredViolations.map((violation) => (
            <Card key={violation.id} className="glass">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-5 h-5 ${getPriorityColor(violation.priority)}`} />
                        <span className="font-semibold">{violation.id}</span>
                      </div>
                      {getStatusBadge(violation.status)}
                      <Badge variant="outline">{getTypeLabel(violation.type)}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{violation.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{violation.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>负责人: {violation.assignee}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">置信度: </span>
                          <span className="font-medium">{violation.confidence}%</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">预计处理时间: </span>
                          <span className="font-medium">{violation.estimatedTime}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">上报方式: </span>
                          <span className="font-medium">{violation.reporter}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{violation.description}</p>
                    </div>

                    {violation.status === "processing" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>处理进度</span>
                          <span>65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      查看详情
                    </Button>
                    {violation.status === "pending" && (
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        开始处理
                      </Button>
                    )}
                    {violation.status === "processing" && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        标记完成
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">2</div>
            <div className="text-sm text-muted-foreground">待处理违规</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">1</div>
            <div className="text-sm text-muted-foreground">处理中</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">8</div>
            <div className="text-sm text-muted-foreground">今日已解决</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">2.3小时</div>
            <div className="text-sm text-muted-foreground">平均处理时间</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
