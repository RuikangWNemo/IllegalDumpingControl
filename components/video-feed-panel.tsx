"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Camera,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Zap,
  AlertTriangle,
  Eye,
  Settings,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface DetectionBox {
  id: string
  x: number
  y: number
  width: number
  height: number
  label: string
  confidence: number
  color: string
}

interface VideoFeedProps {
  communityId?: string
  cameraId?: string
  showControls?: boolean
  autoDetection?: boolean
}

export function VideoFeedPanel({
  communityId = "tinglin",
  cameraId = "camera-01",
  showControls = true,
  autoDetection = true,
}: VideoFeedProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState(cameraId)
  const [detectionBoxes, setDetectionBoxes] = useState<DetectionBox[]>([])
  const [detectionEnabled, setDetectionEnabled] = useState(autoDetection)
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.8])
  const [recordingStatus, setRecordingStatus] = useState<"idle" | "recording" | "processing">("idle")
  const videoRef = useRef<HTMLDivElement>(null)

  const cameras = [
    { id: "camera-01", name: "垃圾桶A-01", location: "小区入口", status: "online" },
    { id: "camera-02", name: "垃圾桶A-02", location: "中心广场", status: "online" },
    { id: "camera-03", name: "垃圾桶B-01", location: "停车场", status: "offline" },
    { id: "camera-04", name: "垃圾桶B-02", location: "儿童游乐区", status: "online" },
  ]

  useEffect(() => {
    if (!detectionEnabled) {
      setDetectionBoxes([])
      return
    }

    const detectionInterval = setInterval(() => {
      const newDetections: DetectionBox[] = []

      // Simulate person detection
      if (Math.random() < 0.7) {
        newDetections.push({
          id: "person-1",
          x: 20 + Math.random() * 40,
          y: 25 + Math.random() * 30,
          width: 15 + Math.random() * 10,
          height: 25 + Math.random() * 15,
          label: "Person",
          confidence: 0.85 + Math.random() * 0.14,
          color: "#22c55e",
        })
      }

      // Simulate bag detection
      if (Math.random() < 0.5) {
        newDetections.push({
          id: "bag-1",
          x: 45 + Math.random() * 30,
          y: 40 + Math.random() * 20,
          width: 8 + Math.random() * 6,
          height: 10 + Math.random() * 8,
          label: "Bag",
          confidence: 0.75 + Math.random() * 0.24,
          color: "#3b82f6",
        })
      }

      // Simulate violation detection
      if (Math.random() < 0.2) {
        newDetections.push({
          id: "violation-1",
          x: 30 + Math.random() * 40,
          y: 50 + Math.random() * 30,
          width: 20 + Math.random() * 15,
          height: 15 + Math.random() * 10,
          label: "Illegal Dumping",
          confidence: 0.88 + Math.random() * 0.11,
          color: "#ef4444",
        })

        // Trigger recording when violation detected
        setRecordingStatus("recording")
        setTimeout(() => setRecordingStatus("processing"), 2000)
        setTimeout(() => setRecordingStatus("idle"), 5000)
      }

      // Filter by confidence threshold
      const filteredDetections = newDetections.filter((d) => d.confidence >= confidenceThreshold[0])
      setDetectionBoxes(filteredDetections)
    }, 2000)

    return () => clearInterval(detectionInterval)
  }, [detectionEnabled, confidenceThreshold])

  const currentCamera = cameras.find((c) => c.id === selectedCamera)

  return (
    <div className="space-y-4">
      {/* Camera Selection and Controls */}
      {showControls && (
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cameras.map((camera) => (
                      <SelectItem key={camera.id} value={camera.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              camera.status === "online" ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {camera.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Badge variant={currentCamera?.status === "online" ? "default" : "destructive"}>
                  {currentCamera?.status === "online" ? "在线" : "离线"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="ghost">
                  <Maximize className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Feed with Detection Overlays */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              {currentCamera?.name || "实时监控"}
              {recordingStatus === "recording" && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2" />
                  录制中
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={detectionEnabled ? "default" : "outline"}
                onClick={() => setDetectionEnabled(!detectionEnabled)}
              >
                <Eye className="w-4 h-4 mr-2" />
                AI检测
              </Button>
              <Button size="sm" variant="ghost">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={videoRef} className="relative h-[500px] bg-black rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
              <img
                src="/placeholder.svg?height=500&width=800&text=实时监控画面"
                alt="监控画面"
                className="w-full h-full object-cover opacity-80"
              />
            </div>

            {detectionEnabled &&
              detectionBoxes.map((detection) => (
                <div
                  key={detection.id}
                  className="absolute border-2 rounded transition-all duration-300"
                  style={{
                    left: `${detection.x}%`,
                    top: `${detection.y}%`,
                    width: `${detection.width}%`,
                    height: `${detection.height}%`,
                    borderColor: detection.color,
                    boxShadow: `0 0 10px ${detection.color}50`,
                  }}
                >
                  <div
                    className="absolute -top-8 left-0 px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: detection.color }}
                  >
                    {detection.label} {(detection.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              ))}

            {/* Video Status Overlays */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 px-3 py-2 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">LIVE</span>
              {detectionEnabled && (
                <Badge className="ml-2 bg-blue-500/80 text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  AI检测
                </Badge>
              )}
            </div>

            <div className="absolute top-4 right-4 bg-black/70 px-3 py-2 rounded text-white text-sm">
              {currentCamera?.location || "监控点位"}
            </div>

            <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded text-white text-sm">
              {new Date().toLocaleString("zh-CN")}
            </div>

            {/* Detection Count */}
            {detectionEnabled && detectionBoxes.length > 0 && (
              <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-2 rounded text-white text-sm">
                检测到 {detectionBoxes.length} 个对象
              </div>
            )}

            {/* Violation Alert */}
            {detectionBoxes.some((d) => d.label.includes("Violation") || d.label.includes("Illegal")) && (
              <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2">
                <div className="bg-red-500/90 text-white p-4 rounded-lg flex items-center gap-3 animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                  <div>
                    <div className="font-bold">违规行为检测！</div>
                    <div className="text-sm opacity-90">检测到非法倾倒行为，正在自动录制证据</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detection Settings */}
      {showControls && detectionEnabled && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">AI检测设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">置信度阈值</label>
                <span className="text-sm text-muted-foreground">{(confidenceThreshold[0] * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={confidenceThreshold}
                onValueChange={setConfidenceThreshold}
                max={1}
                min={0.5}
                step={0.05}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">只显示置信度高于此阈值的检测结果</div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium">检测类型</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span>人员检测</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span>物品检测</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    <span>违规行为</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-medium">录制状态</div>
                <Badge
                  variant={
                    recordingStatus === "recording"
                      ? "destructive"
                      : recordingStatus === "processing"
                        ? "default"
                        : "outline"
                  }
                >
                  {recordingStatus === "recording" ? "录制中" : recordingStatus === "processing" ? "处理中" : "待机"}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="font-medium">存储空间</div>
                <div className="text-muted-foreground">已用: 2.3GB / 10GB</div>
                <div className="w-full bg-muted/50 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-[23%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
