"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Settings, Bell, Lightbulb, Smartphone, Mail } from "lucide-react"

export function AlertSettings() {
  const [settings, setSettings] = useState({
    voiceAlerts: true,
    lightFlash: true,
    smsAlerts: false,
    emailAlerts: true,
    dashboardAlerts: true,
    sensitivity: [80],
    flashDuration: [5],
    alertDelay: [2],
    autoResolve: true,
    escalation: true,
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    console.log("[v0] Updated alert setting:", key, "to", value)
  }

  const saveSettings = () => {
    console.log("[v0] Saving alert settings:", settings)
    // In a real implementation, this would save to the database
  }

  const resetToDefaults = () => {
    setSettings({
      voiceAlerts: true,
      lightFlash: true,
      smsAlerts: false,
      emailAlerts: true,
      dashboardAlerts: true,
      sensitivity: [80],
      flashDuration: [5],
      alertDelay: [2],
      autoResolve: true,
      escalation: true,
    })
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          警报设置
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alert Types */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">警报类型</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">语音警告</span>
              </div>
              <Switch
                checked={settings.voiceAlerts}
                onCheckedChange={(checked) => updateSetting("voiceAlerts", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">闪光警示</span>
              </div>
              <Switch
                checked={settings.lightFlash}
                onCheckedChange={(checked) => updateSetting("lightFlash", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">短信通知</span>
              </div>
              <Switch checked={settings.smsAlerts} onCheckedChange={(checked) => updateSetting("smsAlerts", checked)} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">邮件通知</span>
              </div>
              <Switch
                checked={settings.emailAlerts}
                onCheckedChange={(checked) => updateSetting("emailAlerts", checked)}
              />
            </div>
          </div>
        </div>

        {/* Sensitivity Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">检测设置</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">检测敏感度</label>
                <span className="text-sm text-muted-foreground">{settings.sensitivity[0]}%</span>
              </div>
              <Slider
                value={settings.sensitivity}
                onValueChange={(value) => updateSetting("sensitivity", value)}
                max={100}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">警报延迟</label>
                <span className="text-sm text-muted-foreground">{settings.alertDelay[0]}秒</span>
              </div>
              <Slider
                value={settings.alertDelay}
                onValueChange={(value) => updateSetting("alertDelay", value)}
                max={10}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">闪光持续时间</label>
                <span className="text-sm text-muted-foreground">{settings.flashDuration[0]}秒</span>
              </div>
              <Slider
                value={settings.flashDuration}
                onValueChange={(value) => updateSetting("flashDuration", value)}
                max={30}
                step={1}
              />
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">高级设置</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">自动解决误报</span>
              <Switch
                checked={settings.autoResolve}
                onCheckedChange={(checked) => updateSetting("autoResolve", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">警报升级</span>
              <Switch
                checked={settings.escalation}
                onCheckedChange={(checked) => updateSetting("escalation", checked)}
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">联系方式</h4>
          <div className="space-y-3">
            <Input placeholder="紧急联系电话" />
            <Input placeholder="管理员邮箱" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={saveSettings} className="flex-1">
            保存设置
          </Button>
          <Button variant="outline" onClick={resetToDefaults} className="flex-1 bg-transparent">
            恢复默认
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
