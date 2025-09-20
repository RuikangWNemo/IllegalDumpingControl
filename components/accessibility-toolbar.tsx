"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accessibility, Volume2, Eye, Type, Palette, Settings, X, Languages } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, updateSettings, speak } = useAccessibility()

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      speak("无障碍设置面板已打开")
    }
  }

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value })

    // Provide voice feedback for important changes
    switch (key) {
      case "elderlyMode":
        speak(value ? "已启用老年友好模式" : "已关闭老年友好模式")
        break
      case "fontSize":
        speak(`字体大小已调整为${value === "large" ? "大" : value === "extra-large" ? "特大" : "正常"}`)
        break
      case "highContrast":
        speak(value ? "已启用高对比度模式" : "已关闭高对比度模式")
        break
      case "voiceEnabled":
        if (value) speak("语音播报已启用")
        break
    }
  }

  return (
    <>
      {/* Accessibility Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0 shadow-lg bg-transparent"
        aria-label="打开无障碍设置"
      >
        <Accessibility className="w-5 h-5" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-50 w-80 glass shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-primary" />
                <h3 className="font-medium">无障碍设置</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Elderly Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">老年友好模式</span>
                </div>
                <Switch
                  checked={settings.elderlyMode}
                  onCheckedChange={(checked) => handleSettingChange("elderlyMode", checked)}
                />
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">字体大小</span>
                </div>
                <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange("fontSize", value)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">正常</SelectItem>
                    <SelectItem value="large">大</SelectItem>
                    <SelectItem value="extra-large">特大</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">高对比度</span>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => handleSettingChange("highContrast", checked)}
                />
              </div>

              {/* Color Blind Safe */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">色盲友好</span>
                </div>
                <Switch
                  checked={settings.colorBlindSafe}
                  onCheckedChange={(checked) => handleSettingChange("colorBlindSafe", checked)}
                />
              </div>

              {/* Reduce Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">减少动画</span>
                </div>
                <Switch
                  checked={settings.reduceMotion}
                  onCheckedChange={(checked) => handleSettingChange("reduceMotion", checked)}
                />
              </div>

              {/* Voice Enabled */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">语音播报</span>
                </div>
                <Switch
                  checked={settings.voiceEnabled}
                  onCheckedChange={(checked) => handleSettingChange("voiceEnabled", checked)}
                />
              </div>

              {/* Language Selection */}
              {settings.voiceEnabled && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">语音语言</span>
                  </div>
                  <Select
                    value={settings.selectedLanguage}
                    onValueChange={(value) => handleSettingChange("selectedLanguage", value)}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">中文普通话</SelectItem>
                      <SelectItem value="zh-dialect">中文方言</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Auto Volume Adjust */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">自动音量调节</span>
                </div>
                <Switch
                  checked={settings.autoVolumeAdjust}
                  onCheckedChange={(checked) => handleSettingChange("autoVolumeAdjust", checked)}
                />
              </div>

              {/* Blinking Alerts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">闪烁提醒</span>
                </div>
                <Switch
                  checked={settings.blinkingAlerts}
                  onCheckedChange={(checked) => handleSettingChange("blinkingAlerts", checked)}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => speak("这是语音播报测试")}
                className="w-full"
                disabled={!settings.voiceEnabled}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                测试语音播报
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
