"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Star, Clock, User, Phone, Mail } from "lucide-react"

const feedbackData = [
  {
    id: "F001",
    resident: "王女士",
    contact: "138****5678",
    type: "complaint",
    subject: "垃圾分类点异味问题",
    content: "小区垃圾分类点经常有异味，希望能够加强清理频次。",
    time: "2024-01-15 16:20",
    status: "pending",
    priority: "medium",
    rating: null,
  },
  {
    id: "F002",
    resident: "李先生",
    contact: "139****1234",
    type: "suggestion",
    subject: "增加垃圾分类指导标识",
    content: "建议在垃圾分类点增加更清晰的分类指导标识，方便老年人识别。",
    time: "2024-01-15 14:15",
    status: "resolved",
    priority: "low",
    rating: 5,
  },
  {
    id: "F003",
    resident: "张阿姨",
    contact: "137****9876",
    type: "praise",
    subject: "表扬管理员服务",
    content: "小区垃圾分类管理很好，管理员态度也很好，为社区点赞！",
    time: "2024-01-15 10:30",
    status: "resolved",
    priority: "low",
    rating: 5,
  },
]

export function ResidentFeedback() {
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "complaint":
        return "投诉"
      case "suggestion":
        return "建议"
      case "praise":
        return "表扬"
      default:
        return "其他"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "complaint":
        return "text-red-500"
      case "suggestion":
        return "text-blue-500"
      case "praise":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">居民反馈中心</h2>
          <p className="text-muted-foreground">收集和处理居民对垃圾分类的意见建议</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Phone className="w-4 h-4 mr-2" />
            电话回访
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            发送通知
          </Button>
        </div>
      </div>

      {/* Feedback Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">5</div>
            <div className="text-sm text-muted-foreground">本月反馈</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">1</div>
            <div className="text-sm text-muted-foreground">待处理投诉</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">4.8</div>
            <div className="text-sm text-muted-foreground">平均满意度</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">2小时</div>
            <div className="text-sm text-muted-foreground">平均响应时间</div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedbackData.map((feedback) => (
          <Card key={feedback.id} className="glass">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className={`w-5 h-5 ${getTypeColor(feedback.type)}`} />
                      <span className="font-semibold">{feedback.id}</span>
                    </div>
                    {getStatusBadge(feedback.status)}
                    <Badge variant="outline" className={getTypeColor(feedback.type)}>
                      {getTypeLabel(feedback.type)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{feedback.resident}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{feedback.contact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{feedback.time}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">主题: </span>
                        <span className="font-medium">{feedback.subject}</span>
                      </div>
                      {feedback.rating && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">满意度: </span>
                          {renderStars(feedback.rating)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{feedback.content}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    回复
                  </Button>
                  {feedback.status === "pending" && <Button size="sm">开始处理</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
