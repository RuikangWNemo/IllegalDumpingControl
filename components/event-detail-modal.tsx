"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, MapPin, Clock, Camera, Database } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

interface EventDetailModalProps {
  event: any
  isOpen: boolean
  onClose: () => void
}

export function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!event) return null

  const dataSource = event.metadata?.data_source || (event.id.startsWith("sim_") ? "模拟" : "实时")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            事件详情 - {event.location_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Section */}
          <div className="space-y-4">
            <Card className="glass">
              <CardContent className="p-4">
                <div className="aspect-video bg-background/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-primary" />
                      ) : (
                        <Play className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">边缘设备匿名化视频片段</p>
                    <p className="text-xs text-muted-foreground">时长: {event.metadata?.video_duration || 12}秒</p>
                  </div>
                  <Button
                    className="absolute inset-0 w-full h-full bg-transparent hover:bg-primary/10 border-0"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <span className="sr-only">{isPlaying ? "暂停视频" : "播放视频"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Snapshot */}
            <Card className="glass">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">事件快照</h3>
                <div className="aspect-video bg-background/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">AI检测快照 (已脱敏处理)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <Card className="glass">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">基本信息</h3>
                  <Badge variant={dataSource === "实时" ? "default" : dataSource === "回放" ? "secondary" : "outline"}>
                    <Database className="w-3 h-3 mr-1" />
                    {dataSource}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">事件类型</p>
                    <p className="font-medium">非法倾倒</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">置信度</p>
                    <p className="font-medium">{(event.confidence_score * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">检测时间</p>
                    <p className="font-medium">
                      {formatDistanceToNow(new Date(event.detected_at), {
                        addSuffix: true,
                        locale: zhCN,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">最后更新</p>
                    <p className="font-medium">{new Date().toLocaleTimeString("zh-CN", { hour12: false })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{event.location_name}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(event.detected_at).toLocaleString("zh-CN")}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">检测详情</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">检测对象</span>
                    <span>{event.metadata?.detected_objects?.join(", ") || "塑料袋, 纸箱"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">人员数量</span>
                    <span>{event.metadata?.person_count || 1}人</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">设备ID</span>
                    <span>CAM-{event.location_id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
