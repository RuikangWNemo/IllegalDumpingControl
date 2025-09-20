"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Monitor,
  Wifi,
  Thermometer,
  Zap,
  Camera,
  HardDrive,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

interface EdgeDevice {
  id: string
  name: string
  location: string
  status: "online" | "offline" | "warning"
  lastPing: string
  fps: number
  temperature: number
  voltage: number
  networkSignal: number
  cpuUsage: number
  memoryUsage: number
  storageUsage: number
  mtbf: number // Mean Time Between Failures (hours)
  avgRecoveryTime: number // Average recovery time (minutes)
  totalUptime: number // Total uptime percentage
  lastFailure: string
  failureCount: number
}

export function DeviceHealthPanel() {
  const [devices, setDevices] = useState<EdgeDevice[]>([
    {
      id: "CAM-001",
      name: "社区垃圾站A摄像头",
      location: "社区垃圾站A",
      status: "online",
      lastPing: new Date().toISOString(),
      fps: 25,
      temperature: 42,
      voltage: 12.1,
      networkSignal: 85,
      cpuUsage: 45,
      memoryUsage: 62,
      storageUsage: 78,
      mtbf: 720,
      avgRecoveryTime: 3.5,
      totalUptime: 99.2,
      lastFailure: "2024-12-15T10:30:00Z",
      failureCount: 2,
    },
    {
      id: "CAM-002",
      name: "社区垃圾站B摄像头",
      location: "社区垃圾站B",
      status: "warning",
      lastPing: new Date(Date.now() - 300000).toISOString(),
      fps: 22,
      temperature: 58,
      voltage: 11.8,
      networkSignal: 72,
      cpuUsage: 78,
      memoryUsage: 85,
      storageUsage: 92,
      mtbf: 480,
      avgRecoveryTime: 8.2,
      totalUptime: 96.8,
      lastFailure: "2024-12-18T14:20:00Z",
      failureCount: 5,
    },
    {
      id: "CAM-003",
      name: "社区垃圾站C摄像头",
      location: "社区垃圾站C",
      status: "offline",
      lastPing: new Date(Date.now() - 1800000).toISOString(),
      fps: 0,
      temperature: 0,
      voltage: 0,
      networkSignal: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      storageUsage: 0,
      mtbf: 360,
      avgRecoveryTime: 15.7,
      totalUptime: 94.1,
      lastFailure: new Date(Date.now() - 1800000).toISOString(),
      failureCount: 8,
    },
    {
      id: "CAM-004",
      name: "社区垃圾站D摄像头",
      location: "社区垃圾站D",
      status: "online",
      lastPing: new Date().toISOString(),
      fps: 30,
      temperature: 38,
      voltage: 12.3,
      networkSignal: 92,
      cpuUsage: 35,
      memoryUsage: 48,
      storageUsage: 65,
      mtbf: 1200,
      avgRecoveryTime: 2.1,
      totalUptime: 99.8,
      lastFailure: "2024-11-28T09:15:00Z",
      failureCount: 1,
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prev) =>
        prev.map((device) => {
          if (device.status === "offline") return device

          return {
            ...device,
            lastPing: new Date().toISOString(),
            fps: device.status === "online" ? Math.max(20, device.fps + (Math.random() - 0.5) * 5) : device.fps,
            temperature: Math.max(30, Math.min(70, device.temperature + (Math.random() - 0.5) * 3)),
            voltage: Math.max(10, Math.min(13, device.voltage + (Math.random() - 0.5) * 0.2)),
            networkSignal: Math.max(0, Math.min(100, device.networkSignal + (Math.random() - 0.5) * 10)),
            cpuUsage: Math.max(0, Math.min(100, device.cpuUsage + (Math.random() - 0.5) * 10)),
            memoryUsage: Math.max(0, Math.min(100, device.memoryUsage + (Math.random() - 0.5) * 5)),
          }
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "offline":
        return "text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return { variant: "default" as const, text: "在线", icon: CheckCircle }
      case "warning":
        return { variant: "secondary" as const, text: "警告", icon: AlertTriangle }
      case "offline":
        return { variant: "destructive" as const, text: "离线", icon: AlertTriangle }
      default:
        return { variant: "outline" as const, text: "未知", icon: Clock }
    }
  }

  const getHealthScore = (device: EdgeDevice) => {
    if (device.status === "offline") return 0
    const factors = [
      device.totalUptime,
      100 - (device.temperature / 70) * 100,
      (device.voltage / 12.5) * 100,
      device.networkSignal,
      100 - device.cpuUsage,
      100 - device.memoryUsage,
      100 - device.storageUsage,
    ]
    return Math.round(factors.reduce((sum, factor) => sum + factor, 0) / factors.length)
  }

  const onlineDevices = devices.filter((d) => d.status === "online").length
  const warningDevices = devices.filter((d) => d.status === "warning").length
  const offlineDevices = devices.filter((d) => d.status === "offline").length
  const avgUptime = devices.reduce((sum, d) => sum + d.totalUptime, 0) / devices.length

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">在线设备</p>
                <p className="text-3xl font-bold text-green-400">{onlineDevices}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-400/10">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">警告设备</p>
                <p className="text-3xl font-bold text-yellow-400">{warningDevices}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-400/10">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">离线设备</p>
                <p className="text-3xl font-bold text-red-400">{offlineDevices}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-400/10">
                <Monitor className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">平均正常运行时间</p>
                <p className="text-3xl font-bold text-primary">{avgUptime.toFixed(1)}%</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Activity className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devices">设备状态</TabsTrigger>
          <TabsTrigger value="performance">性能指标</TabsTrigger>
          <TabsTrigger value="reliability">可靠性分析</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {devices.map((device) => {
              const statusBadge = getStatusBadge(device.status)
              const StatusIcon = statusBadge.icon
              const healthScore = getHealthScore(device)

              return (
                <Card key={device.id} className="glass border-l-4 border-l-primary/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{device.location}</p>
                      </div>
                      <Badge variant={statusBadge.variant}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusBadge.text}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Health Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">设备健康度</span>
                        <span className={`text-sm font-bold ${getStatusColor(device.status)}`}>{healthScore}%</span>
                      </div>
                      <Progress value={healthScore} className="h-2" />
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-muted-foreground" />
                        <span>FPS: {device.fps}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-muted-foreground" />
                        <span>温度: {device.temperature}°C</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <span>电压: {device.voltage}V</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-muted-foreground" />
                        <span>信号: {device.networkSignal}%</span>
                      </div>
                    </div>

                    {/* Resource Usage */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            CPU使用率
                          </span>
                          <span>{device.cpuUsage}%</span>
                        </div>
                        <Progress value={device.cpuUsage} className="h-1" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            内存使用率
                          </span>
                          <span>{device.memoryUsage}%</span>
                        </div>
                        <Progress value={device.memoryUsage} className="h-1" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            存储使用率
                          </span>
                          <span>{device.storageUsage}%</span>
                        </div>
                        <Progress value={device.storageUsage} className="h-1" />
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      最后心跳: {new Date(device.lastPing).toLocaleString("zh-CN")}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {devices.map((device) => (
              <Card key={device.id} className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">{device.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">视频性能</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">帧率</span>
                          <span>{device.fps} FPS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">分辨率</span>
                          <span>1920x1080</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">环境监控</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">温度</span>
                          <span className={device.temperature > 60 ? "text-red-400" : ""}>{device.temperature}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">湿度</span>
                          <span>45%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">电源状态</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">电压</span>
                          <span className={device.voltage < 11.5 ? "text-red-400" : ""}>{device.voltage}V</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">功耗</span>
                          <span>12W</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">网络状态</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">信号强度</span>
                          <span className={device.networkSignal < 50 ? "text-red-400" : ""}>
                            {device.networkSignal}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">延迟</span>
                          <span>25ms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reliability" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {devices.map((device) => (
              <Card key={device.id} className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">{device.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">可靠性指标</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MTBF</span>
                          <span className="font-medium">{device.mtbf}小时</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">平均恢复时间</span>
                          <span className="font-medium">{device.avgRecoveryTime}分钟</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">正常运行时间</span>
                          <span className="font-medium text-green-400">{device.totalUptime}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">故障统计</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">故障次数</span>
                          <span className="font-medium">{device.failureCount}次</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">最后故障</span>
                          <span className="font-medium">
                            {new Date(device.lastFailure).toLocaleDateString("zh-CN")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">故障率</span>
                          <span className="font-medium">
                            {device.failureCount > 5 ? (
                              <span className="text-red-400 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />高
                              </span>
                            ) : (
                              <span className="text-green-400 flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />低
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reliability Score */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">可靠性评分</span>
                      <span className="text-sm font-bold">
                        {Math.round((device.mtbf / 1000) * 100 + device.totalUptime - device.failureCount * 5)}分
                      </span>
                    </div>
                    <Progress
                      value={Math.round((device.mtbf / 1000) * 100 + device.totalUptime - device.failureCount * 5)}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
