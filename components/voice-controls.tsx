"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Volume2, VolumeX, Play, Square, Mic } from "lucide-react"

export function VoiceControls() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [volume, setVolume] = useState([75])
  const [voiceType, setVoiceType] = useState("female")
  const [isPlaying, setIsPlaying] = useState(false)
  const [customMessage, setCustomMessage] = useState("请注意：检测到非法倾倒行为，请立即停止并正确分类投放垃圾。")

  const presetMessages = [
    "请注意：检测到非法倾倒行为，请立即停止并正确分类投放垃圾。",
    "警告：此区域禁止倾倒垃圾，请将垃圾投放到指定位置。",
    "提醒：请按照垃圾分类标准正确投放，感谢您的配合。",
    "注意：垃圾桶已满，请稍后再来或使用附近其他垃圾桶。",
  ]

  const playVoiceMessage = (message: string) => {
    setIsPlaying(true)
    console.log("[v0] Playing voice message:", message)
    console.log("[v0] Voice settings - Type:", voiceType, "Volume:", volume[0])

    // Simulate voice playback
    setTimeout(() => {
      setIsPlaying(false)
    }, 3000)
  }

  const broadcastToAllLocations = () => {
    console.log("[v0] Broadcasting to all locations:", customMessage)
    playVoiceMessage(customMessage)
  }

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            语音控制系统
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isVoiceEnabled ? "default" : "secondary"}>{isVoiceEnabled ? "已启用" : "已禁用"}</Badge>
            <Button variant="ghost" size="sm" onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}>
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">音量控制</label>
            <div className="flex items-center gap-4">
              <VolumeX className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
                disabled={!isVoiceEnabled}
              />
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium w-12">{volume[0]}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">语音类型</label>
            <Select value={voiceType} onValueChange={setVoiceType} disabled={!isVoiceEnabled}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">女声（温和）</SelectItem>
                <SelectItem value="male">男声（严肃）</SelectItem>
                <SelectItem value="robotic">机器人声（科技感）</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Preset Messages */}
        <div className="space-y-3">
          <label className="text-sm font-medium">预设警告消息</label>
          <div className="space-y-2">
            {presetMessages.map((message, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg border bg-card/50">
                <div className="flex-1 text-sm">{message}</div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => playVoiceMessage(message)}
                  disabled={!isVoiceEnabled || isPlaying}
                >
                  {isPlaying ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Message */}
        <div className="space-y-3">
          <label className="text-sm font-medium">自定义消息</label>
          <Textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="输入自定义警告消息..."
            className="min-h-[80px]"
            disabled={!isVoiceEnabled}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => playVoiceMessage(customMessage)}
              disabled={!isVoiceEnabled || isPlaying || !customMessage.trim()}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              测试播放
            </Button>
            <Button
              onClick={broadcastToAllLocations}
              disabled={!isVoiceEnabled || isPlaying || !customMessage.trim()}
              className="flex-1"
            >
              <Mic className="w-4 h-4 mr-2" />
              全局广播
            </Button>
          </div>
        </div>

        {/* Status Indicator */}
        {isPlaying && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-primary">正在播放语音警告...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
