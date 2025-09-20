"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Camera, AlertTriangle, CheckCircle, Eye, Zap } from "lucide-react"

export function CommunityMap() {
  const locations = [
    { id: 1, name: "小区入口", status: "normal", cameras: 3, x: 20, y: 30 },
    { id: 2, name: "垃圾分类点A", status: "violation", cameras: 2, x: 40, y: 50 },
    { id: 3, name: "垃圾分类点B", status: "normal", cameras: 2, x: 60, y: 40 },
    { id: 4, name: "垃圾分类点C", status: "normal", cameras: 2, x: 30, y: 70 },
    { id: 5, name: "小区中心广场", status: "normal", cameras: 4, x: 50, y: 60 },
    { id: 6, name: "停车场", status: "warning", cameras: 3, x: 70, y: 80 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "violation":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "violation":
        return <Badge variant="destructive">违规中</Badge>
      case "warning":
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/50">警告</Badge>
      default:
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/50">正常</Badge>
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="glass h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              玉山镇中心社区实时监控地图
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative w-full h-[480px] bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-border/50 overflow-hidden">
              {/* Background map placeholder */}
              <div className="absolute inset-0 bg-[url('/kunshan-community-map.jpg')] bg-cover bg-center opacity-20"></div>

              {/* Location markers */}
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${location.x}%`, top: `${location.y}%` }}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${getStatusColor(location.status)} animate-pulse shadow-lg`}
                  ></div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    {location.name} ({location.cameras}摄像头)
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <div className="text-xs font-semibold mb-2">状态图例</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs">正常</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs">警告</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs">违规</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              监控点状态
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {locations.map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/30"
              >
                <div>
                  <div className="font-medium text-sm">{location.name}</div>
                  <div className="text-xs text-muted-foreground">{location.cameras}个摄像头</div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(location.status)}
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              快速操作
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full bg-transparent" variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" />
              查看所有违规
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              设备健康检查
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              <CheckCircle className="w-4 h-4 mr-2" />
              生成巡检报告
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
